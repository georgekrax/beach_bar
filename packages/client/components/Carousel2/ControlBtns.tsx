import Icons from "@/components/Icons";
import { useCarouselContext2 } from "@/utils/contexts";
import { Button, useClassnames } from "@hashtag-design-system/components";
import { useMemo } from "react";
import styles from "./ControlBtns.module.scss";

const SIZE = 16;

export const ControlBtns: React.FC<Pick<React.ComponentPropsWithoutRef<"div">, "className" | "style">> = props => {
  const [classNames, rest] = useClassnames(styles.btns + " flex-row-flex-start-center", props);

  const { items, visibleItems, handleBtnClick } = useCarouselContext2();

  const isBtnDisabled = useMemo(() => {
    const mappedArr = items.map(({ idx }) => idx);
    const min = Math.min(...mappedArr);
    const max = Math.max(...mappedArr);
    return {
      prev: visibleItems.some(({ idx }) => idx === min),
      next: visibleItems.some(({ idx }) => idx === max),
    };
  }, [items]);
  const hiddenItems = useMemo(() => items.filter(({ isVisible }) => !isVisible), [items]);

  return hiddenItems.length < 1 ? null : (
    <div className={classNames} {...rest}>
      <Button
        variant="secondary"
        disabled={isBtnDisabled.prev}
        aria-label="Next slide of #beach_bars"
        onClick={() => handleBtnClick("prev")}
      >
        <Icons.Chevron.Left width={SIZE} height={SIZE} />
      </Button>
      <Button
        variant="secondary"
        disabled={isBtnDisabled.next}
        aria-label="Previous slide of #beach_bars"
        onClick={() => handleBtnClick("next")}
      >
        <Icons.Chevron.Right width={SIZE} height={SIZE} />
      </Button>
    </div>
  );
};
