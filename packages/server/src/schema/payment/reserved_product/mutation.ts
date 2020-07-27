import { BigIntScalar, errors, MyContext } from "@beach_bar/common";
import { arg, extendType } from "@nexus/schema";
import { DeleteResult } from "../../types";
import { DeleteType } from "@typings/.index";
import { ReservedProduct } from "@entity/ReservedProduct";

export const ReserveProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteReservedProduct", {
      type: DeleteResult,
      description: "Refund (delete) a reserved product from a payment",
      nullable: false,
      args: {
        reservedProductId: arg({
          type: BigIntScalar,
          required: true,
          description: "The ID value of the reserved product",
        }),
      },
      resolve: async (_, { reservedProductId }, { stripe, redis }: MyContext): Promise<DeleteType> => {
        if (!reservedProductId || reservedProductId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid reserved product" } };
        }

        const reservedProduct = await ReservedProduct.findOne({
          where: { id: reservedProductId },
          relations: [
            "product",
            "product.beachBar",
            "payment",
            "payment.cart",
            "payment.cart.products",
            "payment.cart.products.product",
          ],
        });
        if (!reservedProduct) {
          return { error: { code: errors.CONFLICT, message: "Specified reserved product does not exist" } };
        }
        if (reservedProduct.isRefunded) {
          return { error: { code: errors.CONFLICT, message: "Specified product has already been refunded" } };
        }

        try {
          const refund = await reservedProduct.payment.getRefundPercentage();
          if (!refund) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          const { refundPercentage, daysDiff } = refund;
          const productTotal = await reservedProduct.getPrice();
          if (productTotal === undefined) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          } else if (productTotal === 0) {
            return { error: { message: "You shopping cart total was 0" } };
          }
          // ! Do not divide by 100, because Stipe processes cents, and the number will be automatically in cents
          const refundedAmount = productTotal * parseInt(refundPercentage.percentageValue.toString());
          if (daysDiff >= 86400000) {
            const stripeRefund = await stripe.refunds.create({
              payment_intent: reservedProduct.payment.stripeId,
              amount: refundedAmount,
              reason: "requested_by_customer",
              reverse_transfer: true,
              refund_application_fee: false,
            });
            if (!stripeRefund) {
              return { error: { message: errors.SOMETHING_WENT_WRONG } };
            }
          }
          await reservedProduct.customSoftRemove(redis, daysDiff >= 86400000);
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
