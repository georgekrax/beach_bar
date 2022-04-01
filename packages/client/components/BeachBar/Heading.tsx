import { BeachBar } from "@/graphql/generated";
import { Box, Flex, FlexProps, Heading as ChakraHeading } from "@hashtag-design-system/components";

type Props = Pick<BeachBar, "name"> &
  FlexProps & {
    city?: string;
  };

const Heading: React.FC<Props> = ({ name, city, ...props }) => {
  return (
    <Flex flexDir="column" justify="center" maxWidth="75%" mb={6} {...props}>
      <ChakraHeading as="h3" fontSize="2rem" lineHeight="100%">
        {name}
      </ChakraHeading>
      <Box color="gray.500">{city}</Box>
    </Flex>
  );
};

Heading.displayName = "BeachBarHeading";

export { Heading as BeachBarHeading };
