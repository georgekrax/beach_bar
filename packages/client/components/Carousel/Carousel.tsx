import { useCarouselContext } from "@/utils/contexts";
import { callAllHandlers, Flex, FlexProps, MotionFlex, MotionFlexProps, useDimensions } from "@hashtag-design-system/components";
import { useEffect, useMemo } from "react";
import { BeachBar } from "./BeachBar";
import { Context } from "./Context";
import { ControlBtn } from "./ControlBtn";
import { Item } from "./Item";

type SubComponents = {
  Item: typeof Item;
  BeachBar: typeof BeachBar;
  Context: typeof Context;
  ControlBtn: typeof ControlBtn;
  // Visit: typeof Visit;
};

type Props = MotionFlexProps & {
  step?: number;
  container?: FlexProps;
};

const Carousel: React.FC<Props> & SubComponents = ({ step = 1, container, children, ...props }) => {
  const { translateX, trackRef, setStep, handleDrag } = useCarouselContext();

  const trackDimensions = useDimensions(trackRef);
  const dragConstraint = useMemo(
    () => (!trackDimensions ? 0 : +(trackDimensions?.borderBox.width * (1 - 15 / 100)).toFixed(2)),
    [trackDimensions]
  );

  useEffect(() => setStep(step), [step]);

  return (
    <Flex overflow="hidden" {...container}>
      <MotionFlex
        ref={trackRef}
        drag="x"
        dragElastic={0.2}
        dragConstraints={{ left: -dragConstraint, right: 0 }}
        animate={{ x: -translateX }}
        transition={{ duration: 0.6 }}
        cursor="grab"
        whiteSpace="nowrap"
        {...props}
        onDrag={e => callAllHandlers(() => handleDrag(), props.onDrag as any)(e)}
        onDragEnd={e => callAllHandlers(() => handleDrag(), props.onDragEnd as any)(e)}
        onDragTransitionEnd={() => {
          handleDrag();
          props.onDragTransitionEnd?.();
        }}
      >
        {children}
      </MotionFlex>
    </Flex>
  );
};

Carousel.displayName = "Carousel";

Carousel.Context = Context;
Carousel.Item = Item;
Carousel.ControlBtn = ControlBtn;
Carousel.BeachBar = BeachBar;

export default Carousel;
