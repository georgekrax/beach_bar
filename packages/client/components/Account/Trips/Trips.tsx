import { Visit } from "@/components/Carousel";
import { GetPaymentsQuery } from "@/graphql/generated";
import { Details } from "./Details";
import { DoubleInfo } from "./DoubleInfo";
import { Info } from "./Info";
import styles from "./Trips.module.scss";

type SubComponents = {
  Details: typeof Details;
  Info: typeof Info;
  DoubleInfo: typeof DoubleInfo;
};

type Props = {
  data: Required<GetPaymentsQuery>;
};

export const Trips: React.FC<Props> & SubComponents = ({ data }) => {
  return (
    <div className={styles.container + " flex-row-center-center"}>
      {data.getPayments
        ?.map(({ visits, beachBar: { id, name, thumbnailUrl, location: { city, region } } }) => ({
          beachBar: { id, name, city: city?.name, region: region?.name },
          imgProps: { src: thumbnailUrl },
          visits: visits.map(({ time: { value }, ...rest }) => ({ ...rest, hour: value })),
        }))
        .map(({ imgProps: { src }, beachBar, visits }, i) => (
          <Visit
            key={beachBar.id}
            idx={i}
            imgProps={{ src, height: 170 }}
            beachBar={beachBar}
            visits={visits}
            active
            className={styles.trip}
            // ref={el => (itemsRef.current[i] = el)}
            // onClick={() => console.log("hey")}
          />
        ))}
    </div>
  );
};

Trips.Details = Details;
Trips.Info = Info;
Trips.DoubleInfo = DoubleInfo;

Trips.displayName = "AccountTrips";
