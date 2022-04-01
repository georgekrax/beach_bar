import { CarouselContextType, useCarouselContext } from "@/utils/contexts";
import { callAllHandlers, IconButton, IconButtonProps } from "@hashtag-design-system/components";
import { ChevronLeftIcon, ChevronRightIcon } from "@hashtag-design-system/icons";

type Props = Partial<IconButtonProps> & {
  dir: Extract<Parameters<CarouselContextType["handleBtnClick"]>[0], "next" | "prev">;
};

export const ControlBtn: React.FC<Props> = ({ dir, ...props }) => {
  const { activeIdx, handleBtnClick } = useCarouselContext();

  return (
    <IconButton
      aria-label={(dir === "next" ? "Next" : "Previous") + " carousel item"}
      borderRadius="full"
      icon={dir === "next" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      disabled={dir === "prev" && activeIdx === 0}
      {...{ [dir === "next" ? "ml" : "mr"]: 2 }}
      {...props}
      onClick={e => callAllHandlers(() => handleBtnClick(dir), props.onClick)(e)}
    />
  );
};

ControlBtn.displayName = "CarouselControlBtn";
