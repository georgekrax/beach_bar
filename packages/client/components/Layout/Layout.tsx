import Auth from "@/components/Auth";
import { SEARCH_ACTIONS } from "@/components/Search";
import ShoppingCart from "@/components/ShoppingCart";
import { userIpAddr } from "@/lib/apollo/cache";
import { IpAddrType } from "@/typings/graphql";
import { useSearchContext } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { useReactiveVar } from "@apollo/client";
import {
  BottomSheet,
  Box,
  BoxProps,
  cx,
  useEventListener,
  useWindowDimensions,
} from "@hashtag-design-system/components";
import { AnimatePresence } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Footer, LayoutFooterProps } from "./Footer";
import { Header, LayoutHeaderProps } from "./Header";
import { LayoutIconHeader as IconHeader } from "./IconHeader";
import { LoginDialog } from "./LoginDialog";
import { Menu } from "./Menu";
import { LayoutTapBarProps } from "./TapBar";

// const IconHeader = dynamic(() => {
//   const prom = import("./IconHeader").then(mod => mod.LayoutIconHeader);
//   return prom;
// });

export type Props = {
  header?: false | LayoutHeaderProps;
  footer?: false | LayoutFooterProps;
  tapbar?: boolean | LayoutTapBarProps;
  container?: BoxProps;
  main?: BoxProps;
  shoppingCart?: boolean;
  children: React.ReactNode;
  map?: boolean;
  hasToaster?: boolean;
};

type SubComponents = {
  IconHeader: typeof IconHeader;
  Menu: typeof Menu;
};

// @ts-expect-error
export const Layout: React.NamedExoticComponent<Props> & SubComponents = memo(
  ({
    header,
    footer,
    tapbar = true,
    container = {},
    main = {},
    shoppingCart = false,
    map = false,
    hasToaster = false,
    children,
  }) => {
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const _containerClassName = cx("container", container.className);

    const { isDesktop } = useIsDevice();
    const { viewport } = useWindowDimensions();
    const ipAddress = useReactiveVar(userIpAddr);

    const { isCartShown, dispatch: searchDispatch } = useSearchContext();

    const fetchUsersIp = async () => {
      const res = await fetch(
        "http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,currency,isp,org,as,mobile,query"
      );
      const data: IpAddrType = await res.json();
      if (res.ok && data.status === "success") {
        userIpAddr(data);
        // me.current = data;
        // setValue(prevState => ({ ...prevState, variables: { ...prevState.variables, ipAddr: data } }));
      }
    };

    // Fetch user's IP Address
    const handleFocus = async (e: FocusEvent) => {
      if (!ipAddress) fetchUsersIp();

      const activeEl = e.target;
      if (
        activeEl &&
        // @ts-expect-error
        ["input", "textarea"].includes(activeEl.tagName?.toLowerCase()) &&
        // @ts-expect-error
        !["radio", "checkbox"].includes(activeEl.type)
      ) {
        setIsKeyboardShown(e.type === "focus");
      }
    };

    useEffect(() => {
      if (!ipAddress) fetchUsersIp();
    }, [ipAddress?.query]);

    useEventListener("focus", handleFocus, undefined, true);

    return (
      <>
        <LoginDialog>
          <Auth />
        </LoginDialog>
        {/* {map && <MapDialog />} */}
        {header !== false && <Header {...header} />}
        <Box {...container} className={_containerClassName}>
          <AnimatePresence exitBeforeEnter>
            <Box as="main" height="fit-content" flexGrow={1} {...main}>
              <div className="wrapper">
                {hasToaster && <Toaster position="top-center" />}
                {children}
              </div>
            </Box>
          </AnimatePresence>
        </Box>
        {footer !== false && <Footer {...footer} />}
        {shoppingCart && (
          <BottomSheet
            isOpen={isCartShown}
            // defaultHeight={!isDesktop ? viewport.height - 300 : undefined}
            defaultHeight={viewport.height - 200}
            defaultPosition={isDesktop ? "expanded" : undefined}
            mr={0}
            ml="auto"
            // More specificity for CSS
            sx={{ maxWidth: { md: "27rem !important" }, borderTopRightRadius: { md: "0px !important" } }}
            onClose={() => searchDispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: false } })}
          >
            <ShoppingCart atLayout closeBtn />
          </BottomSheet>
        )}
        {/* {!isKeyboardShown && isMobile && tapbar && <TapBar />} */}
      </>
    );
  }
);

Layout.IconHeader = IconHeader;
Layout.Menu = Menu;

Layout.displayName = "Layout";

export default Layout;
