import type { SystemStyleObject } from "@chakra-ui/theme-tools";

const baseStyle: SystemStyleObject = {
  opacity: 1,
  outline: "none",
  color: "blue.500",
  _hover: {
    opacity: 0.75,
    textDecoration: "none",
  },
  _focus: {
    boxShadow: "outline",
  },
};

export const Link = {
  baseStyle,
};
