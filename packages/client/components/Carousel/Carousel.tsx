import { useCarouselContext } from "@/utils/contexts";
import { useClassnames, useWindowDimensions } from "@hashtag-design-system/components";
import React from "react";
import { BeachBar } from "./BeachBar";
import styles from "./Carousel.module.scss";
import { Context } from "./Context";
import { ControlBtns } from "./ControlBtns";
import { Item } from "./Item";

type SubComponents = {
  Item: typeof Item;
  BeachBar: typeof BeachBar;
  Context: typeof Context;
  ControlBtns: typeof ControlBtns;
};

const Carousel: React.FC<Pick<React.ComponentPropsWithoutRef<"div">, "className" | "style">> & SubComponents = ({
  children,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container, props);
  const { containerRef } = useCarouselContext();
  const { width } = useWindowDimensions();

  return (
    <div className={classNames} {...rest}>
      <section
        ref={containerRef}
        className={styles.scrollableArea + " no-scrollbar flex-row-flex-start-center"}
        style={{ maxWidth: width - (containerRef.current?.parentElement?.offsetLeft || 0) + "px" }}
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

Carousel.displayName = "Carousel";

export default Carousel;
