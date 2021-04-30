import styles from "./OrContainer.module.scss";

type Props = {
  text?: string;
  direction?: "row" | "column";
};

export const OrContainer: React.FC<Props> = ({ text = "Or continue with", direction="row" }) => {
  return (
    <div className={styles.container + (direction === "column" ? " " + styles.column : "") + ` w100 flex-${direction}-center-center`}>
      <div />
      <div>{text}</div>
      <div />
    </div>
  );
};

OrContainer.displayName = "NextOrContainer";
