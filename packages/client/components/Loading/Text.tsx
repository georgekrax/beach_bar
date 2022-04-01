import { TextProps as ChakraTextProps } from "@hashtag-design-system/components";
import Loading, { LoadingProps } from ".";

type Props = LoadingProps & {};

export const Text: React.FC<ChakraTextProps & Props> = ({ isLoading = true, children, ...props }) => {
  return (
    <Loading as="span" display="block" width="100%" minHeight={4} borderRadius="full" {...props} isLoading={isLoading}>
      {children}
    </Loading>
  );
};

Text.displayName = "LoadingText";
