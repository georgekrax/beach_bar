import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import { useClassnames, useDisabled } from "@hashtag-design-system/components";

export const ButtonVariants = ["primary", "secondary", "danger"] as const;
export type ButtonVariant = typeof ButtonVariants[number];
const ButtonStates = ["default", "disabled", "focus-visible", "hover"] as const;
export type ButtonState = typeof ButtonStates[number];

export type Props = {
  variant?: ButtonVariant;
  state?: ButtonState;
  block?: boolean;
  pill?: boolean;
};

export type FProps = Props & HTMLMotionProps<"button">;

const Button = React.forwardRef<HTMLButtonElement, FProps>(
  ({ variant = "primary", state = "default", block = false, pill = false, disabled, children, ...props }, ref) => {
    const [classNames, rest] = useClassnames<FProps>(
      `btn btn-${variant}${block ? " block" : ""}${pill ? " pill" : ""} btn-default-font shadow__form-2`,
      props,
      { stateToRemove: { state } }
    );

    const isDisabled = Boolean(useDisabled(props, state) || disabled);
    return (
      <motion.button
        className={classNames}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-testid="btn"
        ref={ref}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
