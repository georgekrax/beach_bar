import { useDashboardHomePageQuery } from "@/graphql/generated";
import { useDashboard } from "@/utils/hooks";
import { dayjsFormat } from "@beach_bar/common";
import { Banner } from "./Banner";
import styles from "./HomePage.module.scss";
import { Report } from "./Report";

// TODO: Change later
export const HomePage: React.FC = () => {
  const { beachBarId, beachBar } = useDashboard({ fetch: true });
  const {
    data: dashboard,
    loading,
    error,
    refetch,
  } = useDashboardHomePageQuery({
    skip: !beachBarId,
    // TODO: Change later
    variables: {
      beachBarId: beachBarId!,
      // dates: { start: undefined, end: dayjs().subtract(1, "week").format(dayjsFormat.ISO_STRING) },
    },
  });

  const data = dashboard?.dashboardHomePage;
  const currencySymbol = beachBar?.defaultCurrency.symbol;

  return (
    <div className={styles.container}>
      {error && !loading ? (
        <h2>Error</h2>
      ) : (
        <>
          <Banner
            onTimePeriodChange={async ({ endDate }) => {
              await refetch({ dates: { start: undefined, end: endDate.format(dayjsFormat.ISO_STRING) } });
            }}
            {...data}
          />
          <div className={styles.data}>
            <h5 className="d--ib">Data overview</h5>
            <span className="body-12 text--grey">Last 7 days</span>
            <div className="flex-row-flex-start-flex-start flex--wrap">
              <Report
                prefix={currencySymbol}
                header="Gross volume"
                type="amount_of_money"
                tooltip={{ content: "hey" }}
                data={data?.grossVolume}
              />
              <Report
                prefix={currencySymbol}
                header="Average spend per person"
                type="amount_of_money"
                data={data?.avgSpendPerPerson}
              />
              <Report
                header="New customers"
                type="number"
                data={data?.newCustomers.map(({ customers, ...rest }) => ({ ...rest, value: customers.length }))}
              />
              <Report data={data?.avgRating} header="Average rating" type="number" toFixed2={1} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

HomePage.displayName = "DashboardHomePage";
