/* eslint-disable prettier/prettier */
import { BigIntScalar, errors, generateId, MyContext } from "@beach_bar/common";
import { generateIdSpecialCharacters } from "@constants/.index";
import prefixes from "@constants/prefixes";
import { payment as paymentStatus } from "@constants/status";
import { Card } from "@entity/Card";
import { Cart } from "@entity/Cart";
import { CouponCode } from "@entity/CouponCode";
import { OfferCampaignCode } from "@entity/OfferCampaignCode";
import { Payment } from "@entity/Payment";
import { PaymentStatus } from "@entity/PaymentStatus";
import { PaymentVoucherCode } from "@entity/PaymentVoucherCode";
import { StripeMinimumCurrency } from "@entity/StripeMinimumCurrency";
import { arg, extendType, stringArg } from "@nexus/schema";
import { DeleteType } from "@typings/.index";
import { AddPaymentType } from "@typings/payment";
import { checkVoucherCode } from "@utils/checkVoucherCode";
import { getManager } from "typeorm";
import { DeleteResult } from "../types";
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
        voucherCode: stringArg({
          required: false,
          description: "A coupon or offer campaign code to make a discount to the shopping cart's or payment's price",
        }),
      },
      resolve: async (_, { cartId, cardId, voucherCode }, { stripe }: MyContext): Promise<AddPaymentType> => {
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
        const uniqueBeachBars = cart.getUniqueBeachBars();
        if (!uniqueBeachBars || uniqueBeachBars.length === 0) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
        }

        const cartTotal = await cart.getTotalPrice();
        if (cartTotal === undefined || cartTotal.totalWithoutEntryFees !== parseFloat(cart.total.toString())) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        const card = await Card.findOne({ where: { id: cardId }, relations: ["customer", "country", "country.currency"] });
        if (!card || !card.customer || !card.country) {
          return {
            error: { code: errors.CONFLICT, message: "Specified credit or debit card does not exist, or is not your default one" },
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

        const refCode = generateId({ length: 16, specialCharacters: generateIdSpecialCharacters.PAYMENT });
        const transferGroupCode = `${prefixes.PAYMENT_TARGET_GROUP}${generateId({ length: 16 })}`;

        const newPayment = Payment.create({
          cart,
          card,
          status,
          refCode,
          transferGroupCode,
        });
        const { totalWithEntryFees, totalWithoutEntryFees } = cartTotal;
        let total = totalWithEntryFees;

        let paymentVoucherCode: PaymentVoucherCode | undefined = undefined;

        if (voucherCode) {
          const res = await checkVoucherCode(voucherCode);
          if (res.error) {
            return res.error;
          }
          const newPaymentOfferCode = PaymentVoucherCode.create({
            payment: newPayment,
          });
          if (res.couponCode) {
            newPaymentOfferCode.couponCode = res.couponCode;
          } else if (res.offerCode) {
            newPaymentOfferCode.offerCode = res.offerCode;
          }
          const discountPercentage: number = res.couponCode
            ? res.couponCode.discountPercentage
            : res.offerCode
            ? res.offerCode.campaign.discountPercentage
            : 0;
          paymentVoucherCode = newPaymentOfferCode;
          const discount = (total * discountPercentage) / 100;
          total = parseFloat((total - discount).toFixed(2));
        }

        newPayment.voucherCode = paymentVoucherCode;

        try {
          // * check if cart total is 0
          for (let i = 0; i < uniqueBeachBars.length; i++) {
            const beachBar = uniqueBeachBars[i];
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
              voucher_code: newPayment.voucherCode
                ? JSON.stringify({
                    id: newPayment.voucherCode.couponCode
                      ? newPayment.voucherCode.couponCode.id
                      : newPayment.voucherCode.offerCode?.id,
                    discount_percentage: newPayment.voucherCode.couponCode
                      ? newPayment.voucherCode.couponCode.discountPercentage
                      : newPayment.voucherCode.offerCode?.campaign.discountPercentage,
                    type: newPayment.voucherCode.couponCode ? "coupon_code" : "offer_campaign_code",
                  })
                    .toString()
                    .replace(/[[\]]/g, "")
                    .replace(/},{/g, "} - {")
                    .replace(/[:]/g, ": ")
                    .replace(/[,]/g, ", ")
                : null,
              entry_fees_total: totalWithEntryFees - totalWithoutEntryFees + total,
            },
            transfer_group: transferGroupCode,
          });

          if (!stripePayment) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }

          let beachBarPricingFee = 0;
          let transferAmount = 0;
          let discountPerBeachBar = 0;
          if (newPayment.voucherCode && newPayment.voucherCode.couponCode) {
            const voucherCouponCode = newPayment.voucherCode.couponCode;
            if (!voucherCouponCode.beachBarId) {
              const beachBarCouponCodeDiscount = (totalWithEntryFees * voucherCouponCode.discountPercentage) / 100;
              discountPerBeachBar = beachBarCouponCodeDiscount / uniqueBeachBars.length;
            }
          }
          console.log(`Discount per #beach_bar: ${discountPerBeachBar}`);
          for (let i = 0; i < uniqueBeachBars.length; i++) {
            const beachBar = uniqueBeachBars[i];

            const cartBeachBarTotal = await cart.getBeachBarTotalPrice(beachBar.id, discountPerBeachBar);
            if (cartBeachBarTotal === undefined) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
            console.log(cartBeachBarTotal);
            const { totalWithEntryFees } = cartBeachBarTotal;
            let discountAmount = 0;
            const paymentVoucherCode = newPayment.voucherCode;
            if (paymentVoucherCode && paymentVoucherCode.offerCode) {
              discountAmount = (totalWithEntryFees * paymentVoucherCode.offerCode.campaign.discountPercentage) / 100;
            }
            console.log(paymentVoucherCode?.couponCode?.beachBarId);
            console.log(beachBar.id);
            if (
              paymentVoucherCode &&
              paymentVoucherCode.couponCode &&
              paymentVoucherCode.couponCode.beachBarId &&
              paymentVoucherCode.couponCode.beachBarId === beachBar.id
            ) {
              const couponCodeDiscount = (totalWithEntryFees * paymentVoucherCode.couponCode.discountPercentage) / 100;
              discountAmount += couponCodeDiscount;
            }
            const beachBarTotal = parseFloat((totalWithEntryFees - discountAmount).toFixed(2));
            console.log(`Discount amount: ${discountAmount}`);
            console.log(`#beach_bar total: ${beachBarTotal}`);
            if (beachBarTotal > 0) {
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
              console.log(stripePayment.currency.toLowerCase());
              if (beachBarTransferAmount * 100 > 1) {
                const stripeTransfer = await stripe.transfers.create({
                  amount: Math.round(beachBarTransferAmount * 100),
                  currency: beachBar.defaultCurrency.isoCode.toLowerCase(),
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
                    offer_codes: newPayment.voucherCode
                      ? JSON.stringify({
                          id: newPayment.voucherCode.couponCode
                            ? newPayment.voucherCode.couponCode.id
                            : newPayment.voucherCode.offerCode?.id,
                          discount_percentage: newPayment.voucherCode.couponCode
                            ? newPayment.voucherCode.couponCode.discountPercentage
                            : newPayment.voucherCode.offerCode?.campaign.discountPercentage,
                          type: newPayment.voucherCode.couponCode ? "coupon_code" : "offer_campaign_code",
                        })
                          .toString()
                          .replace(/[[\]]/g, "")
                          .replace(/},{/g, "} - {")
                          .replace(/[:]/g, ": ")
                          .replace(/[,]/g, ", ")
                      : null,
                  },
                });
                if (!stripeTransfer) {
                  return { error: { message: errors.SOMETHING_WENT_WRONG } };
                }
              }
            }
          }

          newPayment.appFee = beachBarPricingFee;
          newPayment.transferAmount = transferAmount;
          newPayment.stripeId = stripePayment.id;

          await newPayment.save();

          if (newPayment.voucherCode) {
            const paymentVoucherCode = newPayment.voucherCode;
            if (paymentVoucherCode.couponCode) {
              await getManager().increment(CouponCode, { id: paymentVoucherCode.couponCode.id }, "timesUsed", 1);
            } else if (paymentVoucherCode.offerCode) {
              await getManager().increment(OfferCampaignCode, { id: paymentVoucherCode.offerCode.id }, "timesUsed", 1);
            }
          }

          // * Reserved products are created after a successful payment, via Stripe webhook events

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
      resolve: async (_, { paymentId }, { stripe }: MyContext): Promise<DeleteType> => {
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
