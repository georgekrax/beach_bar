/* eslint-disable prettier/prettier */
import { BigIntScalar, MyContext } from "@beach_bar/common";
import { arg, extendType } from "@nexus/schema";
import errors from "../../constants/errors";
import { payment as paymentStatus } from "../../constants/status";
import { Card } from "../../entity/Card";
import { Cart } from "../../entity/Cart";
import { Payment } from "../../entity/Payment";
import { PaymentStatus } from "../../entity/PaymentStatus";
import { generateID } from "@beach_bar/common";
import { StripeFee } from "../../entity/StripeFee";
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
          relations: [
            "user",
            "user.customer",
            "products",
            "products.product",
            "products.product.beachBar",
            "products.product.beachBar.defaultCurrency",
          ],
        });
        if (!cart || !cart.products) {
          return { error: { code: errors.CONFLICT, message: "Specified shopping cart does not exist" } };
        }

        const cartTotal = await cart.getTotalPrice();
        if (cartTotal !== parseFloat(cart.total.toString())) {
          return { error: { message: errors.SOMETHING_WENT_WRONG } };
        }
        if (cartTotal === 0) {
          return { error: { message: "Insufficient cart total" } };
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

        const beachBars = cart.products.map(product => product.product.beachBar);
        const uniqueBeachBars = beachBars.filter((beachBar, index, self) => index === self.findIndex(t => t.id === beachBar.id));
        if (!uniqueBeachBars || uniqueBeachBars.length === 0) {
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
            const refCode = generateID(10);
            const beachBarId = uniqueBeachBars[i].id;
            const products = cart.products.filter(product => product.product.beachBarId === beachBarId);
            const total = await cart.getBeachBarTotalPrice(beachBarId);
            if (total == undefined || total === null) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
            const beachBarPricingFee = await uniqueBeachBars[i].getBeachBarPaymentFee(cardProcessingFee, total * 100);
            if (!beachBarPricingFee) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
            const { total: amount, transferAmount, beachBarAppFee } = beachBarPricingFee;
            const stripePayment = await stripe.paymentIntents.create({
              amount,
              currency: uniqueBeachBars[i].defaultCurrency.isoCode.toLowerCase(),
              customer: customer.stripeCustomerId,
              payment_method: card.stripeId,
              off_session: true,
              confirm: true,
              receipt_email: customer.email,
              description: `${products.length}x products purchased by ${customer.email} (${customer.stripeCustomerId})`,
              metadata: {
                ref_code: refCode,
                quantity: products.length,
                product_ids: products
                  .map(product => JSON.stringify({ id: product.product.id, name: product.product.name }))
                  .toString()
                  .replace("[", "")
                  .replace("]", "")
                  .replace("},{", "} - {"),
              },
              transfer_data: {
                // * Math.round(): 10.5 => 11
                // * Math.trunc(): 10.5 => 10
                amount: transferAmount,
                destination: uniqueBeachBars[i].stripeConnectId,
              },
            });
            if (!stripePayment) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
            const newPayment = Payment.create({
              cart,
              card,
              status,
              appFee: beachBarAppFee,
              transferAmount,
              stripeId: stripePayment.id,
              refCode,
            });
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
          relations: ["cart", "cart.products"],
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
          if (!cartTotal) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
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
