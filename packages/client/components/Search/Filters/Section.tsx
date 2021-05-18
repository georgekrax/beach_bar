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
