import { useClassnames } from "@hashtag-design-system/components";
import styles from "./PickerAndLabel.module.scss";

export type Props = {
  label: string;
};

export type FProps = Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">;

export const PickerAndLabel: React.FC<FProps> = ({ label, children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container, props);

  return (
    <div className={classNames} {...rest}>
      <label className="d--block input__floating-placeholder">{label}</label>
      {children}
    </div>
  );
};

PickerAndLabel.displayName = "SearchFormPickerAndLabel";
