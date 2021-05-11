import { BeachBar } from "entity/BeachBar";
import { Payment } from "entity/Payment";
import { getConnection } from "typeorm";

export const fetchBeachBarPayments = async (id: BeachBar["id"]) => {
  const payments = await getConnection()
    .createQueryBuilder(Payment, "payment")
    .leftJoinAndSelect("payment.cart", "paymentCart")
    .leftJoinAndSelect("paymentCart.products", "products")
    .leftJoinAndSelect("products.product", "cartProduct")
    .leftJoinAndSelect("cartProduct.beachBar", "beachBar")
    .where("payment.isRefunded IS FALSE")
    .andWhere("beachBar.id = :id", { id })
    .getMany();
  return payments;
};
