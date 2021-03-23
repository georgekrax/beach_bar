import { MOTION, NAMES } from "@/config/index";
import { SearchDocument, SearchQuery, useSearchInputValuesQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { notify } from "@/utils/notify";
import { checkSearchDate } from "@/utils/search";
import { useApolloClient } from "@apollo/client";
import { Button, Input, useClassnames } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import { AnimatePresence, motion, useAnimation, Variants } from "framer-motion";
import debounce from "lodash/debounce";
import React, { memo, useEffect, useMemo, useRef } from "react";
import { HANDLE_SELECT_PAYLOAD, SEARCH_ACTIONS } from "../reducer";
import { CurrentLocation } from "./CurrentLocation";
import styles from "./Form.module.scss";
import { Rest } from "./Rest";
import { ReturnAndClear } from "./ReturnAndClear";
import { Suggestion } from "./Suggestion";

const variants: Variants = { shrinked: { width: 0 }, extended: { width: "100%" } };

export type Props = {
  onReturn: () => void;
  onSubmit: () => void;
};

type FProps = Props & Omit<React.ComponentPropsWithoutRef<"div">, "onSubmit">;

export const Form: React.FC<FProps> = memo(({ onReturn, onSubmit, ...props }) => {
  const { data, error } = useSearchInputValuesQuery();
  const apolloClient = useApolloClient();
  const { form, inputValue, date, hourTime, people, map, dispatch } = useSearchContext();
  const { searchValue, suggestions, showRest } = form;
  const [classNames, rest] = useClassnames(styles.container + " w-100 flex-column-flex-start-stretch", props);
  const inputRef = useRef<HTMLInputElement>(null);

  const borderControls = useAnimation();
  const itemControls = useAnimation();
  const suggestionsHeaderControls = useAnimation();
  const locationControls = useAnimation();

  const limitedSuggestions = useMemo(() => suggestions.slice(0, 7), [suggestions]);

  const animateSuggestionsAnimation = () => {
    suggestionsHeaderControls.start("animate");
    locationControls.start("animate");
    itemControls.start("animate");
  };

  const toggleSuggestionsAnimation = (display: Extract<React.CSSProperties["display"], "none" | "flex">) => {
    suggestionsHeaderControls.set({ display });
    locationControls.set({ display });
    itemControls.set({ display });
  };

  const exitAnimation = async () => {
    locationControls.start({ opacity: 0 });
    suggestionsHeaderControls.start("initial");
    await itemControls.start("initial");
    locationControls.set("initial");
    toggleSuggestionsAnimation("none");
    setTimeout(() => dispatch({ type: SEARCH_ACTIONS.TOGGLE_REST_FORM, payload: { bool: true } }), 500);
  };

  const handleChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      dispatch({ type: SEARCH_ACTIONS.HANDLE_CHANGE, payload: { newVal, data: data?.searchInputValues || [] } });
      if (newVal.length === 1) animateSuggestionsAnimation();
    },
    1000,
    { leading: true }
  );

  const handleSelect = async (newInputValue: HANDLE_SELECT_PAYLOAD) => {
    dispatch({ type: SEARCH_ACTIONS.HANDLE_SELECT, payload: { newInputValue } });
    await exitAnimation();
  };

  const handleSubmit = async () => {
    const newPeople = { adults: people?.adults || 1, children: people?.children || 0 };
    dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { people: newPeople } });
    const { data: searchData, error: searchError } = await apolloClient.query<SearchQuery>({
      query: SearchDocument,
      variables: {
        inputId: inputValue?.publicId,
        inputValue: undefined,
        availability: {
          ...newPeople,
          date: date || checkSearchDate(dayjs()),
          timeId: hourTime?.toString() || undefined,
        },
        filterIds: undefined,
        searchId: undefined,
        sortId: undefined,
      },
    });
    if (searchError) notify("error", searchError.message);
    else {
      // set results from GraphQL data
      onSubmit();
    }
  };

  const handleClear = () => {
    animateSuggestionsAnimation();
    dispatch({ type: SEARCH_ACTIONS.HANDLE_CLEAR, payload: { data: data?.searchInputValues || [] } });
  };

  const handleFocus = async () => {
    borderControls.start("extended");
    if (showRest) {
      toggleSuggestionsAnimation("flex");
      animateSuggestionsAnimation();
    }
    dispatch({ type: SEARCH_ACTIONS.TOGGLE_REST_FORM, payload: { bool: false } });
  };

  const handleBlur = async () => {
    borderControls.start("shrinked");
    if (inputValue && searchValue) await exitAnimation();
  };

  useEffect(() => {
    itemControls.set("initial");
    suggestionsHeaderControls.set("initial");
    locationControls.set("initial");
    locationControls.start("animate", { delay: 0.25 });
    if (inputRef && inputRef.current) inputRef.current.focus();
    if (data)
      dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { form: { ...form, suggestions: data.searchInputValues } } });
  }, []);

  return (
    <div className={classNames} {...rest}>
      <ReturnAndClear onReturn={onReturn} onClear={handleClear} />
      <div className={styles.searchBarContainer}>
        <motion.div
          className={styles.searchBar + " " + (showRest ? styles.formItem + " " : "") + styles.wrapperMargin}
          layout
          layoutId={MOTION.LAYOUT_IDS.searchBox}
        >
          <Input
            // floatingplaceholder={false}
            className="w-100 header-5 semibold"
            value={searchValue}
            placeholder={NAMES.SEARCH_BOX_PLACEHOLDER}
            overrideOnChange
            onChange={e => handleChange(e)}
            onFocus={() => handleFocus()}
            onBlur={() => handleBlur()}
            forwardref={inputRef}
            aria-disabled={false}
            aria-label={NAMES.SEARCH_BOX_PLACEHOLDER}
          />
          <motion.div
            className={styles.borderBottom}
            initial="shrinked"
            animate={borderControls}
            variants={variants}
            transition={{ duration: 0.25, stiffness: 100 }}
          />
        </motion.div>
        <CurrentLocation animate={locationControls} />
      </div>
      <div className={styles.suggestions}>
        {error ? (
          <h2>Error</h2>
        ) : (
          <motion.div
            className={styles.wrapperMargin}
            animate={suggestionsHeaderControls}
            variants={MOTION.searchItemVariants}
          >
            <span>Suggestions</span>
          </motion.div>
        )}
        <ul>
          <AnimatePresence presenceAffectsLayout>
            {limitedSuggestions.map(({ inputValue: { id, ...rest } }, i) => (
              <Suggestion
                key={id}
                idx={i}
                id={id}
                itemControls={itemControls}
                onClick={content => handleSelect(content)}
                {...rest}
              />
            ))}
          </AnimatePresence>
        </ul>
      </div>
      {showRest && (
        <motion.div
          className={styles.wrapperMargin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2 } }}
        >
          {!map && <Rest />}
          <Button block pill className={styles.cta} onClick={async () => await handleSubmit()}>
            Search
          </Button>
        </motion.div>
      )}
    </div>
  );
});
