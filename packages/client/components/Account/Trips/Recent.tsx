import Carousel from "@/components/Carousel2";
import { usePaymentsQuery } from "@/graphql/generated";
import styles from "./Recent.module.scss";

export const Recent: React.FC = () => {
  const { data, loading, error } = usePaymentsQuery({ fetchPolicy: "cache-first" });

  return data?.payments.length === 0 ? null : (
    <Carousel.Context>
      <div className={styles.container}>
        <div className="flex-row-space-between-flex-start">
          <h6>
            Recent <span className="normal">trips</span>
          </h6>
          <Carousel.ControlBtns className="im0" />
        </div>
        {!loading && (error || !data?.payments) ? (
          <h2>Error</h2>
        ) : (
          <div className={styles.carousel + " flex-row-flex-start-stretch"}>
            <Carousel className="m0">
              {data?.payments.map(({ beachBar, ...rest }, i) => (
                <Carousel.Item key={"beach_bar_" + i} idx={i} className="im0 h100" animateScale={false}>
                  <Carousel.Visit beachBar={beachBar} {...rest} />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </Carousel.Context>
  );
};

Recent.displayName = "AccountTripsRecent";
