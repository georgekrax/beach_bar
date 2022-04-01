import Icons from "@/components/Icons";
import styles from "./TextBox.module.scss";

type Props = {
  icon?: Pick<React.ComponentPropsWithoutRef<"div">, "style">;
};

export const TextBox: React.FC<Props> = ({ icon, children }) => {
  return (
    <div className={styles.container + " flex-row-center-center"}>
      <div className={styles.icon + " flex-inherit-inherit-inherit"} {...icon}>
        <Icons.Info width={20} height={20} />
      </div>
      <div className="body-14">{children}</div>
    </div>
  );
};

TextBox.displayName = "NextTextBox";
