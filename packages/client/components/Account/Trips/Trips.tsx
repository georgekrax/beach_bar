import Carousel from "@/components/Carousel2";
import { PaymentsQuery } from "@/graphql/generated";
import { Details } from "./Details";
import { DoubleInfo } from "./DoubleInfo";
import { Info } from "./Info";
import { Recent } from "./Recent";
import { Page } from "./Page";
import styles from "./Trips.module.scss";

type SubComponents = {
  Details: typeof Details;
  Info: typeof Info;
  DoubleInfo: typeof DoubleInfo;
  Recent: typeof Recent;
  Page: typeof Page;
};

export const Trips: React.FC<Pick<PaymentsQuery, "payments">> & SubComponents = ({ payments }) => (
  <div
    className={styles.container + " flex-row-flex-start-center"}
    style={{ justifyContent: payments.length > 3 ? "space-between" : undefined }}
  >
    {payments.map(({ beachBar, ...rest }) => (
      <Carousel.Visit {...rest} key={"beach_bar_" + beachBar.id} beachBar={beachBar} />
    ))}
  </div>
);

Trips.Details = Details;
Trips.Info = Info;
Trips.DoubleInfo = DoubleInfo;
Trips.Recent = Recent;
Trips.Page = Recent;

Trips.displayName = "AccountTrips";
