import { Flex, FlexProps } from "@hashtag-design-system/components";

export const Container: React.FC<FlexProps> = ({ children, ...props }) => {
  // &::before {
  //   content: "";
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 40px;
  //   height: 1px;
  //   background-color: $grey-6;
  // }
  return (
    <Flex align="center" position="relative" wrap="wrap" gap={3} mt={4} {...props}>
      {children}
    </Flex>
  );
};

Container.displayName = "BeachBarFeatureContainer";
