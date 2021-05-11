<<<<<<< HEAD
import Search, { SearchFiltersBtnProps, SearchFiltersSectionProps } from "@/components/Search";
import { COMMON_CONFIG } from "@beach_bar/common";
import { useMemo } from "react";

const { REVIEW_SCORES } = COMMON_CONFIG.DATA.searchFilters;

type Props = {
  greaterThan?: boolean;
  btn?: Partial<SearchFiltersBtnProps>;
  arr?: typeof REVIEW_SCORES.EXCELLENT[];
};

export const ReviewScores: React.FC<Props & SearchFiltersSectionProps> = ({ header, greaterThan = true, arr, btn }) => {
  const scoresArr = useMemo(() => (arr ? arr : Object.values(REVIEW_SCORES)).sort((a, b) => b.rating - a.rating), [
    arr,
  ]);

  return (
    <Search.Filters.Section header={header ?? "Review score"}>
      <div className="flex-row-flex-start-center" style={{ flexWrap: "wrap" }}>
        {scoresArr.map(({ name, publicId, rating }) => (
          <Search.Filters.Btn
            key={publicId}
            id={publicId}
            label={name + ": " + rating + (greaterThan ? "+" : "")}
            checkbox={false}
            {...btn}
          />
        ))}
      </div>
    </Search.Filters.Section>
  );
};

ReviewScores.displayName = "SearchFiltersReviewScores";
=======
import Search, { SearchFiltersBtnProps, SearchFiltersSectionProps } from "@/components/Search";
import { COMMON_CONFIG } from "@beach_bar/common";
import { useMemo } from "react";

const { REVIEW_SCORES } = COMMON_CONFIG.DATA.searchFilters;

type Props = {
  greaterThan?: boolean;
  btn?: Partial<SearchFiltersBtnProps>;
  arr?: typeof REVIEW_SCORES.EXCELLENT[];
};

export const ReviewScores: React.FC<Props & SearchFiltersSectionProps> = ({ header, greaterThan = true, arr, btn }) => {
  const scoresArr = useMemo(() => (arr ? arr : Object.values(REVIEW_SCORES)).sort((a, b) => b.rating - a.rating), [
    arr,
  ]);

  return (
    <Search.Filters.Section header={header ?? "Review score"}>
      <div className="flex-row-flex-start-center" style={{ flexWrap: "wrap" }}>
        {scoresArr.map(({ name, publicId, rating }) => (
          <Search.Filters.Btn
            key={publicId}
            id={publicId}
            label={name + ": " + rating + (greaterThan ? "+" : "")}
            checkbox={false}
            {...btn}
          />
        ))}
      </div>
    </Search.Filters.Section>
  );
};

ReviewScores.displayName = "SearchFiltersReviewScores";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
