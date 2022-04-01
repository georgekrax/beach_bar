import { MotionBox, MotionBoxProps } from "@hashtag-design-system/components";
import { forwardRef } from "react";

type Props = MotionBoxProps & {
  children: React.ReactNode;
  isShown: boolean;
};

export const Step = forwardRef<HTMLDivElement, Props>(({ isShown, style, children, ...props }, ref) => {
  return (
    <MotionBox
      animate={{ opacity: isShown ? 1 : 0.25 }}
      {...props}
      ref={ref as any}
      _last={{ mt: "22vh", mb: "35%", ...props._last }}
    >
      {children}
    </MotionBox>
  );
});
