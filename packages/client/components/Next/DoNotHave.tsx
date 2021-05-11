import styles from "./DoNotHave.module.scss";

type Props = {
  msg?: string;
  emoji?: string;
};

export const DoNotHave: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "style">> = ({
  msg,
  emoji,
  style,
  children,
}) => {
  return (
    <div className={styles.container + " w100 flex-column-center-center"} style={style}>
      {emoji && <span className={styles.emoji}>{emoji}</span>}
      <span style={{ textAlign: "center" }}>{msg || children}</span>
    </div>
  );
};

DoNotHave.displayName = "NextDoNotHave";

export const NextDoNotHave = DoNotHave;