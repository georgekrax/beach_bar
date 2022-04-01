import Layout, { LayoutMenuDefaultSelected } from "@/components/Layout";
import { useClassnames } from "@hashtag-design-system/components";
import { AddBtn } from "./AddBtn";
import { Billing } from "./Billing";
import { Pie } from "./Billing/Pie";
import { TimePeriod } from "./Billing/TimePeriod";
import { Bookings } from "./Bookings";
import { Chart } from "./Chart";
import styles from "./Dashboard.module.scss";
import { Features } from "./Features";
import { Foods } from "./Foods";
import { Form } from "./Form";
import { HomePage } from "./HomePage";
import { Report } from "./HomePage/Report";
import { Images } from "./Images";
import { Location } from "./Location";
import { Products } from "./Products";
import { ReservationLimitNote } from "./ReservationLimitNote";
import { Reviews } from "./Reviews";
import { Settings } from "./Settings";

type SubComponents = {
  Form: typeof Form;
  Location: typeof Location;
  Products: typeof Products;
  ReservationLimitNote: typeof ReservationLimitNote;
  Foods: typeof Foods;
  AddBtn: typeof AddBtn;
  Features: typeof Features;
  HomePage: typeof HomePage;
  Chart: typeof Chart;
  Images: typeof Images;
  Reviews: typeof Reviews;
  Billing: typeof Billing;
  Report: typeof Report;
  Pie: typeof Pie;
  TimePeriod: typeof TimePeriod;
  Bookings: typeof Bookings;
  Settings: typeof Settings;
};

const PAGES = [
  { header: "Home", link: "/dashboard", sublinks: undefined },
  { header: "Bookings", link: "/dashboard/bookings", sublinks: undefined },
  { header: "Billing", link: "/dashboard/billing", sublinks: undefined },
  { header: "Products", link: "/dashboard/products", sublinks: undefined },
  { header: "Foods", link: "/dashboard/foods", sublinks: undefined },
  { header: "Settings", link: "/dashboard/settings", sublinks: undefined },
  {
    header: "More",
    link: undefined,
    sublinks: [
      { header: "Reviews", link: "/dashboard/reviews" },
      { header: "Images", link: "/dashboard/images" },
      { header: "Features", link: "/dashboard/features" },
    ],
  },
] as const;

const Dashboard: React.FC<
  LayoutMenuDefaultSelected<typeof PAGES> & Pick<React.ComponentPropsWithoutRef<"div">, "className">
> &
  SubComponents = ({ defaultSelected, children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " flex-row-flex-start-flex-start", props);

  return (
    <div className={classNames} {...rest}>
      <Layout.Menu pages={PAGES} defaultSelected={defaultSelected} />
      <div className="w100">{children}</div>
    </div>
  );
};

Dashboard.Form = Form;
Dashboard.Location = Location;
Dashboard.Products = Products;
Dashboard.ReservationLimitNote = ReservationLimitNote;
Dashboard.Foods = Foods;
Dashboard.AddBtn = AddBtn;
Dashboard.Features = Features;
Dashboard.HomePage = HomePage;
Dashboard.Chart = Chart;
Dashboard.Images = Images;
Dashboard.Reviews = Reviews;
Dashboard.Billing = Billing;
Dashboard.Report = Report;
Dashboard.Pie = Pie;
Dashboard.TimePeriod = TimePeriod;
Dashboard.Bookings = Bookings;
Dashboard.Settings = Settings;

Dashboard.displayName = "BeachBarDashboard";

export default Dashboard;
