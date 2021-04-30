import Account from "@/components/Account";
import Header from "@/components/Header";
import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import { ShoppingCartPage } from "@/components/pages";
import { errors as COMMON_ERRORS } from "@beach_bar/common";
import { Dialog } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import uniq from "lodash/uniq";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  PaymentDocument,
  PaymentQuery,
  PaymentQueryVariables,
  PaymentRefundAmountDocument,
  PaymentRefundAmountQuery,
  PaymentRefundAmountQueryVariables,
  usePaymentQuery,
  usePaymentRefundAmountQuery,
  useRefundPaymentMutation,
} from "../../../graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "../../../lib/apollo";
import { notify } from "../../../utils/notify";

type Props = {};

const TripDetails: React.FC<Props> = () => {
  const [isDialogShown, setIsDialogShown] = useState(false);
  const router = useRouter();
  const variables: PaymentQueryVariables & PaymentRefundAmountQueryVariables = {
    refCode: router.query.ref as string,
  };
  const { data, loading, error } = usePaymentQuery({ variables });
  const { data: refundData, loading: refundLoading, error: refundError } = usePaymentRefundAmountQuery({ variables });
  const [refund] = useRefundPaymentMutation();

  const hasSameBeachBars = useMemo(
    () => new Set(data?.payment.cart.products?.map(({ product: { beachBar } }) => beachBar.name)).size === 0,
    [data]
  );
  const hasSameTimes = useMemo(
    () =>
      new Set(
        data?.payment.cart.products?.map(({ date, time: { id } }) => dayjs(date).hour(parseInt(id)).toISOString())
      ).size === 0,
    [data]
  );
  const eligibleToRefund = useMemo(
    () => data?.payment.cart.products?.some(({ date }) => dayjs(date).isAfter(dayjs())),
    [data]
  );

  return (
    <Layout header={false} tapbar={false} footer={false} wrapper={{ style: { padding: 0 } }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial">
        <Header.Crud
          title="Trip"
          closeIcon="chevron_left"
          content={{ className: "account-trips__details__container" }}
          onClose={() =>
            router.push({
              pathname: "/account/trips",
            })
          }
        >
          {loading || refundLoading ? (
            <h2>Loading...</h2>
          ) : error || !data || refundError ? (
            <h2>Error</h2>
          ) : (
            <div className="flex-column-flex-start-center">
              <Toaster position="top-center" />
              <Account.Trips.Details style={{ marginTop: 0 }}>
                {hasSameBeachBars && (
                  <Account.Trips.Info info="#beach_bar">
                    <Account.Trips.DoubleInfo
                      primary={data.payment.cart.products?.[0]?.product.beachBar.name}
                      secondary={data.payment.cart.products?.[0]?.product.beachBar.formattedLocation}
                    />
                  </Account.Trips.Info>
                )}
                <Account.Trips.Info info="Ref" children={data.payment.refCode} />
                {hasSameTimes && (
                  <Account.Trips.Info info="Visit time">
                    <Account.Trips.DoubleInfo
                      primary={data.payment.cart.products?.[0]?.date}
                      secondary={data.payment.cart.products?.[0]?.time.value.slice(0, -3)}
                    />
                  </Account.Trips.Info>
                )}
                <Account.Trips.Info info="Status">
                  <Account.Trips.DoubleInfo
                    className="account-trips__details__status"
                    primary={data.payment.status.name}
                    row
                    alignItems="center"
                  >
                    {data.payment.isRefunded ? <Icons.Close.Circle.Colored /> : <Icons.Checkmark.Circle.Colored />}
                  </Account.Trips.DoubleInfo>
                </Account.Trips.Info>
              </Account.Trips.Details>
              <Account.Trips.Details header="Billing information">
                <Account.Trips.Info info="Paid at" children={dayjs(data.payment.timestamp).format("MM/DD/YYYY")} />
                <Account.Trips.Info info="Paid with">
                  <Account.Trips.DoubleInfo className="account-trips__details__card" row alignItems="center">
                    <div>
                      <span>**** **** ****</span> <span>{data.payment.card.last4}</span>
                    </div>
                    <Account.PaymentMethod.CardBrand
                      brand={data.payment.card.brand?.name as any}
                      width={28}
                      height={20}
                    />
                  </Account.Trips.DoubleInfo>
                </Account.Trips.Info>
                {data.payment.voucherCode?.couponCode ||
                  (data.payment.voucherCode?.offerCode && (
                    <Account.Trips.Info
                      info="Voucher code"
                      children={
                        data.payment.voucherCode?.couponCode?.refCode || data.payment.voucherCode?.offerCode.refCode
                      }
                    />
                  ))}
              </Account.Trips.Details>
              <Account.Trips.Details header="Contact details">
                <Account.Trips.Info info="Email" children={data.payment.card.customer.email} />
                {data.payment.card.customer.phoneNumber && (
                  <Account.Trips.Info info="Phone number">
                    <Account.Trips.DoubleInfo
                      className="account-trips__details__phone-number"
                      primary={"+" + data.payment.card.customer.country?.callingCode}
                      row
                      alignItems="center"
                    >
                      <span>{data.payment.card.customer.phoneNumber}</span>
                    </Account.Trips.DoubleInfo>
                  </Account.Trips.Info>
                )}
              </Account.Trips.Details>
              <Account.Trips.Details header="Cart">
                {uniq(data.payment.cart.products?.map(({ product: { beachBar } }) => beachBar)).map(beachBar => (
                  <ShoppingCartPage.Bar
                    key={beachBar.id}
                    beachBar={beachBar}
                    products={
                      data.payment.cart.products
                        ?.filter(({ product: { beachBar: bar } }) => bar.id === beachBar.id)
                        .map(product => ({ ...product, allowRemove: false, allowEdit: false })) || []
                    }
                  />
                ))}
              </Account.Trips.Details>
              <Account.Trips.Details header="Refund">
                <div className="account-trips__details__refund flex-column-center-flex-start">
                  <div>Cancel and refund the upcoming trips of this payment</div>
                  <Header.Crud.Btn
                    variant="danger"
                    disabled={!eligibleToRefund || data.payment.isRefunded || refundData?.paymentRefundAmount === 0}
                    onClick={() => setIsDialogShown(true)}
                  >
                    Refund
                  </Header.Crud.Btn>
                </div>
              </Account.Trips.Details>
            </div>
          )}
          <Dialog
            isShown={isDialogShown}
            onDismiss={async (e, { cancel }) => {
              const tagName = e.currentTarget.tagName;
              const id = data?.payment.id;
              if (cancel && id && tagName && tagName.toLowerCase() === "button") {
                const { errors } = await refund({
                  variables: { paymentId: id },
                  refetchQueries: [{ query: PaymentDocument, variables }],
                });
                if (errors) errors.forEach(({ message }) => notify("error", message));
                else notify("success", "Success! Your trip has been cancelled & refunded");
              }
              setIsDialogShown(false);
            }}
          >
            <Dialog.Content style={{ textAlign: "center" }}>
              <Dialog.Title>
                Are you sure you want to refund and cancel the upcoming trips of this payment?
              </Dialog.Title>
              <div className="account-trips__details__refund-dialog">
                You will be refunded depending on how early you cancel your trip. For this one you will receive:{" "}
                <span className="semibold">
                  {refundData?.paymentRefundAmount} {data?.payment.card.country?.currency.symbol}
                </span>
              </div>
            </Dialog.Content>
            <Dialog.Btn.Group>
              <Dialog.Btn>Yes</Dialog.Btn>
              <Dialog.Btn variant="danger" confirm>
                No
              </Dialog.Btn>
            </Dialog.Btn.Group>
          </Dialog>
        </Header.Crud>
      </motion.div>
    </Layout>
  );
};

TripDetails.displayName = "AccountTripDetails";

export default TripDetails;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const apolloClient = initializeApollo();

  const variables: PaymentQueryVariables & PaymentRefundAmountQueryVariables = {
    refCode: query.ref as string,
  };
  const { errors } = await apolloClient.query<PaymentQuery>({
    query: PaymentDocument,
    variables,
  });
  const { errors: refundErrors } = await apolloClient.query<PaymentRefundAmountQuery>({
    query: PaymentRefundAmountDocument,
    variables,
  });

  return {
    props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() },
    notFound: errors
      ?.concat(refundErrors || [])
      ?.some(({ extensions }) => extensions?.code === COMMON_ERRORS.NOT_FOUND),
  };
};
