import { BeachBar } from "../../entity/BeachBar";
import { CurrencyProductPrice } from "../../entity/CurrencyProductPrice";
import { ProductCategory } from "../../entity/ProductCategory";

export const checkMinimumProductPrice = async (
  price: number,
  category: ProductCategory,
  beachBar: BeachBar,
  currencyId: number,
): Promise<Error | void> => {
  const productPrice = await CurrencyProductPrice.findOne({ where: { currencyId }, relations: ["currency"] });
  if (!productPrice) {
    throw new Error("Something went wrong");
  }
  if (!category.zeroPrice && price === 0) {
    throw new Error("You are not allowed to have 0 as a price for this type of product");
  }
  if (
    !category.whitelist &&
    !beachBar.entryFees.map(entryFee => entryFee.date).some(date => date.getTime() > Date.now()) &&
    price > productPrice.price
  ) {
    throw new Error("You should set an entry fee for the next days, to have 0 as a price for this type of product");
  }
  if (price < productPrice.price && (!category.zeroPrice || !category.whitelist)) {
    throw new Error(
      `You are not allowed to have a price lower than ${productPrice.price}${productPrice.currency.symbol} for this type of product`,
    );
  }
};
