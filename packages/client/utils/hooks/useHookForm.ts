import { SelectedItems } from "@hashtag-design-system/components";
import { useEffect } from "react";
import { RegisterOptions, UseFormRegister, UseFormReturn, UseFormUnregister } from "react-hook-form";

type UseHookFormParams = {} & Pick<UseFormReturn, "setValue" | "getValues">;

export const useHookForm = <
  T extends Record<string, unknown>,
  D extends Record<string, unknown> | undefined = T,
  S extends keyof T | undefined = undefined,
>({
  data,
  registeredFields,
  setValue,
  getValues,
  register,
  unregister,
  registerOptions,
}: UseHookFormParams & {
  data?: Partial<D extends undefined ? T : D>;
  registeredFields?: (keyof T)[];
  registerOptions?: (fieldName: keyof T) => RegisterOptions;
  register?: UseFormRegister<T>;
  unregister?: UseFormUnregister<T>;
}) => {
  const handleChange = (fieldName: keyof T, newVal: T[typeof fieldName], checkCurVal: boolean = false) => {
    const field = fieldName.toString();
    if (checkCurVal && getValues(field) === newVal) return;
    setValue(field, newVal, { shouldValidate: true, shouldDirty: true });
  };

  const handleSelect = (fieldName: NonNullable<S>, items: SelectedItems[]) => {
    const selected = items.find(({ selected }) => selected);
    if (selected) handleChange(fieldName, selected.id as T[typeof fieldName]);
  };

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => key in data && setValue(String(key as keyof T), value));
    }
  }, [Object.values(data || {}).length]);

  useEffect(() => {
    if (!registeredFields || !register || !unregister) return;
    const newArr: any[] = registeredFields.map(fieldName => String(fieldName));
    newArr.forEach(fieldName => register(fieldName, registerOptions ? registerOptions(fieldName) : {}));
    return () => unregister(newArr);
  }, [register, unregister]);

  return {
    handleChange,
    handleSelect,
  };
};
