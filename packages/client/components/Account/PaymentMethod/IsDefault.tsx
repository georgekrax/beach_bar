<<<<<<< HEAD
import { RadioButton, RadioButtonFProps, useClassnames } from "@hashtag-design-system/components";
import styles from "./IsDefault.module.scss";

export type Props = {
  showDefault?: boolean;
  ref?: React.RefAttributes<HTMLInputElement>["ref"];
  headerProps?: React.ComponentPropsWithoutRef<"h6">;
  text?: "default" | "selected";
};

export type FProps = Props & RadioButtonFProps;

export const IsDefault: React.FC<FProps> = ({ showDefault = false, ref, headerProps = {}, text = "default", ...props }) => {
  const [classNames, rest] = useClassnames("body-16 normal upper", headerProps);

  return (
    <div className={styles.container + " flex-row-center-center"}>
      <RadioButton ref={ref} {...props} />
      {showDefault && (
        <h6 className={classNames} {...rest}>
          {text}
        </h6>
      )}
    </div>
  );
};

IsDefault.displayName = "AccountPaymentMethodIsDefault";
=======
import { RadioButton, RadioButtonFProps, useClassnames } from "@hashtag-design-system/components";
import styles from "./IsDefault.module.scss";

export type Props = {
  showDefault?: boolean;
  ref?: React.RefAttributes<HTMLInputElement>["ref"];
  headerProps?: React.ComponentPropsWithoutRef<"h6">;
  text?: "default" | "selected";
};

export type FProps = Props & RadioButtonFProps;

export const IsDefault: React.FC<FProps> = ({ showDefault = false, ref, headerProps = {}, text = "default", ...props }) => {
  const [classNames, rest] = useClassnames("body-16 normal upper", headerProps);

  return (
    <div className={styles.container + " flex-row-center-center"}>
      <RadioButton ref={ref} {...props} />
      {showDefault && (
        <h6 className={classNames} {...rest}>
          {text}
        </h6>
      )}
    </div>
  );
};

IsDefault.displayName = "AccountPaymentMethodIsDefault";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
