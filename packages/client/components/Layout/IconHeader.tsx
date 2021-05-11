import styles from "./IconHeader.module.scss";

type Props = {
  before?: React.ReactNode;
  after?: React.ReactNode;
};

const IconHeader: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">> = ({
  before,
  after,
  className,
  children,
}) => {
  return (
    <div className={styles.container + " flex-row-space-between-center" + (className ? " " + className : "")}>
      <div className="flex-row-center-center">{before}</div>
      {children}
      <div className="flex-row-center-center">{after}</div>
    </div>
  );
};

IconHeader.displayName = "LayoutIconHeader";

export { IconHeader as LayoutIconHeader };
