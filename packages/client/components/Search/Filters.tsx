import Icons from "@/components/Icons";
import { useSearchContext } from "@/utils/contexts";
import { COMMON_CONFIG } from "@beach_bar/common";
import { memo, useMemo, useState } from "react";
import Next from "../Next";
import styles from "./Filters.module.scss";
import { HANDLE_SORT_PAYLOAD, SEARCH_ACTIONS } from "./index";

type FProps = Required<Pick<HANDLE_SORT_PAYLOAD, "beachBars">>;

export const Filters: React.FC<FProps> = memo(() => {
  const [activeId, setActiveId] = useState<number | undefined>();

  const { map, dispatch } = useSearchContext();

  const sortFilters = useMemo(() => Object.values(COMMON_CONFIG.DATA.searchSortFilters), []);

  const handleClick = (idx: number) => {
    setActiveId(idx);
    const newSort = sortFilters[idx];
    dispatch({
      type: SEARCH_ACTIONS.SET_STATE,
      payload: { map: { ...map, isActive: map?.isActive || false, sort: { id: newSort.id.toString(), name: newSort.name } } },
    });
  };

  return (
    <div className={styles.container + " flex-row-flex-start-center"}>
      <Next.IconBox>
        <Icons.Filters />
      </Next.IconBox>
      <div className={styles.filters + " no-scrollbar flex-row-flex-start-center"}>
        {sortFilters.map(({ id, name }, i) => {
          return (
            <span key={id} className={activeId === i ? styles.active : undefined} onClick={() => handleClick(i)}>
              {name}
            </span>
          );
        })}
      </div>
    </div>
  );
});

Filters.displayName = "SearchFilters";
