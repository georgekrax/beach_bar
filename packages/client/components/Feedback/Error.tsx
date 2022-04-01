import { Text, TextProps } from "@hashtag-design-system/components";

export type Props = TextProps;

export const Error: React.FC<Props> = ({ children, ...props }) => {
  return (
    <Text as="span" display="inline-block" alignSelf="center" textAlign="center" color="error" {...props}>
      {children}
    </Text>
  );
};

Error.displayName = "FeedbackError";
