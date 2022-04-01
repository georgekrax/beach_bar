import Feedback from "@/components/Feedback";
import Header from "@/components/Header";
import Stripe from "@/components/Stripe";
import {
  CustomerPaymentMethodsDocument,
  CustomerPaymentMethodsQuery,
  useAddCustomerPaymentMethodMutation,
} from "@/graphql/generated";
import { PaymentMethodFormData } from "@/pages/account/billing";
import { notify } from "@/utils/notify";
import { Box, BoxProps, Button, Flex, Form, Input, Switch, useDisclosure } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { PaymentMethod } from "./PaymentMethod";

export const yupSchema = yup.object().shape({
  cardholderName: yup.string().min(1, "Cardholder name must be at least 1 characters").required(),
  isCardValid: yup.boolean().required("required").isTrue("must be hey"),
});

type FormData = Pick<PaymentMethodFormData, "cardholderName" | "isDefault"> & {
  isSavedForFuture: boolean;
  isCardValid: boolean;
};

export type Props = BoxProps & {
  customerId: string;
  cardsLength: number;
  hasDefaultBtn?: boolean;
  saveForFuturePayments?: boolean;
  defaultSaveForFuture?: boolean;
  atCheckout?: boolean;
  onSubmit?: (e: React.BaseSyntheticEvent) => void;
  onSubmitId?: (cardId: string) => void;
  setIsFormValid?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Add: React.FC<Props> = memo(
  ({
    customerId,
    cardsLength,
    saveForFuturePayments = false,
    defaultSaveForFuture = false,
    atCheckout = false,
    hasDefaultBtn = !atCheckout,
    onSubmit: _onSubmit,
    onSubmitId,
    setIsFormValid,
    children,
    ...props
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: session } = useSession();
    const [addPaymentMethod] = useAddCustomerPaymentMethodMutation();

    const { register, setValue, handleSubmit, formState } = useForm<FormData>({
      mode: "onBlur",
      resolver: yupResolver(yupSchema),
      defaultValues: {
        cardholderName: (session?.fullName as string) || "",
        isDefault: cardsLength === 0,
        isSavedForFuture: defaultSaveForFuture,
        isCardValid: false,
      },
    });

    const stripe = useStripe();
    const elements = useElements();

    const onSubmit = async (
      { cardholderName, isDefault, isSavedForFuture }: FormData,
      e: React.BaseSyntheticEvent<object, any, any> | undefined
    ): Promise<string | void> => {
      e?.preventDefault();
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      if (!stripe || !elements) return notify("error", "");

      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const card = elements.getElement(CardElement);
      if (!card) return notify("error", "");
      const result = await stripe.createToken(card);

      if (result.error) return notify("error", result.error.message || "");

      if (_onSubmit && e) _onSubmit(e);
      const { data: res, errors } = await addPaymentMethod({
        variables: {
          token: result.token.id,
          customerId,
          cardholderName,
          isDefault: saveForFuturePayments || isDefault,
          savedForFuture: isSavedForFuture,
        },
        update: (cache, { data }) => {
          const cachedData = cache.readQuery<CustomerPaymentMethodsQuery>({ query: CustomerPaymentMethodsDocument });
          cache.writeQuery<CustomerPaymentMethodsQuery>({
            query: CustomerPaymentMethodsDocument,
            data: {
              customerPaymentMethods: [
                ...(Array.from(cachedData?.customerPaymentMethods || []) || []),
                data?.addCustomerPaymentMethod || [],
              ].flat(),
            },
          });
        },
      });
      if (errors || !res) return errors?.forEach(({ message }) => notify("error", message));
      else {
        const id = res.addCustomerPaymentMethod.id.toString();
        if (!atCheckout) notify("success", "Success! Your payment method was added.");
        onSubmitId?.(id);
        return id;
      }
    };

    useEffect(() => setIsFormValid?.(formState.isValid), [formState]);

    const { errors, touchedFields } = formState;

    return (
      <Box mb={atCheckout ? undefined : 4} {...props}>
        {/* <Next.Link href="/account/billing/add" prefetch={false} className={styles.add + " d--block"}> */}
        {!atCheckout && (
          <Button aria-label="Add" mr="auto" mb={6} py={2} px={3} gap={2} onClick={onOpen}>
            <Icon.Math.Add />
            <span>Add</span>
          </Button>
        )}
        {/* </Next.Link> */}
        <Header.Crud
          closeIcon="close"
          title="Add payment method"
          bottomSheet={atCheckout ? undefined : { isOpen, onClose }}
          container={!atCheckout ? undefined : { display: "none" }}
          content={
            !atCheckout
              ? undefined
              : { mt: 8, p: 0, overflow: "initial", bg: "transparent", sx: { "& > div": { m: 0 } } }
          }
          cta={{
            children: "Add",
            icon: <Icon.Math.Add />,
            onClick: async (_, dismiss) =>
              handleSubmit(async (data, e) => {
                const res = await onSubmit(data, e);
                if (res) await dismiss();
              })(),
          }}
        >
          <Box as="form" display="flex" flexDir="column" gap={6} onSubmit={handleSubmit(onSubmit)}>
            <Stripe.CardElement
              onChange={({ complete }) => setValue("isCardValid", complete, { shouldValidate: true })}
            />
            <Form.Control isInvalid={touchedFields.cardholderName && !!errors.cardholderName} isOptional={atCheckout}>
              <Input placeholder="Cardholder name" {...register("cardholderName")} />
              <Form.ErrorMessage>{errors.cardholderName?.message}</Form.ErrorMessage>
            </Form.Control>
            <Flex flexDir="column" justify="center" width="100%">
              {hasDefaultBtn && (
                <PaymentMethod.IsDefault
                  hasDefault
                  defaultChecked={cardsLength === 0}
                  onChange={e => setValue("isDefault", e.target.value === "true")}
                />
              )}
              {saveForFuturePayments && (
                <Switch
                  defaultChecked={cardsLength === 0}
                  placement="right"
                  alignSelf="flex-end"
                  onChange={e => setValue("isSavedForFuture", e.target.value === "true")}
                >
                  Save this card for future payments
                </Switch>
              )}
              {errors.isDefault && <Feedback.Error alignSelf="flex-start">{errors.isDefault.message}</Feedback.Error>}
              {children}
            </Flex>
          </Box>
        </Header.Crud>
      </Box>
    );
  }
);

Add.displayName = "Add";
