<<<<<<< HEAD
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
=======
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
