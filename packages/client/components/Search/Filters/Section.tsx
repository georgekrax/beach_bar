import { Box, BoxProps, Text } from "@hashtag-design-system/components";

export type Props = BoxProps & {
  header?: string;
};

export const Section: React.FC<Props> = ({ header, children, ...props }) => (
  <Box
    {...props}
    _last={{ "& > div": { mb: 0 } }}
    sx={{
      ...props.sx,
      "&:nth-of-type(3), &:nth-of-type(4)": { "& > div": { flexDir: "column" } },
      "& > div": {
        gap: { base: 4, md: 3 },
        mt: { base: 4, md: 3 },
        mb: { base: 12, md: 8 },
        ...props.sx?.["& > div"],
      },
    }}
  >
    {header && (
      <Text as="h6" color="gray.800" fontSize={{ md: "md" }} className="semibold">
        {header}
      </Text>
    )}
    {children}
  </Box>
);

Section.displayName = "SearchFiltersSection";
