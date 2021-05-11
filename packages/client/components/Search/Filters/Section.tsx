<<<<<<< HEAD
import styles from "./Section.module.scss";

export type Props = {
  header?: string;
};

export const Section: React.FC<Props> = ({ header, children }) => (
  <div className={styles.container}>
    {header && <h6 className="semibold">{header}</h6>}
    {children}
  </div>
);

Section.displayName = "SearchFiltersSection";
=======
import styles from "./Section.module.scss";

export type Props = {
  header?: string;
};

export const Section: React.FC<Props> = ({ header, children }) => (
  <div className={styles.container}>
    {header && <h6 className="semibold">{header}</h6>}
    {children}
  </div>
);

Section.displayName = "SearchFiltersSection";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
