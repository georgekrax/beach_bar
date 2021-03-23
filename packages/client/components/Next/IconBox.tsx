import { useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import styles from "./IconBox.module.scss";

type FProps = HTMLMotionProps<"div">;

export const IconBox: React.FC<FProps> = ({ children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.box + " flex-row-center-center", props);

  return <motion.div className={classNames} {...rest}>{children}</motion.div>;
};

IconBox.displayName = "NextIconBox";
