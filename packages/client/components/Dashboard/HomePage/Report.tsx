import Dashboard, { DashboardChartOnMouseMove } from "@/components/Dashboard";
import Next, { NextTooltipProps } from "@/components/Next";
import { DashboardHomePageQuery } from "@/graphql/generated";
import { NonReadonly } from "@/typings/index";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import styles from "./Report.module.scss";

const DATE_FORMAT = "D ddd";

export type Props = {
  header: string;
  // value: number;
  toFixed2?: boolean | number;
  type?: "amount_of_money" | "number" | "category";
  prefix?: string;
  suffix?: string;
  tooltip?: NextTooltipProps;
  data?: readonly Omit<DashboardHomePageQuery["dashboardHomePage"]["grossVolume"][number], "__typename">[];
};

export const Report: React.FC<Props> = ({
  data: propsData,
  header,
  // value,
  type,
  prefix,
  suffix,
  tooltip,
  toFixed2 = type && type === "amount_of_money" ? true : false,
}) => {
  const [payload, setPayload] = useState<{ value: string | number; date: string } | undefined>();

  const data = useMemo(
    () => Array.from(propsData || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [propsData]
  );
  const isLoading = !data || data.length === 0;
  const value = isLoading ? undefined : data[data.length - 1].value;

  const handleMouseMove = (payload: DashboardChartOnMouseMove["activePayload"]) => {
    const item = payload?.[0];
    setPayload(item ? { ...item, date: dayjs(item.payload.date).format(DATE_FORMAT) } : undefined);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header + " text--grey body-14 flex-row-space-between-flex-start"}>
        <div>{header}</div>
        {tooltip && <Next.Tooltip type="info" placement="left" animation="shift-away" {...tooltip} />}
      </div>
      <div className={styles.value}>
        <div
          className={isLoading ? "loading loading--text" : ""}
          style={{ maxWidth: isLoading ? 120 / 16 + "em" : undefined }}
        >
          {!isLoading && value != null && (
            <>
              {prefix}
              {(payload != null ? +payload.value.toString() : value).toFixed(
                typeof toFixed2 === "number" ? toFixed2 : toFixed2 ? 2 : 0
              )}
              {suffix && (
                <>
                  &nbsp;
                  {suffix}
                </>
              )}
            </>
          )}
        </div>
        <span className="d--block body-12 text--grey">{payload?.date}</span>
      </div>
      <Next.Loading isLoading={!data}>
        {data && (
          <Dashboard.Chart
            height={120}
            data={data as NonReadonly<typeof data>}
            yAxis={{ dataKey: "value", tickCount: 4 }}
            xAxis={{
              dataKey: "date",
              tickMargin: 18,
              ticks: [data[0]?.date, data[data.length - 1]?.date],
              tickFormatter: (day: typeof data[number]["date"]) => {
                const parsed = dayjs(day);
                return parsed.isToday() ? "Today" : parsed.format(DATE_FORMAT);
              },
            }}
            onMouseLeave={() => setPayload(undefined)}
            onMouseMove={({ activePayload }) => handleMouseMove(activePayload)}
          />
        )}
      </Next.Loading>
    </div>
  );
};

Report.displayName = "DashboardHomePageReport";
