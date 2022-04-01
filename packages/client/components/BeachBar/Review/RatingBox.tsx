import { BeachBar } from "@/graphql/generated";
import { genReviewRating } from "@/utils/format";
import { getRatingColor } from "@/utils/styles";
import { Flex, FlexProps } from "@hashtag-design-system/components";
import { useMemo } from "react";

type Props = Pick<BeachBar, "avgRating"> &
  FlexProps & {
    atBeach?: boolean;
  };

export const RatingBox: React.FC<Props> = ({ avgRating, atBeach = false, ...props }) => {
  const { rating, clrs } = useMemo(() => {
    return {
      rating: genReviewRating(avgRating),
      clrs: getRatingColor(avgRating),
    };
  }, [avgRating]);

  return (
    <Flex
      justify="center"
      align="center"
      boxSize="2em"
      p="0.5em"
      borderRadius="regular"
      borderBottomLeftRadius={0}
      color="white"
      bgGradient={`linear(to bottom left, ${clrs.first}, ${clrs.second})`}
      fontWeight={atBeach ? "semibold" : undefined}
      className={atBeach ? " header-5" : ""}
      data-rating={rating.floored}
      {...props}
    >
      {rating.val}
    </Flex>
  );
};

RatingBox.displayName = "BeachBarReviewRatingBox";
