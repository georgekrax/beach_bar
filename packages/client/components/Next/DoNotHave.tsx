import styles from "./DoNotHave.module.scss";

type Props = {
  msg?: string;
  emoji?: string;
};

export const DoNotHave: React.FC<Props> = ({ msg, emoji, children }) => {
  return (
    <div className={styles.container + " w-100 flex-column-center-center"}>
      {emoji && <span className={styles.emoji}>{emoji}</span>}
      <span style={{ textAlign: "center" }}>{msg || children}</span>
    </div>
  );
};

DoNotHave.displayName = "NextDoNotHave";
