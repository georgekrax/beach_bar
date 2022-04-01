import { Box, Heading, HeadingProps } from "@hashtag-design-system/components";
import React from "react";

type Props = HeadingProps & {
  children: React.ReactNode;
};

export const PageHeader = React.forwardRef<HTMLDivElement, Props>(({ children, ...props }, ref) => {
  return (
    <Box ref={ref} maxWidth="65%" width="fit-content" height="fit-content">
      <Heading as="h4" size="lg" textTransform="none" mb={1} {...props}>
        {children}
      </Heading>
    </Box>
  );
});

PageHeader.displayName = "PageHeader";
