import Next from "@/components/Next";
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./ChartInfo.module.scss";

type Props = {
  header: string;
  value: string;
  note?: string;
  isLoading?: boolean;
  colorPercentage?: number;
  seeMoreHref?: string;
};

export const ChartInfo: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">> = ({
  header,
  value,
  note,
  seeMoreHref,
  isLoading = false,
  colorPercentage,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container + " w100 flex-column-inherit-inherit", props);

  return (
    <div className={classNames} {...rest}>
      <div className="w100 flex-row-space-between-inherit">
        <div className="semibold text--grey">{header}</div>
        {seeMoreHref && (
          <Next.Link className="body-14" href={seeMoreHref}>
            See more
          </Next.Link>
        )}
      </div>
      <h6
        className={styles.header + (isLoading ? " loading loading--text" : "") + " semibold text--primary"}
        data-rating={colorPercentage}
      >
        {!isLoading && value}
      </h6>
      {note && (
        <span
          className={styles.note + (isLoading ? " loading loading--text" : "") + " body-12 text--grey"}
          style={{ maxWidth: isLoading ? 120 / 16 + "em" : undefined }}
        >
          {!isLoading && note}
        </span>
      )}
    </div>
  );
};

ChartInfo.displayName = "DashboardChartInfo";
