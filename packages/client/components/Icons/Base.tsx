import { useClassnames } from "@hashtag-design-system/components";
import { motion, SVGMotionProps } from "framer-motion";
import React from "react";
import { DATA } from "@/config/data";

const { ICON_SIZE, ICON_SIZE_LG } = DATA;

export type Props = {
  large?: boolean;
};

export type IconBaseFProps = Props & SVGMotionProps<"svg">;

export const Base: React.FC<IconBaseFProps> = React.memo(({ large, children, ...props }) => {
  const [classNames, rest] = useClassnames("icon", props);

  return (
    <motion.svg
      className={classNames}
      width={large ? ICON_SIZE_LG : ICON_SIZE}
      height={large ? ICON_SIZE_LG : ICON_SIZE}
      viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {children}
    </motion.svg>
  );
});

Base.displayName = "IconBase";

export type IconPathBaseFProps = React.ComponentPropsWithoutRef<"path"> & { filled?: boolean };

export const PathBase: React.FC<IconPathBaseFProps> = ({ filled = false, children, ...props }) => {
  const [classNames, rest] = useClassnames(filled ? "filled" : "", props);

  return <path className={classNames} {...rest} />;
};

PathBase.displayName = "PathBaseIcon";

export type IconCircleBaseFProps = React.ComponentPropsWithoutRef<"circle"> & { filled?: boolean };

export const CircleBase: React.FC<IconCircleBaseFProps> = ({ filled = false, children, ...props }) => {
  const [classNames, rest] = useClassnames(filled ? "filled" : "", props);

  return <circle className={classNames} {...rest} />;
};

CircleBase.displayName = "CircleBaseIcon";
