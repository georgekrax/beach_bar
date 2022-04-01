import { DashboardReportProps } from "@/components/Dashboard";
import Icons from "@/components/Icons";
import { useConfig } from "@/utils/hooks";
import { useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import styles from "./Pie.module.scss";

const SIZE = 80;
const STROKE_WIDTH = 6;

type Props = {
  header: string;
  description: string;
  firstValue: number | string;
  lastValue: number | string;
} & Pick<DashboardReportProps, "type" | "toFixed2" | "prefix" | "suffix">;

export const Pie: React.FC<Props & Pick<HTMLMotionProps<"div">, "className">> = ({
  header,
  description,
  prefix,
  suffix,
  type = "amount_of_money",
  toFixed2 = type === "amount_of_money" ? true : false,
  firstValue,
  lastValue,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container + " flex-row-space-between-center", props);
  const {
    colors: { grey, green, orange },
  } = useConfig();

  const radius = (SIZE + STROKE_WIDTH) / 2;
  const circumference = Math.ceil(2 * Math.PI * radius);

  const isCategory = typeof firstValue === "string" || typeof lastValue === "string";
  let percentage: number | undefined = undefined;
  let isPositive: boolean | undefined = undefined;
  let fillPercents: number | undefined = undefined;
  let colorPercent: number | undefined = undefined;
  if (!isCategory) {
    percentage = Math.abs((firstValue - lastValue) / firstValue) * 100;
    percentage = percentage * (lastValue >= firstValue ? 1 : -1);
    if (isNaN(percentage)) percentage = 0;
    else if (!isFinite(percentage)) percentage = 100;
    isPositive = percentage > 0;
    fillPercents = Math.abs(Math.ceil((circumference / 100) * (Math.abs(percentage) - 100)));
    colorPercent = isPositive ? percentage : 50 - percentage;
  }

  const color = isPositive ? green["200"] : orange["300"];

  const toHexadecimal = (val: number): string => {
    return Math.round(255 * ((val <= 30 ? 30 : val >= 60 ? 60 : val) / 100)).toString(16);
  };

  return (
    <motion.div
      className={classNames}
      {...rest}
      style={{
        backgroundColor: color + (colorPercent !== undefined ? toHexadecimal(colorPercent) : toHexadecimal(30)),
      }}
    >
      <div className={styles.info + " flex-column-inherit-flex-start"}>
        <div>
          <h6>{header}</h6>
          <span className="body-14 text--grey">{description}</span>
        </div>
        <div className="w100 flex-row-space-between-flex-end">
          <h3>
            {prefix}
            {isCategory ? firstValue : lastValue.toFixed(typeof toFixed2 === "number" ? toFixed2 : toFixed2 ? 2 : 0)}
            {suffix && (
              <>
                &nbsp;
                {suffix}
              </>
            )}
          </h3>
          {isCategory && <h3>{lastValue}</h3>}
        </div>
      </div>
      {percentage !== undefined && (
        <div className="flex-column-inherit-flex-end">
          <Icons.Arrow.Right
            className={styles.arrow + " icon--bold"}
            animate={
              percentage === 0
                ? { rotate: 0, stroke: grey["900"] }
                : isPositive
                ? { rotate: -45, stroke: green["600"] }
                : { rotate: 45, stroke: orange["500"] }
            }
            transition={{ duration: 0.6 }}
          />
          <div
            className={styles.percent + " border-radius--lg flex-row-center-center"}
            style={{ width: SIZE, height: SIZE }}
          >
            <h6>{Math.round(Math.abs(percentage))}%</h6>
            <svg viewBox="0 0 100 100" width={SIZE} height={SIZE}>
              <motion.circle
                cx="50%"
                cy="50%"
                r={radius}
                fill="transparent"
                strokeLinecap="round"
                strokeWidth={STROKE_WIDTH}
                strokeDashoffset={fillPercents}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: percentage === 0 ? 0 : circumference }}
                animate={{ strokeDashoffset: fillPercents }}
                transition={{ duration: 1.6, ease: "easeIn" }}
              />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
};
