import { useConfig } from "@/utils/hooks";
import { memo } from "react";
import {
  Area,
  AreaChart,
  AreaProps,
  CartesianGrid,
  ResponsiveContainer,
  ResponsiveContainerProps,
  Tooltip,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from "recharts";

export type OnMouseMove = {
  isTooltipActive: true;
  activeCoourdinates: { x: number; y: number };
  activeLabel: number;
  activeTooltipIndex: number;
  chartX: number;
  chartY: number;
  activePayload?: {
    dataKey: string;
    name: string;
    value: string | number;
    [x: string]: any;
  }[];
};

type AxisProps = {
  dataKey: string;
};

export type Props = {
  data: any[];
  isPrimary?: boolean;
  xAxis: AxisProps & XAxisProps;
  yAxis: AxisProps & YAxisProps;
  area?: Omit<Partial<AreaProps>, "ref">;
  onMouseMove?: (params: Partial<OnMouseMove>) => void;
} & Pick<ResponsiveContainerProps, "height"> &
  Pick<AreaProps, "onMouseLeave">;

export const Chart: React.FC<Props> = memo(
  ({ data, isPrimary = false, height, xAxis, yAxis, area, onMouseMove, onMouseLeave }) => {
    const {
      colors: { grey },
      variables: { primary },
    } = useConfig();
    const { color, id } = isPrimary ? { color: primary, id: "color" } : { color: grey["700"], id: "grey" };

    return (
      <ResponsiveContainer width="100%" height={height || 224}>
        <AreaChart data={data} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={yAxis.dataKey} stroke={color} fill={`url(#${id})`} {...area} />
          <XAxis
            tickMargin={20}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tick={{ fontSize: 12 / 16 + "rem" }}
            {...xAxis}
          />
          <YAxis width={0} axisLine={false} tickLine={false} {...yAxis} />
          <Tooltip content={({ active }) => active && <div />} />
          {/* <Tooltip /> */}
          <CartesianGrid opacity={0.2} vertical={false} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
);

Chart.displayName = "DashboardChart";

// export const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
//   if (!active) return null;
//   return (
//     <div className="tooltip">
//       <h4>{label}</h4>
//       <p>${payload?.[0].value?.toFixed(2)} CAD</p>
//     </div>
//   );
// };
