import { useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";
import styles from "./IconBox.module.scss";

type FProps = Omit<HTMLMotionProps<"div">, "aria-label" | "ref"> & Required<Pick<HTMLMotionProps<"div">, "aria-label">>;

export const IconBox = forwardRef<HTMLDivElement, FProps>(({ children, ...props }, ref) => {
  const [classNames, rest] = useClassnames(styles.box + " flex-row-center-center", props);

  return (
    <motion.div className={classNames} ref={ref} {...rest}>
      {children}
    </motion.div>
  );
});

IconBox.displayName = "NextIconBox";