import { createCtx } from "@hashtag-design-system/components";

export type CarouselContextType = {
  step: number;
  activeIdx: number;
  translateX: number;
  trackRef: React.MutableRefObject<HTMLDivElement | null>;
  setStep: React.Dispatch<React.SetStateAction<CarouselContextType["step"]>>;
  handleDrag: () => void;
  handleBtnClick: (dir: "drag" | "next" | "prev") => void;
};

export const [CarouselContextProvider, useCarouselContext] = createCtx<CarouselContextType>();
