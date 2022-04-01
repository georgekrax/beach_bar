import { Box, BoxProps } from "@hashtag-design-system/components";
import { useMemo } from "react";
import { Text } from "./Text";

type SubComponents = {
  Text: typeof Text;
};

export type Props = {
  isLoading?: boolean;
  children?: React.ReactNode | ((hasLoaded: boolean) => React.ReactNode);
};

const Loading: React.FC<BoxProps & Props> & SubComponents = ({ isLoading = true, children: _children, ...props }) => {
  const children = useMemo(
    () => (_children && typeof _children === "function" ? _children(!isLoading) : _children),
    [isLoading, _children?.toString().length]
  );

  return isLoading ? (
    <Box bg="loading" {...props}>
      {children}
    </Box>
  ) : (
    <>{children}</>
  );
};

Loading.displayName = "Loading";

Loading.Text = Text;

export default Loading;
