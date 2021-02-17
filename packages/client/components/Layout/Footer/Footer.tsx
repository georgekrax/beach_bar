import dayjs from "dayjs";
import styles from "./Footer.module.scss";

type Props = {};

const Footer: React.FC<Props> = () => {
  return (
    <footer className={styles.container + " w-100"}>
      <small>Copyright &#169; {dayjs().year()} #beach_bar. All rights Reserved.</small>
    </footer>
  );
};

Footer.displayName = "Footer";

export default Footer;
