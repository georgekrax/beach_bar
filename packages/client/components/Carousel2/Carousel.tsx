import { useCarouselContext2 } from "@/utils/contexts";
import { isInViewport, useClassnames, useWindowDimensions } from "@hashtag-design-system/components";
import { throttle } from "lodash";
import React, { useEffect, useState } from "react";
import { BeachBar } from "./BeachBar";
import styles from "./Carousel.module.scss";
import { Context } from "./Context";
import { ControlBtns } from "./ControlBtns";
import { Item } from "./Item";
import { Visit } from "./Visit";

type SubComponents = {
  Item: typeof Item;
  BeachBar: typeof BeachBar;
  Context: typeof Context;
  ControlBtns: typeof ControlBtns;
  Visit: typeof Visit;
};

type Props = {
  maxWidth?: React.CSSProperties["maxWidth"];
};

const Carousel: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className" | "style">> & SubComponents =
  ({ maxWidth, children, ...props }) => {
    const [height, setHeight] = useState(0);
    const [classNames, rest] = useClassnames(styles.container, props);
    const { containerRef, items, windowWidth, parentOffset, setItems } = useCarouselContext2();
    const { width } = useWindowDimensions();

    const handleScroll = throttle(
      () => {
        if (!containerRef.current?.children) return;
        items.forEach(({ idx }) => {
          const containerChildren = Array.from(containerRef.current?.children || []);
          let bool = items.length <= 1 || containerChildren.length === 0;
          if (!bool) {
            const current = containerChildren[idx].children[0];
            const { bottom, right, left, top, width } = current.getBoundingClientRect();
            const parentRect = containerRef.current?.getBoundingClientRect();

            bool =
              bottom > 0 &&
              right > 0 &&
              left - parentOffset < windowWidth - width &&
              top < (window.innerHeight || document.documentElement.clientHeight) &&
              right - width > (parentRect?.left || 0);
          }

          setItems(prev => prev.map(item => (item.idx === idx ? { ...item, isVisible: bool } : item)));
        });
      },
      200,
      { leading: false }
    );

    useEffect(() => handleScroll(), [items.length]);

    useEffect(() => {
      const newHeight = containerRef.current?.offsetHeight || 0;
      if (newHeight !== height) setHeight(newHeight);
    });

    useEffect(() => {
      if (!containerRef.current) return;
      const containerChildren = Array.from(containerRef.current.children);
      const containerChildrenLength = containerChildren.length;
      containerChildren.forEach((_, i) => {
        if (items.filter(({ idx }) => idx === i).length === 0) {
          setItems(prev => [...prev, { idx: i, isVisible: false }]);
        }
      });
      if (items.some(({ idx }) => idx >= containerChildrenLength)) {
        setItems(prev => prev.filter(({ idx }) => idx < containerChildrenLength));
      }
    }, [containerRef.current?.childElementCount]);

    return (
      <div className={classNames} {...rest} style={{ ...rest.style, height }}>
        <section
          ref={containerRef}
          className={styles.scrollableArea + " no-scrollbar h100 flex-row-flex-start-center"}
          style={{ maxWidth: maxWidth ? maxWidth : width - (containerRef.current?.parentElement?.offsetLeft || 0) }}
          onScroll={handleScroll}
        >
          {children}
        </section>
      </div>
    );
  };

Carousel.Item = Item;
Carousel.BeachBar = BeachBar;
Carousel.Context = Context;
Carousel.ControlBtns = ControlBtns;
Carousel.Visit = Visit;

export default Carousel;
