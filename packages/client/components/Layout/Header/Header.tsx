import { Button, ButtonFProps, useClassnames } from "@hashtag-design-system/components";
import Layout from "../Layout";
import styles from "./Header.module.scss";

export type Props = {
  withAuth?: boolean;
  btnProps?: ButtonFProps;
};

const Header: React.FC<Props> = ({ withAuth = true, btnProps = {} }) => {
  const [classNames, rest] = useClassnames(styles.btn, btnProps);

  return (
    <header className={styles.container + " w-100 flex-row-space-between-center"}>
      <Layout.Logo />
      {withAuth && <Button variant="secondary" className={classNames} {...rest}>Login</Button>}
      {withAuth && <p>Hi, George</p>}
    </header>
  );
};

Header.displayName = "Header";

export default Header;
