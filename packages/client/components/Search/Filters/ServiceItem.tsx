import Search, { SearchFiltersBtnProps } from "@/components/Search";
import styles from "./ServiceItem.module.scss";

export type Props = {
  icon: React.ReactNode;
  quantity?: number;
} & (
  | {
      v2: true;
      feature: undefined;
    }
  | {
      v2?: false;
      feature: string;
    }
);

export const ServiceItem: React.FC<Props & SearchFiltersBtnProps> = ({
  feature,
  icon,
  quantity,
  v2 = false,
  label = feature,
  ...props
}) => {
  return !v2 ? (
    <Search.Filters.Btn className={styles.btn} label={label || ""} {...props}>
      <Icon icon={icon} v2={v2} />
    </Search.Filters.Btn>
  ) : (
    <Icon icon={icon} v2={v2} />
  );
};

export const Icon: React.FC<Pick<Props, "icon" | "v2" | "quantity">> = ({ icon, quantity, v2 }) => (
  <div className={styles.icon + (v2 ? " " + styles.v2 : "") + " flex-row-center-center"}>
    {icon}
    {quantity && quantity > 1 && (
      <small className="body-14 bold" style={{ marginLeft: "0.35em" }}>
        {quantity}
        <span className="body-14 bold">x</span>
      </small>
    )}
  </div>
);

Icon.displayName = "SearchFiltersServiceItemIcon";
ServiceItem.displayName = "SearchFiltersServiceItem";
