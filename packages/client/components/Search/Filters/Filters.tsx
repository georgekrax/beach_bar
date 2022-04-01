import Icons from "@/components/Icons";
import Next from "@/components/Next";
import { GetAllBeachBarsQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Flex, Heading } from "@hashtag-design-system/components";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useState } from "react";
import { SEARCH_ACTIONS } from "../index";
import { Btn } from "./Btn";
import styles from "./Filters.module.scss";
import { ReviewScores } from "./ReviewScores";
import { Section } from "./Section";
// import { ServiceItem } from "./ServiceItem";
import { Services } from "./Services";

const BottomSheetDynamic = dynamic(() => {
  const prom = import("@hashtag-design-system/components").then(mod => mod.BottomSheet);
  return prom;
});
const BottomSheetScrollbarDynamic = dynamic(() => {
  const prom = import("@hashtag-design-system/components").then(mod => mod.BottomSheet.ScrollBar);
  return prom;
});
const IconBoxDynamic = dynamic(() => {
  const prom = import("@/components/Next/IconBox").then(mod => mod.IconBox);
  return prom;
});

type SubComponents = {
  Btn: typeof Btn;
  // ServiceItem: typeof ServiceItem;
  Section: typeof Section;
  Services: typeof Services;
  ReviewScores: typeof ReviewScores;
};

const BOTTOM_SHEET_SCROLLBAR_HEIGHT = "32px";

type Props = {
  allBeachBars: GetAllBeachBarsQuery["getAllBeachBars"];
  mobileView?: boolean;
  onFilter?: () => void;
};

// @ts-expect-error
export const Filters: React.FC<Props> & SubComponents = memo(
  // @ts-expect-error
  ({ allBeachBars, mobileView, onFilter }) => {
    const [isFiltersShown, setIsFiltersShown] = useState(false);
    const [activeId, setActiveId] = useState<number | undefined>();
    const { isDesktop } = useIsDevice();

    const {
      map,
      _query: { filterIds },
      dispatch,
    } = useSearchContext();

    const sortFilters = useMemo(() => Object.values(COMMON_CONFIG.DATA.searchSortFilters), []);
    const uniqFiltersSize = useMemo(() => new Set(filterIds).size, [filterIds.length]);

    const handleSortClick = (idx: number) => {
      setActiveId(idx);
      const newSort = sortFilters[idx];
      dispatch({
        type: SEARCH_ACTIONS.SET_STATE,
        payload: {
          // map: { ...map, isActive: map?.isActive || false, sort: { id: newSort.id.toString(), name: newSort.name } },
          map: { ...map, isActive: map?.isActive || false, sortId: newSort.id.toString() },
        },
      });
    };

    const handleFilter = () => {
      if (onFilter) onFilter();
      else dispatch({ type: SEARCH_ACTIONS.HANDLE_FILTER, payload: { filterPublicIds: filterIds } });
    };

    const handleClose = () => {
      handleFilter();
      setIsFiltersShown(false);
    };

    useEffect(() => {
      if (isDesktop) handleFilter();
    }, [isDesktop, filterIds.length]);

    return (
      <Flex
        align="center"
        pt={4}
        pb={6}
        pl="container.pad"
        p={{ md: 4 }}
        border={{ md: "2px solid" }}
        borderColor={{ md: "gray.300" }}
        borderRadius="regular"
        bg="white"
        sx={{
          "& > div:first-of-type": { position: "relative" },
        }}
      >
        {isDesktop && !mobileView ? (
          <Content />
        ) : (
          <>
            <div>
              <IconBoxDynamic aria-label="Add or remove search filters" onClick={() => setIsFiltersShown(true)}>
                <Icons.Filters />
              </IconBoxDynamic>
              {uniqFiltersSize > 0 && <Next.Badge>{uniqFiltersSize}</Next.Badge>}
            </div>
            <Flex align="center" ml={4} overflowX="scroll" className={styles.filters + " w100 no-scrollbar"}>
              {sortFilters.map(({ id, name }, i) => (
                <span
                  key={id}
                  className={activeId === i ? styles.active + " bold" : "semibold"}
                  onClick={() => handleSortClick(i)}
                >
                  {name}
                </span>
              ))}
            </Flex>
          </>
        )}
        <BottomSheetDynamic isOpen={isFiltersShown} defaultY={200} onClose={handleClose}>
          {/* {({ dismiss }) => ( */}
          <BottomSheetScrollbarDynamic style={{ height: BOTTOM_SHEET_SCROLLBAR_HEIGHT }} />
          {/* <DialogContentDynamic
            style={{
              overflowY: "scroll",
              maxHeight: `calc(100% - ${BOTTOM_SHEET_SCROLLBAR_HEIGHT})`,
            }}
          > */}
          <Content />
          {/* </DialogContentDynamic> */}
          {/* )} */}
        </BottomSheetDynamic>
      </Flex>
    );
  }
);

// Filters.ServiceItem = ServiceItem;
Filters.Btn = Btn;
Filters.Services = Services;
Filters.Section = Section;
Filters.ReviewScores = ReviewScores;

Filters.displayName = "SearchFilters";

const { STYLE, DISTANCE_FILTERS, GENERAL } = COMMON_CONFIG.DATA.searchFilters;

export const Content: React.FC = memo(() => {
  const router = useRouter();
  const { inputValue } = useSearchContext();

  const handleClearFilters = async () => {
    const { filterIds, ...rest } = router.query;
    if (filterIds) {
      await router.replace({ pathname: router.pathname, query: rest }, undefined, {
        shallow: true,
        scroll: false,
      });
    }
    // dispatch({ type: SEARCH_ACTIONS.CLEAR_FILTERS })
  };

  return (
    <div>
      <Flex justify="space-between" align="flex-end" mb={{ base: 8, md: 6 }}>
        <Heading as="h4" size="md">
          Filters
        </Heading>
        <Next.Link isA={false} fontSize="sm" onClick={handleClearFilters}>
          Clear all
        </Next.Link>
      </Flex>
      <Section>
        <Flex align="center" wrap="wrap">
          {Object.values(GENERAL).map(({ name, publicId }) => (
            <Btn key={publicId} id={publicId} label={name} isCheckbox={false} />
          ))}
        </Flex>
      </Section>
      <Section header="Services">
        <Services />
      </Section>
      <Section header="Style">
        <Flex wrap="wrap">
          {Object.values(STYLE).map(({ name, publicId }) => (
            <Btn key={publicId} id={publicId} label={name} />
          ))}
        </Flex>
      </Section>
      <ReviewScores />
      {inputValue && inputValue.id && (
        <Section header="Distance from your destination">
          <Flex align="center" wrap="wrap">
            {Object.values(DISTANCE_FILTERS).map(({ km, publicId }) => (
              <Btn key={publicId} id={publicId} label={`Less than ${km}km`} />
            ))}
          </Flex>
        </Section>
      )}
    </div>
  );
});

Content.displayName = "FiltersContent";
