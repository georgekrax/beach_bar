import Icons from "@/components/Icons";
import Tippy, { TippyProps } from "@tippyjs/react";

export type Props = {
  type?: "info" | "question";
} & TippyProps;

export const Tooltip: React.FC<Props> = ({ type, children, ...props }) => {
  return (
    <Tippy {...props}>
      {type ? (
        type === "info" ? (
          <div className="flex-row-center-center">
            <Icons.Info />
          </div>
        ) : (
          <div className="flex-row-center-center">
            <Icons.Question />
          </div>
        )
      ) : (
        children
      )}
    </Tippy>
  );
};

Tooltip.displayName = "NextTooltip";
