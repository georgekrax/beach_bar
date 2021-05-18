import Icons from "@/components/Icons";
import { useCarouselContext } from "@/utils/contexts";
import { Button, useClassnames } from "@hashtag-design-system/components";
import { useMemo } from "react";
import styles from "./ControlBtns.module.scss";

export const ControlBtns: React.FC<Pick<React.ComponentPropsWithoutRef<"div">, "className" | "style">> = props => {
  const [classNames, rest] = useClassnames(styles.btns + " flex-row-flex-start-center", props);

  const { items, visibleItems, handlePrev, handleNext } = useCarouselContext();

  const isBtnDisabled = useMemo(() => {
    const min = Math.min(...items.map(({ idx }) => idx));
    return visibleItems.find(({ idx }) => idx === min) !== undefined;
  }, [items]);
  const hiddenItems = useMemo(() => items.filter(({ isVisible }) => !isVisible), [items]);

  return hiddenItems.length < 1 ? null : (
    <div className={classNames} {...rest}>
      <Button
        variant="secondary"
        disabled={isBtnDisabled}
        aria-label="Next slide of #beach_bars"
        onClick={() => handlePrev()}
      >
        <Icons.Chevron.Left width={16} height={16} />
      </Button>
      <Button variant="secondary" aria-label="Previous slide of #beach_bars" onClick={() => handleNext()}>
        <Icons.Chevron.Right width={16} height={16} />
      </Button>
    </div>
  );
};

ControlBtns.displayName = "CarouselControlBtns";
