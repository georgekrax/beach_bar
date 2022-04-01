import { SearchFiltersBtnProps, SearchFiltersSectionProps } from "@/components/Search";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Flex, BoxProps } from "@hashtag-design-system/components";
import { useMemo } from "react";
import { Btn } from "./Btn";
import { Section } from "./Section";

const { REVIEW_SCORES } = COMMON_CONFIG.DATA.searchFilters;

type Props = BoxProps & {
  greaterThan?: boolean;
  btn?: Partial<SearchFiltersBtnProps>;
  arr?: typeof REVIEW_SCORES.EXCELLENT[];
};

export const ReviewScores: React.FC<Props & SearchFiltersSectionProps> = ({
  header,
  greaterThan = true,
  arr,
  btn,
  ...props
}) => {
  const scoresArr = useMemo(
    () => (arr ? arr : Object.values(REVIEW_SCORES)).sort((a, b) => b.rating - a.rating),
    [arr?.length]
  );

  return (
    <Section header={header ?? "Review score"} {...props}>
      <Flex align="center" wrap="wrap">
        {scoresArr.map(({ name, publicId, rating }) => (
          <Btn
            key={publicId}
            id={publicId}
            label={name + ": " + rating + (greaterThan ? "+" : "")}
            isCheckbox={false}
            {...btn}
          />
        ))}
      </Flex>
    </Section>
  );
};

ReviewScores.displayName = "SearchFiltersReviewScores";
