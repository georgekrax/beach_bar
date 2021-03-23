import Next from "../../../components/Next";
import { Select } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import Account from "../../../components/Account";
import Layout from "../../../components/Layout";
import {
  GetPaymentsDatesDocument,
  GetPaymentsDocument,
  useGetPaymentsDatesQuery,
  useGetPaymentsQuery,
} from "../../../graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "../../../lib/apollo";

const Trips: React.FC = () => {
  const { data: payments, error: paymentsError, loading: paymentsLoading, refetch } = useGetPaymentsQuery();
  const { data: dates, error: datesError, loading: datesLoading } = useGetPaymentsDatesQuery();

  return (
    <Layout>
      <Account.Header />
      <Account.Menu defaultSelected="/trips" />
      {paymentsLoading || datesLoading ? (
        <h2>Loading...</h2>
      ) : paymentsError || !payments || !payments.getPayments || datesError || !dates ? (
        <h2>Error</h2>
      ) : (
        <div className="account-trips__container">
          {dates.getPaymentsDates.length > 0 ? (
            <>
              <Select
                onSelect={async items => {
                  const selected = items.find(({ selected }) => selected);
                  if (!selected) return;
                  await refetch({
                    monthId: selected.id.match(/\[(.*?)\]/)[1],
                    year: parseInt(selected.content.split(" ")[1]),
                  });
                }}
              >
                <Select.Button style={{ width: "11rem" }}>
                  {dates.getPaymentsDates[0].month.value +
                    (dates.getPaymentsDates[0].year === dayjs().year() ? "" : " " + dates.getPaymentsDates[0].year)}
                </Select.Button>
                <Select.Modal>
                  <Select.Header value="Choose the month & year of your trips" />
                  <Select.Options>
                    {dates.getPaymentsDates.map(({ month, year }, i) => {
                      const value = month.value + (year === dayjs().year() ? "" : " " + year);
                      const key = `[${month.id}]_` + value;
                      return <Select.Item key={key} id={key} content={value} />;
                    })}
                  </Select.Options>
                </Select.Modal>
              </Select>
              <Account.Trips data={payments} />
            </>
          ) : (
            <Next.DoNotHave msg="You have not visited any #beach_bar yet." emoji="🏖️" />
          )}
        </div>
      )}
    </Layout>
  );
};

Trips.displayName = "AccountTrips";

export default Trips;

export const getServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({ query: GetPaymentsDocument });
  await apolloClient.query({ query: GetPaymentsDatesDocument });

  return {
    props: {
      [INITIAL_APOLLO_STATE]: apolloClient.cache.extract(),
    },
  };
};
