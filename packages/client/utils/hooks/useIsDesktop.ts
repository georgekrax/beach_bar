<<<<<<< HEAD
import { useWindowDimensions } from "@hashtag-design-system/components";
import { useConfig } from "./useConfig";

export const useIsDesktop = () => {
  const { width } = useWindowDimensions();
  const {
    variables: {
      breakpoints: { md },
    },
  } = useConfig();

  return width >= md;
};
=======
import { useWindowDimensions } from "@hashtag-design-system/components";
import { useConfig } from "./useConfig";

export const useIsDesktop = () => {
  const { width } = useWindowDimensions();
  const {
    variables: {
      breakpoints: { md },
    },
  } = useConfig();

  return width >= md;
};
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
