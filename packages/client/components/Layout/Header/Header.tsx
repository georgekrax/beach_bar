import Search from "@/components/Search";
import { useAuth } from "@/utils/hooks/useAuth";
import { useClassnames } from "@hashtag-design-system/components";
import dynamic from "next/dynamic";
import { Logo } from "../Logo";
import styles from "./Header.module.scss";

const AccountAvatarDynamic = dynamic(() => {
  const prom = import("@/components/Account/Avatar").then(mod => mod.AccountAvatar);
  return prom;
})
const LoginBtnDynamic = dynamic(() => {
  const prom = import("@/components/Auth/LoginBtn").then(mod => mod.LoginBtn);
  return prom;
})

const inlineStyles: React.CSSProperties = { alignSelf: "center" }

export type Props = {
  withAuth?: boolean;
  searchBar?: boolean;
  sticky?: boolean;
} & React.ComponentPropsWithoutRef<"header">;

const Header: React.FC<Props> = ({ withAuth = true, searchBar = false, sticky = true, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " w100", props);
  const { data } = useAuth();

  return (
    <header className={classNames} style={{ ...rest.style, position: sticky ? "sticky" : "static" }} {...rest}>
      <div className="container--padding container--mw h100 flex-row-space-between-center">
        <nav className={styles.nav} style={{ marginRight: searchBar ? "auto" : undefined }}>
          <Logo />
        </nav>
        {searchBar && <Search.Box className={styles.searchBar} inHeader />}
        {withAuth && data?.me ? (
          <div className="flex-row-center-center">
            <div className={styles.userFirstName}>Hello {data?.me?.firstName}!</div>
            <AccountAvatarDynamic />
          </div>
        ) : (
          <LoginBtnDynamic style={inlineStyles} />
        )}
      </div>
    </header>
  );
};

Header.displayName = "Header";

export default Header;
