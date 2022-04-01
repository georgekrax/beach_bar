import Search, { SearchFiltersBtnProps } from "@/components/Search";
import styles from "./ServiceItem.module.scss";

export type Props = {
  icon: React.ReactNode;
  quantity?: number;
  v2?: boolean;
  feature?: string;
} & Omit<SearchFiltersBtnProps, "label"> &
  Pick<Partial<SearchFiltersBtnProps>, "label">;

export const ServiceItem: React.FC<Props> = ({
  feature,
  icon,
  quantity,
  v2 = false,
  label = feature + (quantity && quantity > 1 ? ` (${quantity}x)` : ""),
  ...props
}) => {
  return v2 ? (
    <Icon icon={icon} v2={v2} quantity={quantity} />
  ) : (
    <Search.Filters.Btn className={styles.btn} label={label || ""} {...props}>
      <Icon icon={icon} v2={v2} />
    </Search.Filters.Btn>
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
