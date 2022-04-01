import { Variants } from "framer-motion";
import React, { memo } from "react";
import { Date } from "./Date";
import { Input as FormInput } from "./Input";
import { People } from "./People";
import { Time } from "./Time";

const variants: Variants = { shrinked: { width: 0 }, extended: { width: "100%" } };

type SubComponents = {
  Input: typeof FormInput;
  Date: typeof Date;
  People: typeof People;
  Time: typeof Time;
};

export type Props = {
  handleReturn: () => void;
  handleSubmit: () => Promise<void>;
};

// @ts-expect-error
export const Form: React.NamedExoticComponent<Props & React.ComponentPropsWithoutRef<"div">> & SubComponents = memo(
  () => {
    return null;
    // const { form, inputValue, map, dispatch } = useSearchContext();
    // // const { searchInputValues, handleChange: onChange, handleSelect: onSelect } = useSearch();
    // const { handleChange: onChange, handleSelect: onSelect } = useSearch();
    // const { searchValue, showRest } = form;
    // const [classNames, rest] = useClassnames(styles.container + " w100 flex-column-flex-start-stretch", props);
    // const inputRef = useRef<HTMLInputElement>(null);

    // const borderControls = useAnimation();
    // const itemControls = useAnimation();
    // const suggestionsHeaderControls = useAnimation();
    // const locationControls = useAnimation();

    // const animateSuggestionsAnimation = () => {
    //   suggestionsHeaderControls.start("animate");
    //   locationControls.start("animate");
    //   itemControls.start("animate");
    // };

    // const toggleSuggestionsAnimation = (display: Extract<React.CSSProperties["display"], "none" | "flex">) => {
    //   suggestionsHeaderControls.set({ display });
    //   locationControls.set({ display });
    //   itemControls.set({ display });
    // };

    // const exitAnimation = async () => {
    //   locationControls.start({ opacity: 0 });
    //   suggestionsHeaderControls.start("initial");
    //   await itemControls.start("initial");
    //   locationControls.set("initial");
    //   toggleSuggestionsAnimation("none");
    //   setTimeout(() => dispatch({ type: SEARCH_ACTIONS.TOGGLE_REST_FORM, payload: { bool: true } }), 500);
    // };

    // const handleChange = debounce(
    //   (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const newVal = e.target.value;
    //     onChange(newVal);
    //     if (newVal.length === 1) animateSuggestionsAnimation();
    //   },
    //   1000,
    //   { leading: true }
    // );

    // const handleSelect = async (newInputValue: HANDLE_SELECT_PAYLOAD) => {
    //   onSelect(newInputValue);
    //   await exitAnimation();
    // };

    // const handleClear = () => {
    //   animateSuggestionsAnimation();
    //   // dispatch({
    //   //   type: SEARCH_ACTIONS.HANDLE_CLEAR,
    //   //   payload: { data: searchInputValues.data?.searchInputValues || [] },
    //   // });
    // };

    // const handleFocus = async () => {
    //   borderControls.start("extended");
    //   if (showRest) {
    //     toggleSuggestionsAnimation("flex");
    //     animateSuggestionsAnimation();
    //   }
    //   dispatch({ type: SEARCH_ACTIONS.TOGGLE_REST_FORM, payload: { bool: false } });
    // };

    // const handleBlur = async () => {
    //   borderControls.start("shrinked");
    //   if (inputValue && searchValue) await exitAnimation();
    // };

    // useEffect(() => {
    //   itemControls.start("initial", { duration: 0 });
    //   suggestionsHeaderControls.start("initial", { duration: 0 });
    //   locationControls.start("initial", { duration: 0 });
    //   locationControls.start("animate", { delay: 0.25 });
    //   if (inputRef && inputRef.current) inputRef.current.focus();
    //   if (showRest) dispatch({ type: SEARCH_ACTIONS.TOGGLE_REST_FORM, payload: { bool: false } });
    // }, []);

    // return (
    //   <div className={classNames} {...rest}>
    //     <ReturnAndClear handleReturn={handleReturn} onClear={handleClear} />
    //     <div className={styles.searchBarContainer}>
    //       <motion.div
    //         className={styles.searchBar + " " + (showRest ? styles.formItem + " " : "") + styles.wrapperMargin}
    //         layout
    //         layoutId={MOTION.LAYOUT_IDS.searchBox}
    //       >
    //         <Input
    //           // floatingplaceholder={false}
    //           className="iw100 semibold"
    //           placeholder={NAMES.SEARCH_BOX_PLACEHOLDER}
    //           overrideOnChange
    //           ref={inputRef}
    //           aria-disabled={false}
    //           aria-label={NAMES.SEARCH_BOX_PLACEHOLDER}
    //           onChange={handleChange}
    //           onFocus={handleFocus}
    //           onBlur={handleBlur}
    //         />
    //         <motion.div
    //           className={styles.borderBottom}
    //           initial="shrinked"
    //           animate={borderControls}
    //           variants={variants}
    //           transition={{ duration: 0.25, stiffness: 100 }}
    //         />
    //       </motion.div>
    //       <CurrentLocation animate={locationControls} />
    //     </div>
    //     <div className={styles.suggestions}>
    //       {/* {searchInputValues.error ? ( */}
    //       {false ? (
    //         <h2>Error</h2>
    //       ) : (
    //         <motion.div
    //           className={styles.wrapperMargin}
    //           animate={suggestionsHeaderControls}
    //           variants={MOTION.searchItemVariants}
    //         >
    //           <span>Suggestions</span>
    //         </motion.div>
    //       )}
    //       <ul>
    //         <AnimatePresence presenceAffectsLayout>
    //           {/* {searchInputValues.sliced.map(({ id, ...rest }, i) => ( */}
    //           {/* <Suggestion
    //               key={id}
    //               idx={i}
    //               id={id}
    //               itemControls={itemControls}
    //               onClick={content => handleSelect(content)}
    //               {...rest}
    //             /> */}
    //         </AnimatePresence>
    //       </ul>
    //     </div>
    //     {showRest && (
    //       <motion.div
    //         className={styles.wrapperMargin}
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1, transition: { duration: 0.2 } }}
    //       >
    //         {!map.isActive && <Rest />}
    //         <Button block pill className={styles.cta + " w100 header-6"} onClick={async () => await handleSubmit()}>
    //           Search
    //         </Button>
    //       </motion.div>
    //     )}
    //   </div>
    // );
  }
);

Form.Input = FormInput;
Form.Date = Date;
Form.Time = Time;
Form.People = People;

Form.displayName = "SearchForm";
