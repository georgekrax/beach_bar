import { CarouselContextProvider, CarouselContextType } from "@/utils/contexts";
import { useElementScroll } from "framer-motion";
import { useMemo, useRef, useState } from "react";

export const Context: React.FC = ({ children }) => {
  const [items, setItems] = useState<CarouselContextType["items"]>([]);
  const ref = useRef<HTMLElement>(null);
  const { scrollX, scrollXProgress } = useElementScroll(ref);

  const visibleItems = useMemo(() => items.filter(({ isVisible }) => isVisible === true), [items]);

  const scroll = (left: number, isFirstItem: boolean) =>
    ref.current?.scrollTo({
      behavior: "smooth",
      left: left - (isFirstItem ? Math.round(left * 0.75) : Math.round(left * 0.3)),
    });

  const handleNext = () => {
    if (!ref || !ref.current) return;
    const children = ref.current.children;
    let newActive = visibleItems[visibleItems.length - 1].idx + 1;
    // >= because it is i and arr length = i + 1
    newActive = newActive >= children.length ? 0 : newActive;
    // @ts-expect-error
    const left = children[newActive].offsetLeft;
    const isFirstItem = newActive === 0;
    scroll(left, isFirstItem);
  };

  const handlePrev = () => {
    const maxIdx = Math.min(...visibleItems.map(({ idx }) => idx));
    const maxItemsIdx = items.findIndex(item => item.idx === maxIdx);
    let newActive = items[maxItemsIdx - 1].idx;
    newActive = newActive <= 0 ? 0 : newActive;
    // @ts-expect-error
    const left = ref.current?.children[newActive].offsetLeft;
    const padding = parseInt(window.getComputedStyle(ref.current!).padding.replace("px", ""));
    const isFirstItem = left - padding === 0;
    scroll(left, isFirstItem);
  };

  return (
    <CarouselContextProvider
      value={{
        containerRef: ref,
        scrollX,
        scrollXProgress,
        visibleItems,
        items,
        setItems,
        handlePrev,
        handleNext,
      }}
    >
      {children}
    </CarouselContextProvider>
  );
};

Context.displayName = "CarouselContext";
