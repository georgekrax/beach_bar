import { useSearchContext } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { Button, ButtonProps, Checkbox, CheckboxProps } from "@hashtag-design-system/components";
import React, { memo } from "react";
import { SEARCH_ACTIONS } from "../reducer";

export type Props = Omit<ButtonProps | CheckboxProps, "label"> & {
  id: string;
  label: string;
  isCheckbox?: boolean;
  defaultChecked?: boolean;
  onClick?: (e: React.ChangeEvent<HTMLInputElement>, btn: { id: string; isChecked: boolean }) => void;
};

export const Btn: React.FC<Props> = memo(
  ({ id, label, isCheckbox: _isCheckbox = true, defaultChecked = false, onClick, children, ...props }) => {
    const { isDesktop } = useIsDevice();
    const isCheckbox = _isCheckbox && isDesktop;
    // const [isChecked, setIsChecked] = useState(defaultChecked);

    const {
      _query: { filterIds },
      map: { isDialogShown, filterPublicIds },
      dispatch,
      handleFilterIds,
    } = useSearchContext();

    const isChecked = filterIds.includes(id);

    const handleClick = async (e: React.ChangeEvent<HTMLInputElement>, isBtn = false) => {
      const newVal = isBtn ? !isChecked : !(e.target.value === "true");
      onClick?.(e, { id, isChecked: newVal });
      if (e.isDefaultPrevented()) return;
      // setIsChecked(newVal);
      // else dispatch({ type: SEARCH_ACTIONS.TOGGLE_FILTER, payload: { id, bool: newVal } });
      if (isDialogShown) dispatch({ type: SEARCH_ACTIONS.TOGGLE_MAP_FILTER, payload: { id, bool: newVal } });
      else await handleFilterIds(id);
    };

    // useEffect(() => {
    //   const newBool = (isDialogShown ? filterPublicIds : filterIds).includes(id);
    //   if (newBool !== isChecked) setIsChecked(newBool);
    // }, [id, isDialogShown, filterPublicIds.length, filterIds.length]);

    return isCheckbox ? (
      <Checkbox isChecked={isChecked} spacing={2.5} {...(props as any)} onChange={handleClick}>
        {label}
      </Checkbox>
    ) : (
      <Button
        boxShadow="none"
        bg={isChecked ? "orange.500" : undefined}
        borderColor={isChecked ? "orange.500" : undefined}
        color={isChecked ? "white" : undefined}
        {...(props as any)}
        _hover={{ bg: isChecked ? "orange.500" : undefined, ...props._hover }}
        onClick={e => handleClick(e as any, true)}
      >
        {children}
        {label}
      </Button>
    );
  }
);

Btn.displayName = "SearchFiltersBtn";
