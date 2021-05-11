import React from "react";
import styles from "./PageHeader.module.scss";

type Props = {
  children: React.ReactNode;
};

export const PageHeader = React.forwardRef<HTMLDivElement, Props>(({ children }, ref) => {
  return (
    <div ref={ref} className={styles.header}>
      <h4>{children}</h4>
    </div>
  );
});

PageHeader.displayName = "PageHeader";
