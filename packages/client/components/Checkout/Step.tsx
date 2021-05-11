<<<<<<< HEAD
import { useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";
import styles from "./Step.module.scss";

type Props = {
  children: React.ReactNode;
};

export const Step = forwardRef<
  HTMLDivElement,
  Props &
    Pick<HTMLMotionProps<"div">, "onClick" | "className" | "style"> &
    Required<Pick<NonNullable<HTMLMotionProps<"div">["style"]>, "opacity">>
>(({ opacity, style, children, onClick, ...props }, ref) => {
  const [classNames, rest] = useClassnames(styles.container, props);

  return (
    <motion.div className={classNames} ref={ref} style={{ ...style, opacity }} onClick={e => onClick && onClick(e)} {...rest}>
      {children}
    </motion.div>
  );
});

Step.displayName = "CheckoutStep";
=======
import { useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";
import styles from "./Step.module.scss";

type Props = {
  children: React.ReactNode;
};

export const Step = forwardRef<
  HTMLDivElement,
  Props &
    Pick<HTMLMotionProps<"div">, "onClick" | "className" | "style"> &
    Required<Pick<NonNullable<HTMLMotionProps<"div">["style"]>, "opacity">>
>(({ opacity, style, children, onClick, ...props }, ref) => {
  const [classNames, rest] = useClassnames(styles.container, props);

  return (
    <motion.div className={classNames} ref={ref} style={{ ...style, opacity }} onClick={e => onClick && onClick(e)} {...rest}>
      {children}
    </motion.div>
  );
});

Step.displayName = "CheckoutStep";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
