<<<<<<< HEAD
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

export const NextOrContainer= OrContainer;
=======
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
