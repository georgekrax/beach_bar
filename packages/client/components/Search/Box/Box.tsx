import Search from "@/components/Search";
import { SearchFormContextProvider, SearchFormContextType, useSearchContext } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { dayjsFormat } from "@beach_bar/common";
import {
  AutosuggestProps,
  ButtonProps,
  cx,
  InputProps,
  MotionBoxProps,
  MotionFlex,
} from "@hashtag-design-system/components";
import { useRouter } from "next/router";
import { memo, useRef, useState } from "react";
import styles from "./Box.module.scss";
import { Btn } from "./Btn";

export type Props = MotionBoxProps & {
  redirectUri?: string;
  input?: (InputProps & AutosuggestProps) | false;
  atHeader?: boolean;
  atBeach?: boolean;
  fields?: { date: boolean; people: boolean };
  cta?: ButtonProps;
};

export const Box: React.FC<Props> = memo(
  ({
    redirectUri,
    input,
    atHeader = false,
    atBeach = false,
    fields = { date: true, people: true },
    cta = {},
    onClick,
    ...props
  }) => {
    const _className = cx(styles.container, atBeach && styles.atBeach, props.className);

    const router = useRouter();
    const { isDesktop } = useIsDevice();
    const {
      _query,
      form: { suggestions },
      formatInputValue,
    } = useSearchContext();

    const [searchValue, setSearchValue] = useState("");
    const [_inputValuePublicId, _setInputValuePublicId] = useState("");
    const [date, setDate] = useState<SearchFormContextType["date"]>(_query.date);
    const [time, setTime] = useState<SearchFormContextType["time"]>(_query.time);
    const [people, setPeople] = useState<SearchFormContextType["people"]>({
      adults: _query.adults,
      children: _query.children || 0,
    });
    const [isBtnHovered, setIsBtnHovered] = useState(false);

    const autosuggestRef = useRef<HTMLInputElement>(null);
    const { isMobile } = useIsDevice();

    const focusAutosuggest = () => autosuggestRef?.current?.focus();

    const handleHover = (timing: "start" | "end") => {
      if (!atHeader && !atBeach) setIsBtnHovered(timing === "start");
    };

    const handleChange: SearchFormContextType["handleChange"] = newVal => {
      setSearchValue(newVal);
    };

    const handleDateSelect: SearchFormContextType["handleDateSelect"] = newDate => {
      if (!newDate.isSame(date, "date")) setDate(newDate);
    };

    const handleTimeChange: SearchFormContextType["handleTimeChange"] = ([start, end]) => {
      if (start !== time?.start || end !== time?.end) setTime({ start, end });
    };

    const handlePeopleChange: SearchFormContextType["handlePeopleChange"] = (type, newVal) => {
      setPeople(prev => ({ ...prev, [type]: +newVal }));
    };

    const handleSelect: SearchFormContextType["handleSelect"] = id => {
      const selectedItem = suggestions.sliced.find(input => input.id === id);
      if (!selectedItem) return notify("error", "");
      const { primary } = formatInputValue(selectedItem);

      setSearchValue(primary);
      _setInputValuePublicId(selectedItem.publicId);
    };

    const handleBtnClick = async () => {
      if (!searchValue && !atBeach) return focusAutosuggest();

      handleHover("start");

      const data = {
        date: date?.format(dayjsFormat.ISO_STRING),
        time: (time?.start ?? "") + "_" + (time?.end ?? ""),
      };

      if (!atBeach) {
        await router.push({
          pathname: "/search",
          query: {
            ...data,
            ...(_inputValuePublicId && { inputId: _inputValuePublicId }),
            box: isMobile ? 1 : undefined,
            searchValue,
          },
        });
      } else {
        console.log(router.query);
        await router.replace(
          {
            pathname: "/beach/[...slug]",
            query: {
              ...router.query,
              ...data,
              // ...(_inputValuePublicId && { inputId: _inputValuePublicId }),
              // box: isMobile ? 1 : undefined,
              // searchValue,
            },
          },
          undefined,
          { shallow: true, scroll: false }
        );
      }
      // await handleSearch(!map.isDialogShown);
    };

    // const handleBtnClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

    const handleTransform = (generated: string) => {
      if (generated.includes("scale(1,")) return generated.split(" scale(1, ")[0];
      return generated;
    };

    return (
      <SearchFormContextProvider
        value={{
          searchValue,
          date,
          people,
          time,
          autosuggestRef,
          atHeader,
          atBeach,
          isBtnHovered,
          handleHover,
          handleChange,
          handleSelect,
          handleBtnClick,
          handleDateSelect,
          handleTimeChange,
          handlePeopleChange,
        }}
      >
        <MotionFlex
          initial={false}
          animate={false}
          layout
          justifyContent="space-between"
          alignItems="stretch"
          // gap={5}
          // py={2}
          // px={3}
          // pl={6}
          gap="1.5em"
          py="0.5em"
          px="0.75em"
          pl="1.5em"
          borderRadius="full"
          bg="white"
          boxShadow="lg"
          // layoutId={MOTION.LAYOUT_IDS.searchBox}
          // onClick={handleClick}
          {...props}
          transformTemplate={(_, generated) => handleTransform(generated)}
          sx={{
            ...(atBeach && {
              "& > div > button": {
                fontSize: "0.75em",
              },
            }),
            "& > div:not(:last-child)": {
              flex: 1,
              bg: "white",
              border: "1px solid",
              borderColor: "gray.300",
              borderRadius: "regular",
              transitionProperty: "common",
              transitionDuration: "normal",
              _first: { flex: 2, py: 1, px: 4 },
              _hover: { bg: "gray.100" },
              "& > button": {
                py: 1,
                px: 4,
                width: "100%",
                height: "100%",
                border: "none",
                boxShadow: "none",
              },
            },
            ...props.sx,
          }}
          className={_className}
        >
          {input !== false && (
            // <Field onClick={focusAutosuggest}>
            <Search.Form.Input />
            // </Field>
          )}
          {/* {input && fields.date && isDesktop && <span />} */}
          {fields.date && isDesktop && (
            // <Field>
            <Search.Form.Date />
            // </Field>
          )}
          {fields.people && isDesktop && (
            <>
              {/* <span /> */}
              {/* <Field
              select
              label="People"
              value={formatPeopleShort(people)}
              modal={{ minWidth: 280, display: "block", className: styles.people, align: atBeach ? "left" : "right" }}
            > */}
              <Search.Form.People />
              {/* </Field> */}
            </>
          )}
          <Btn />
        </MotionFlex>
      </SearchFormContextProvider>
    );
  }
);

Box.displayName = "SearchBox";
