import Account, { AccountPaymentMethodEditProps } from "@/components/Account";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import {
  Card,
  CustomerPaymentMethodsDocument,
  CustomerPaymentMethodsQuery,
  useCustomerQuery,
  useDeleteCustomerPaymentMethodMutation,
  useUpdateCustomerPaymentMethodMutation,
} from "@/graphql/generated";
import { notify } from "@/utils/notify";
import { Dialog, DialogDismissInfoType } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.2 } },
};

export type PaymentMethodFormData = {
  month: Card["expMonth"];
  year: Card["expYear"];
} & Pick<Card, "id" | "cardholderName" | "last4" | "isDefault">;

export type FuncPaymentMethodFormData = Omit<PaymentMethodFormData, "isDefault"> &
  Pick<Partial<PaymentMethodFormData>, "isDefault">;

const AccountBillingPage: React.FC = () => {
  const [updateInfo, setUpdateInfo] = useState<{
    edit?: AccountPaymentMethodEditProps["card"];
    deleteId?: PaymentMethodFormData["id"];
  }>({});

  const { data, loading, error } = useCustomerQuery();
  const [updatePaymentMethod] = useUpdateCustomerPaymentMethodMutation();
  const [deletePaymentMethod] = useDeleteCustomerPaymentMethodMutation();

  const sorted = useMemo(
    () => Array.from(data?.customer.cards || []).sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [data]
  );

  const handleEdit = async (
    card: Parameters<AccountPaymentMethodEditProps["handleEdit"]>["0"],
    toast: boolean
  ): Promise<boolean> => {
    if (!card) {
      if (toast) notify("error", "");
      return false;
    }
    const { id, year, month, cardholderName, isDefault } = card;
    const { data, errors } = await updatePaymentMethod({
      variables: { cardId: id, expMonth: month, expYear: year, cardholderName, isDefault },
      update: (cache, { data }) => {
        const cachedData = cache.readQuery<CustomerPaymentMethodsQuery>({ query: CustomerPaymentMethodsDocument });
        const newCard = data?.updateCustomerPaymentMethod;
        if (!newCard) return;
        const updated = cachedData?.customerPaymentMethods?.map(prevCard => {
          if (prevCard.id === newCard.id) return newCard;
          else {
            if (newCard.isDefault) return { ...prevCard, isDefault: false };
            else return prevCard;
          }
        });
        cache.writeQuery<CustomerPaymentMethodsQuery>({
          query: CustomerPaymentMethodsDocument,
          data: { customerPaymentMethods: updated || [] },
        });
      },
    });
    if (errors && !data) {
      errors.forEach(({ message }) => notify("error", message));
      return false;
    } else {
      if (toast) notify("success", "Payment method updated!");
      return true;
    }
  };

  const handleRemoveDismiss = async ({ cancel }: DialogDismissInfoType) => {
    const { deleteId } = updateInfo;
    if (!deleteId || cancel) return setUpdateInfo({ deleteId: undefined });
    const { data, errors } = await deletePaymentMethod({
      variables: { cardId: deleteId },
      update: cache => {
        const cachedData = cache.readQuery<CustomerPaymentMethodsQuery>({
          query: CustomerPaymentMethodsDocument,
        });
        const newArr = cachedData?.customerPaymentMethods?.filter(({ id }) => id !== deleteId);
        cache.writeQuery<CustomerPaymentMethodsQuery>({
          query: CustomerPaymentMethodsDocument,
          data: { customerPaymentMethods: newArr || [] },
        });
      },
    });
    setUpdateInfo({ deleteId: undefined });
    if (!data && errors) errors.forEach(({ message }) => notify("error", message));
  };

  return (
    <Layout hasToaster>
      <Account.Dashboard defaultSelected="/account/billing">
        {loading ? (
          <h2>Loading...</h2>
        ) : error || !data?.customer ? (
          <h2>Error</h2>
        ) : (
          <Next.MotionContainer>
            <Account.PaymentMethod.Add
              defaultSaveForFuture
              cardsLength={data.customer.cards?.length || 0}
              customerId={data.customer.id}
            />
            {sorted.length > 0 ? (
              <motion.div
                className="account__billing__list w100 flex-row-center-center flex--wrap"
                initial="initial"
                animate="animate"
                variants={variants}
              >
                {sorted.map(card => (
                  <Account.PaymentMethod
                    key={card.id}
                    card={{ ...card, brand: card.brand?.name as any }}
                    isDefault={card.isDefault}
                    handleEdit={handleEdit}
                    onEditClick={() => setUpdateInfo({ edit: { ...card, brand: card.brand?.name as any } })}
                    onRemoveClick={() => setUpdateInfo({ deleteId: card.id })}
                  />
                ))}
              </motion.div>
            ) : (
              <Next.DoNotHave emoji="💳" msg="You have not added a payment method yet." />
            )}
            <Account.PaymentMethod.Edit
              card={updateInfo.edit}
              handleEdit={handleEdit}
              onDismiss={() => setUpdateInfo({ edit: undefined })}
            />
            <Dialog isShown={!!updateInfo.deleteId} onDismiss={async (_, info) => await handleRemoveDismiss(info)}>
              <Dialog.Content className="text--center">
                <Dialog.Title>Are you sure you want to remove this payment method from your account?</Dialog.Title>
              </Dialog.Content>
              <Dialog.Btn.Group className="account__billing__remove-btns">
                <Dialog.Btn>No</Dialog.Btn>
                <Dialog.Btn confirm>Yes</Dialog.Btn>
              </Dialog.Btn.Group>
            </Dialog>
          </Next.MotionContainer>
        )}
      </Account.Dashboard>
    </Layout>
  );
};

AccountBillingPage.displayName = "AccountBillingPage";

export default AccountBillingPage;
