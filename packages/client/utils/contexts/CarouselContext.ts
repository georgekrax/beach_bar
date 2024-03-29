import { createCtx } from "@hashtag-design-system/components";
import { ScrollMotionValues } from "framer-motion";
import React from "react";

export type CarouselContextType = {
  items: { idx: number; isVisible: boolean }[];
  setItems: React.Dispatch<React.SetStateAction<CarouselContextType["items"]>>;
  visibleItems: CarouselContextType["items"];
  containerRef: React.RefObject<HTMLElement>;
  handlePrev: () => void;
  handleNext: () => void;
} & Pick<ScrollMotionValues, "scrollX" | "scrollXProgress">;

export const [CarouselContextProvider, useCarouselContext] = createCtx<CarouselContextType>();
