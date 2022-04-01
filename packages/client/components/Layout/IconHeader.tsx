import { Flex, FlexProps } from "@hashtag-design-system/components";

type Props = FlexProps & {
  before?: FlexProps;
  after?: FlexProps;
};

const IconHeader: React.FC<Props> = ({ before, after, children, ...props }) => {
  return (
    <Flex justify="space-between" align="flex-start" {...props}>
      {before && (
        <Flex justify="center" align="center" gap={4} {...before}>
          {before.children}
        </Flex>
      )}
      {children}
      {after && (
        <Flex justify="center" align="center" gap={4} {...after}>
          {after.children}
        </Flex>
      )}
    </Flex>
  );
};

IconHeader.displayName = "LayoutIconHeader";

export { IconHeader as LayoutIconHeader };
