/* eslint-disable prettier/prettier */
import { BigIntScalar, errors, generateID, MyContext } from "@beach_bar/common";
import { arg, extendType } from "@nexus/schema";
import dayjs from "dayjs";
import prefixes from "../../constants/prefixes";
import { payment as paymentStatus } from "../../constants/status";
import { Card } from "../../entity/Card";
import { Cart } from "../../entity/Cart";
import { CouponCode } from "../../entity/CouponCode";
import { OfferCampaignCode } from "../../entity/OfferCampaignCode";
import { Payment } from "../../entity/Payment";
import { PaymentOfferCode } from "../../entity/PaymentOfferCode";
import { PaymentStatus } from "../../entity/PaymentStatus";
import { StripeMinimumCurrency } from "../../entity/StripeMinimumCurrency";
import { DeleteType, ErrorType } from "../returnTypes";
import { DeleteResult } from "../types";
import { PaymentOfferCodeInput } from "./offer_code/types";
import { AddPaymentType, UniqueBeachBarsType } from "./returnTypes";
import { AddPaymentResult } from "./types";

export const PaymentCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("checkout", {
      type: AddPaymentResult,
      description: "Create (make) a payment for a customer's shopping cart",
      nullable: false,
      args: {
        cartId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the shopping cart with the products to purchase",
        }),
        cardId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the credit or debit card of the customer",
        }),
        offerCodes: arg({
          type: PaymentOfferCodeInput,
          required: false,
          list: true,
          description:
            "A list with the offer codes, with their discount percentages each, to apply to the payment. The discount percentages total should be less or equal to 100%",
        }),
      },
      resolve: async (_, { cartId, cardId, offerCodes }, { stripe }: MyContext): Promise<AddPaymentType | ErrorType> => {
        if (!cartId || cartId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
        }
        if (!cardId || cardId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid credit or debit card" } };
        }

        const cart = await Cart.findOne({
          where: { id: cartId },
          relations: [
            "products",
            "products.product",
            "products.product.beachBar",
            "products.product.beachBar.products",
            "products.product.beachBar.defaultCurrency",
          ],
        });
        if (!cart || !cart.products || cart.products.length === 0) {
          return { error: { code: errors.CONFLICT, message: "Specified shopping cart does not exist" } };
        }
        const uBeachBars = cart.getUniqueBeachBars();
        if (!uBeachBars || uBeachBars.length === 0) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }
        const uniqueBeachBars: UniqueBeachBarsType = uBeachBars.map(beachBar => {
          return { beachBar, discountPercentage: 0 };
        });

        const cartTotal = await cart.getTotalPrice();
        if (cartTotal === undefined || cartTotal.totalWithoutEntryFees !== parseFloat(cart.total.toString())) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        const card = await Card.findOne({ where: { id: cardId }, relations: ["customer", "country", "country.currency"] });
        if (!card || !card.customer || !card.country) {
          return {
            error: { code: errors.CONFLICT, message: "Specified credit or debit card does not exist, or is not the a default one" },
          };
        }

        const customer = card.customer;
        if (!customer) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        const status = await PaymentStatus.findOne({ status: paymentStatus.CREATED });
        if (!status) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        const refCode = generateID(16);
        const transferGroupCode = `${prefixes.PAYMENT_TARGET_GROUP}${generateID(16)}`;

        const newPayment = Payment.create({
          cart,
          card,
          status,
          refCode,
          transferGroupCode,
        });
        const { totalWithEntryFees, totalWithoutEntryFees } = cartTotal;
        let total = totalWithEntryFees;
        let couponCodeDiscount = 0;

        const couponCodes: CouponCode[] = [],
          offerCampaignCodes: OfferCampaignCode[] = [],
          paymentOfferCodes: PaymentOfferCode[] = [];

        if (offerCodes) {
          const totalDiscountPercentage = offerCodes.reduce((sum, i) => sum + i.discountPercentage, 0);
          if (totalDiscountPercentage > 100) {
            return { error: { message: "The total discount percentage should be less or equal to 100%" } };
          }
          for (let i = 0; i < offerCodes.length; i++) {
            const element = offerCodes[i];
            if (element.refCode.trim().length === 18) {
              const couponCode = await CouponCode.findOne({ refCode: element.refCode });
              if (!couponCode) {
                return { error: { code: errors.CONFLICT, message: errors.INVALID_REF_CODE_MESSAGE } };
              }
              if (!couponCode.isActive || dayjs(couponCode.validUntil) < dayjs()) {
                return { error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: errors.INVALID_REF_CODE_MESSAGE } };
              }
              if (couponCode.timesLimit && couponCode.timesUsed >= couponCode.timesLimit) {
                return {
                  error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: "You have exceeded the times of use of a coupon code" },
                };
              }
              if (element.discountPercentage > couponCode.discountPercentage) {
                return { error: { message: "You cannot set a discount percentage more than the coupon code has as a limit" } };
              }
              const newPaymentOfferCode = PaymentOfferCode.create({
                payment: newPayment,
                couponCode,
                discountPercentage: element.discountPercentage,
              });
              const discount = (totalWithEntryFees * element.discountPercentage) / 100;
              couponCodeDiscount += discount;
              console.log(total);
              paymentOfferCodes.push(newPaymentOfferCode);
              couponCodes.push(couponCode);
            } else if (element.refCode.trim().length === 23) {
              const offerCode = await OfferCampaignCode.findOne({
                where: { refCode: element.refCode },
                relations: ["campaign", "campaign.products", "campaign.products.beachBar", "campaign.products.beachBar.products"],
              });
              if (!offerCode) {
                return { error: { code: errors.CONFLICT, message: errors.INVALID_REF_CODE_MESSAGE } };
              }
              if (offerCode.isRedeemed || dayjs(offerCode.campaign.validUntil) < dayjs() || !offerCode.campaign.isActive) {
                return { error: { code: errors.INVALID_PRODUCT_OFFER_CODE, message: errors.INVALID_REF_CODE_MESSAGE } };
              }
              if (element.discountPercentage > offerCode.campaign.discountPercentage) {
                return { error: { message: "You cannot set a discount percentage more than the offer campaign has as a limit" } };
              }
              if (
                !cart.products
                  ?.map(product => product.productId)
                  .some(id => offerCode.campaign.products.map(product => product.id).includes(id))
              ) {
                return { error: { message: "This offer code's campaign does not include any products of your shopping cart" } };
              }
              const campaignBeachBar = offerCode.getProductBeachBars();
              for (let i = 0; i < campaignBeachBar.length; i++) {
                const idx = uniqueBeachBars.findIndex(obj => obj.beachBar.id === campaignBeachBar[i].id);
                uniqueBeachBars[idx].discountPercentage += element.discountPercentage;
              }
              const newPaymentOfferCode = PaymentOfferCode.create({
                payment: newPayment,
                offerCode,
                discountPercentage: element.discountPercentage,
              });
              paymentOfferCodes.push(newPaymentOfferCode);
              offerCampaignCodes.push(offerCode);
            }
          }
          const discount = (total * totalDiscountPercentage) / 100;
          total = total - discount;
          total = parseFloat(total.toFixed(2));
        }
        console.log(cartTotal);
        console.log(total);
        console.log(couponCodeDiscount);

        console.log(uniqueBeachBars.map(bar => `${bar.beachBar.id} - ${bar.discountPercentage}`));
        const couponCodeDiscountPerBar = parseFloat((couponCodeDiscount / uniqueBeachBars.length).toFixed(2));
        newPayment.offerCodes = paymentOfferCodes;

        try {
          // * check if cart total is 0
          for (let i = 0; i < uniqueBeachBars.length; i++) {
            const beachBar = uniqueBeachBars[i].beachBar;
            const isZeroCartTotal = cart.verifyZeroCartTotal(beachBar);
            const minimumCurrency = await StripeMinimumCurrency.findOne({ currencyId: beachBar.defaultCurrencyId });
            if (!minimumCurrency) {
              return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
            }
            const boolean = total <= parseFloat(minimumCurrency.chargeAmount.toString());
            if (!beachBar.zeroCartTotal && boolean) {
              return {
                error: {
                  code: errors.ZERO_CART_TOTAL_ERROR_CODE,
                  message: `You cannot have ${cartTotal} as the total of your shopping cart for this #beach_bar`,
                },
              };
            } else if (isZeroCartTotal && boolean) {
              const charge = await stripe.charges.create({
                amount: minimumCurrency.chargeAmount * 100,
                currency: beachBar.defaultCurrency.isoCode.toLowerCase(),
                source: beachBar.stripeConnectId,
              });
              newPayment.stripeId = charge.id;
              console.log(charge);
              return {
                payment: newPayment,
                added: true,
              };
            }
          }
          const cartProducts = cart.products;
          const stripePayment = await stripe.paymentIntents.create({
            amount: total * 100,
            currency: card.country.currency.isoCode.toLowerCase(),
            customer: customer.stripeCustomerId,
            payment_method: card.stripeId,
            off_session: true,
            confirm: true,
            receipt_email: customer.email,
            description: `${cartProducts.length}x product${cartProducts.length > 1 ? "s" : ""} purchased by ${customer.email} (${
              customer.stripeCustomerId
            })`,
            metadata: {
              ref_code: refCode,
              products_quantity: cartProducts.length,
              product_ids: cartProducts
                .map(product => JSON.stringify({ id: product.product.id, name: product.product.name }))
                .toString()
                .replace(/[[\]]/g, "")
                .replace(/},{/g, "} - {")
                .replace(/[:]/g, ": ")
                .replace(/[,]/g, ", "),
              offer_codes: newPayment.offerCodes
                .map(code => {
                  return JSON.stringify({
                    id: code.couponCode ? code.couponCode.id : code.offerCode?.id,
                    discount_percentage: code.discountPercentage,
                    type: code.couponCode ? "coupon_code" : "offer_campaign_code",
                  });
                })
                .toString()
                .replace(/[[\]]/g, "")
                .replace(/},{/g, "} - {")
                .replace(/[:]/g, ": ")
                .replace(/[,]/g, ", "),
              entry_fees_total: totalWithEntryFees - totalWithoutEntryFees + total,
            },
            transfer_group: transferGroupCode,
          });

          if (!stripePayment) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }

          let beachBarPricingFee = 0;
          let transferAmount = 0;
          for (let i = 0; i < uniqueBeachBars.length; i++) {
            const { beachBar, discountPercentage } = uniqueBeachBars[i];

            const cartBeachBarTotal = await cart.getBeachBarTotalPrice(beachBar.id, couponCodeDiscountPerBar);
            if (cartBeachBarTotal === undefined) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
            console.log(cartBeachBarTotal);
            const { totalWithEntryFees } = cartBeachBarTotal;
            const discountAmount = (totalWithEntryFees * discountPercentage) / 100;
            const beachBarTotal = parseFloat((totalWithEntryFees - discountAmount).toFixed(2));
            console.log(discountAmount);
            console.log(beachBarTotal);
            const beachBarStripeFee = await cart.getStripeFee(card.country.isEu, beachBarTotal);
            if (beachBarStripeFee === undefined) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
            const pricingFee = await beachBar.getBeachBarPaymentDetails(beachBarTotal, beachBarStripeFee);
            if (pricingFee === undefined) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }

            const { beachBarAppFee, transferAmount: beachBarTransferAmount } = pricingFee;
            console.log(`App fee: ${pricingFee.beachBarAppFee}`);
            console.log(`Transfer amount: ${pricingFee.transferAmount}`);
            console.log(`Total: ${pricingFee.total}`);
            beachBarPricingFee += beachBarAppFee;
            transferAmount += beachBarTransferAmount;
            console.log(`Stripe fee: ${beachBarStripeFee}`);
            if (beachBarTransferAmount * 100 > 1) {
            const stripeTransfer = await stripe.transfers.create({
              amount: beachBarTransferAmount * 100,
              currency: stripePayment.currency.toLowerCase(),
              transfer_group: transferGroupCode,
              destination: beachBar.stripeConnectId,
              metadata: {
                ref_code: refCode,
                stripe_fee: beachBarStripeFee,
                platform_fee: beachBarAppFee,
                products: cartProducts
                  .filter(product => product.product.beachBarId === beachBar.id)
                  .map(product => JSON.stringify({ name: product.product.name }))
                  .toString()
                  .replace("[", "")
                  .replace("]", "")
                  .replace("},{", "} - {"),
                offer_codes: newPayment.offerCodes
                  .map(code => {
                    return JSON.stringify({
                      discount_percentage: code.discountPercentage,
                      type: code.couponCode ? "coupon_code" : "offer_campaign_code",
                    });
                  })
                  .toString()
                  .replace(/[[\]]/g, "")
                  .replace(/},{/g, "} - {")
                  .replace(/[:]/g, ": ")
                  .replace(/[,]/g, ", "),
              },
            });
            console.log(stripeTransfer);
            if (!stripeTransfer) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
          }
          }

          newPayment.appFee = beachBarPricingFee;
          newPayment.transferAmount = transferAmount;
          newPayment.stripeId = stripePayment.id;

          await newPayment.save();
          // if (offerCodes) {
          //   newPayment.offerCodes?.forEach(async code => code.save());
          // }

          return {
            payment: newPayment,
            added: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("refundPayment", {
      type: DeleteResult,
      description: "Refund a payment",
      nullable: false,
      args: {
        paymentId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the payment to update",
        }),
      },
      resolve: async (_, { paymentId }, { stripe }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!paymentId || paymentId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid payment" } };
        }

        const payment = await Payment.findOne({
          where: { id: paymentId },
          relations: ["cart", "cart.products", "cart.products.product", "cart.products.product.beachBar"],
        });
        if (!payment) {
          return { error: { code: errors.CONFLICT, message: "Specified payment does not exist" } };
        }
        if (payment.isRefunded) {
          return { error: { code: errors.CONFLICT, message: "Specified payment has already been refunded" } };
        }
        try {
          const refund = await payment.getRefundPercentage();
          if (!refund) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          const { refundPercentage, daysDiff } = refund;
          const cartTotal = await payment.cart.getTotalPrice();
          if (cartTotal === undefined) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          const { totalWithEntryFees } = cartTotal;
          if (totalWithEntryFees === 0) {
            return { error: { message: "You shopping cart total was 0" } };
          }
          // ! Do not divide by 100, because Stipe processes cents, and the number will be automatically in cents
          const refundedAmount = totalWithEntryFees * parseInt(refundPercentage.percentageValue.toString());
          if (daysDiff >= 86400000) {
            const stripeRefund = await stripe.refunds.create({
              payment_intent: payment.stripeId,
              amount: refundedAmount,
              reason: "requested_by_customer",
              reverse_transfer: true,
              refund_application_fee: false,
            });
            if (!stripeRefund) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
          }
          await payment.softRemove();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
        return {
          deleted: true,
        };
      },
    });
  },
});
