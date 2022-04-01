import { CardElement } from "./CardElement";

type SubComponents = {
  CardElement: typeof CardElement;
}

type Props = {

}

const Stripe: React.FC<Props> & SubComponents = () => {
  return (
    <div>

    </div>
  );
};

Stripe.displayName = "Stripe"

Stripe.CardElement = CardElement;

export default Stripe;