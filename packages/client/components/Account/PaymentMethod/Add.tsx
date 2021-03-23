import Feedback from "@/components/Feedback";
import Header from "@/components/Header";
import Icons from "@/components/Icons";
import {
  GetCustomerPaymentMethodsDocument,
  GetCustomerPaymentMethodsQuery,
  useAddCustomerPaymentMethodMutation,
} from "@/graphql/generated";
import { useAuth, useConfig } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { Button, Form, Input } from "@hashtag-design-system/components";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { PaymentMethodFormData } from "../../../pages/account/billing";
import styles from "./Add.module.scss";
import { PaymentMethod } from "./PaymentMethod";

type FormData = Pick<PaymentMethodFormData, "cardholderName" | "isDefault">;

type Props = {
  customerId: string;
  cardsLength: number;
};

export const Add: React.FC<Props> = ({ customerId, cardsLength }) => {
  const [isShown, setIsShown] = useState(false);
  const { data: meData } = useAuth();
  const [addPaymentMethod] = useAddCustomerPaymentMethodMutation();

  const { register, handleSubmit, control, errors } = useForm<FormData>();
  const {
    field: { ref: isDefaultRef, onChange, ...isDefaultProps },
  } = useController({
    name: "isDefault",
    control,
    // defaultValue: cardsLength === 0,
  });

  const stripe = useStripe();
  const elements = useElements();

  const {
    colors: { red, grey },
    variables: { primary },
  } = useConfig();

  const onSubmit = async (
    { cardholderName, isDefault }: FormData,
    e: React.BaseSyntheticEvent<object, any, any> | undefined
  ): Promise<boolean> => {
    e?.preventDefault();
    // Stripe.js has not loaded yet. Make sure to disable
    // form submission until Stripe.js has loaded.
    if (!stripe || !elements) {
      notify("error", "");
      return false;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);
    if (!card) {
      notify("error", "");
      return false;
    }
    const result = await stripe.createToken(card);

    if (result.error) {
      notify("error", result.error.message || "", { somethingWentWrong: { onlyWhenUndefined: true } });
      return false;
    } else {
      const { errors } = await addPaymentMethod({
        variables: {
          token: result.token.id,
          customerId,
          cardholderName,
          isDefault,
        },
        update: (cache, { data }) => {
          const cachedData = cache.readQuery<GetCustomerPaymentMethodsQuery>({
            query: GetCustomerPaymentMethodsDocument,
          });
          cache.writeQuery({
            query: GetCustomerPaymentMethodsDocument,
            data: {
              getCustomerPaymentMethods: [
                ...Array.from(cachedData?.getCustomerPaymentMethods || []),
                data?.addCustomerPaymentMethod.card,
              ],
            },
          });
        },
      });
      if (errors) {
        errors.forEach(({ message }) => notify("error", message));
        return false;
      } else {
        notify("success", "Success! Your payment method was added.");
        return true;
      }
    }
  };

  return (
    <div className={styles.container + " w-100"}>
      <Button className={styles.btn} variant="secondary" aria-label="Add" onClick={() => setIsShown(true)}>
        <Icons.Add className="icon--bold" width={16} height={16} />
        <span>Add</span>
      </Button>
      <Header.Crud
        bottomSheet={{
          isShown,
          onDismiss: () => setIsShown(false),
        }}
        cta={{
          children: "Add",
          icon: <Icons.Add className="icon--bold" width={16} height={16} />,
          onClick: async (_, dismiss) =>
            handleSubmit(async (data, e) => {
              const res = await onSubmit(data, e);
              if (res) await dismiss();
            })(),
        }}
        title="Add payment method"
      >
        <Form.Group className={styles.form + " w-100"}>
          <CardElement
            className="w-100 input"
            options={{
              style: {
                base: {
                  iconColor: primary,
                  fontSize: "16px",
                  color: grey["1000"],
                  "::placeholder": { color: grey["900"] },
                },
                invalid: { color: red["600"] },
              },
            }}
          />
          <Input
            name="cardholderName"
            placeholder="Cardholder name"
            defaultValue={meData && meData.me ? meData.me.firstName + " " + meData.me.lastName : undefined}
            forwardref={register}
            secondhelptext={{ error: true, value: errors.cardholderName?.message }}
          />
          <div className="flex-column-center-flex-start">
            <PaymentMethod.IsDefault
              showDefault
              ref={isDefaultRef as any}
              onValue={newVal => onChange(newVal)}
              defaultChecked={cardsLength === 0}
              {...isDefaultProps}
            />
            {errors.isDefault && (
              <Feedback.Error style={{ alignSelf: "flex-start" }}>{errors.isDefault.message}</Feedback.Error>
            )}
          </div>
        </Form.Group>
      </Header.Crud>
    </div>
  );
};

Add.displayName = "Add";
