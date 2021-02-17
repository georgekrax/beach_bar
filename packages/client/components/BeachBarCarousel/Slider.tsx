import { motion, useReducedMotion, Variants } from "framer-motion";
import { useRef } from "react";

const variants: Variants = {
  inital: { opacity: 0 },
  animate: (hasReducedMotion: boolean) => ({
    opacity: 1,
    transition: { staggerChildren: hasReducedMotion ? 0 : 0.2, delay: 0.1 },
  }),
};

export type Props = {
  setPosition: React.Dispatch<React.SetStateAction<number>>;
};

const Slider: React.FC<Props> = ({ setPosition, children }) => {
  const sliderContainer = useRef<HTMLDivElement>(null);
  const hasReducedMotion = useReducedMotion();

  const handleScroll = () => {
    const current = sliderContainer.current;
    if (sliderContainer && current) {
      const activeEl = Array.from(current.children).find(el => el.getBoundingClientRect().left > 0);

      if (activeEl) {
        const id = activeEl.children[0].children[0].getAttribute("data-id");
        if (id) {
          setPosition(parseInt(id));
        }
      }
    }
  };

  return (
    <section style={{ overflow: "visible", width: "fit-content" }}>
      <motion.div
        className="index__carousel__container no-scrollbar flex-row-flex-start-center"
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
};

Slider.displayName = "BeachBarSlider";

export default Slider;
