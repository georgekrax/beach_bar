import { BeachBar } from "@/graphql/generated";
import styles from "./Heading.module.scss";

type Props = {
  city?: string;
};

const Heading: React.FC<Props & Pick<BeachBar, "name"> & Pick<React.ComponentPropsWithoutRef<"div">, "className">> = ({
  name,
  city,
  className,
}) => {
  return (
    <div className={styles.container + (className ? " " + className : "") + " flex-column-center-flex-start"}>
      <h3>{name}</h3>
      <div className="semibold text--grey">{city}</div>
    </div>
  );
};

Heading.displayName = "BeachBarHeading";

export { Heading as BeachBarHeading };
