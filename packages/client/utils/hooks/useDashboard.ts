import { useBeachBarQuery } from "@/graphql/generated";
import { useLocalStorage } from "@hashtag-design-system/components";

type Params = {
  fetch?: boolean;
};

export const useDashboard = (params: Params = {}) => {
  const { fetch } = params;
  const [beachBarId, setBeachBarId] = useLocalStorage({ key: "beach_bar_id" });

  const { data, loading, error } = useBeachBarQuery({
    skip: !fetch || !beachBarId,
    variables: { id: beachBarId!, slug: undefined, userVisit: false },
  });
  

  return {
    beachBarId: beachBarId?.toString(),
    setBeachBarId,
    beachBar: data?.beachBar,
    loading,
    error,
    currencySymbol: data?.beachBar?.defaultCurrency.symbol,
  };
};
