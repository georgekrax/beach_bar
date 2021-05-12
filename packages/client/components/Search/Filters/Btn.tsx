import { useSearchContext } from "@/utils/contexts";
import { useIsDesktop } from "@/utils/hooks";
import { Button, ButtonFProps, Checkbox, useClassnames } from "@hashtag-design-system/components";
import React, { useEffect, useState } from "react";
import { SEARCH_ACTIONS } from "../reducer";
import styles from "./Btn.module.scss";

export type Props = {
  id: string;
  label: string;
  checkbox?: boolean;
  onClick?: (btn: { id: string; isChecked: boolean }, e: Parameters<NonNullable<ButtonFProps["onClick"]>>["0"]) => void;
};

export const Btn: React.FC<Props & Pick<ButtonFProps, "className">> = ({ id, label, checkbox = true, onClick, children, ...props }) => {
  const { filterPublicIds, dispatch } = useSearchContext();
  const [isChecked, setIsChecked] = useState(false);
  const [classNames, rest] = useClassnames(styles.btn, props);
  const isDesktop = useIsDesktop();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newVal = !isChecked;
    setIsChecked(newVal);
    if (onClick) onClick({ id, isChecked: newVal }, e);
    else dispatch({ type: SEARCH_ACTIONS.TOGGLE_FILTER, payload: { id, bool: newVal } });
  };

  useEffect(() => setIsChecked(filterPublicIds.includes(id)), [id, filterPublicIds]);

  return checkbox && isDesktop ? (
    <Checkbox
      className={classNames + " " + styles.checkbox}
      onChange={e => handleClick(e as any)}
      checked={isChecked}
      label={{ gap: "0.65em", value: label }}
      {...rest}
    />
  ) : (
    <Button
      className={classNames}
      variant="secondary"
      onClick={e => handleClick(e)}
      data-ischecked={isChecked}
      {...rest}
    >
      {children}
      {label}
    </Button>
  );
};

Btn.displayName = "SearchFiltersBtn";
