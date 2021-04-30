import { Step } from "./Step";

type SubComponents= {
  Step: typeof Step;
}

type Props = {};

const Checkout: React.FC<Props> & SubComponents = () => {
  return <div></div>;
};

Checkout.Step = Step;

Checkout.displayName = "Checkout";

export default Checkout;
