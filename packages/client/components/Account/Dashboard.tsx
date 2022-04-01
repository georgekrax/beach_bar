import Layout, { LayoutMenuDefaultSelected } from "@/components/Layout";
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./Dashboard.module.scss";

const PAGES = [
  { header: "Account", link: "/account", sublinks: undefined },
  { header: "Trips", link: "/account/trips", sublinks: undefined },
  { header: "Billing", link: "/account/billing", sublinks: undefined },
  { header: "Favourites", link: "/account/favourites", sublinks: undefined },
  { header: "Reviews", link: "/account/reviews", sublinks: undefined },
  { header: "History", link: "/account/history", sublinks: undefined },
] as const;

export const Dashboard: React.FC<LayoutMenuDefaultSelected<typeof PAGES> & React.ComponentPropsWithoutRef<"div">> = ({
  defaultSelected,
  children,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container + " flex-column-flex-start-flex-start", props);
  return (
    <div className={classNames} {...rest}>
      <Layout.Menu defaultSelected={defaultSelected} pages={PAGES} />
      <div className="w100">{children}</div>
    </div>
  );
};

Dashboard.displayName = "AccountDashboard";
