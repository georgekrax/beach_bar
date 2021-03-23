import { userIpAddr } from "@/lib/apollo/cache";
import { IpAddrType } from "@/typings/graphql";
import { useConfig } from "@/utils/hooks";
import { useIsMobile } from "@hashtag-design-system/components";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState, memo } from "react";
import AuthForm from "../AuthForm";
import Wrapper from "././Wrapper";
import Footer, { LayoutFooterProps } from "./Footer";
import Header, { LayoutHeaderProps } from "./Header";
import { LayoutWrapperFProps } from "./index";
import { LoginDialog } from "./LoginDialog";
import { Logo } from "./Logo";
import TapBar, { LayoutTapBarProps } from "./TapBar";

type SubComponents = {
  Wrapper: typeof Wrapper;
  Header: typeof Header;
  Footer: typeof Footer;
  TapBar: typeof TapBar;
  Logo: typeof Logo;
  LoginDialog: typeof LoginDialog;
};

export type Props = {
  header?: boolean | LayoutHeaderProps;
  footer?: boolean | LayoutFooterProps;
  tapbar?: boolean | LayoutTapBarProps;
  wrapperProps?: LayoutWrapperFProps;
  mainProps?: React.ComponentPropsWithoutRef<"main">;
};

// @ts-expect-error
const Layout: React.FC<Props> & SubComponents = memo(
  // @ts-expect-error
  ({ header = true, footer = true, tapbar = true, wrapperProps, mainProps = {}, children }) => {
    const [isDialogShown, setIsDialogShown] = useState(false);
    const { isMobile } = useIsMobile();
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);

    const { variables, setValue } = useConfig();

    const fetchUsersIp = async () => {
      const res = await fetch(
        "http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,currency,isp,org,as,mobile,query"
      );
      const data: IpAddrType = await res.json();
      if (data.status === "success") {
        const {
          city,
          country,
          countryCode,
          currency,
          district,
          lat,
          lon,
          mobile,
          query,
          region,
          regionName,
          status,
          timezone,
          zip,
        } = data;

        const newIpAddr: IpAddrType = {
          city,
          country,
          countryCode,
          currency,
          district,
          lat,
          lon,
          mobile,
          query,
          region,
          regionName,
          status,
          timezone,
          zip,
        };

        userIpAddr(newIpAddr);

        setValue(prevState => ({
          ...prevState,
          variables: {
            ...prevState.variables,
            ipAddr: newIpAddr,
          },
        }));
      }
    };

    const handleFocus = (e: FocusEvent, bool: boolean) => {
      const activeEl = e.target;
      if (
        activeEl &&
        // @ts-expect-error
        ["input", "textarea"].includes(activeEl.tagName.toLowerCase()) &&
        // @ts-expect-error
        !["radio", "checkbox"].includes(activeEl.type)
      )
        setIsKeyboardShown(bool);
    };

    // Fetch user's IP Address
    useEffect(() => {
      if (!variables.ipAddr) fetchUsersIp();
      // console.clear();

      document.addEventListener("focus", e => handleFocus(e, true), true);
      document.addEventListener("blur", e => handleFocus(e, false), true);

      return () => {
        document.removeEventListener("focus", e => handleFocus(e, true));
        document.removeEventListener("blur", e => handleFocus(e, false));
      };
    }, []);

    return (
      <>
        {header && <Header btnProps={{ onClick: () => setIsDialogShown(true) }} {...header} />}
        <LoginDialog isShown={isDialogShown} setIsShown={setIsDialogShown}>
          <AuthForm />
        </LoginDialog>
        <AnimatePresence exitBeforeEnter>
          <Wrapper key="wrapper" {...wrapperProps}>
            <main {...mainProps} style={{ ...mainProps?.style, height: "fit-content" }}>
              {children}
            </main>
            {footer && <Footer {...footer} />}
          </Wrapper>
        </AnimatePresence>
        {!isKeyboardShown && isMobile && tapbar && <TapBar />}
      </>
    );
  }
);

Layout.Wrapper = Wrapper;
Layout.Header = Header;
Layout.Footer = Footer;
Layout.TapBar = TapBar;
Layout.Logo = Logo;
Layout.LoginDialog = LoginDialog;

export default Layout;
