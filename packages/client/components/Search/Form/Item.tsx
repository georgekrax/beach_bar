import { SearchPickerAndLabelFProps } from "./index";
import styles from "./Item.module.scss";
import { PickerAndLabel } from "./PickerAndLabel";

type Props = {
  picker: SearchPickerAndLabelFProps & Pick<React.ComponentPropsWithoutRef<"div">, "onClick"> & {
    content: string;
  };
  before?: React.ReactNode;
};

export const Item: React.FC<Props> = ({ before, picker: { label, content, onClick, ...rest }, children }) => {
  return (
    <div className={styles.container + " flex-row-space-between-stretch"}>
      {before}
      <PickerAndLabel label={label} {...rest}>
        <div className="header-6" onClick={e => onClick && onClick(e)}>
          {content}
        </div>
      </PickerAndLabel>
      {children}
    </div>
  );
};

Item.displayName = "SearchFormItem";
