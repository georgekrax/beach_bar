import { RadioButton, RadioButtonFProps, useClassnames } from "@hashtag-design-system/components";
import styles from "./IsDefault.module.scss";

type Props = {
  showDefault?: boolean;
  ref?: React.RefAttributes<HTMLInputElement>["ref"];
  headerProps?: React.ComponentPropsWithoutRef<"h6">;
};

type FProps = Props & RadioButtonFProps;

export const IsDefault: React.FC<FProps> = ({ showDefault = false, ref, headerProps = {}, ...props }) => {
  const [classNames, rest] = useClassnames("body-16 normal upper", headerProps);

  return (
    <div className={styles.container + " flex-row-center-center"}>
      <RadioButton ref={ref} {...props} />
      {showDefault && <h6 className={classNames} {...rest}>Default</h6>}
    </div>
  );
};

IsDefault.displayName = "AccountPaymentMethodIsDefault";
