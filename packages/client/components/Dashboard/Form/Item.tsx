import { CONFIG } from "@/config/animation";
import { DASHBOARD_NEW_STEPS_ARR } from "@/config/pages";
import { HTMLMotionProps, motion } from "framer-motion";
import styles from "./Item.module.scss";

const arrLength = [DASHBOARD_NEW_STEPS_ARR.length, 1] as const;

export type Props = {
  isStep?: boolean;
  atStep?: number;
  step: typeof arrLength[number];
  progress: typeof DASHBOARD_NEW_STEPS_ARR[number][number];
};

export const Item: React.FC<Props & Pick<HTMLMotionProps<"div">, "style">> = ({
  isStep,
  atStep,
  step,
  progress,
  style,
  children,
}) => {
  const parseNum = (num: number) => `-${num}00%`;

  return (
    <motion.div
      className={styles.container + (isStep ? " " + styles.isStep : "")}
      animate={{
        x: isStep
          ? parseNum(step - 1)
          : atStep !== step && atStep && step
          ? parseNum(atStep - step - 1)
          : parseNum(progress - 1),
      }}
      transition={{ stiffness: 750, duration: CONFIG.newListingDuration }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

Item.displayName = "DashboardFormItem";
