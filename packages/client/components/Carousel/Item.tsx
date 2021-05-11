<<<<<<< HEAD
import { useCarouselContext } from "@/utils/contexts";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
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
};

export const Item: React.FC<Props> = ({ idx, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollXProgress, items, visibleItems, setItems } = useCarouselContext();

  const activeIdxs = useMemo(() => visibleItems.map(({ idx }) => idx), [visibleItems]);

  const handleElemScroll = () => {
    const current = ref.current;
    if (!ref || !current) return;
    const { bottom, right, left, top, width } = current.getBoundingClientRect();
    const parentRect = current.parentElement?.parentElement?.getBoundingClientRect();

    const bool =
      bottom > 0 &&
      right > 0 &&
      left < (window.innerWidth || document.documentElement.clientWidth) - width &&
      top < (window.innerHeight || document.documentElement.clientHeight) &&
      right - width > (parentRect?.left || 0);
      
    setItems(prev => prev.map(item => (item.idx === idx ? { ...item, isVisible: bool } : item)));
  };

  useEffect(() => {
    if (items.filter(item => item.idx === idx).length === 0) setItems(prev => [...prev, { idx, isVisible: false }]);
  }, [idx]);

  useEffect(() => {
    handleElemScroll();

    return () => setItems(items.filter(item => item.idx !== idx));
  }, []);

  useEffect(() => {
    scrollXProgress.onChange(() => handleElemScroll());
  }, [scrollXProgress]);

  return (
    <motion.div
      animate={{ scale: activeIdxs.includes(idx) ? 1.1 : 1, transition: { duration: 0.2 } }}
      className={styles.overflowPadding}
    >
      <div ref={ref} className={styles.container}>
        {children}
      </div>
    </motion.div>
  );
};

Item.displayName = "CarouselItem";
=======
import { useCarouselContext } from "@/utils/contexts";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
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
};

export const Item: React.FC<Props> = ({ idx, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollXProgress, items, visibleItems, setItems } = useCarouselContext();

  const activeIdxs = useMemo(() => visibleItems.map(({ idx }) => idx), [visibleItems]);

  const handleElemScroll = () => {
    const current = ref.current;
    if (!ref || !current) return;
    const { bottom, right, left, top, width } = current.getBoundingClientRect();
    const parentRect = current.parentElement?.parentElement?.getBoundingClientRect();

    const bool =
      bottom > 0 &&
      right > 0 &&
      left < (window.innerWidth || document.documentElement.clientWidth) - width &&
      top < (window.innerHeight || document.documentElement.clientHeight) &&
      right - width > (parentRect?.left || 0);
      
    setItems(prev => prev.map(item => (item.idx === idx ? { ...item, isVisible: bool } : item)));
  };

  useEffect(() => {
    if (items.filter(item => item.idx === idx).length === 0) setItems(prev => [...prev, { idx, isVisible: false }]);
  }, [idx]);

  useEffect(() => {
    handleElemScroll();

    return () => setItems(items.filter(item => item.idx !== idx));
  }, []);

  useEffect(() => {
    scrollXProgress.onChange(() => handleElemScroll());
  }, [scrollXProgress]);

  return (
    <motion.div
      animate={{ scale: activeIdxs.includes(idx) ? 1.1 : 1, transition: { duration: 0.2 } }}
      className={styles.overflowPadding}
    >
      <div ref={ref} className={styles.container}>
        {children}
      </div>
    </motion.div>
  );
};

Item.displayName = "CarouselItem";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
