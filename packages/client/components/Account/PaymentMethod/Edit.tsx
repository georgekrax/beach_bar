<<<<<<< HEAD
import Header from "@/components/Header";
import { Card } from "@/graphql/generated";
import { FuncPaymentMethodFormData } from "@/pages/account/billing";
import { cardHolderSchema, monthSchema, yearSchema } from "@/utils/yup";
import { BottomSheetFProps, CreditCardProps, Form, Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useController, useForm } from "react-hook-form";
import styles from "./Edit.module.scss";
import { PaymentMethod } from "./PaymentMethod";

type FormData = Omit<FuncPaymentMethodFormData, "id" | "isDefault">;

export type Props = {
  card?: Pick<Card, "id" | "cardholderName" | "expMonth" | "expYear" | "last4"> & Pick<CreditCardProps, "brand">;
  handleEdit: (card: FuncPaymentMethodFormData, toast: boolean) => Promise<boolean>;
};

export type FProps = Props & Required<Pick<BottomSheetFProps, "onDismiss">>;

export const Edit: React.FC<FProps> = ({ card, onDismiss, handleEdit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(yearSchema.concat(monthSchema).concat(cardHolderSchema)) });
  const { field: month } = useController<FormData, "month">({ name: "month", control });
  const { field: year } = useController<FormData, "year">({ name: "year", control });
  const { field: cardholderName } = useController<FormData, "cardholderName">({ name: "cardholderName", control });

  const onSubmit = async ({ year, month, cardholderName }: FormData): Promise<boolean> => {
    if (!card) return false;
    return await handleEdit(
      { id: card.id, cardholderName, year, month, last4: card.last4, isDefault: undefined },
      true
    );
  };

  return (
    <Header.Crud
      bottomSheet={{ isShown: card !== null && card !== undefined, onDismiss }}
      cta={{
        children: "Save",
        onClick: async (_, dismiss) =>
          handleSubmit(async data => {
            const res = await onSubmit(data);
            if (res) await dismiss();
          })(),
      }}
      title="Edit payment method"
    >
      <Form.Group as="form" className={styles.form}>
        {card && (
          <>
            <div className="w100 flex-row-space-between-flex-start">
              <div className={styles.expiration + " flex-row-flex-start-flex-end"}>
                <Input.Number
                  {...month}
                  min={1}
                  max={12}
                  defaultValue={card.expMonth}
                  label="Expiration"
                  placeholder="Month"
                  floatingplaceholder
                  forwardref={month.ref}
                  secondhelptext={{ error: true, value: errors.month?.message }}
                />
                <Input.Number
                  {...year}
                  min={dayjs().year()}
                  max={dayjs().year() + 100}
                  defaultValue={card.expYear}
                  placeholder="Year"
                  floatingplaceholder
                  forwardref={year.ref}
                  secondhelptext={{ error: true, value: errors.year?.message }}
                />
              </div>
              <PaymentMethod.CardBrand brand={card.brand} />
            </div>
            <Input
              {...cardholderName}
              label="Cardholder name"
              defaultValue={card.cardholderName}
              forwardref={cardholderName.ref}
              secondhelptext={{ error: true, value: errors.cardholderName?.message }}
            />
          </>
        )}
      </Form.Group>
    </Header.Crud>
  );
};

Edit.displayName = "AccountPaymentMethodEdit";
=======
import Header from "@/components/Header";
import { Card } from "@/graphql/generated";
import { FuncPaymentMethodFormData } from "@/pages/account/billing";
import { cardHolderSchema, monthSchema, yearSchema } from "@/utils/yup";
import { BottomSheetFProps, CreditCardProps, Form, Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useController, useForm } from "react-hook-form";
import styles from "./Edit.module.scss";
import { PaymentMethod } from "./PaymentMethod";

type FormData = Omit<FuncPaymentMethodFormData, "id" | "isDefault">;

export type Props = {
  card?: Pick<Card, "id" | "cardholderName" | "expMonth" | "expYear" | "last4"> & Pick<CreditCardProps, "brand">;
  handleEdit: (card: FuncPaymentMethodFormData, toast: boolean) => Promise<boolean>;
};

export type FProps = Props & Required<Pick<BottomSheetFProps, "onDismiss">>;

export const Edit: React.FC<FProps> = ({ card, onDismiss, handleEdit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(yearSchema.concat(monthSchema).concat(cardHolderSchema)) });
  const { field: month } = useController<FormData, "month">({ name: "month", control });
  const { field: year } = useController<FormData, "year">({ name: "year", control });
  const { field: cardholderName } = useController<FormData, "cardholderName">({ name: "cardholderName", control });

  const onSubmit = async ({ year, month, cardholderName }: FormData): Promise<boolean> => {
    if (!card) return false;
    return await handleEdit(
      { id: card.id, cardholderName, year, month, last4: card.last4, isDefault: undefined },
      true
    );
  };

  return (
    <Header.Crud
      bottomSheet={{ isShown: card !== null && card !== undefined, onDismiss }}
      cta={{
        children: "Save",
        onClick: async (_, dismiss) =>
          handleSubmit(async data => {
            const res = await onSubmit(data);
            if (res) await dismiss();
          })(),
      }}
      title="Edit payment method"
    >
      <Form.Group as="form" className={styles.form}>
        {card && (
          <>
            <div className="w100 flex-row-space-between-flex-start">
              <div className={styles.expiration + " flex-row-flex-start-flex-end"}>
                <Input.Number
                  {...month}
                  min={1}
                  max={12}
                  defaultValue={card.expMonth}
                  label="Expiration"
                  placeholder="Month"
                  floatingplaceholder
                  forwardref={month.ref}
                  secondhelptext={{ error: true, value: errors.month?.message }}
                />
                <Input.Number
                  {...year}
                  min={dayjs().year()}
                  max={dayjs().year() + 100}
                  defaultValue={card.expYear}
                  placeholder="Year"
                  floatingplaceholder
                  forwardref={year.ref}
                  secondhelptext={{ error: true, value: errors.year?.message }}
                />
              </div>
              <PaymentMethod.CardBrand brand={card.brand} />
            </div>
            <Input
              {...cardholderName}
              label="Cardholder name"
              defaultValue={card.cardholderName}
              forwardref={cardholderName.ref}
              secondhelptext={{ error: true, value: errors.cardholderName?.message }}
            />
          </>
        )}
      </Form.Group>
    </Header.Crud>
  );
};

Edit.displayName = "AccountPaymentMethodEdit";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
