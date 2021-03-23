import Section from "@/components/Section";
import { Button } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Slider } from "../../Carousel";
import Icons from "../../Icons";
import styles from "./Header.module.scss";

type ChildrenOptions = {
  position: number;
  itemsRef: React.MutableRefObject<HTMLDivElement[] | null[]>;
  handleClick: (i: number) => void;
};

type Props = {
  header?: boolean | React.ReactNode;
  // headerSuffix?: React.ReactNode;
  children: (options: ChildrenOptions) => React.ReactNodeArray;
};

type FProps = Props & HTMLMotionProps<"div">;

export const Header = React.forwardRef<HTMLDivElement, FProps>(({ header, children, ...props }, headerRef) => {
  const [position, setPosition] = useState(0);
  const [itemsDistance, setItemsDistance] = useState<number[]>([]);
  const sliderContainer = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[] | null[]>([]);

  const handleClick = (direction?: "previous" | "next", i?: number) => {
    if (sliderContainer && sliderContainer.current && itemsRef && itemsRef.current) {
      const next = i !== undefined ? i : position + (direction === "previous" ? -1 : 1);
      if (!(direction === "previous" && position === 0)) {
        const distance = itemsDistance[next];
        sliderContainer.current.scrollTo({ left: distance - 48, behavior: "smooth" });
      }
    }
  };

  const handleScroll = () => {
    const current = sliderContainer.current;
    if (sliderContainer && current) {
      const activeEl = Array.from(current.children).find(el => el.getBoundingClientRect().left > 0);
      if (activeEl) {
        const id = activeEl.getAttribute("data-id");
        if (id) setPosition(parseInt(id));
      }
    }
  };

  useEffect(() => {
    if (itemsRef && itemsRef.current) {
      setItemsDistance(
        Array.from(itemsRef.current).map(
          el => (el?.getBoundingClientRect().left || 0) - (el?.parentElement?.getBoundingClientRect().left || 0) * 2
        )
      );
    }
  }, []);

  return (
    <motion.div {...props}>
      {header && (
        <>
          <div className={styles.container + " flex-row-space-between-flex-end"}>
            <Section.PageHeader ref={headerRef}>
              {header}
              {/* <p>Places you will love for your next visit</p> */}
            </Section.PageHeader>
            <div className={styles.btns + " flex-row-center-center"}>
              <Button variant="secondary" onClick={() => handleClick("previous")}>
                <Icons.Chevron.Left width={10} height={10} />
              </Button>
              <Button variant="secondary" onClick={() => handleClick("next")}>
                <Icons.Chevron.Right width={10} height={10} />
              </Button>
            </div>
          </div>
          {/* {headerSuffix} */}
        </>
      )}
      <Slider ref={sliderContainer} handleScroll={handleScroll}>
        {children({ position, itemsRef, handleClick: i => handleClick(undefined, i) })}
        <div className={styles.spacer} />
      </Slider>
    </motion.div>
  );
});

Header.displayName = "IndexHeader";
