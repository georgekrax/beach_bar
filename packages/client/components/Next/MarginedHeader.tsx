import { Text, TextProps } from "@hashtag-design-system/components";

export const MarginedHeader: React.FC<TextProps> = ({ children, ...props }) => {
  // font-size: map-get($rem-spacers, 32);
  return (
    <Text as="h4" mt={8} fontSize="3xl" color="gray.800" {...props}>
      {children}
    </Text>
  );
};

MarginedHeader.displayName = "NextMarginedHeader";
