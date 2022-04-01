import { Box, Form } from "@hashtag-design-system/components";

const ACTIVE_STYLE = {
  color: "gray.700",
  fontWeight: "semibold",
} as const;

type Props = {
  label?: string;
  value?: string;
};

export const Label: React.FC<Props> = ({ label, value, children }) => {
  return (
    <Form.Control
      display="flex"
      flexDir="column"
      alignSelf="stretch"
      justifyContent="space-between"
      sx={{ "+ svg": { display: "none" }, input: ACTIVE_STYLE }}
    >
      <Form.Label m={0} color="gray.500" fontWeight="normal" fontSize="xs" lineHeight="base" cursor="pointer">
        {label}
      </Form.Label>
      {children ?? (
        <Box mb={2} {...ACTIVE_STYLE}>
          {value}
        </Box>
      )}
    </Form.Control>
  );
};

Label.displayName = "SearchBoxLabel";
