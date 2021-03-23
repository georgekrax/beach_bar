import { HTMLMotionProps, motion } from "framer-motion";

type FProps = HTMLMotionProps<"div">;

export const Container: React.FC<FProps> = ({ children, ...props }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial" {...props}>
      {children}
    </motion.div>
  );
};

Container.displayName = "NextMotionContainer";
