import { Flex, FlexProps, Box } from "@hashtag-design-system/components";

type Props = FlexProps & {
  info?: string;
};

export const Info: React.FC<Props> = ({ info, children, ...props }) => {
  return (
    <Flex justify="space-between" mb={3} {...props}>
      <Box color="gray.600">{info}</Box>
      <Box fontSize="lg">
        {children}
      </Box>
    </Flex>
  );
};

Info.displayName = "AccountTripsInfo";
