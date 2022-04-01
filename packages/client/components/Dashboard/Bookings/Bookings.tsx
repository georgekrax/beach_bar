import Dashboard from "@/components/Dashboard";
import Next from "@/components/Next";
import Search from "@/components/Search";
import { DashboardBookingsQuery, useDashboardBookingsQuery } from "@/graphql/generated";
import { useDashboard, useQueryFilters } from "@/utils/hooks";
import { dayjsFormat } from "@beach_bar/common";
import { Select, SelectedItems, Table, useSortableData } from "@hashtag-design-system/components";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import styles from "./Bookings.module.scss";
import { FoodTableRow } from "./FoodTableRow";
import { PaymentsTableRow } from "./PaymentsTableRow";
import { ProductTableRow } from "./ProductTableRow";

const PRODUCT_KEY = "product";
const FOOD_KEY = "food";
const KEY_SEPARATOR = "_";

export const Bookings: React.FC = () => {
  const [mode, setMode] = useState<"payments" | "products" | "foods">("payments");
  const [bookings, setBookings] = useState<DashboardBookingsQuery["dashboardBookings"]["bookings"]>([]);
  const { beachBarId, beachBar, currencySymbol } = useDashboard({ fetch: true });
  const { filterIds, toggleFilterIds } = useQueryFilters();
  const {
    data: notData,
    loading,
    refetch,
  } = useDashboardBookingsQuery({
    skip: !beachBarId,
    variables: {
      beachBarId: beachBarId!,
      dates: {
        start: dayjs().format(dayjsFormat.ISO_STRING),
        end: dayjs().subtract(1, "day").format(dayjsFormat.ISO_STRING),
      },
    },
  });

  const isPayments = mode === "payments";
  const data = notData?.dashboardBookings;
  const { data: sortedData, setSort } = useSortableData(data?.bookings.slice() || []);
  const { capacity, products, foods } = useMemo(() => {
    const totalCustomers = data?.capacity.totalCustomers;
    // console.log(totalCustomers);
    // console.log(data?.capacity);
    return {
      products:
        data?.bookings.map(({ refCode, cart }) => cart.products.map(item => ({ ...item, refCode }))).flat() || [],
      foods: data?.bookings.map(({ refCode, cart }) => cart.foods.map(item => ({ ...item, refCode }))).flat() || [],
      capacity: {
        firstValue: totalCustomers?.[0]?.value || 0,
        lastValue: totalCustomers?.[totalCustomers.length - 1]?.value || 0,
      },
    };
  }, [data]);

  const handleDateChange = async (startDate: Dayjs, endDate: Dayjs) => {
    await refetch({
      beachBarId: "3",
      dates: { start: startDate.format(dayjsFormat.ISO_STRING), end: endDate.format(dayjsFormat.ISO_STRING) },
    });
  };

  const handleSelect = (items: SelectedItems[], type: string) => {
    const selectedArr = items.filter(({ selected }) => selected);
    const alreadyInQuery = filterIds.filter(val => !val.startsWith(type));
    toggleFilterIds([...alreadyInQuery, ...selectedArr.map(({ id }) => type + KEY_SEPARATOR + id)]);
  };

  const handleExpandClick = (e: React.MouseEvent<HTMLButtonElement>, key: "showProducts" | "showFoods") => {
    e.preventDefault();
    const existingFilter = filterIds.find(filter => filter.startsWith("show"));
    toggleFilterIds(key, existingFilter);
  };

  const handleFilters = () => {
    let newArr = sortedData;
    filterIds.forEach(filter => {
      switch (filter) {
        case "hasNote":
          newArr = newArr.filter(({ cart }) => cart.notes.length > 0);
          break;
        case "isRefunded":
          newArr = newArr.filter(({ isRefunded, deletedAt }) => isRefunded || deletedAt != null);
          break;
      }
      if (filter.startsWith(PRODUCT_KEY)) {
        filter = filter.replace(PRODUCT_KEY + KEY_SEPARATOR, "");
        newArr = newArr.filter(({ cart }) => cart.products.some(({ product }) => product.id === filter));
      }
      if (filter.startsWith(FOOD_KEY)) {
        filter = filter.replace(FOOD_KEY + KEY_SEPARATOR, "");
        newArr = newArr.filter(({ cart }) => cart.foods.some(({ food }) => food.id === filter));
      }
    });
    setBookings(newArr);
    setMode(filterIds.includes("showProducts") ? "products" : filterIds.includes("showFoods") ? "foods" : "payments");
  };

  useEffect(() => setBookings(sortedData), [sortedData]);
  useEffect(() => handleFilters(), [filterIds]);

  const arr: (typeof bookings[number] | typeof products[number] | typeof foods[number])[] = isPayments
    ? bookings.slice()
    : mode === "products"
    ? products
    : mode === "foods"
    ? foods
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header + " flex-row-space-between-center"}>
        <div>
          <h5 className="d--ib">Bookings</h5>
          <span className="body-12 text--grey">Reserved products</span>
        </div>
        <Dashboard.TimePeriod onClick={async ({ startDate, endDate }) => await handleDateChange(startDate, endDate)} />
      </div>
      <Next.Loading isScreen isLoading={loading}>
        <div className="dashboard-banner__pies flex-row-center-center">
          <Dashboard.Pie type="number" header="Capacity" description="Total day customers" {...capacity} />
          <Dashboard.Pie
            className={styles.active}
            type="category"
            header="Most active weekday & hour"
            // description="The day of the week & hour, you have the most capacity"
            // description="Which day of the week, and what hour, do you have the most capacity?"
            description="Day of the week & hour, with the highest capacity"
            firstValue={data?.mostActive.weekDay || ""}
            lastValue={data?.mostActive.hour || 0}
          />
        </div>
        <div className={styles.filters + " flex-row-space-between-flex-end"}>
          <div className="body-14 text--nowrap text--grey">
            {arr.length} {isPayments ? "booking" : "products"}
            {arr.length !== 1 ? "s" : ""}
          </div>
          <div className={styles.list + " flex-inherit-flex-end-center flex--wrap"}>
            <div className="flex-inherit-inherit-inherit">
              <Search.Filters.Btn
                id="showProducts"
                label="Show products"
                checkbox={false}
                onClick={(_, e) => handleExpandClick(e, "showProducts")}
              />
              <Search.Filters.Btn
                id="showFoods"
                label="Show foods"
                checkbox={false}
                onClick={(_, e) => handleExpandClick(e, "showFoods")}
              />
            </div>
            {(["Products", "Foods"] as const).map(type => {
              const isProduct = type === "Products";
              const key = type.toLowerCase().replace("s", "");
              return (
                <Select key={"select_" + key} width={176} multiSelectable onSelect={items => handleSelect(items, key)}>
                  <Select.Button>{type}</Select.Button>
                  <Select.Modal align="right">
                    <Select.Options>
                      {((isProduct ? beachBar?.products : beachBar?.foods) || []).map(({ id, name }) => (
                        <Select.Item key={key + "_" + id} id={id} content={name} />
                      ))}
                    </Select.Options>
                  </Select.Modal>
                </Select>
              );
            })}
            <Search.Filters.Btn id="isRefunded" label="Refunded" checkbox={false} />
            <Search.Filters.Btn id="hasNote" label="Note" checkbox={false} />
          </div>
        </div>
        {arr.length === 0 ? (
          <Next.DoNotHave emoji="😔" msg="You don't have any bookings for the selected period." />
        ) : (
          <Table className={styles.table + " iw100"}>
            <Table.THead>
              <Table.Tr idx={0}>
                <Table.Th sort onClick={(_, info) => setSort({ ...info, key: "total" })}>
                  Amount
                </Table.Th>
                {isPayments && <Table.Th />}
                <Table.Th className="w100">Description</Table.Th>
                {isPayments && <Table.Th>Customer</Table.Th>}
                <Table.Th className="text--nowrap">{isPayments ? "Note" : "Payment ref code"}</Table.Th>
                <Table.Th sort onClick={(_, info) => setSort({ ...info, key: "timestamp" })}>
                  {isPayments ? "Timestamp" : "Date"}
                </Table.Th>
              </Table.Tr>
            </Table.THead>
            <Table.TBody>
              {arr.map(({ id, ...rest }, i) => {
                const { __typename, refCode } = rest;
                const href = "/dashboard/bookings/" + refCode;
                
                return (
                  <Table.Tr
                    idx={i + 1}
                    className="cursor--pointer"
                    key={
                      (mode === "payments" ? "booking" : mode === "products" ? "cart_product" : "cart_food") + "_" + id
                    }
                  >
                    {__typename === "Payment" ? (
                      <PaymentsTableRow href={href} currencySymbol={currencySymbol} {...rest} />
                    ) : __typename === "CartProduct" ? (
                      <ProductTableRow href={href} currencySymbol={currencySymbol} {...rest} />
                    ) : __typename === "CartFood" ? (
                      <FoodTableRow href={href} currencySymbol={currencySymbol} {...rest} />
                    ) : null}
                  </Table.Tr>
                );
              })}
            </Table.TBody>
          </Table>
        )}
      </Next.Loading>
    </div>
  );
};

Bookings.displayName = "DashboardBookings";
