import { Box, Flex } from "@hashtag-design-system/components";

type Props = {
  text?: string;
  direction?: "row" | "column";
};

// .container {
//   & > div:not(:nth-child(2)) {
//     height: 1px;
//     background-color: $grey-6;
//     border-radius: 8px;
//     flex: 1;
//   }
// }

export const OrContainer: React.FC<Props> = ({ text = "Or continue with", direction = "row" }) => {
  const isColumn = direction === "column";

  return (
    <Flex
      className="w100"
      maxWidth="25em"
      flexDirection={direction}
      justifyContent="center"
      alignItems="center"
      sx={{
        ...(isColumn && { minHeight: "100%", alignSelf: "stretch", "& > div:not(:nth-child(2))": { width: "1px" } }),
        "& > div:not(:nth-child(2))": {
          height: "1px",
          bg: "gray.400",
          borderRadius: "half",
          flex: 1,
        },
      }}
    >
      <div />
      <Box mx={3} mb={1} color="gray.600">
        {text}
      </Box>
      <div />
    </Flex>
  );
};

OrContainer.displayName = "NextOrContainer";
