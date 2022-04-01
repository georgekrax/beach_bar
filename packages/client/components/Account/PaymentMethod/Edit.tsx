import Header from "@/components/Header";
import { Card } from "@/graphql/generated";
import { FuncPaymentMethodFormData } from "@/pages/account/billing";
import { cardHolderSchema, monthSchema, yearSchema } from "@/utils/yup";
import { BottomSheetFProps, CreditCardProps, Form, Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import styles from "./Edit.module.scss";
import { useHookForm } from "@/utils/hooks";
import { PaymentMethod } from "./PaymentMethod";

type FormData = Omit<FuncPaymentMethodFormData, "id" | "isDefault">;

export type Props = {
  card?: Pick<Card, "id" | "cardholderName" | "expMonth" | "expYear" | "last4"> & Pick<CreditCardProps, "brand">;
  handleEdit: (card: { id: string } & Omit<Partial<FuncPaymentMethodFormData>, "id">, toast: boolean) => Promise<boolean>;
};

export const Edit: React.FC<Props & Required<Pick<BottomSheetFProps, "onDismiss">>> = ({
  card,
  onDismiss,
  handleEdit,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    ...form
  } = useForm<FormData>({
    resolver: yupResolver(yearSchema.concat(monthSchema, cardHolderSchema)),
    defaultValues: {
      ...card,
      month: card?.expMonth,
      year: card?.expYear,
    },
  });
  const { handleChange } = useHookForm<FormData>(form);

  const onSubmit = async ({ year, month, cardholderName }: FormData): Promise<boolean> => {
    if (!card) return false;
    return await handleEdit(
      { id: card.id, cardholderName, year, month, last4: card.last4, isDefault: undefined },
      true
    );
  };

  return (
    <Header.Crud
      closeIcon="close"
      title="Edit payment method"
      bottomSheet={{ isShown: card != null, onDismiss }}
      cta={{
        children: "Save",
        onClick: async (_, dismiss) =>
          handleSubmit(async data => {
            const res = await onSubmit(data);
            if (res) await dismiss();
          })(),
      }}
    >
      {card && (
        <Form.Group as="form" className={styles.form}>
          <div className="w100 flex-row-space-between-flex-start">
            <div className={styles.expiration + " flex-row-flex-start-flex-end"}>
              <Input.Number
                min={1}
                max={12}
                defaultValue={card.expMonth}
                label="Expiration"
                placeholder="Month"
                floatingplaceholder
                secondhelptext={{ error: true, value: errors.month?.message }}
                onValue={newVal => handleChange("month", newVal, true)}
              />
              <Input.Number
                min={dayjs().year()}
                max={dayjs().year() + 100}
                defaultValue={card.expYear}
                placeholder="Year"
                floatingplaceholder
                secondhelptext={{ error: true, value: errors.year?.message }}
                onValue={newVal => handleChange("year", newVal, true)}
              />
            </div>
            <PaymentMethod.CardBrand brand={card.brand} />
          </div>
          <Input
            label="Cardholder name"
            defaultValue={card.cardholderName}
            secondhelptext={{ error: true, value: errors.cardholderName?.message }}
            onChange={e => handleChange("cardholderName", e.target.value)}
          />
        </Form.Group>
      )}
    </Header.Crud>
  );
};

Edit.displayName = "AccountPaymentMethodEdit";
