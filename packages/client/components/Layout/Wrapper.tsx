import { useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

export type FProps = HTMLMotionProps<"div"> & React.ComponentPropsWithRef<"div">;

const Wrapper = React.forwardRef<HTMLDivElement, FProps>(({ children, ...props }, ref) => {
  const [classNames, rest] = useClassnames("wrapper", props);

  return (
    <motion.div className={classNames} ref={ref} {...rest}>
      {children}
    </motion.div>
  );
});

Wrapper.displayName = "LayoutWrapper";

export default Wrapper;
