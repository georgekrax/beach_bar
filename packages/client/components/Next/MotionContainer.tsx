<<<<<<< HEAD:packages/client/components/Next/MotionContainer.tsx
import { HTMLMotionProps, motion } from "framer-motion";

type FProps = HTMLMotionProps<"div">;

const MotionContainer: React.FC<FProps> = ({ children, ...props }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial" {...props}>
      {children}
    </motion.div>
  );
};

MotionContainer.displayName = "NextMotionContainer";

=======
import { HTMLMotionProps, motion } from "framer-motion";

type FProps = HTMLMotionProps<"div">;

const MotionContainer: React.FC<FProps> = ({ children, ...props }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial" {...props}>
      {children}
    </motion.div>
  );
};

MotionContainer.displayName = "NextMotionContainer";

>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff:packages/client/components/Next/Motion/Container.tsx
export const NextMotionContainer = MotionContainer;