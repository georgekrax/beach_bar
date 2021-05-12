import styles from "./Badge.module.scss";

type Props = {
  position?: "top" | "bottom";
};

export const Badge: React.FC<Props> = ({ position = "bottom", children }) => {
  return (
    <div style={{ [position]: "-15%" }} className={styles.container + " body-12 semibold flex-row-center-center"}>
      {children}
    </div>
  );
};

Badge.displayName = "NextBadge";
