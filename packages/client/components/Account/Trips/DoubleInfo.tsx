import { useClassnames } from "@hashtag-design-system/components";
import styles from "./DoubleInfo.module.scss";

type Props = {
  primary?: string;
  secondary?: string;
  row?: boolean;
  alignItems?: "center" | "flex-end";
};

type FProps = Props & React.ComponentPropsWithoutRef<"div">;

export const DoubleInfo: React.FC<FProps> = ({
  primary,
  secondary,
  row,
  alignItems = "flex-end",
  children,
  ...props
}) => {
  const [classNames, rest] = useClassnames(
    styles.container + (row ? " " + styles.row : "") + ` flex-${row ? "row" : "column"}-center-${alignItems}`,
    props
  );

  return (
    <div className={classNames} {...rest}>
      {primary && <span>{primary}</span>}
      {children}
      {secondary && <span className="body-16">{secondary}</span>}
    </div>
  );
};

DoubleInfo.displayName = "AccountTripsDoubleInfo";
