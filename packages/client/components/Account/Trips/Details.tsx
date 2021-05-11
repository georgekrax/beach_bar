<<<<<<< HEAD
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./Details.module.scss";

type Props = {
  header?: string;
};

type FProps = Props & React.ComponentPropsWithoutRef<"div">;

export const Details: React.FC<FProps> = ({ header, children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " w100", props);

  return (
    <div className={classNames} {...rest}>
      {header && <h5 className="upper normal body-16">{header}</h5>}
      {children}
    </div>
  );
};

Details.displayName = "AccountTripsDetails";
=======
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./Details.module.scss";

type Props = {
  header?: string;
};

type FProps = Props & React.ComponentPropsWithoutRef<"div">;

export const Details: React.FC<FProps> = ({ header, children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " w100", props);

  return (
    <div className={classNames} {...rest}>
      {header && <h5 className="upper normal body-16">{header}</h5>}
      {children}
    </div>
  );
};

Details.displayName = "AccountTripsDetails";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
