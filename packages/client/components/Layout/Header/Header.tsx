import Search from "@/components/Search";
import { useAuth } from "@/utils/hooks/useAuth";
import { Box, cx, HTMLChakraProps } from "@hashtag-design-system/components";
import dynamic from "next/dynamic";
import { Logo } from "../Logo";
import styles from "./Header.module.scss";

const AccountAvatarDynamic = dynamic(() => {
  const prom = import("@/components/Account/Avatar").then(mod => mod.AccountAvatar);
  return prom;
});
const LoginBtnDynamic = dynamic(() => {
  const prom = import("@/components/Auth/LoginBtn").then(mod => mod.LoginBtn);
  return prom;
});

export type Props = HTMLChakraProps<"header"> & {
  auth?: boolean;
  searchBar?: boolean;
  sticky?: boolean;
};

const Header: React.FC<Props> = ({ auth = true, searchBar = false, sticky = true, ...props }) => {
  const _className = cx(styles.container + " w100", props.className);
  const { data } = useAuth();

  return (
    <Box as="header" position={sticky ? "sticky" : "static"} {...props} className={_className}>
      <div className="container--padding container--mw h100 flex-row-space-between-center">
        <nav className={styles.nav} style={{ marginRight: searchBar ? "auto" : undefined }}>
          <Logo />
        </nav>
        {searchBar && <Search.Box className={styles.searchBar} inHeader />}
        {auth && data?.me ? (
          <div className="flex-row-center-center">
            <div className={styles.userFirstName}>Hello {data?.me?.firstName}!</div>
            <AccountAvatarDynamic />
          </div>
        ) : (
          <LoginBtnDynamic style={{ alignSelf: "center" }} />
        )}
      </div>
    </Box>
  );
};

Header.displayName = "Header";

export default Header;
