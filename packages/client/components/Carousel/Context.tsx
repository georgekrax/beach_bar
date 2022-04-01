import { CarouselContextProvider, CarouselContextType } from "@/utils/contexts";
import { getBox } from "@hashtag-design-system/components";
import { useRef, useState } from "react";

type Props = {};

export const Context: React.FC<Props> = ({ children }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [step, setStep] = useState(1);

  const trackRef = useRef<HTMLDivElement | null>(null);

  const getActive = (dir: Parameters<CarouselContextType["handleBtnClick"]>[0]) => {
    const isDrag = dir === "drag";
    const children = Array.from(trackRef.current?.children || []);
    const sorted = children
      .map((item, i) => ({ i, left: getBox(item).borderBox.left }))
      .filter(({ left }) => (!isDrag ? true : left > 0))
      .sort((a, b) => Math.abs(0 - a.left) - Math.abs(0 - b.left));
    let { i: newActiveIdx } = sorted[0] || {};
    if (!isDrag) newActiveIdx = newActiveIdx + (dir === "next" ? step : -step);
    if (dir === "next") newActiveIdx = newActiveIdx >= children.length ? 0 : newActiveIdx;
    else newActiveIdx = newActiveIdx <= 0 ? 0 : newActiveIdx;

    return { newActiveIdx, newChild: children[newActiveIdx] };
  };

  const handleDrag = () => {
    const { newActiveIdx } = getActive("drag");
    if (newActiveIdx !== activeIdx) setActiveIdx(newActiveIdx);
  };

  const handleBtnClick: CarouselContextType["handleBtnClick"] = dir => {
    const { newActiveIdx, newChild } = getActive(dir);
    if (!newChild || !trackRef.current || (newActiveIdx === 0 && activeIdx === 0)) return;
    const offsetLeft = getBox(trackRef.current).contentBox.left - getBox(newChild).marginBox.left;
    setTranslateX(Math.abs(offsetLeft));
    setActiveIdx(newActiveIdx);
  };

  return (
    <CarouselContextProvider
      value={{
        step,
        activeIdx,
        translateX,
        trackRef,
        setStep,
        handleDrag,
        handleBtnClick,
      }}
    >
      {children}
    </CarouselContextProvider>
  );
};

Context.displayName = "CarouselContext";
