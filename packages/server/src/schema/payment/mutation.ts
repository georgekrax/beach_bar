/* eslint-disable prettier/prettier */
import { BigIntScalar, errors, generateID, MyContext } from "@beach_bar/common";
import { arg, extendType } from "@nexus/schema";
import { payment as paymentStatus } from "../../constants/status";
import { Card } from "../../entity/Card";
import { Cart } from "../../entity/Cart";
import { Payment } from "../../entity/Payment";
import { PaymentStatus } from "../../entity/PaymentStatus";
import { StripeFee } from "../../entity/StripeFee";
import { StripeMinimumCurrency } from "../../entity/StripeMinimumCurrency";
import { DeleteType, ErrorType } from "../returnTypes";
import { DeleteResult } from "../types";
import { AddPaymentType } from "./returnTypes";
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
      },
      resolve: async (_, { cartId, cardId }, { stripe }: MyContext): Promise<AddPaymentType | ErrorType> => {
        if (!cartId || cartId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
        }
        if (!cardId || cardId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid credit or debit card" } };
        }

        const cart = await Cart.findOne({
          where: { id: cartId },
          relations: ["products", "products.product", "products.product.beachBar", "products.product.beachBar.defaultCurrency"],
        });
        if (!cart || !cart.products) {
          return { error: { code: errors.CONFLICT, message: "Specified shopping cart does not exist" } };
        }
        const uniqueBeachBars = cart.getUniqueBeachBars();
        if (!uniqueBeachBars || uniqueBeachBars.length === 0) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        const cartTotal = await cart.getTotalPrice();
        if (cartTotal !== parseFloat(cart.total.toString())) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        const card = await Card.findOne({ where: { id: cardId }, relations: ["customer", "country"] });
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

        const cardProcessingFee = await StripeFee.findOne({ where: { isEu: card.country.isEu } });
        if (!cardProcessingFee) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }

        try {
          const newPayments: Payment[] = [];
          for (let i = 0; i < uniqueBeachBars.length; i++) {
            const refCode = generateID(16);
            const beachBar = uniqueBeachBars[i];
            const beachBarId = uniqueBeachBars[i].id;
            const products = cart.getBeachBarProducts(beachBarId);
            if (!products) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
            const totalPrice = await cart.getBeachBarTotalPrice(beachBarId);
            if (totalPrice === undefined) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
            const { totalWithEntryFees: total, entryFeeTotal } = totalPrice;
            const newPayment = Payment.create({
              cart,
              card,
              status,
              refCode,
            });
            const isZeroCartTotal = cart.verifyZeroCartTotal(beachBar);
            const minimumCurrency = await StripeMinimumCurrency.findOne({ currencyId: beachBar.defaultCurrencyId });
            if (!minimumCurrency) {
              return { error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG } };
            }
            if (!beachBar.zeroCartTotal && total <= parseFloat(minimumCurrency.chargeAmount.toString())) {
              return {
                error: {
                  code: errors.ZERO_CART_TOTAL_ERROR_CODE,
                  message: "You cannot have 0 as the total of your shopping cart for this #beach_bar",
                },
              };
            } else if (isZeroCartTotal) {
              const charge = await stripe.charges.create({
                amount: minimumCurrency.chargeAmount * 100,
                currency: beachBar.defaultCurrency.isoCode.toLowerCase(),
                source: beachBar.stripeConnectId,
              });
              newPayment.stripeId = charge.id;
              console.log(charge);
            } else {
              const beachBarPricingFee = await beachBar.getBeachBarPaymentFee(cardProcessingFee, Math.round(total * 100));
              if (!beachBarPricingFee) {
                return { error: { message: errors.SOMETHING_WENT_WRONG } };
              }
              const { total: amount, transferAmount, beachBarAppFee } = beachBarPricingFee;
              const stripePayment = await stripe.paymentIntents.create({
                amount,
                currency: beachBar.defaultCurrency.isoCode.toLowerCase(),
                customer: customer.stripeCustomerId,
                payment_method: card.stripeId,
                off_session: true,
                confirm: true,
                receipt_email: customer.email,
                description: `${products.length}x product${products.length > 1 ? "s" : ""} purchased by ${customer.email} (${
                  customer.stripeCustomerId
                })`,
                metadata: {
                  ref_code: refCode,
                  quantity: products.length,
                  product_ids: products
                    .map(product => JSON.stringify({ id: product.product.id, name: product.product.name }))
                    .toString()
                    .replace("[", "")
                    .replace("]", "")
                    .replace("},{", "} - {"),
                  entry_fee_total: entryFeeTotal,
                },
                transfer_data: {
                  // * Math.round(): 10.5 => 11
                  // * Math.trunc(): 10.5 => 10
                  amount: transferAmount,
                  destination: beachBar.stripeConnectId,
                },
              });
              if (!stripePayment) {
                return { error: { message: errors.SOMETHING_WENT_WRONG } };
              }
              newPayment.appFee = beachBarAppFee;
              newPayment.transferAmount = transferAmount;
              newPayment.stripeId = stripePayment.id;
            }
            await newPayment.save();
            newPayments.push(newPayment);
          }

          if (newPayments.length === 0) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }

          return {
            payments: newPayments,
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
          let cartTotal = await payment.cart.getTotalPrice();
          if (cartTotal === undefined) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          const entryFeeTotal = await payment.cart.getBeachBarsEntryFeeTotal();
          if (entryFeeTotal === undefined) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          cartTotal = cartTotal + entryFeeTotal;
          if (cartTotal === 0) {
            return { error: { message: "You shopping cart total was 0" } };
          }
          // ! Do not divide by 100, because Stipe processes cents, and the number will be automatically in cents
          const refundedAmount = cartTotal * parseInt(refundPercentage.percentageValue.toString());
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
