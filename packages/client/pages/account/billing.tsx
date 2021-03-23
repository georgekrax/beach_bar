import Account, { AccountPaymentMethodEditProps } from "@/components/Account";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import {
  Card,
  GetCustomerPaymentMethodsDocument,
  GetCustomerPaymentMethodsQuery,
  GetOrCreateCustomerDocument,
  useDeleteCustomerPaymentMethodMutation,
  useGetCustomerPaymentMethodsQuery,
  useGetOrCreateCustomerQuery,
  useUpdateCustomerPaymentMethodMutation,
} from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { notify } from "@/utils/notify";
import { Dialog } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";

const variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.2 } },
};

export type PaymentMethodFormData = {
  month: Card["expMonth"];
  year: Card["expYear"];
} & Pick<Card, "id" | "cardholderName" | "last4" | "isDefault">;

export type FuncPaymentMethodFormData = Omit<PaymentMethodFormData, "isDefault"> &
  Partial<Pick<PaymentMethodFormData, "isDefault">>;

const Billing: React.FC = () => {
  const [cardToEdit, setCardToEdit] = useState<AccountPaymentMethodEditProps["card"] | null>(null);
  const [cardToDelete, setCardToDelete] = useState<Pick<PaymentMethodFormData, "id"> | null>(null);

  const { data: customerData } = useGetOrCreateCustomerQuery();
  const { data, loading, error } = useGetCustomerPaymentMethodsQuery();
  const [updatePaymentMethod] = useUpdateCustomerPaymentMethodMutation();
  const [deletePaymentMethod] = useDeleteCustomerPaymentMethodMutation();

  const sorted = useMemo(
    () =>
      data && data.getCustomerPaymentMethods
        ? data.getCustomerPaymentMethods
            ?.map(({ __typename, ...card }) => card)
            .sort((a, b) => parseInt(b.id) - parseInt(a.id))
        : [],
    [data]
  );

  const handleEdit = async (card: FuncPaymentMethodFormData, toast: boolean): Promise<boolean> => {
    if (!card) {
      if (toast) notify("error", "");
      return false;
    }
    const { id, year, month, cardholderName, isDefault } = card;
    const { errors } = await updatePaymentMethod({
      variables: { cardId: id, expMonth: month, expYear: year, cardholderName, isDefault },
      optimisticResponse: {
        __typename: "Mutation",
        updateCustomerPaymentMethod: {
          __typename: "UpdateCard",
          updated: true,
          // @ts-expect-error
          card: { __typename: "Card", expMonth: month, expYear: year, isDefault: isDefault ?? false, ...card },
        },
      },
      update: (cache, { data }) => {
        const cachedData = cache.readQuery<GetCustomerPaymentMethodsQuery>({
          query: GetCustomerPaymentMethodsDocument,
        });
        const newCard = data?.updateCustomerPaymentMethod.card;
        if (!newCard) return;
        const updated = cachedData?.getCustomerPaymentMethods?.map(prevCard => {
          if (prevCard.id === newCard.id) return newCard;
          else {
            if (newCard.isDefault) return { ...prevCard, isDefault: false };
            else return prevCard;
          }
        });
        cache.writeQuery({
          query: GetCustomerPaymentMethodsDocument,
          data: { getCustomerPaymentMethods: updated },
        });
      },
    });
    if (errors) {
      errors.forEach(({ message }) => notify("error", message));
      return false;
    } else {
      if (toast) notify("success", "Payment method updated!");
      return true;
    }
  };

  return (
    <Layout>
      <Toaster position="top-center" />
      <Account.Header />
      <Account.Menu defaultSelected="/billing" />
      {loading ? (
        <h2>Loading...</h2>
      ) : error || !data || !data.getCustomerPaymentMethods || !customerData ? (
        <h2>Error</h2>
      ) : (
        <Next.Motion.Container>
          <Account.PaymentMethod.Add
            cardsLength={data.getCustomerPaymentMethods.length}
            customerId={customerData.getOrCreateCustomer.customer.id}
          />
          {sorted.length > 0 ? (
            <motion.div
              className="w-100 flex-column-center-flex-end"
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
                  onEditClick={() => setCardToEdit({ ...card, brand: card.brand?.name as any })}
                  onRemoveClick={() => setCardToDelete({ id: card.id })}
                />
              ))}
            </motion.div>
          ) : (
            <Next.DoNotHave msg="You have not added a payment method yet." emoji="💳" />
          )}
          <Account.PaymentMethod.Edit
            card={cardToEdit || undefined}
            onDismiss={() => setCardToEdit(null)}
            handleEdit={handleEdit}
          />
          <Dialog
            isShown={cardToDelete !== null}
            onDismiss={async (_, { cancel }) => {
              if (!cardToDelete || cancel) return;
              const deleteCardId = cardToDelete.id;
              const { errors } = await deletePaymentMethod({
                variables: { cardId: deleteCardId },
                update: cache =>
                  cache.modify({
                    fields: {
                      getCustomerPaymentMethods(list, { readField }) {
                        return list.filter(n => readField("id", n) !== deleteCardId);
                      },
                    },
                  }),
              });
              if (errors) errors.forEach(({ message }) => notify("error", message));
              else setCardToDelete(null);
            }}
          >
            <Dialog.Content style={{ textAlign: "center" }}>
              <Dialog.Title>Are you sure you want to remove this payment method from your account?</Dialog.Title>
            </Dialog.Content>
            <Dialog.Btn.Group>
              <Dialog.Btn>No</Dialog.Btn>
              <Dialog.Btn confirm>Yes</Dialog.Btn>
            </Dialog.Btn.Group>
          </Dialog>
        </Next.Motion.Container>
      )}
    </Layout>
  );
};

Billing.displayName = "AccountBilling";

export default Billing;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({ query: GetOrCreateCustomerDocument });
  await apolloClient.query({ query: GetCustomerPaymentMethodsDocument });

  return {
    props: {
      [INITIAL_APOLLO_STATE]: apolloClient.cache.extract(),
    },
  };
};
