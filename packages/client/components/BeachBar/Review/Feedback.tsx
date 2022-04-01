import { Flex, FlexProps } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";

type Props = FlexProps & {
  isShown?: boolean;
  positive?: boolean;
};

export const Feedback: React.FC<Props> = ({ isShown, positive = false, children, ...props }) => {
  return isShown ? (
    <Flex align="center" gap={4} {...props}>
      {positive ? (
        <Icon.People.HappyFace.Filled boxSize={10} color="green.400" />
      ) : (
        <Icon.People.SadFace.Filled boxSize={10} color="gray.400" />
      )}
      {children}
    </Flex>
  ) : null;
};

Feedback.displayName = "BeachBarReviewFeedback";
