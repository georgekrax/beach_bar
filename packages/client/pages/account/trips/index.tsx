import Account from "@/components/Account";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { PaymentsQuery, usePaymentsQuery } from "@/graphql/generated";
import { Select, SelectedItems } from "@hashtag-design-system/components";
import { MONTHS } from "@the_hashtag/common";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import uniq from "lodash/uniq";
import { useMemo, useState } from "react";

dayjs.extend(minMax);

const AccountTripsPage: React.FC = () => {
  const [paymentsArr, setPaymentsArr] = useState<PaymentsQuery["payments"]>([]);
  const {
    data: payments,
    error: paymentsError,
    loading: paymentsLoading,
  } = usePaymentsQuery({ onCompleted: ({ payments }) => setPaymentsArr(payments) });

  const dates = useMemo(() => {
    let dates = payments?.payments.map(({ visits }) => visits.map(({ date }) => dayjs(date).format("YYYY-MM"))).flat();
    dates = uniq(dates);
    return dates.map(date => {
      const day = dayjs(String(date));
      const month = day.month();
      return { month: { id: month + 1, value: MONTHS[month], days: day.daysInMonth() }, year: day.year() };
    });
  }, [payments]);

  const handleSelect = (items: SelectedItems[]) => {
    const selected = items.find(({ selected }) => selected);
    if (!selected || !payments?.payments) return;
    const splittedId = selected.id.split("_");
    const monthId = +(splittedId[0] || 0) - 1;
    const year = +splittedId[3] || Math.max(...dates.map(({ year }) => year));
    const filteredArr = payments.payments.filter(({ visits }) =>
      visits.some(({ date }) => {
        const parsed = dayjs(date);
        return parsed.month() === monthId && parsed.year() === year;
      })
    );
    setPaymentsArr(filteredArr);
  };

  return (
    <Layout>
      <Account.Dashboard defaultSelected="/account/trips">
        {paymentsLoading ? (
          <h2>Loading...</h2>
        ) : paymentsError || !payments || !payments.payments ? (
          <h2>Error</h2>
        ) : (
          <div>
            {dates.length > 0 ? (
              <>
                <Select onSelect={items => handleSelect(items)}>
                  <Select.Button style={{ width: "11rem" }}>
                    {dates[0].month.value + (dates[0].year === dayjs().year() ? "" : " " + dates[0].year)}
                  </Select.Button>
                  <Select.Modal>
                    <Select.Header value="Choose the month & year of your trips" />
                    <Select.Options>
                      {dates.map(({ month, year }) => {
                        const value = month.value + (year === dayjs().year() ? "" : " " + year);
                        const key = month.id + "_" + value.replace(" ", "_");
                        return <Select.Item key={key} id={key} content={value} />;
                      })}
                    </Select.Options>
                  </Select.Modal>
                </Select>
                <Account.Trips payments={paymentsArr} />
              </>
            ) : (
              <Next.DoNotHave emoji="🏖️" msg="You have not visited any #beach_bar yet." />
            )}
          </div>
        )}
      </Account.Dashboard>
    </Layout>
  );
};

AccountTripsPage.displayName = "AccountTrips";

export default AccountTripsPage;

// export const getServerSideProps = async ctx => {
//   const apolloClient = initializeApollo(ctx);

//   await apolloClient.query({ query: PaymentsDocument });
//   await apolloClient.query({ query: PaymentDatesDocument });

//   return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() } };
// };
