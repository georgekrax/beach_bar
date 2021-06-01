import { HTMLMotionProps, motion } from "framer-motion";

type FProps = HTMLMotionProps<"div">;

export const MotionContainer: React.FC<FProps> = ({ children, ...props }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial" {...props}>
      {children}
    </motion.div>
  );
};

MotionContainer.displayName = "NextMotionContainer";

export const NextMotionContainer = MotionContainer;