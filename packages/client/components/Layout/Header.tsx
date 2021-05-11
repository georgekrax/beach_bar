import { Avatar } from "@/components/Account/Avatar";
import { LoginBtn } from "@/components/Auth/LoginBtn";
import { Box } from "@/components/Search/Box/Box";
import { useAuth } from "@/utils/hooks";
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./Header.module.scss";
import { Logo } from "./Logo";

type Props = {
  withAuth?: boolean;
  searchBar?: boolean;
  sticky?: boolean;
} & React.ComponentPropsWithoutRef<"header">;

export const Header: React.FC<Props> = ({ withAuth = true, searchBar = false, sticky = true, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " w100", props);
  const { data } = useAuth();

  return (
    <header className={classNames} style={{ ...rest.style, position: sticky ? "sticky" : "static" }} {...rest}>
      <div className="container--padding container--mw h100 flex-row-space-between-center">
        <nav className={styles.nav} style={{ marginRight: searchBar ? "auto" : undefined }}>
          <Logo />
        </nav>
        {searchBar && <Box className={styles.searchBar} inHeader />}
        {withAuth && data?.me ? (
          <div className="flex-row-center-center">
            <div className={styles.userFirstName}>Hello {data?.me?.firstName}!</div>
            <Avatar />
          </div>
        ) : (
          <LoginBtn style={{ alignSelf: "center" }} />
        )}
      </div>
    </header>
  );
};

Header.displayName = "Header";

export type { Props as LayoutHeaderProps };
