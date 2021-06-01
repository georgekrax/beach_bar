import { useWindowDimensions } from "@hashtag-design-system/components";
import { useConfig } from "./useConfig";

export const useIsDesktop = (): boolean => {
  const { width } = useWindowDimensions();
  const {
    variables: {
      breakpoints: { md },
    },
  } = useConfig();

  return width >= md;
};
