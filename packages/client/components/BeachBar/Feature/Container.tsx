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
