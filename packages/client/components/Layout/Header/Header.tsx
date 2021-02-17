import styles from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.container + " w-100 flex-row-space-between-center"}>
      <h4>#beach_bar</h4>
      <p>Hi, George</p>
    </header>
  );
};

Header.displayName = "Header";

export default Header;
