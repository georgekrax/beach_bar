<<<<<<< HEAD
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./MarginedHeader.module.scss";

export const MarginedHeader: React.FC<Pick<React.ComponentPropsWithoutRef<"h4">, "className">> = ({
  children,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.header, props);

  return <h4 className={classNames} {...rest}>{children}</h4>;
};

MarginedHeader.displayName = "NextMarginedHeader";
=======
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./MarginedHeader.module.scss";

export const MarginedHeader: React.FC<Pick<React.ComponentPropsWithoutRef<"h4">, "className">> = ({
  children,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.header, props);

  return <h4 className={classNames} {...rest}>{children}</h4>;
};

MarginedHeader.displayName = "NextMarginedHeader";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
