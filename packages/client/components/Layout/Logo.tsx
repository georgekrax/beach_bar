import styles from "./Logo.module.scss";

type Props = {};

export const Logo: React.FC<Props> = () => {
  return <h4 className={styles.logo}>#beach_bar</h4>;
};

Logo.displayName = "LayoutLogo";

