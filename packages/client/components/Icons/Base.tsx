import { useClassnames } from "@hashtag-design-system/components";
import { motion, SVGMotionProps } from "framer-motion";

export type IconBaseFProps = SVGMotionProps<"svg">;

export const Base: React.FC<IconBaseFProps> = ({ children, ...props }) => {
  const [classNames, rest] = useClassnames("icon", props);

  return (
    <motion.svg
      className={classNames}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {children}
    </motion.svg>
  );
};

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
