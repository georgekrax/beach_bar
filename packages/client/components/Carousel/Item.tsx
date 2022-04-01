import { useCarouselContext } from "@/utils/contexts";
import { MotionBox, MotionBoxProps } from "@hashtag-design-system/components";
import { memo, useMemo } from "react";

type Props = MotionBoxProps & {
  idx: number;
  hasAnimatedScale?: boolean
  // isActive?: boolean | (({ activeIdx: number }) => boolean);
};

export const Item: React.FC<Props> = memo(({ idx, hasAnimatedScale = true, children, ...props }) => {
  const { activeIdx } = useCarouselContext();

  // const isActive = useMemo(
  //   () => (typeof isActiveProp === "boolean" ? isActiveProp : isActiveProp?.({ activeIdx })) || false,
  //   [isActiveProp, activeIdx]
  // );
  const isActive = useMemo(() => idx >= activeIdx, [idx, activeIdx]);

  return (
    <MotionBox
      initial={{ scale: 1 }}
      animate={hasAnimatedScale ? { scale: isActive ? 1.2 : 1 } : undefined}
      transition={{ duration: isActive ? 0.4 : undefined }}
      display="inline-block"
      mx={8}
      ml={idx === 0 ? 4 : undefined}
      {...props}
      _last={{ mr: 0, ...props._last }}
    >
      {children}
    </MotionBox>
  );
});

Item.displayName = "CarouselItem";
