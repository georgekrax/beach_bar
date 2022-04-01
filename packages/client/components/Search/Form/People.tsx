import { useSearchFormContext } from "@/utils/contexts";
import { formatPeopleAdults, formatPeopleChilden, formatPeopleShort } from "@/utils/search";
import { Box, Flex, Input, InputIncrDcrGroupProps, Select, Text } from "@hashtag-design-system/components";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Label } from "../Box/Label";

export const People: React.FC = () => {
  const { query } = useRouter();
  const { people, handlePeopleChange } = useSearchFormContext();

  const { qAdults, qChildren } = useMemo(() => ({ qAdults: query.adults, qChildren: query.children }), [query]);

  return (
    <Select>
      <Select.Btn>
        <Label label="People" value={formatPeopleShort(people)} />
      </Select.Btn>
      {/* className: styles.people, align: atBeach ? "left" : "right" */}
      <Select.Modal align="center">
        <Select.Options gap={5} p={2.5} minWidth={280}>
          <Row
            quantity={people?.adults || 1}
            heading={formatPeopleAdults(people?.adults)}
            description={<>12 years old &amp; more</>}
            input={{
              min: 1,
              max: 12,
              defaultValue: qAdults ? +qAdults.toString() : 1,
              onChange: newVal => handlePeopleChange("adults", newVal),
            }}
          />
          <Row
            quantity={people?.children || 0}
            heading={formatPeopleChilden(people?.children)}
            description="Less than 12 years old"
            input={{
              min: 0,
              max: 8,
              defaultValue: qChildren ? +qChildren.toString() : 0,
              onChange: newVal => handlePeopleChange("children", newVal),
            }}
          />
        </Select.Options>
      </Select.Modal>
    </Select>
  );
};

People.displayName = "SearchFormPeople";

type RowProps = {
  quantity: number;
  heading: string;
  description: React.ReactNode;
  input: Pick<InputIncrDcrGroupProps, "min" | "max" | "defaultValue" | "onChange">;
};

export const Row: React.FC<RowProps> = ({ quantity, heading, description, input }) => (
  <Flex justifyContent="space-between" alignItems="center" whiteSpace="nowrap">
    <Flex justifyContent="center" alignItems="center">
      <Text as="span" width={6} textAlign="center" color="brand.secondary" fontWeight="semibold" fontSize="xl">
        {quantity}
      </Text>
      <Flex flexDirection="column" justifyContent="inherit" ml={3} mr={8}>
        <Box fontSize="sm">{heading}</Box>
        <Text as="span" color="gray.600" fontSize="xs">
          {description}
        </Text>
      </Flex>
    </Flex>
    <Input.IncrDcrGroup
      {...input}
      justifyContent="flex-end"
      flex={1}
      sx={{
        button: {
          maxWidth: 6,
          maxHeight: 6,
          minWidth: "unset",
          padding: "0px !important",
          borderRadius: "full",
          svg: { boxSize: 2.5 },
        },
      }}
    >
      {/* <Input.IncrDcrStepper colorScheme="blue" color="white" type="decrement" /> */}
      <Input.IncrDcrStepper type="decrement" />
      <Input.IncrDcrStepper type="increment" />
    </Input.IncrDcrGroup>
  </Flex>
);

Row.displayName = "SearchFormPeopleRow";
