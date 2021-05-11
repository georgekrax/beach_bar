import { errors, MyContext } from "@beach_bar/common";
import { generateId } from "@the_hashtag/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { DATA } from "constants/data";
import prefixes from "constants/prefixes";
import { generateIdSpecialCharacters } from "constants/_index";
import { Card } from "entity/Card";
import { Cart } from "entity/Cart";
import { CouponCode } from "entity/CouponCode";
import { OfferCampaignCode } from "entity/OfferCampaignCode";
import { Payment } from "entity/Payment";
import { PaymentVoucherCode } from "entity/PaymentVoucherCode";
import { extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { getManager, IsNull, Not } from "typeorm";
import { TDelete } from "typings/.index";
import { checkVoucherCode, formatMetadata, formatVoucherCodeMetadata, toFixed2 } from "utils/payment";
import { DeleteGraphQlType } from "../types";
import { PaymentType } from "./types";

export const PaymentCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("checkout", {
      type: PaymentType,
      description: "Make a payment using a customer's shopping cart",
      args: {
        cartId: idArg({ description: "The ID value of the shopping cart with the products to purchase" }),
        cardId: idArg({ description: "The ID value of the credit or debit card of the customer" }),
        totalPeople: nullable(intArg({ description: "How many people will visit the #beach_bar(s)?. Defaults to true", default: 1 })),
        voucherCode: nullable(stringArg({ description: "A coupon or offer campaign code to make a discount to the payment's price" })),
      },
      resolve: async (_, { cartId, cardId, totalPeople, voucherCode }, { stripe }: MyContext): Promise<Payment> => {
        if (!cartId || cartId.trim().length === 0) throw new UserInputError("Please provide a valid cartId");
        if (!cardId || cardId.trim().length === 0) throw new UserInputError("Please provide a valid cardId");

        const cart = await Cart.findOne({
          where: { id: cartId },
          relations: [
            "products",
            "products.time",
            "products.product",
            "products.product.beachBar",
            "products.product.beachBar.products",
            "products.product.beachBar.defaultCurrency",
            "products.product.beachBar.fee",
          ],
        });
        if (!cart || !cart.products || cart.products.length === 0) throw new ApolloError("Shopping cart was not found");
        // console.log("AVAILABLE: ", cart.checkAllProductsAvailable());
        const { bool: allCartProductsAvailable, notAvailable } = cart.checkAllProductsAvailable();
        if (!allCartProductsAvailable && notAvailable.length > 0) throw new ApolloError("Some products that you have in your shopping cart are not currently available.", errors.CONFLICT, {
            notAvailableProducts: notAvailable,
          });
        const uniqueBeachBars = cart.getUniqBeachBars();
        if (uniqueBeachBars.length === 0) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

        const cartTotal = cart.getTotalPrice();
        if (cartTotal.totalWithoutEntryFees !== +cart.total) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
        // console.log("CART TOTAL: ", cartTotal);

        const card = await Card.findOne({
          where: [
            { id: cardId, deletedAt: IsNull() },
            { id: cardId, savedForFuture: false, deletedAt: Not(IsNull()) },
          ],
          relations: ["customer", "country", "country.currency"],
          withDeleted: true,
        });
        if (!card || !card.customer || !card.country) throw new ApolloError("Payment method was not found", errors.NOT_FOUND);

        const customer = card.customer;
        const status = DATA.PAYMENT.STATUSES.CREATED;

        const refCode = generateId({ length: 16, specialCharacters: generateIdSpecialCharacters.PAYMENT });
        const transferGroupCode = prefixes.PAYMENT_TARGET_GROUP + generateId({ length: 16 });
        // console.log("DETAILS: ");
        // console.log("refCode: ", refCode);
        // console.log("transferGroupCode: ", transferGroupCode);

        const newPayment = Payment.create({ cart, card, status, refCode, transferGroupCode });
        const { totalWithEntryFees, totalWithoutEntryFees } = cartTotal;

        let total = totalWithEntryFees;
        let paymentVoucherCode: PaymentVoucherCode | undefined = undefined;

        const stripeProccessingFees = cart.getStripeFee(card.country.isEu);
        newPayment.stripeProccessingFee = stripeProccessingFees;
        // console.log("STRIPE PROCCESSING FEES: ", stripeProccessingFees);

        if (voucherCode) {
          const res = await checkVoucherCode(voucherCode);
          const newPaymentOfferCode = PaymentVoucherCode.create({ payment: newPayment });
          if (res.couponCode) newPaymentOfferCode.couponCode = res.couponCode;
          else if (res.offerCode) newPaymentOfferCode.offerCode = res.offerCode;
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
          // check if cart total is 0
          for (let i = 0; i < uniqueBeachBars.length; i++) {
            const beachBar = uniqueBeachBars[i];
            const isZeroCartTotal = cart.verifyZeroCartTotal(beachBar);
            const minimumCurrency = DATA.STRIPE.MINIMUM_CURRENCY.find(({ currencyId }) => currencyId === beachBar.defaultCurrencyId);
            if (!minimumCurrency) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
            const boolean = total <= minimumCurrency.chargeAmount;
            if (!beachBar.zeroCartTotal && boolean)
              throw new ApolloError(
                `You cannot have ${cartTotal} as the total of your shopping cart for this #beach_bar`,
                errors.ZERO_CART_TOTAL_ERROR_CODE
              );
            else if (isZeroCartTotal && boolean) {
              const barTotal = cart.getBeachBarTotal(beachBar.id, totalPeople);
              const { beachBarAppFee } = beachBar.getPaymentDetails(barTotal.totalWithoutEntryFees, 0);
              const charge = await stripe.charges.create({
                amount: (beachBarAppFee + stripeProccessingFees) * 100,
                currency: beachBar.defaultCurrency.isoCode.toLowerCase(),
                source: beachBar.stripeConnectId,
              });
              newPayment.stripeId = charge.id;
              newPayment.appFee = beachBarAppFee;
              newPayment.transferAmount = 0;
              await newPayment.save();
              return newPayment;
            }
          }

          const cartProducts = cart.products;
          const stripePayment = await stripe.paymentIntents.create({
            amount: total * 100,
            currency: card.country.currency.isoCode.toLowerCase(),
            customer: customer.stripeCustomerId,
            payment_method: card.stripeId,
            // off_session: true,
            confirm: true,
            receipt_email: customer.email,
            transfer_group: transferGroupCode,
            description: `${cartProducts.length}x product${cartProducts.length > 1 ? "s" : ""} purchased by ${customer.email} (${
              customer.stripeCustomerId
            })`,
            metadata: {
              ref_code: refCode,
              calculated_stripe_proccessing_fee: stripeProccessingFees,
              products_quantity: cartProducts.length,
              product_ids: formatMetadata(cartProducts.map(({ product: { id, name } }) => JSON.stringify({ id, name })).toString()),
              voucher_code: formatVoucherCodeMetadata(newPayment.voucherCode),
              entry_fees_total: totalWithEntryFees - totalWithoutEntryFees + total,
            },
          });

          if (!stripePayment) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

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
          // console.log(`Discount per #beach_bar: ${discountPerBeachBar}`);
          for (let i = 0; i < uniqueBeachBars.length; i++) {
            const beachBar = uniqueBeachBars[i];

            const cartBarTotal = cart.getBeachBarTotal(beachBar.id, totalPeople, discountPerBeachBar);
            console.log("#BEACH_BAR TOTAL: ", cartBarTotal);
            const { totalWithEntryFees } = cartBarTotal;
            let discountAmount = 0;
            const paymentVoucherCode = newPayment.voucherCode;
            if (paymentVoucherCode && paymentVoucherCode.offerCode)
              discountAmount = (totalWithEntryFees * paymentVoucherCode.offerCode.campaign.discountPercentage) / 100;
            // console.log(paymentVoucherCode?.couponCode?.beachBarId);
            // console.log(beachBar.id);
            if (
              paymentVoucherCode &&
              paymentVoucherCode.couponCode &&
              paymentVoucherCode.couponCode.beachBarId &&
              paymentVoucherCode.couponCode.beachBarId === beachBar.id
            ) {
              const couponCodeDiscount = (totalWithEntryFees * paymentVoucherCode.couponCode.discountPercentage) / 100;
              discountAmount += couponCodeDiscount;
            }
            const barTotal = toFixed2(totalWithEntryFees - discountAmount);
            // console.log(`Discount amount: ${discountAmount}`);
            // console.log("#BEACH_BAR ID: ", beachBar.id)
            if (barTotal > 0) {
              const { beachBarAppFee, transferAmount: barTransferAmount } = beachBar.getPaymentDetails(
                barTotal,
                stripeProccessingFees
              );

              // console.log(`APP FEE: ${beachBarAppFee}`);
              // console.log(`TRANSFER AMOUNT: ${barTransferAmount}`);
              // console.log(`TOTAL: ${pricingFee.total}`);
              beachBarPricingFee += beachBarAppFee;
              transferAmount += barTransferAmount;

              if (barTransferAmount * 100 > 1) {
                const stripeTransfer = await stripe.transfers.create({
                  amount: Math.round(barTransferAmount * 100),
                  currency: beachBar.defaultCurrency.isoCode.toLowerCase(),
                  transfer_group: transferGroupCode,
                  destination: beachBar.stripeConnectId,
                  metadata: {
                    ref_code: refCode,
                    stripe_fee: stripeProccessingFees,
                    platform_fee: beachBarAppFee,
                    products: formatMetadata(
                      cartProducts
                        .filter(({ product: { beachBarId } }) => beachBarId === beachBar.id)
                        .map(({ product: { name } }) => JSON.stringify({ name }))
                        .toString()
                    ),
                    offer_codes: formatVoucherCodeMetadata(newPayment.voucherCode),
                  },
                });
                if (!stripeTransfer) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
              }
            }
          }

          newPayment.appFee = beachBarPricingFee;
          newPayment.transferAmount = transferAmount;
          newPayment.stripeId = stripePayment.id;

          await newPayment.save();

          if (newPayment.voucherCode) {
            const paymentVoucherCode = newPayment.voucherCode;
            if (paymentVoucherCode.couponCode)
              await getManager().increment(CouponCode, { id: paymentVoucherCode.couponCode.id }, "timesUsed", 1);
            else if (paymentVoucherCode.offerCode)
              await getManager().increment(OfferCampaignCode, { id: paymentVoucherCode.offerCode.id }, "timesUsed", 1);
          }

          // Reserved products are created after a successful payment, via Stripe webhook events

          return newPayment;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("refundPayment", {
      type: DeleteGraphQlType,
      description: "Refund a payment",
      args: { paymentId: idArg({ description: "The ID of the payment to refund" }) },
      resolve: async (_, { paymentId }, { stripe }: MyContext): Promise<TDelete> => {
        if (!paymentId || paymentId.trim().length === 0) throw new UserInputError("Please provide a valid paymentId");

        const payment = await Payment.findOne({
          where: { id: paymentId },
          relations: ["cart", "cart.products", "cart.products.product", "cart.products.product.beachBar"],
        });
        if (!payment) throw new ApolloError("Payment was not found", errors.CONFLICT);
        if (payment.isRefunded) throw new ApolloError("Payment has already been refunded", errors.CONFLICT);

        try {
          const refund = await payment.getRefundPercentage();
          if (!refund) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
          const { refundPercentage, daysDiff } = refund;
          const cartTotal = await payment.cart.getTotalPrice(true);
          if (cartTotal === undefined) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
          const { totalWithEntryFees } = cartTotal;
          if (totalWithEntryFees === 0) throw new ApolloError("Your shopping cart total was 0", errors.CONFLICT);
          // ! Do not divide by 100, because Stipe processes cents, and the number will be automatically in cents
          const refundedAmount = parseInt((totalWithEntryFees * parseInt(refundPercentage.percentageValue.toString())).toString());
          if (daysDiff >= 86400000) {
            const stripeRefund = await stripe.refunds.create({
              payment_intent: payment.stripeId,
              amount: refundedAmount,
              reason: "requested_by_customer",
              reverse_transfer: true,
              refund_application_fee: false,
            });
            if (!stripeRefund) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
          }
          await payment.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }
        return { deleted: true };
      },
    });
  },
});
