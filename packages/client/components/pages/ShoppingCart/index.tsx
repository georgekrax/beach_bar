import { Bar } from "./Bar";
import { Product } from "./Product";

type SubComponents = {
  Bar: typeof Bar;
  Product: typeof Product;
};

const ShoppingCartPage: React.FC & SubComponents = () => {
  return <></>;
};

ShoppingCartPage.Bar = Bar;
ShoppingCartPage.Product = Product;

ShoppingCartPage.displayName = "ShoppingCartPage";

export default ShoppingCartPage;