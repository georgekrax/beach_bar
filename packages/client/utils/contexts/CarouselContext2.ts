import { createCtx } from "@hashtag-design-system/components";
import React from "react";

export type CarouselContextType = {
  items: { idx: number; isVisible: boolean }[];
  setItems: React.Dispatch<React.SetStateAction<CarouselContextType["items"]>>;
  visibleItems: CarouselContextType["items"];
  containerRef: React.RefObject<HTMLElement>;
  windowWidth: number;
  parentOffset: number;
  handleBtnClick: (type: "next" | "prev") => void;
};

export const [CarouselContextProvider, useCarouselContext] = createCtx<CarouselContextType>();
