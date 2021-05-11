<<<<<<< HEAD
import Icons from "@/components/Icons";
import Search from "@/components/Search";
import { MOTION, NAMES } from "@/config/index";
import { useSearchContext } from "@/utils/contexts";
import { genBarThumbnailAlt } from "@/utils/format";
import { useIsDesktop, useSearchForm } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { formatHourTime, formatPeopleShort } from "@/utils/search";
import { Autosuggest, Input, InputFProps, Select, useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, memo } from "react";
import styles from "./Box.module.scss";
import { Field } from "./Field";

type Props = {
  redirectUri?: string;
  input?: InputFProps;
  inHeader?: boolean;
};

export const Box: React.FC<Props & HTMLMotionProps<"div">> = memo(({
  redirectUri,
  input,
  inHeader = false,
  onClick,
  ...props
}) => {
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const autosuggestRef = useRef<HTMLInputElement>(null);
  const [classNames, rest] = useClassnames(
    styles.container + " w100 zi--md border-radius--lg flex-row-flex-start-center",
    props
  );

  const isDesktop = useIsDesktop();
  const { form, inputValue, hourTime, people, map } = useSearchContext();
  const { searchInputValues, handleChange, formatInputValue, handleSelect: onSelect, handleSearch } = useSearchForm();

  const focusAutosuggest = () => {
    if (autosuggestRef && autosuggestRef.current) autosuggestRef.current.focus();
  };

  const handleTransform = (generated: string) => {
    if (generated.includes("scale(1,")) return generated.split(" scale(1, ")[0];
    return generated;
  };

  // const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (isDesktop) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     return;
  //   }
  //   let query = { box: true };
  //   if (redirectUri) Object.assign(query, { redirect: redirectUri });
  //   router.push({ pathname: "/search", query });
  //   if (onClick) onClick(e);
  // };

  const handleSelect = (id: typeof searchInputValues.sliced[number]["id"]) => {
    const selectedItem = searchInputValues.sliced.find(input => input.id === id);
    if (selectedItem) onSelect(selectedItem);
    else notify("error", "");
  };

  const handleClick = async () => {
    if (!inputValue) focusAutosuggest();
    else {
      setIsBtnClicked(true);
      await handleSearch(!map.isDialogShown);
    }
  };

  console.log("<Search.Box />");

  return (
    <motion.div
      className={classNames}
      initial={false}
      layout
      layoutId={MOTION.LAYOUT_IDS.searchBox}
      transformTemplate={(_, generated) => handleTransform(generated)}
      // onClick={e => handleClick(e)}
      {...rest}
    >
      {!isDesktop ? (
        <Input floatingplaceholder={false} placeholder={NAMES.SEARCH_BOX_PLACEHOLDER} {...input} />
      ) : (
        <>
          <Field select={false} onClick={() => focusAutosuggest()}>
            <Autosuggest
              className="body-14"
              label="Destination"
              placeholder={NAMES.SEARCH_BOX_PLACEHOLDER}
              defaultValue={form.searchValue}
              floatingplaceholder={false}
              forwardref={autosuggestRef}
              onChange={(val, e) => handleChange(e?.target.value || val)}
            >
              {searchInputValues.error ? (
                <h2>Error</h2>
              ) : (
                <>
                  {searchInputValues.sliced.map(({ id, beachBar, ...rest }) => {
                    const { primary, secondary } = formatInputValue({ beachBar, ...rest });
                    return (
                      <Select.Item
                        key={id}
                        id={id}
                        content={primary}
                        className={styles.item}
                        onClick={() => handleSelect(id)}
                        htmlContent={{
                          before: beachBar && (
                            <div className={styles.item__img + " flex-row-center-center"}>
                              <Image
                                src={beachBar.thumbnailUrl}
                                alt={genBarThumbnailAlt(beachBar.name)}
                                width={40}
                                height={40}
                                objectFit="cover"
                                objectPosition="center bottom"
                              />
                            </div>
                          ),
                          after: <div className="body-14">{secondary}</div>,
                        }}
                      />
                    );
                  })}
                </>
              )}
            </Autosuggest>
          </Field>
          {/* <Field select={false}>
            <Search.Form.Date />
          </Field> */}
          {inHeader && <span></span>}
          <Field
            label="Time"
            value={formatHourTime(hourTime, "Time")}
            className={styles.time}
            align="center"
          >
            <Search.Form.Time />
          </Field>
          {inHeader && <span></span>}
          <Field label="People" value={formatPeopleShort(people)} className={styles.people} align="right">
            <Search.Form.People />
          </Field>
        </>
      )}
      <button
        aria-label="Search"
        className={styles.cta + (isBtnClicked ? " " + styles.hover : "") + " iborder-radius--lg flex-row-center-center"}
        onClick={async () => await handleClick()}
      >
        <Icons.Search width={20} height={20} />
        <h4 className="body-16">Search</h4>
      </button>
    </motion.div>
  );
});
=======
import Icons from "@/components/Icons";
import Search from "@/components/Search";
import { MOTION, NAMES } from "@/config/index";
import { useSearchContext } from "@/utils/contexts";
import { genBarThumbnailAlt } from "@/utils/format";
import { useIsDesktop, useSearchForm } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { formatHourTime, formatPeopleShort } from "@/utils/search";
import { Autosuggest, Input, InputFProps, Select, useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, memo } from "react";
import styles from "./Box.module.scss";
import { Field } from "./Field";

