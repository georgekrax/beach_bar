import { motion, useReducedMotion, Variants } from "framer-motion";
import React from "react";

const variants: Variants = {
  inital: { opacity: 0 },
  animate: (hasReducedMotion: boolean) => ({
    opacity: 1,
    transition: { staggerChildren: hasReducedMotion ? 0 : 0.2, delay: 0.1 },
  }),
};

export type Props = {
  handleScroll: () => void;
  children: React.ReactNode;
};

export const Slider = React.forwardRef<HTMLDivElement, Props>(({ handleScroll, children }, sliderContainer) => {
  const hasReducedMotion = useReducedMotion();

  return (
    <section style={{ overflow: "visible", width: "fit-content" }}>
      <motion.div
        className="index__carousel__container no-scrollbar flex-row-flex-start-flex-end"
        initial="initial"
        animate="animate"
        variants={variants}
        custom={hasReducedMotion}
        ref={sliderContainer}
        onScroll={handleScroll}
      >
        {children}
      </motion.div>
    </section>
  );
});

Slider.displayName = "CarouselSlider";
