import { addDomEvent, useSafeLayoutEffect, useToken } from "@hashtag-design-system/components";
import { useState } from "react";

type UseIsDevice = {
  isDesktop: boolean;
  isMobile: boolean;
};

export const useIsDevice = (): UseIsDevice => {
  const [isDesktop, setIsDesktop] = useState(false);
  const mdBreakpoint = useToken("breakpoints", "md");

  useSafeLayoutEffect(() => {
    const handleResize = () => {
      const { matches } = window.matchMedia(`(min-width: ${mdBreakpoint})`);
      setIsDesktop(matches);
    };

    handleResize();
    addDomEvent(window, "resize", handleResize);
  }, []);

  return { isDesktop, isMobile: !isDesktop };
};
