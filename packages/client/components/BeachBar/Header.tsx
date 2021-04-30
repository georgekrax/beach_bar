import { useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

type Props = {
  as?: "h4" | "h6";
};

type FProps = Props & HTMLMotionProps<"h4">;

export const Header: React.FC<FProps> = ({ as = "h6", children, ...props }) => {
  const [classNames, rest] = useClassnames("beach_bar__header semibold", props);

  return as === "h4" ? (
    <motion.h4 className={classNames} {...rest}>
      {children}
    </motion.h4>
  ) : (
    <motion.h6 className={classNames} {...rest}>
      {children}
    </motion.h6>
  );
};

Header.displayName = "Header";
