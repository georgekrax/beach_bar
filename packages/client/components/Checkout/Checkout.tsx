<<<<<<< HEAD
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
=======
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
