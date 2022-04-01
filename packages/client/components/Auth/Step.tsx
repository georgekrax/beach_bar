import Next, { NextLinkProps } from "@/components/Next";
import { Box, Text } from "@hashtag-design-system/components";

export type Props = {
  description?: React.ReactNode;
  other?: { text: string; link: string; handleClick: NextLinkProps["onClick"] };
};

export const Step: React.FC<Props> = ({ description, children, other }) => {
  return (
    <>
      {description && (
        <Text as="span" color="gray.900" className="light text--center">
          {description}
        </Text>
      )}
      {children}
      {other && (
        <Box mt={4} mb={2} className="text--center">
          <span>{other.text}</span>&nbsp;
          <Next.Link isA={false} onClick={other.handleClick}>
            {other.link}
          </Next.Link>
        </Box>
      )}
    </>
  );
};

Step.displayName = "AuthStep";
