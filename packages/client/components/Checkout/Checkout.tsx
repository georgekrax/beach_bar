import { Step } from "./Step";
import { Customer } from "./Customer";
import { PaymentMethod } from "./PaymentMethod";

type SubComponents = {
  Step: typeof Step;
  Customer: typeof Customer;
  PaymentMethod: typeof PaymentMethod;
};

type Props = {};

const Checkout: React.FC<Props> & SubComponents = () => {
  return <div></div>;
};

Checkout.Step = Step;
Checkout.Customer = Customer;
Checkout.PaymentMethod = PaymentMethod;

Checkout.displayName = "Checkout";

export default Checkout;
