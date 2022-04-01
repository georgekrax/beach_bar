import prefixes from "@/constants/prefixes";
import { generateIdSpecialCharacters } from "@/constants/_index";
import { getPaymentDetails } from "@/utils/beachBar";
import { checkAllProductsAvailable, getTotal, getUniqBeachBars } from "@/utils/cart";
import { toFixed2 } from "@/utils/data";
import { formatMetadata, getRefundDetails } from "@/utils/payment";
import { errors, TABLES } from "@beach_bar/common";
import { Prisma } from "@prisma/client";
import { generateId } from "@the_hashtag/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { extendType, idArg, nullable, stringArg } from "nexus";
import { PaymentType } from "./types";

const CREATED_STATUS = TABLES.PAYMENT_STATUS.find(({ name }) => name === "CREATED")!;
const CHARGE_OPTS = {
  expand: ["charges.data.balance_transaction"],
};

export const PaymentCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("checkout", {
      type: PaymentType,
      description: "Make a payment using a customer's shopping cart",
      args: {
        cartId: idArg({ description: "The ID value of the shopping cart with the products to purchase" }),
        cardId: idArg({ description: "The ID value of the credit or debit card of the customer" }),
        voucherCode: nullable(stringArg({ description: "A coupon or offer campaign code to make a discount to the payment's price" })),
      },
      // @ts-ignore
      resolve: async (_, { cartId, cardId, voucherCode }, { res, prisma, stripe }) => {
        if (!cartId || cartId.toString().trim().length === 0) throw new UserInputError("Please provide a valid cartId");
        if (!cardId || cardId.toString().trim().length === 0) throw new UserInputError("Please provide a valid cardId");

        const cart = await prisma.cart.findUnique({
          where: { id: BigInt(cartId) },
          include: {
            foods: { include: { food: true } },
            products: {
              include: {
                // startTime: true,
                // endTime: true,
                product: { include: { beachBar: { include: { products: true, currency: true, appFee: true } } } },
              },
            },
          },
        });
        if (!cart?.products) throw new ApolloError("Shopping cart was not found");
        if (cart.products.length === 0) throw new ApolloError("Shopping cart is empty");
        const { bool: allProductsAvailable, notAvailable } = await checkAllProductsAvailable(cart);
        if (!allProductsAvailable && notAvailable.length > 0) {
          throw new ApolloError("Some products that you have in your shopping cart are not currently available.", errors.CONFLICT, {
            notAvailableProducts: notAvailable,
          });
        }

        const uniqBeachBars = getUniqBeachBars(cart);
        if (uniqBeachBars.length === 0) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
        const cartTotal = getTotal(cart);
        if (cartTotal.totalWithoutEntryFees !== cart.total.toNumber()) throw new ApolloError(errors.SOMETHING_WENT_WRONG);

        const details = uniqBeachBars.map(item => {
          const { id, currency, products } = item;
          const amount = getTotal(cart, { beachBarId: id });
          const stripeMinCurrency = TABLES.STRIPE_MINIMUM_CURRENCY.find(
            ({ currencyId }) => currencyId.toString() === currency.id.toString()
          );
          if (!stripeMinCurrency) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
          const totalMinSpending = products.reduce((sum, { minFoodSpending }) => sum + (minFoodSpending?.toNumber() || 0), 0);
          if (amount.foodsTotal < totalMinSpending) {
            const errPrice = currency.symbol + " " + totalMinSpending.toFixed(2);
            throw new ApolloError(
              "For the products, you have selected, the total minimum spending on foods and beverages is: " + errPrice
            );
          }

          // if (newPaymentVoucher?.couponCode) {
          //   const voucherCouponCode = newPaymentVoucher.couponCode;
          //   if (!voucherCouponCode.beachBarId) {
          //     const beachBarCouponCodeDiscount = (totalWithEntryFees * voucherCouponCode.discountPercentage.toNumber()) / 100;
          //     discountPerBeachBar = beachBarCouponCodeDiscount / uniqBeachBars.length;
          //   }
          // }

          let discount = 0;
          const cartBarTotal = getTotal(cart, { beachBarId: id, afterToday: false, discount });

          const { totalWithEntryFees } = cartBarTotal;
          if (newPaymentVoucher?.offerCode) {
            discount = (totalWithEntryFees * newPaymentVoucher.offerCode.campaign.discountPercentage.toNumber()) / 100;
          }
          if (newPaymentVoucher?.couponCode?.beachBarId === id) {
            const couponCodeDiscount = (totalWithEntryFees * newPaymentVoucher.couponCode.discountPercentage.toNumber()) / 100;
            discount += couponCodeDiscount;
          }

          const finalTotal = toFixed2(totalWithEntryFees - discount);
          const percentage = toFixed2(finalTotal / cartTotal.totalWithEntryFees);
          return { ...item, ...amount, stripeMinCurrency, totalMinSpending, finalTotal, percentage, discount };
        });

        const card = await prisma.card.findFirst({
          include: { customer: true, country: { include: { currency: true } } },
          where: {
            OR: [
              { id: BigInt(cardId), deletedAt: null },
              { id: BigInt(cardId), savedForFuture: false, deletedAt: { not: null } },
            ],
          },
        });
        if (!card?.customer || !card.country) throw new ApolloError("Payment method was not found", errors.NOT_FOUND);

        const customer = card.customer;
        const status = CREATED_STATUS;
        const refCode = generateId({ length: 16, specialCharacters: generateIdSpecialCharacters.PAYMENT });
        const transferGroupCode = prefixes.PAYMENT_TARGET_GROUP + generateId({ length: 16 });
        // const newPayment = Payment.create({ cart, card, status, refCode, transferGroupCode });

        let newPaymentData: Prisma.PaymentCreateArgs["data"] = {
          cartId: cart.id,
          cardId: card.id,
          statusId: status.id,
          refCode,
          transferGroupCode,
          appFee: 0,
          transferAmount: 0,
          stripeId: "",
          stripeProccessingFee: 0,
        };
        // Recalculate in order to get the new total after discount
        const { totalWithEntryFees, totalWithoutEntryFees } = details.reduce(
          (prev, cur) => ({
            totalWithEntryFees: prev.totalWithEntryFees + cur.totalWithEntryFees,
            totalWithoutEntryFees: prev.totalWithoutEntryFees + cur.totalWithoutEntryFees,
          }),
          { totalWithEntryFees: 0, totalWithoutEntryFees: 0 }
        );
        let newPaymentVoucher: Prisma.PaymentVoucherCodeGetPayload<{
          include: { couponCode: true; offerCode: { include: { campaign: true } } };
        }> | null = null;
        // const stripeProccessingFees = 0;

        // if (voucherCode) {
        //   const { couponCode, offerCode } = await checkVoucherCode(voucherCode);
        //   // const newPaymentOfferCode: Prisma.PaymentVoucherCodeGetPayload<{
        //   //   select: { paymentId: true; payment: true; couponCode: true; offerCode: true };
        //   // }> = { paymentId: newPayment.id };
        //   // if (couponCode) newPaymentOfferCode.couponCode = couponCode;
        //   // else if (offerCode) newPaymentOfferCode.offerCode = offerCode;
        //   const discountPercentage: number = couponCode
        //     ? couponCode.discountPercentage.toNumber()
        //     : offerCode
        //     ? offerCode.campaign.discountPercentage.toNumber()
        //     : 0;
        //   // paymentVoucherCode = newPaymentOfferCode;
        //   const discount = (total * discountPercentage) / 100;
        //   total = +(total - discount).toFixed(2);
        // }
        // newPayment.voucherCode = paymentVoucherCode;

        try {
          // check if cart total is 0
          for (let i = 0; i < details.length; i++) {
            const {
              id,
              zeroCartTotal,
              totalWithoutEntryFees,
              currency,
              stripeConnectId,
              stripeMinCurrency: { minAmount },
              ...beachBar
            } = details[i];
            const bool = totalWithEntryFees <= minAmount;
            if (!zeroCartTotal && bool) {
              throw new ApolloError(
                `You cannot have ${cartTotal} as the total of your shopping cart for this #beach_bar`,
                errors.ZERO_CART_TOTAL_ERROR_CODE
              );
            }
            if (zeroCartTotal && bool) {
              const { barFee } = getPaymentDetails(beachBar, { total: totalWithoutEntryFees });
              const charge = await stripe.charges.create({
                ...CHARGE_OPTS,
                amount: (barFee + minAmount) * 100,
                currency: currency.isoCode.toLowerCase(),
                source: stripeConnectId,
              });
              // TODO: Fix
              const newPayment = await prisma.payment.create({
                data: {
                  ...newPaymentData,
                  stripeId: charge.id,
                  appFee: new Prisma.Decimal(barFee),
                  transferAmount: new Prisma.Decimal(0),
                },
              });
              return newPayment;
            }
          }

          const cartProducts = cart.products;
          const stripePayment = await stripe.paymentIntents.create({
            ...CHARGE_OPTS,
            amount: totalWithEntryFees * 100,
            currency: card.country.currency.isoCode.toLowerCase(),
            customer: customer.stripeCustomerId,
            payment_method: card.stripeId,
            // off_session: true,
            confirm: true,
            receipt_email: customer.email || undefined,
            transfer_group: transferGroupCode,
            description: `${cartProducts.length}x product${cartProducts.length > 1 ? "s" : ""} purchased by ${customer.email} (${
              customer.stripeCustomerId
            })`,
            metadata: {
              ref_code: refCode,
              products_quantity: cartProducts.length,
              product_ids: formatMetadata(cartProducts.map(({ product: { id, name } }) => JSON.stringify({ id, name })).toString()),
              // TODO: Fix
              // voucher_code: formatVoucherCodeMetadata(newPayment.voucherCode),
              entry_fees_total: toFixed2(totalWithEntryFees - totalWithoutEntryFees),
            },
          });

          if (!stripePayment) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          const stripeFees = (stripePayment.charges.data[0].balance_transaction?.["fee"] || 0) / 100;
          newPaymentData.stripeProccessingFee = stripeFees;

          let totalAppFee = 0;
          let totalTransferAmount = 0;

          for (let i = 0; i < details.length; i++) {
            const { id, stripeConnectId, finalTotal, currency, percentage, ...beachBar } = details[i];
            if (finalTotal <= 0) continue;
            const stripeProccessingFees = toFixed2(stripeFees * percentage);
            const { barFee, transferAmount } = getPaymentDetails(beachBar, {
              total: finalTotal,
              stripeFee: stripeProccessingFees,
            });
            // console.log("APP FEE: ", barFee);
            // console.log("STRIPE FEES: ", stripeProccessingFees, percentage);
            // console.log("TRANSFER AMOUNT: ", transferAmount);
            // console.log("TOTAL WITH ENTRY FEES: ", beachBar.totalWithEntryFees);
            // console.log("TOTAL WITHOUT ENTRY FEES: ", beachBar.totalWithoutEntryFees);

            totalAppFee += barFee;
            totalTransferAmount += transferAmount;
            if (transferAmount * 100 <= 1) continue;
            const stripeTransfer = await stripe.transfers.create({
              amount: Math.round(transferAmount * 100),
              currency: currency.isoCode.toLowerCase(),
              transfer_group: transferGroupCode,
              destination: stripeConnectId,
              metadata: {
                ref_code: refCode,
                stripe_fee: stripeProccessingFees,
                platform_fee: barFee,
                products: formatMetadata(
                  cartProducts
                    .filter(({ product: { beachBarId } }) => beachBarId === id)
                    .map(({ product: { name } }) => JSON.stringify({ name }))
                    .toString()
                ),
                // TODO: Fix
                // offer_codes: formatVoucherCodeMetadata(newPayment.voucherCode),
              },
            });
            if (!stripeTransfer) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
          }

          newPaymentData = {
            ...newPaymentData,
            stripeId: stripePayment.id,
            appFee: new Prisma.Decimal(totalAppFee),
            transferAmount: new Prisma.Decimal(totalTransferAmount),
          };

          // TODO: Fix
          const newPayment = await prisma.payment.create({ data: newPaymentData });
          if (newPaymentVoucher) {
            const isCoupon = newPaymentVoucher.couponCode;
            // @ts-expect-error
            await prisma[isCoupon ? "couponCode" : "offerCampaignCode"].update({
              where: { id: newPaymentVoucher[isCoupon ? "couponCode" : "offerCode"]?.id },
              data: { timesUsed: { increment: 1 } },
            });
          }
          res.clearCookie(process.env.CART_COOKIE_NAME);

          // Reserved products are created after a successful payment, via Stripe webhook events
          return newPayment;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.boolean("refundPayment", {
      description: "Refund a payment",
      // Use the ID, because the refCode is accessible through the URL, and malicious users
      // can copy it freely and refund a payment
      args: { id: idArg({ description: "The ID of the payment to refund" }) },
      resolve: async (_, { id }, { stripe, prisma }) => {
        if (id.toString().trim().length === 0) throw new UserInputError("Please provide a valid ID");

        const payment = await prisma.payment.findUnique({
          where: { id: BigInt(id) },
          include: {
            cart: {
              include: {
                foods: { include: { food: true } },
                products: { include: { product: { include: { beachBar: true } } } },
              },
            },
          },
        });
        if (!payment) throw new ApolloError("Payment was not found.", errors.CONFLICT);
        if (payment.isRefunded) throw new ApolloError("Payment has already been refunded", errors.CONFLICT);

        try {
          const { refundedAmount, daysDiff } = getRefundDetails(payment);
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
          // TODO: Check - Test
          await prisma.payment.delete({ where: { id: payment.id } });
        } catch (err) {
          throw new ApolloError(err.message);
        }
        return true;
      },
    });
  },
});
