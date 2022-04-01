import { CarouselContextProvider2, CarouselContextType2 } from "@/utils/contexts";
import { useConfig, useIsDevice } from "@/utils/hooks";
import { useMemo, useRef, useState } from "react";

export const Context: React.FC<Partial<Pick<CarouselContextType2, "windowWidth" | "parentOffset">>> = ({
  windowWidth: wWidth,
  parentOffset = 0,
  children,
}) => {
  const [items, setItems] = useState<CarouselContextType2["items"]>([]);
  const containerRef = useRef<HTMLElement>(null);
  const { isDesktop } = useIsDevice();
  const {
    variables: {
      breakpoints: { xl },
    },
  } = useConfig();

  const visibleItems = useMemo(() => items.filter(({ isVisible }) => isVisible === true), [items]);
  const windowWidth = useMemo(() => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    return wWidth ? wWidth : viewportWidth >= xl ? xl : viewportWidth;
  }, [wWidth]);

  const scroll = (left: number, isFirstItem: boolean) => {
    containerRef.current?.scrollTo({
      behavior: "smooth",
      left: left - (isFirstItem ? Math.round(left * 0.75) : isDesktop ? 0 : windowWidth * 0.2),
    });
  };

  const handleBtnClick = (type: Parameters<CarouselContextType2["handleBtnClick"]>[0]) => {
    if (!containerRef?.current) return;
    const children = containerRef.current.children;
    const leftDisArr = Array.from(children).map((cur, i) => ({ i, left: Math.abs(cur.getBoundingClientRect().left) }));
    let minDisElem = leftDisArr.reduce((prev, cur) => (prev.left < cur.left ? prev : cur)).i;
    if (type === "next") minDisElem = minDisElem + 1;
    else minDisElem = minDisElem - 1;
    // >= because it is i and arr length = i + 1
    if (type=== "next") minDisElem = minDisElem >= children.length ? 0 : minDisElem;
    else minDisElem = minDisElem <= 0 ? 0 : minDisElem;
    const left = (children[minDisElem] as HTMLElement).offsetLeft;
    const isFirstItem = minDisElem === 0;
    scroll(left, isFirstItem);
  };

  return (
    <CarouselContextProvider2
      value={{
        containerRef,
        windowWidth,
        parentOffset,
        visibleItems,
        items,
        setItems,
        handleBtnClick,
      }}
    >
      {children}
    </CarouselContextProvider2>
  );
};
