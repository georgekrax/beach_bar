import { Flex, Select, SelectModalProps } from "@hashtag-design-system/components";
import React from "react";
import { Label } from "./Label";

type Props = {
  label?: string;
  value?: string;
  select?: boolean;
  modal?: SelectModalProps;
};

export const Field: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className" | "onClick">> = ({
  label,
  value,
  modal,
  select = false,
  onClick,
  children,
  ...props
}) => {
  return (
    <Flex
      alignItems="center"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="regular"
      onClick={onClick}
      {...props}
    >
      {!select ? (
        children
      ) : (
        <Select>
          <Select.Btn border="none">
            <Label label={label} value={value} />
          </Select.Btn>
          <Select.Modal {...modal}>{children}</Select.Modal>
        </Select>
      )}
    </Flex>
  );
};

Field.displayName = "SearchBoxField";
