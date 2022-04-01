import Dashboard, { DashboardChartOnMouseMove, DashboardTimePeriodProps } from "@/components/Dashboard";
import Next from "@/components/Next";
import { DashboardHomePageQuery } from "@/graphql/generated";
import { NonReadonly } from "@/typings/index";
import { Select, SelectedItems } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import { useState } from "react";
import styles from "./Banner.module.scss";
import { ChartInfo } from "./ChartInfo";

const DEFAULT_SELECTED_ID = "0";

type DashboardQuery = DashboardHomePageQuery["dashboardHomePage"];

type Props = {
  onTimePeriodChange: DashboardTimePeriodProps["onClick"];
} & Partial<Pick<DashboardQuery, "totalCustomers" | "balance" | "capacity">>;

export const Banner: React.FC<Props> = ({
  totalCustomers,
  balance = { revenue: 0, grossVolume: [], successfulPayments: [] },
  capacity = {
    availableProducts: 0,
    percentage: 0,
    reservedProducts: 0,
    totalHourCustomers: 0,
    totalMaxPeopleCapacity: 0,
  },
  onTimePeriodChange,
}) => {
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED_ID);
  const [payload, setPayload] = useState<{ value: string | number; date: string } | undefined>();

  const isGrossVolume = selectedId === "1";
  const data = isGrossVolume ? balance.grossVolume : totalCustomers;
  const value = data?.[data.length - 1].value;
  const isLoading = !data;
  const paymentsLength = balance.successfulPayments.length;
  const { percentage, reservedProducts, availableProducts } = capacity;

  const formatDate = (date: string) => {
    let format = "h A";
    const firstItem = data?.[0];
    if (!data?.every(({ date }) => (firstItem ? dayjs(date).isSame(firstItem.date, "date") : true))) {
      format = "D ddd";
    }
    return dayjs(date).format(format);
  };

  const handleMouseMove = (payload: DashboardChartOnMouseMove["activePayload"]) => {
    const item = payload?.[0];
    setPayload(item ? { ...item, date: item.payload.date } : undefined);
  };

  const handleSelect = (items: SelectedItems[]) => {
    const selected = items.find(({ selected }) => selected);
    if (!selected) return;
    setSelectedId(selected.id);
  };

  return (
    <div>
      <div className="flex-row-space-between-center">
        <h5>Today</h5>
        <Dashboard.TimePeriod defaultDates={{ end: "1W" }} onClick={onTimePeriodChange} />
      </div>
      <div className={styles.container + " flex-row-flex-start-flex-start"}>
        <div className={styles.chart + " flex-column-flex-start-flex-start"}>
          <Select onSelect={items => handleSelect(items)}>
            <Select.Button className={styles.selectBtn + " text--grey body-14"}>Gross volume</Select.Button>
            <Select.Modal fullWidth>
              <Select.Options>
                <Select.Item
                  id={DEFAULT_SELECTED_ID}
                  content="Total customers"
                  defaultChecked={selectedId === DEFAULT_SELECTED_ID}
                />
                <Select.Item id="1" content="Gross volume" />
              </Select.Options>
            </Select.Modal>
          </Select>
          <h6 className={styles.value + (isLoading ? " loading loading--text" : "") + " semibold text--grey"}>
            {isGrossVolume && "$"}
            {value != null && <>{(payload ? +payload.value.toString() : value).toFixed(isGrossVolume ? 2 : 0)}</>}
          </h6>
          <span className={(isLoading ? "loading loading--text " : "") + "d--block body-12 text--grey"}>
            {!isLoading && payload ? formatDate(payload.date) : undefined}
          </span>
          <Next.Loading isLoading={isLoading}>
            {data && (
              <Dashboard.Chart
                isPrimary
                height={168}
                data={data as NonReadonly<typeof data>}
                yAxis={{ dataKey: "value", tickCount: 4, domain: [0, capacity.totalMaxPeopleCapacity] }}
                xAxis={{ dataKey: "date", tickCount: 7, tickFormatter: date => formatDate(date) }}
                onMouseLeave={() => setPayload(undefined)}
                onMouseMove={({ activePayload }) => handleMouseMove(activePayload)}
              />
            )}
          </Next.Loading>
        </div>
        <div className={styles.info + " normal flex-column-inherit-inherit"}>
          <ChartInfo
            header="Revenue"
            isLoading={isLoading}
            value={"€" + balance.revenue}
            seeMoreHref="/dashboard/billing"
            note={`${paymentsLength} successful payment${paymentsLength === 1 ? "" : "s"}`}
          />
          <ChartInfo
            header="Capacity"
            isLoading={isLoading}
            value={percentage + "%"}
            className={styles.capacity}
            seeMoreHref="/dashboard/bookings"
            colorPercentage={percentage / 20}
            note={
              reservedProducts === 0
                ? "No products booked"
                : `${reservedProducts} / ${availableProducts}  products booked`
            }
          />
        </div>
      </div>
    </div>
  );
};

Banner.displayName = "DashboardBanner";
