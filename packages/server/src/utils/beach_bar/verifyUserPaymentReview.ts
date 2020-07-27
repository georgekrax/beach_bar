import { Payment } from "@entity/Payment";
import { User } from "@entity/User";
import { VerifyUserPaymentReviewReturnResult } from "@typings/beach_bar/review";

export const verifyUserPaymentReview = async (
  beachBarId: number,
  refCode?: string,
  payload?: any
): Promise<VerifyUserPaymentReviewReturnResult> => {
  if (refCode) {
    const payment = await Payment.findOne({
      where: { refCode },
      relations: ["card", "card.customer", "card.customer.reviews", "cart", "cart.products", "cart.products.product"],
    });
    if (!payment || !payment.cart.products) {
      return {
        boolean: false,
      };
    }
    return {
      boolean: payment.hasBeachBarProduct(beachBarId),
      customer: payment.card.customer,
      payment,
    };
  } else if (payload && payload.sub) {
    const user = await User.findOne({
      where: { id: payload.sub },
      relations: [
        "customer",
        "customer.reviews",
        "carts",
        "carts.payment",
        "carts.payment.cart",
        "carts.payment.cart.products",
        "carts.payment.cart.products.product",
      ],
    });
    if (!user || !user.carts || !user.customer) {
      return {
        boolean: false,
      };
    }
    const beachBarPayment: any = user.carts
      .map(cart => cart.payment)
      .find(payment => {
        if (payment) {
          return { boolean: payment.hasBeachBarProduct(beachBarId), payment };
        } else {
          return { boolean: false, payment: undefined };
        }
      });
    return {
      boolean: beachBarPayment.boolean,
      customer: user.customer,
      payment: beachBarPayment.payment,
    };
  } else {
    return {
      boolean: false,
    };
  }
};
