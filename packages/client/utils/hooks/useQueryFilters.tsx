import { useRouter } from "next/router";
import { useMemo } from "react";

export const useQueryFilters = () => {
  const router = useRouter();

  const filterIds = useMemo(() => {
    const arr = router.query.filterIds;
    return arr ? (Array.isArray(arr) ? Array.from(arr) : [arr]) : [];
  }, [router.query.filterIds]);

  const toggleFilterIds = async (newVal: string | string[], replaceWith?: string) => {
    let newArr: string[] = [];
    if (typeof newVal === "string") {
      newArr = filterIds.includes(newVal)
        ? filterIds.filter(filterId => filterId !== newVal)
        : [...(replaceWith ? filterIds.filter(val => val !== replaceWith) : filterIds), newVal];
    } else newArr = newVal;
    await router.replace({ pathname: router.pathname, query: { ...router.query, filterIds: newArr } }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  return {
    filterIds,
    toggleFilterIds,
  };
};
