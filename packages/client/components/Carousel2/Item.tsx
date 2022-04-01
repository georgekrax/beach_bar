import { useCarouselContext2 } from "@/utils/contexts";
import { useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import { useMemo, useRef } from "react";
import styles from "./Item.module.scss";

// const isElementInViewport = <T extends HTMLElement = HTMLElement>(el: T, strict: boolean = false) => {
//   const { bottom, right, left, top, width } = el.getBoundingClientRect();
//   const parentRect = el.parentElement?.parentElement?.getBoundingClientRect();

//   return (
//     bottom > 0 &&
//     right > 0 &&
//     left < (window.innerWidth || document.documentElement.clientWidth) - (strict ? width : 0) &&
//     top < (window.innerHeight || document.documentElement.clientHeight) &&
//     (strict ? right - width > (parentRect?.left || 0) : true)
//   );
// };

type Props = {
  idx: number;
  overflowPadding?: HTMLMotionProps<"div">;
  animateScale?: boolean;
};

export const Item: React.FC<Props & React.ComponentPropsWithoutRef<"div">> = ({
  idx,
  overflowPadding,
  animateScale = true,
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [classNames, rest] = useClassnames(styles.container, props);
  const { visibleItems } = useCarouselContext2();

  const activeIdxs = useMemo(() => visibleItems.map(({ idx }) => idx), [visibleItems]);

  return (
    <motion.div
      {...overflowPadding}
      animate={animateScale && { scale: activeIdxs.includes(idx) ? 1.1 : 1, transition: { duration: 0.15 } }}
      className={styles.overflowPadding + (overflowPadding?.className ? " " + overflowPadding.className : "")}
    >
      <div ref={ref} className={classNames} {...rest}>
        {children}
      </div>
    </motion.div>
  );
};
