import Dashboard from "@/components/Dashboard";
import Next from "@/components/Next";
import { useDashboardBillingQuery } from "@/graphql/generated";
import { useDashboard } from "@/utils/hooks";
import { dayjsFormat } from "@beach_bar/common";
import { Table, useSortableData } from "@hashtag-design-system/components";
import { useMemo } from "react";
import styles from "./Billing.module.scss";
import { Pie } from "./Pie";
import { TimePeriod } from "./TimePeriod";

const START_DATE = "2021-04-16";

const TABLES_DATA = [
  { header: "Most common products", type: "products" },
  { header: "Most common foods", type: "foods" },
  { header: "Customers per country", type: "countries" },
] as const;

export const Billing: React.FC = () => {
  const { beachBarId, currencySymbol } = useDashboard({ fetch: true });
  const {
    data: notData,
    loading,
    refetch,
  } = useDashboardBillingQuery({
    skip: !beachBarId,
    // TODO: Change later
    variables: { beachBarId: beachBarId!, dates: { start: START_DATE, end: "2021-04-14" } },
  });

  const data = notData?.dashboardBilling;
  const { products, foods, customerCountries } = useMemo(() => {
    const products = data?.products;
    let productsRevenue = products?.revenue;
    productsRevenue = productsRevenue && productsRevenue.length > 0 ? productsRevenue : undefined;
    const foods = data?.foods;
    let foodsRevenue = foods?.revenue;
    foodsRevenue = foodsRevenue && foodsRevenue.length > 0 ? foodsRevenue : undefined;
    return {
      customerCountries:
        data?.customersCountries.map(({ country, value }, i) => ({ ...country, value, id: i + 1 })) || [],
      products: {
        ...products,
        mostCommon: products?.mostCommon.map(({ product, ...rest }, i) => ({ ...product, ...rest, id: i + 1 })) || [],
        firstValue: productsRevenue ? productsRevenue[0].value : 0,
        lastValue: productsRevenue ? productsRevenue[productsRevenue.length - 1].value : 0,
      },
      foods: {
        ...foods,
        mostCommon: foods?.mostCommon.map(({ food, ...rest }, i) => ({ ...food, ...rest, id: i + 1 })) || [],
        firstValue: foodsRevenue ? foodsRevenue[0].value : 0,
        lastValue: foodsRevenue ? foodsRevenue[foodsRevenue.length - 1].value : 0,
      },
    };
  }, [data]);

  const mostProducts = useSortableData(products.mostCommon.sort((a, b) => b.timesBooked - a.timesBooked));
  const mostFoods = useSortableData(foods.mostCommon.sort((a, b) => b.timesPurchased - a.timesPurchased));
  const mostCountries = useSortableData(customerCountries.sort((a, b) => b.value - a.value));

  return (
    <div className={styles.container}>
      <div className="flex-row-space-between-center">
        <h4 style={{ fontSize: "1.75rem" }}>Billing</h4>
        <TimePeriod
          onClick={async ({ endDate }) => {
            await refetch({ dates: { start: undefined, end: endDate.format(dayjsFormat.ISO_STRING) } });
          }}
        />
      </div>
      <Next.Loading isScreen isLoading={loading}>
        <div className="dashboard-banner__pies flex-row-center-center">
          <Pie header="Products" description="Total product's revenue" prefix={currencySymbol} {...products} />
          <Pie header="Foods" description="Total food's revenue" prefix={currencySymbol} {...foods} />
        </div>
        <div>
          <h6>Data reports</h6>
          <div className={styles.reports + " flex-row-flex-start-flex-start flex--wrap"}>
            <Dashboard.Report
              prefix={currencySymbol}
              header="Product's revenue"
              type="amount_of_money"
              data={products.revenue}
            />
            <Dashboard.Report
              prefix={currencySymbol}
              header="Food's revenue"
              type="amount_of_money"
              data={foods.revenue}
            />
            <Dashboard.Report
              header="Refunded payments"
              type="number"
              data={data?.refundedPayments.map(({ payments, ...item }) => ({ ...item, value: payments.length }))}
            />
            <Dashboard.Report header="Average products booked per payment" type="number" data={data?.avgProducts} />
            <Dashboard.Report header="Average foods purchased per payment" type="number" data={data?.avgFoods} />
          </div>
        </div>
        <div className={styles.tables + " flex-row-flex-start-flex-start flex--wrap"}>
          {TABLES_DATA.map(({ header, type }) => {
            let item: typeof mostProducts | typeof mostFoods | typeof mostCountries,
              secondTh: string,
              lastTh: string,
              lastKey;
            switch (type) {
              case "products":
                (item = mostProducts), (secondTh = "Product"), (lastTh = "Times booked"), (lastKey = "timesBooked");
                break;
              case "foods":
                (item = mostFoods), (secondTh = "Food"), (lastTh = "Times purchased"), (lastKey = "timesPurchased");
                break;
              case "countries":
                (item = mostCountries), (secondTh = "Country"), (lastTh = "ISO Alpha-2 Code"), (lastKey = "alpha2Code");
                break;
            }
            return (
              <div key={"table_" + type}>
                <h6>{header}</h6>
                <Table>
                  <Table.THead>
                    <Table.Tr idx={0}>
                      <Table.Th className="table__id" sort onClick={(_, info) => item.setSort({ ...info, key: "id" })}>
                        <span>#</span>
                      </Table.Th>
                      <Table.Th className="w100" sort onClick={(_, info) => item.setSort({ ...info, key: "name" })}>
                        {secondTh}
                      </Table.Th>
                      <Table.Th
                        className="text--nowrap"
                        sort
                        onClick={(_, info) => item.setSort({ ...info, key: lastKey })}
                      >
                        {lastTh}
                      </Table.Th>
                    </Table.Tr>
                  </Table.THead>
                  <Table.TBody>
                    {item.data.map(({ id, name, ...rest }) => (
                      <Table.Tr key={"table_row_" + id} idx={id}>
                        <Table.Td className="itext--center">{id}</Table.Td>
                        <Table.Td>{name}</Table.Td>
                        <Table.Td>{rest[lastKey]}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.TBody>
                </Table>
              </div>
            );
          })}
        </div>
      </Next.Loading>
    </div>
  );
};

Billing.displayName = "DashboardBilling";
