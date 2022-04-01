import { MotionFlex, MotionFlexProps } from "@hashtag-design-system/components";
import { forwardRef } from "react";

export type Props = Omit<MotionFlexProps, "aria-label" | "ref"> & Required<Pick<MotionFlexProps, "aria-label">>;

export const IconBox = forwardRef<HTMLDivElement, Props>(({ children, ...props }, ref) => {
  return (
    <MotionFlex
      justify="center"
      align="center"
      border="1px solid"
      p={2}
      borderColor="gray.500"
      borderRadius="regular"
      bg="white"
      cursor="pointer"
      transitionProperty="common"
      transitionDuration="normal"
      transitionTimingFunction="ease-out"
      {...props}
      ref={ref}
      _hover={{ opacity: 0.5, ...props._hover }}
      _active={{ opacity: 0.5, bg: "gray.200", ...props._active }}
    >
      {children}
    </MotionFlex>
  );
});

IconBox.displayName = "NextIconBox";
