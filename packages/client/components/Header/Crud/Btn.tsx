import { Button, ButtonFProps, useClassnames } from "@hashtag-design-system/components";
import styles from "./Btn.module.scss";

type FProps = ButtonFProps;

export const Btn: React.FC<FProps> = ({ variant, children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.btn + (variant === "danger" ? " btn-secondary " + styles.danger : ""), props);

  return (
    <Button variant={variant} className={classNames} {...rest}>
      {children}
    </Button>
  );
};

Btn.displayName = "HeaderCrudBtn";
