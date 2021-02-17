import { useHasMounted, useIsMobile } from "@hashtag-design-system/components";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Container from "./Container";
import Footer from "./Footer";
import Header from "./Header";
import TapBar from "./TapBar";

type SubComponents = {
  Container: typeof Container;
  Header: typeof Header;
  Footer: typeof Footer;
  TapBar: typeof TapBar;
};

export type Props = {};

const Layout: React.FC<Props> & SubComponents = ({ children }) => {
  const { isMobile } = useIsMobile();
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [hasMounted] = useHasMounted();

  useEffect(() => {
    if (hasMounted) {
      const activeEl = document.activeElement;
      if (activeEl && ["input", "textarea"].includes(activeEl.tagName.toLowerCase())) {
        setIsKeyboardShown(true);
      } else {
        setIsKeyboardShown(false);
      }
    }
  });

  return (
    <div>
      <Header />
      <AnimatePresence exitBeforeEnter>
        <Container key="container">{children}</Container>
        <Footer key="footer" />
      </AnimatePresence>
      {isMobile && !isKeyboardShown && hasMounted && <TapBar />}
    </div>
  );
};

Layout.displayName = "Layout";

Layout.Container = Container;
Layout.Header = Header;
Layout.Footer = Footer;
Layout.TapBar = TapBar;

export default Layout;
