import { CarouselItemProps } from "@/components/HeyCarousel";
import { useCycle, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

type Options = Required<Pick<CarouselItemProps, "active">>;

export const useCarouselItem = ({ active }: Options) => {
  const hasReducedMotion = useReducedMotion();
  const [scale, cycleScale] = useCycle(hasReducedMotion ? 1 : 0.9, 1);

  useEffect(() => {
    if (hasReducedMotion || active) {
      cycleScale();
    } else {
      cycleScale(0);
    }
  }, [hasReducedMotion, active]);

  return [scale];
};
