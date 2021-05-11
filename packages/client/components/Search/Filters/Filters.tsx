import Icons from "@/components/Icons";
import Next from "@/components/Next";
import { useSearchContext } from "@/utils/contexts";
import { useIsDesktop } from "@/utils/hooks";
import { COMMON_CONFIG } from "@beach_bar/common";
import { BottomSheetPosition, useWindowDimensions } from "@hashtag-design-system/components";
import dynamic from "next/dynamic";
import { memo, useEffect, useMemo, useState } from "react";
import { HANDLE_SORT_PAYLOAD, SEARCH_ACTIONS } from "../index";
import { Btn } from "./Btn";
import styles from "./Filters.module.scss";
import { ReviewScores } from "./ReviewScores";
import { Section } from "./Section";
import { ServiceItem } from "./ServiceItem";
import { Services } from "./Services";

const BottomSheetDynamic = dynamic(() => {
  const prom = import("@hashtag-design-system/components").then(mod => mod.BottomSheet);
  return prom;
});
const BottomSheetScrollbarDynamic = dynamic(() => {
  const prom = import("@hashtag-design-system/components").then(mod => mod.BottomSheet.ScrollBar);
  return prom;
});
const DialogContentDynamic = dynamic(() => {
  const prom = import("@hashtag-design-system/components").then(mod => mod.Dialog.Content);
  return prom;
});
const IconBoxDynamic = dynamic(() => {
  const prom = import("@/components/Next/IconBox").then(mod => mod.IconBox);
  return prom;
});

const BOTTOM_SHEET_DEFAULT_Y = 200;
const BOTTOM_SHEET_SCROLLBAR_HEIGHT = 32;

const { STYLE, DISTANCE_FILTERS, GENERAL } = COMMON_CONFIG.DATA.searchFilters;

type SubComponents = {
  Btn: typeof Btn;
  ServiceItem: typeof ServiceItem;
  Section: typeof Section;
  Services: typeof Services;
  ReviewScores: typeof ReviewScores;
};

type Props = {
  allBeachBars: Required<HANDLE_SORT_PAYLOAD["beachBars"]>;
};

// @ts-expect-error
export const Filters: React.FC<Props> & SubComponents = memo(
  // @ts-expect-error
  ({ allBeachBars }) => {
    const [isFiltersShown, setIsFiltersShown] = useState(false);
    const [position, setPosition] = useState<BottomSheetPosition>("middle");
    const [activeId, setActiveId] = useState<number | undefined>();
    const isDesktop = useIsDesktop();
    const { height } = useWindowDimensions();

    const { map, filterPublicIds, dispatch } = useSearchContext();

    const sortFilters = useMemo(() => Object.values(COMMON_CONFIG.DATA.searchSortFilters), []);
    const uniqFilters = useMemo(() => new Set(filterPublicIds), [filterPublicIds]);

    const handleSortClick = (idx: number) => {
      setActiveId(idx);
      const newSort = sortFilters[idx];
      dispatch({
        type: SEARCH_ACTIONS.SET_STATE,
        payload: {
          map: { ...map, isActive: map?.isActive || false, sort: { id: newSort.id.toString(), name: newSort.name } },
        },
      });
    };

    const handleFilter = () => dispatch({ type: SEARCH_ACTIONS.HANDLE_FILTER, payload: { beachBars: allBeachBars } });

    const handleDismiss = () => {
      handleFilter();
      setIsFiltersShown(false);
    };

    useEffect(() => {
      if (isDesktop) handleFilter();
    }, [isDesktop, filterPublicIds.length]);

    return (
      <div className={styles.container + " flex-row-flex-start-center"}>
        {isDesktop ? (
          <Content />
        ) : (
          <>
            <div>
              <IconBoxDynamic aria-label="Add or remove search filters" onClick={() => setIsFiltersShown(true)}>
                <Icons.Filters />
              </IconBoxDynamic>
              {uniqFilters.size > 0 && <Next.Badge>{uniqFilters.size}</Next.Badge>}
            </div>
            <div className={styles.filters + " w100 no-scrollbar flex-row-flex-start-center"}>
              {sortFilters.map(({ id, name }, i) => (
                <span
                  key={id}
                  className={activeId === i ? styles.active + " bold" : "semibold"}
                  onClick={() => handleSortClick(i)}
                >
                  {name}
                </span>
              ))}
            </div>
          </>
        )}
        <BottomSheetDynamic
          isShown={isFiltersShown}
          defaultY={BOTTOM_SHEET_DEFAULT_Y}
          hugContentsHeight={false}
          onChange={(_, { position }) => setPosition(position)}
          onDismiss={() => handleDismiss()}
        >
          {/* {({ dismiss }) => ( */}
          <div>
            <BottomSheetScrollbarDynamic style={{ height: BOTTOM_SHEET_SCROLLBAR_HEIGHT }} />
            <DialogContentDynamic
              style={{
                overflowY: "scroll",
                maxHeight:
                  height - (position === "expanded" ? 0 : BOTTOM_SHEET_DEFAULT_Y) - BOTTOM_SHEET_SCROLLBAR_HEIGHT,
              }}
            >
              <Content />
            </DialogContentDynamic>
          </div>
          {/* )} */}
        </BottomSheetDynamic>
      </div>
    );
  }
);

Filters.Btn = Btn;
Filters.ServiceItem = ServiceItem;
Filters.Services = Services;
Filters.Section = Section;
Filters.ReviewScores = ReviewScores;

Filters.displayName = "SearchFilters";

export const Content: React.FC = () => {
  const { inputValue, dispatch } = useSearchContext();

  return (
    <div>
      <div className={styles.heading + " flex-row-space-between-flex-end"}>
        <h4>Filters</h4>
        <div className="body-14 link" onClick={() => dispatch({ type: SEARCH_ACTIONS.CLEAR_FILTERS })}>
          Clear all
        </div>
      </div>
      <Section>
        <div className="flex-row-flex-start-center" style={{ flexWrap: "wrap" }}>
          {Object.values(GENERAL).map(({ name, publicId }) => (
            <Btn key={publicId} id={publicId} label={name} checkbox={false} />
          ))}
        </div>
      </Section>
      <Section header="Services">
        <Services />
      </Section>
      <Section header="Style">
        <div className="flex-row-flex-start-flex-start" style={{ flexWrap: "wrap" }}>
          {Object.values(STYLE).map(({ name, publicId }) => (
            <Btn key={publicId} id={publicId} label={name} />
          ))}
        </div>
      </Section>
      <ReviewScores />
      {inputValue && inputValue.id && (
        <Section header="Distance from your destination">
          <div className="flex-row-flex-start-center" style={{ flexWrap: "wrap" }}>
            {Object.values(DISTANCE_FILTERS).map(({ km, publicId }) => (
              <Btn key={publicId} id={publicId} label={"Less than " + km + "km"} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

Content.displayName = "FiltersContent";
