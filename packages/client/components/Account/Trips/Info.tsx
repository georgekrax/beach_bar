import styles from "./Info.module.scss";

type Props = {
  info?: string;
};

export const Info: React.FC<Props> = ({ info, children }) => {
  return (
    <div className={styles.container + " flex-row-space-between-flex-start"}>
      <div>{info}</div>
      <div style={{ fontSize: "1.125rem" }}>
        {children}
      </div>
    </div>
  );
};

Info.displayName = "AccountTripsInfo";
