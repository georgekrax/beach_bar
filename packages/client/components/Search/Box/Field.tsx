import { Select, SelectModalFProps } from "@hashtag-design-system/components";
import React from "react";
import styles from "./Field.module.scss";

type Props = {
  label?: string;
  value?: string;
  select?: boolean;
};

export const Field: React.FC<Props & Pick<SelectModalFProps, "align" | "className" | "onClick">> = ({
  label,
  value,
  align,
  select = true,
  className,
  onClick,
  children,
}) => {
  return (
    <div className={styles.container} onClick={onClick}>
      {!select ? (
        children
      ) : (
        <Select>
          <Select.Button>
            <div>{label}</div>
            <div>{value}</div>
          </Select.Button>
          <Select.Modal className={className} align={align}>
            {children}
          </Select.Modal>
        </Select>
      )}
    </div>
  );
};

Field.displayName = "SearchBoxField";
