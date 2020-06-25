import { Cart } from "../../entity/Cart";
import { User } from "../../entity/User";

export const createCart = async (user?: User): Promise<Cart | null> => {
  const cart = Cart.create({
    user,
    total: 0,
  });
  try {
    await cart.save();
  } catch {
    return null;
  }
  return cart;
};