type Props = {
  redirectUri?: string;
  input?: InputFProps;
  inHeader?: boolean;
};

export const Box: React.FC<Props & HTMLMotionProps<"div">> = memo(({
  redirectUri,
  input,
  inHeader = false,
  onClick,
  ...props
}) => {
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const autosuggestRef = useRef<HTMLInputElement>(null);
  const [classNames, rest] = useClassnames(
    styles.container + " w100 zi--md border-radius--lg flex-row-flex-start-center",
    props
  );

  const isDesktop = useIsDesktop();
  const { form, inputValue, hourTime, people, map } = useSearchContext();
  const { searchInputValues, handleChange, formatInputValue, handleSelect: onSelect, handleSearch } = useSearchForm();

  const focusAutosuggest = () => {
    if (autosuggestRef && autosuggestRef.current) autosuggestRef.current.focus();
  };

  const handleTransform = (generated: string) => {
    if (generated.includes("scale(1,")) return generated.split(" scale(1, ")[0];
    return generated;
  };

  // const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (isDesktop) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     return;
  //   }
  //   let query = { box: true };
  //   if (redirectUri) Object.assign(query, { redirect: redirectUri });
  //   router.push({ pathname: "/search", query });
  //   if (onClick) onClick(e);
  // };

  const handleSelect = (id: typeof searchInputValues.sliced[number]["id"]) => {
    const selectedItem = searchInputValues.sliced.find(input => input.id === id);
    if (selectedItem) onSelect(selectedItem);
    else notify("error", "");
  };

  const handleClick = async () => {
    if (!inputValue) focusAutosuggest();
    else {
      setIsBtnClicked(true);
      await handleSearch(!map.isDialogShown);
    }
  };

  console.log("<Search.Box />");

  return (
    <motion.div
      className={classNames}
      initial={false}
      layout
      layoutId={MOTION.LAYOUT_IDS.searchBox}
      transformTemplate={(_, generated) => handleTransform(generated)}
      // onClick={e => handleClick(e)}
      {...rest}
    >
      {!isDesktop ? (
        <Input floatingplaceholder={false} placeholder={NAMES.SEARCH_BOX_PLACEHOLDER} {...input} />
      ) : (
        <>
          <Field select={false} onClick={() => focusAutosuggest()}>
            <Autosuggest
              className="body-14"
              label="Destination"
              placeholder={NAMES.SEARCH_BOX_PLACEHOLDER}
              defaultValue={form.searchValue}
              floatingplaceholder={false}
              forwardref={autosuggestRef}
              onChange={(val, e) => handleChange(e?.target.value || val)}
            >
              {searchInputValues.error ? (
                <h2>Error</h2>
              ) : (
                <>
                  {searchInputValues.sliced.map(({ id, beachBar, ...rest }) => {
                    const { primary, secondary } = formatInputValue({ beachBar, ...rest });
                    return (
                      <Select.Item
                        key={id}
                        id={id}
                        content={primary}
                        className={styles.item}
                        onClick={() => handleSelect(id)}
                        htmlContent={{
                          before: beachBar && (
                            <div className={styles.item__img + " flex-row-center-center"}>
                              <Image
                                src={beachBar.thumbnailUrl}
                                alt={genBarThumbnailAlt(beachBar.name)}
                                width={40}
                                height={40}
                                objectFit="cover"
                                objectPosition="center bottom"
                              />
                            </div>
                          ),
                          after: <div className="body-14">{secondary}</div>,
                        }}
                      />
                    );
                  })}
                </>
              )}
            </Autosuggest>
          </Field>
          {/* <Field select={false}>
            <Search.Form.Date />
          </Field> */}
          {inHeader && <span></span>}
          <Field
            label="Time"
            value={formatHourTime(hourTime, "Time")}
            className={styles.time}
            align="center"
          >
            <Search.Form.Time />
          </Field>
          {inHeader && <span></span>}
          <Field label="People" value={formatPeopleShort(people)} className={styles.people} align="right">
            <Search.Form.People />
          </Field>
        </>
      )}
      <button
        aria-label="Search"
        className={styles.cta + (isBtnClicked ? " " + styles.hover : "") + " iborder-radius--lg flex-row-center-center"}
        onClick={async () => await handleClick()}
      >
        <Icons.Search width={20} height={20} />
        <h4 className="body-16">Search</h4>
      </button>
    </motion.div>
  );
});
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
