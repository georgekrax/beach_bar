import Feedback from "@/components/Feedback";
import Header from "@/components/Header";
import Icons from "@/components/Icons";
import {
  CustomerPaymentMethodsDocument,
  CustomerPaymentMethodsQuery,
  useAddCustomerPaymentMethodMutation,
} from "@/graphql/generated";
import { PaymentMethodFormData } from "@/pages/account/billing";
import { useAuth, useConfig } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { Form } from "@hashtag-design-system/components";
import { Button, Input, Switch, useClassnames } from "@hashtag-design-system/components";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { memo, useEffect, useState } from "react";
import { FormState, useController, useForm } from "react-hook-form";
import styles from "./Add.module.scss";
import { PaymentMethod } from "./PaymentMethod";

type FormData = Pick<PaymentMethodFormData, "cardholderName" | "isDefault">;

export type Props = {
  customerId: string;
  cardsLength: number;
  defaultBtn?: boolean;
  saveForFuturePayments?: boolean;
  bottomSheet?: boolean;
  notifyOnSuccess?: boolean;
  onSubmit?: () => void;
  onSubmitId?: (cardId: string) => void;
  onFormState?: (formState: FormState<FormData>) => void;
};

export const Add: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">> = memo(
  ({
    customerId,
    cardsLength,
    defaultBtn = true,
    saveForFuturePayments = false,
    bottomSheet = true,
    notifyOnSuccess = true,
    children,
    onSubmit: onPropsSubmit,
    onSubmitId,
    onFormState,
    ...props
  }) => {
    const [savedForFuture, setSavedForFuture] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const [classNames, rest] = useClassnames(styles.container + " w100", props);

    const { data: meData } = useAuth();
    const [addPaymentMethod] = useAddCustomerPaymentMethodMutation();

    const { handleSubmit, control, formState } = useForm<FormData>({
      mode: "onBlur",
      defaultValues: {
        cardholderName: meData?.me?.fullName || "",
        isDefault: cardsLength === 0,
      },
    });
    const { field: cardholderName } = useController<FormData, "cardholderName">({ name: "cardholderName", control });
    const {
      field: { value, ...isDefault },
    } = useController<FormData, "isDefault">({
      name: "isDefault",
      control,
      defaultValue: cardsLength === 0,
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
    ): Promise<{ id: string | undefined }> => {
      e?.preventDefault();
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      if (!stripe || !elements) {
        notify("error", "");
        return { id: undefined };
      }

      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const card = elements.getElement(CardElement);
      if (!card) {
        notify("error", "");
        return { id: undefined };
      }
      const result = await stripe.createToken(card);

      if (result.error) {
        notify("error", result.error.message || "", { somethingWentWrong: { onlyWhenUndefined: true } });
        return { id: undefined };
      } else {
        if (onPropsSubmit) onPropsSubmit();
        const { data: res, errors } = await addPaymentMethod({
          variables: {
            token: result.token.id,
            customerId,
            cardholderName,
            isDefault: saveForFuturePayments || isDefault,
            savedForFuture,
          },
          update: (cache, { data }) => {
            const cachedData = cache.readQuery<CustomerPaymentMethodsQuery>({
              query: CustomerPaymentMethodsDocument,
            });
            cache.writeQuery<CustomerPaymentMethodsQuery>({
              query: CustomerPaymentMethodsDocument,
              data: {
                customerPaymentMethods: [
                  ...(Array.from(cachedData?.customerPaymentMethods || []) || []),
                  data?.addCustomerPaymentMethod.card || [],
                ].flat(),
              },
            });
          },
        });
        if (errors) {
          errors.forEach(({ message }) => notify("error", message));
          return { id: undefined };
        } else {
          const id = res?.addCustomerPaymentMethod.card.id || "";
          if (notifyOnSuccess) notify("success", "Success! Your payment method was added.");
          if (onSubmitId) onSubmitId(id);
          return { id: res?.addCustomerPaymentMethod.card.id || undefined };
        }
      }
    };

    useEffect(() => {
      if (onFormState) onFormState(formState);
    }, [formState]);

    const { errors } = formState;
    return (
      <div className={classNames} {...rest}>
        <Button className={styles.btn} variant="secondary" aria-label="Add" onClick={() => setIsShown(true)}>
          <Icons.Add className="icon--bold" width={16} height={16} />
          <div>Add</div>
        </Button>
        <Header.Crud
          bottomSheet={bottomSheet ? { isShown, onDismiss: () => setIsShown(false) } : undefined}
          cta={{
            children: "Add",
            icon: <Icons.Add className="icon--bold" width={16} height={16} />,
            onClick: async (_, dismiss) =>
              handleSubmit(async (data, e) => {
                const res = await onSubmit(data, e);
                if (res.id) await dismiss();
              })(),
          }}
          title="Add payment method"
        >
          <Form.Group className={styles.form + " w100"} onSubmit={handleSubmit(onSubmit)}>
            <CardElement
              className="w100 input"
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
              {...cardholderName}
              placeholder="Cardholder name"
              defaultValue={meData?.me?.fullName}
              forwardref={cardholderName.ref}
              secondhelptext={{ error: true, value: errors.cardholderName?.message }}
            />
            <div className="w100 flex-column-center-flex-start">
              {defaultBtn && (
                <PaymentMethod.IsDefault
                  {...isDefault}
                  showDefault
                  ref={isDefault.ref as any}
                  onValue={newVal => isDefault.onChange(newVal)}
                  defaultChecked={cardsLength === 0}
                />
              )}
              {saveForFuturePayments && (
                <Switch
                  defaultChecked
                  label={{ position: "right", value: "Save this card for future payment" }}
                  onChange={e => setSavedForFuture(e.target.value === "true" ? false : true)}
                />
              )}
              {errors.isDefault && (
                <Feedback.Error style={{ alignSelf: "flex-start" }}>{errors.isDefault.message}</Feedback.Error>
              )}
              {children}
            </div>
          </Form.Group>
        </Header.Crud>
      </div>
    );
  }
);

Add.displayName = "Add";
