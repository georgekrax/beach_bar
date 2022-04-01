import { extendHashtagTheme, ThemeComponents, ThemeConfig, ThemeOverride } from "@hashtag-design-system/components";
import { Link } from "./components";

const config: ThemeConfig = {
  // cssVarPrefix: "hashtag",
  // initialColorMode: "dark",
  // useSystemColorMode: false,
};

const components: ThemeComponents = {
  Link,
};

const commonSpacingAndSizes: ThemeOverride["sizes"] = {
  container: {
    pad: "2em",
  },
  header: {
    height: "5rem",
  },
  icon: {
    semi: "1.25rem",
  },
};

const overrides: ThemeOverride = {
  config,
  components,
  space: {
    ...commonSpacingAndSizes,
  },
  sizes: {
    ...commonSpacingAndSizes,
    containerPad: "2em",
    loginDialogShape: "100px",
  },
  zIndices: {
    least: 1,
    sm: 9,
  },
  radii: {
    regular: "0.875rem",
    half: "0.5rem",
    loginDialog: "20px",
  },
  colors: {
    loading: "#E2E8F0",
    error: "#E53E3E",
    success: "#48BB78",
    brand: {
      secondary: "tomato",
      georgekrax: "orange",
    },
    text: {
      grey: "#2D3748",
    },
    bronze: {
      50: "#FAF2EB",
      100: "#F1DBC6",
      200: "#E8C3A1",
      300: "#DFAC7C",
      400: "#D69457",
      500: "#CD7D32",
      600: "#A46428",
      700: "#7B4B1E",
      800: "#523214",
      900: "#29190A",
    },
  },
};

const theme = extendHashtagTheme(overrides);

export default theme;
