import React from "react";
import styles from "./Step.module.scss";

type Props = {
  header?: string;
};

export const Step: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "style">> = ({
  header,
  style,
  children,
}) => {
  return (
    <div className={styles.container} style={style}>
      <h6 className="text--grey">{header}</h6>
      <div className="flex-column-flex-start-flex-start">{children}</div>
    </div>
  );
};

Step.displayName = "DashboardFormStep";
