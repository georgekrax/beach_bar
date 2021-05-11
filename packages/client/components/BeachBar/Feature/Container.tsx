<<<<<<< HEAD
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./Container.module.scss";

export const Container: React.FC<Pick<React.ComponentPropsWithoutRef<"div">, "style" | "className">> = ({
  children,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container + " flex-row-flex-start-center", props);

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
};

Container.displayName = "BeachBarFeatureContainer";
=======
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./Container.module.scss";

export const Container: React.FC<Pick<React.ComponentPropsWithoutRef<"div">, "style" | "className">> = ({
  children,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container + " flex-row-flex-start-center", props);

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
};

Container.displayName = "BeachBarFeatureContainer";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
