import { getRefundDetails } from "@/utils/payment";
import { errors } from "@beach_bar/common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { extendType, idArg, nullable, stringArg } from "nexus";
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
        voucherCode: nullable(stringArg({ description: "A coupon or offer campaign code to make a discount to the payment's price" })),
      },
      resolve: async (_, { cartId, cardId, voucherCode }, { prisma, stripe }) => {
        return {} as any;
        // if (!cartId || cartId.trim().length === 0) throw new UserInputError("Please provide a valid cartId");
        // if (!cardId || cardId.trim().length === 0) throw new UserInputError("Please provide a valid cardId");
        // const cart = await prisma.cart.findUnique({
        //   where: { id: BigInt(cartId) },
        //   include: {
        //     foods: { include: { food: true } },
        //     products: {
        //       include: {
        //         startTime: true,
        //         endTime: true,
        //         product: { include: { beachBar: { include: { products: true, currency: true, appFee: true } } } },
        //       },
        //     },
        //   },
        // });
        // if (!cart?.products || cart.products.length === 0) throw new ApolloError("Shopping cart was not found");
        // // console.log("AVAILABLE: ", cart.checkAllProductsAvailable());
        // const { bool: allCartProductsAvailable, notAvailable } = await checkAllProductsAvailable(cart);
        // if (!allCartProductsAvailable && notAvailable.length > 0) {
        //   throw new ApolloError("Some products that you have in your shopping cart are not currently available.", errors.CONFLICT, {
        //     notAvailableProducts: notAvailable,
        //   });
        // }
        // const uniqBeachBars = getUniqBeachBars(cart);
        // if (uniqBeachBars.length === 0) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
        // const cartTotal = getTotal(cart);
        // if (cartTotal.totalWithoutEntryFees !== cart.total.toNumber()) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
        // // console.log("CART TOTAL: ", cartTotal);
        // const card = await prisma.card.findFirst({
        //   where: {
        //     OR: [
        //       { id: BigInt(cardId), deletedAt: null },
        //       { id: BigInt(cardId), savedForFuture: false, deletedAt: { not: null } },
        //     ],
        //   },
        //   include: { customer: true, country: { include: { currency: true } } },
        // });
        // if (!card?.customer || !card.country) throw new ApolloError("Payment method was not found", errors.NOT_FOUND);
        // const customer = card.customer;
        // const status = TABLES.PAYMENT_STATUS.find(({ name }) => name === "CREATED")!;
        // const refCode = generateId({ length: 16, specialCharacters: generateIdSpecialCharacters.PAYMENT });
        // const transferGroupCode = prefixes.PAYMENT_TARGET_GROUP + generateId({ length: 16 });
        // // console.log("DETAILS: ");
        // // console.log("refCode: ", refCode);
        // // console.log("transferGroupCode: ", transferGroupCode);
        // // const newPayment = Payment.create({ cart, card, status, refCode, transferGroupCode });
        // let newPayment: Prisma.PaymentCreateArgs["data"] = {
        //   cartId: cart.id,
        //   cardId: card.id,
        //   statusId: status.id,
        //   refCode,
        //   transferGroupCode,
        //   appFee: 0,
        //   transferAmount: 0,
        //   stripeId: "",
        //   stripeProccessingFee: 0,
        // };
        // const { totalWithEntryFees, totalWithoutEntryFees } = cartTotal;
        // let total = totalWithEntryFees;
        // let newPaymentVoucher: Prisma.PaymentVoucherCodeGetPayload<{
        //   include: { couponCode: true; offerCode: { include: { campaign: true } } };
        // }> | null = null;
        // const stripeProccessingFees = 0;
        // // const stripeProccessingFees = cart.getStripeFee(card.country.isEu);
        // // newPayment.stripeProccessingFee = stripeProccessingFees;
        // // console.log("STRIPE PROCCESSING FEES: ", stripeProccessingFees);
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
        // // newPayment.voucherCode = paymentVoucherCode;
        // try {
        //   // check if cart total is 0
        //   for (let i = 0; i < uniqBeachBars.length; i++) {
        //     const beachBar = uniqBeachBars[i];
        //     const minimumCurrency = TABLES.STRIPE_MINIMUM_CURRENCY.find(
        //       ({ currencyId }) => currencyId.toString() === beachBar.currencyId.toString()
        //     );
        //     if (!minimumCurrency) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
        //     const totalMinSpending = beachBar.products.reduce(
        //       (sum, { minFoodSpending }) => sum + (minFoodSpending?.toNumber() || 0),
        //       0
        //     );
        //     const foodsTotalForBar =
        //       cart.foods
        //         ?.filter(({ food: { beachBarId } }) => beachBarId.toString() === beachBar.id.toString())
        //         .reduce((sum, { quantity, food: { price } }) => sum + price.toNumber() * quantity, 0) || 0;
        //     if (foodsTotalForBar < totalMinSpending) {
        //       throw new ApolloError(
        //         "For the products, you have selected, the total minimum spending on foods and beverages is: " +
        //           beachBar.currency.symbol +
        //           " " +
        //           totalMinSpending.toFixed(2)
        //       );
        //     }
        //     const bool = total <= minimumCurrency.minAmount;
        //     if (!beachBar.zeroCartTotal && bool) {
        //       throw new ApolloError(
        //         `You cannot have ${cartTotal} as the total of your shopping cart for this #beach_bar`,
        //         errors.ZERO_CART_TOTAL_ERROR_CODE
        //       );
        //     } else if (verifyZeroCart({ beachBar }) && bool) {
        //       const barTotal = getTotal(cart, { beachBarId: beachBar.id });
        //       const { barFee } = getPaymentDetails(beachBar, { total: barTotal.totalWithoutEntryFees });
        //       const charge = await stripe.charges.create({
        //         amount: (barFee + stripeProccessingFees) * 100,
        //         currency: beachBar.currency.isoCode.toLowerCase(),
        //         source: beachBar.stripeConnectId,
        //       });
        //       // TODO: Fix
        //       const newP = await prisma.payment.create({
        //         data: {
        //           ...newPayment,
        //           stripeId: charge.id,
        //           appFee: new Prisma.Decimal(barFee),
        //           transferAmount: new Prisma.Decimal(0),
        //         },
        //       });
        //       return newPayment;
        //     }
        //   }
        //   const cartProducts = cart.products;
        //   const stripePayment = await stripe.paymentIntents.create({
        //     amount: total * 100,
        //     currency: card.country.currency.isoCode.toLowerCase(),
        //     customer: customer.stripeCustomerId,
        //     payment_method: card.stripeId,
        //     // off_session: true,
        //     confirm: true,
        //     receipt_email: customer.email || undefined,
        //     transfer_group: transferGroupCode,
        //     description: `${cartProducts.length}x product${cartProducts.length > 1 ? "s" : ""} purchased by ${customer.email} (${
        //       customer.stripeCustomerId
        //     })`,
        //     metadata: {
        //       ref_code: refCode,
        //       calculated_stripe_proccessing_fee: stripeProccessingFees,
        //       products_quantity: cartProducts.length,
        //       product_ids: formatMetadata(cartProducts.map(({ product: { id, name } }) => JSON.stringify({ id, name })).toString()),
        //       // TODO: Fix
        //       // voucher_code: formatVoucherCodeMetadata(newPayment.voucherCode),
        //       entry_fees_total: totalWithEntryFees - totalWithoutEntryFees + total,
        //     },
        //   });
        //   if (!stripePayment) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
        //   let beachBarPricingFee = 0;
        //   let transferAmount = 0;
        //   let discountPerBeachBar = 0;
        //   if (newPaymentVoucher?.couponCode) {
        //     const voucherCouponCode = newPaymentVoucher.couponCode;
        //     if (!voucherCouponCode.beachBarId) {
        //       const beachBarCouponCodeDiscount = (totalWithEntryFees * voucherCouponCode.discountPercentage.toNumber()) / 100;
        //       discountPerBeachBar = beachBarCouponCodeDiscount / uniqBeachBars.length;
        //     }
        //   }
        //   // console.log(`Discount per #beach_bar: ${discountPerBeachBar}`);
        //   for (let i = 0; i < uniqBeachBars.length; i++) {
        //     const { id, stripeConnectId, currency, ...beachBar } = uniqBeachBars[i];
        //     const cartBarTotal = getTotal(cart, { beachBarId: id, afterToday: false, discount: discountPerBeachBar });
        //     console.log("#BEACH_BAR TOTAL: ", cartBarTotal);
        //     const { totalWithEntryFees } = cartBarTotal;
        //     let discountAmount = 0;
        //     if (newPaymentVoucher?.offerCode) {
        //       discountAmount = (totalWithEntryFees * newPaymentVoucher.offerCode.campaign.discountPercentage.toNumber()) / 100;
        //     }
        //     // console.log(paymentVoucherCode?.couponCode?.beachBarId);
        //     // console.log(beachBar.id);
        //     if (newPaymentVoucher?.couponCode?.beachBarId === id) {
        //       const couponCodeDiscount = (totalWithEntryFees * newPaymentVoucher.couponCode.discountPercentage.toNumber()) / 100;
        //       discountAmount += couponCodeDiscount;
        //     }
        //     const barTotal = toFixed2(totalWithEntryFees - discountAmount);
        //     // console.log(`Discount amount: ${discountAmount}`);
        //     // console.log("#BEACH_BAR ID: ", beachBar.id)
        //     if (barTotal > 0) {
        //       const { barFee, transferAmount: barTransferAmount } = getPaymentDetails(beachBar, {
        //         total: barTotal,
        //         stripeFee: stripeProccessingFees,
        //       });
        //       // console.log(`APP FEE: ${beachBarAppFee}`);
        //       // console.log(`TRANSFER AMOUNT: ${barTransferAmount}`);
        //       // console.log(`TOTAL: ${pricingFee.total}`);
        //       beachBarPricingFee += barFee;
        //       transferAmount += barTransferAmount;
        //       if (barTransferAmount * 100 > 1) {
        //         const stripeTransfer = await stripe.transfers.create({
        //           amount: Math.round(barTransferAmount * 100),
        //           currency: currency.isoCode.toLowerCase(),
        //           transfer_group: transferGroupCode,
        //           destination: stripeConnectId,
        //           metadata: {
        //             ref_code: refCode,
        //             stripe_fee: stripeProccessingFees,
        //             platform_fee: barFee,
        //             products: formatMetadata(
        //               cartProducts
        //                 .filter(({ product: { beachBarId } }) => beachBarId === id)
        //                 .map(({ product: { name } }) => JSON.stringify({ name }))
        //                 .toString()
        //             ),
        //             // TODO: Fix
        //             // offer_codes: formatVoucherCodeMetadata(newPayment.voucherCode),
        //           },
        //         });
        //         if (!stripeTransfer) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
        //       }
        //     }
        //   }
        //   // TODO: Fix
        //   const newP = await prisma.payment.create({
        //     data: {
        //       ...newPayment,
        //       stripeId: stripePayment.id,
        //       appFee: new Prisma.Decimal(beachBarPricingFee),
        //       transferAmount: new Prisma.Decimal(transferAmount),
        //     },
        //   });
        //   if (newPaymentVoucher) {
        //     const isCoupon = newPaymentVoucher.couponCode;
        //     await getManager().increment(
        //       isCoupon ? CouponCode : OfferCampaignCode,
        //       { id: newPaymentVoucher[isCoupon ? "couponCode" : "offerCode"]?.id },
        //       "timesUsed",
        //       1
        //     );
        //   }
        //   // Reserved products are created after a successful payment, via Stripe webhook events
        //   return newPayment;
        // } catch (err) {
        //   throw new ApolloError(err.message);
        // }
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
          // TODO: Fix
          // await payment.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }
        return true;
      },
    });
  },
});
