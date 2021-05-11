import Auth from "@/components/Auth/Auth";
import { MapDialog } from "@/components/Search/MapDialog";
import { SEARCH_ACTIONS } from "@/components/Search/reducer";
import ShoppingCart from "@/components/ShoppingCart/ShoppingCart";
import { userIpAddr } from "@/lib/apollo/cache";
import { IpAddrType } from "@/typings/graphql";
import { useSearchContext } from "@/utils/contexts";
import { useConfig } from "@/utils/hooks/useConfig";
import { useIsDesktop } from "@/utils/hooks/useIsDesktop";
import { BottomSheet, Dialog, useClassnames, useWindowDimensions } from "@hashtag-design-system/components";
import { AnimatePresence } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { Footer, LayoutFooterProps } from "./Footer";
import Header, { LayoutHeaderProps } from "./Header";
import { LoginDialog } from "./LoginDialog";
import { LayoutTapBarProps } from "./TapBar";

export type Props = {
  header?: false | LayoutHeaderProps;
  footer?: false | LayoutFooterProps;
  tapbar?: boolean | LayoutTapBarProps;
  container?: React.ComponentPropsWithRef<"div">;
  main?: React.ComponentPropsWithoutRef<"main">;
  shoppingCart?: boolean;
  children: React.ReactNode;
};

const Layout: React.NamedExoticComponent<Props> = memo(
  ({ header, footer, tapbar = true, container = {}, main = {}, shoppingCart = false, children }) => {
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [containerClassNames, containerRest] = useClassnames("container", container);
    const isDesktop = useIsDesktop();
    const { height } = useWindowDimensions();
    // const { variables, setValue } = useConfig();

    const BOTTOM_SHEET_DEFAULT_Y = isDesktop ? 150 : 300;

    // const { isCartShown, dispatch: searchDispatch } = useSearchContext();

    // const fetchUsersIp = async () => {
    //   const res = await fetch(
    //     "http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,currency,isp,org,as,mobile,query"
    //   );
    //   const data: IpAddrType = await res.json();
    //   if (data.status === "success") {
    //     userIpAddr(data);
    //     setValue(prevState => ({ ...prevState, variables: { ...prevState.variables, ipAddr: data } }));
    //   }
    // };

    // const handleFocus = (e: FocusEvent, bool: boolean) => {
    //   const activeEl = e.target;
    //   if (
    //     activeEl &&
    //     // @ts-expect-error
    //     ["input", "textarea"].includes(activeEl.tagName.toLowerCase()) &&
    //     // @ts-expect-error
    //     !["radio", "checkbox"].includes(activeEl.type)
    //   )
    //     setIsKeyboardShown(bool);
    // };

    // // Fetch user's IP Address
    // useEffect(() => {
    //   if (!variables.ipAddr) fetchUsersIp();
    //   // console.clear();

    //   document.addEventListener("focus", e => handleFocus(e, true), true);
    //   document.addEventListener("blur", e => handleFocus(e, false), true);

    //   return () => {
    //     document.removeEventListener("focus", e => handleFocus(e, true));
    //     document.removeEventListener("blur", e => handleFocus(e, false));
    //   };
    // }, []);

    return (
      <>
        <LoginDialog>
          <Auth />
        </LoginDialog>
        <MapDialog />
        {header !== false && <Header {...header} />}
        <div className={containerClassNames} {...containerRest}>
          <AnimatePresence exitBeforeEnter>
            {/* <Wrapper key="wrapper" {...wrapper}> */}
            <main {...main} style={{ ...main?.style, height: "fit-content", flexGrow: 1 }}>
              <div className="wrapper">{children}</div>
            </main>
            {/* </Wrapper> */}
          </AnimatePresence>
          {footer !== false && <Footer {...footer} />}
        </div>
        {/* {shoppingCart && (
          <BottomSheet
            isShown={isCartShown}
            transformTemplate={(_, gen) => gen.replace("300px", BOTTOM_SHEET_DEFAULT_Y + "px")}
            defaultY={BOTTOM_SHEET_DEFAULT_Y}
            hugContentsHeight={false}
            style={{ top: 0 }}
            onDismiss={() => searchDispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: false } })}
          >
            <Dialog.Content className="search__cart" style={{ maxHeight: height - BOTTOM_SHEET_DEFAULT_Y - 32 }}>
              <ShoppingCart />
            </Dialog.Content>
          </BottomSheet>
        )} */}
        {/* {!isKeyboardShown && isMobile && tapbar && <TapBar />} */}
      </>
    );
  }
);

Layout.displayName = "Layout";

export default Layout;
