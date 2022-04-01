import { createCtx } from "@hashtag-design-system/components";
import { Dayjs } from "dayjs";
import React from "react";
import { SearchContextType } from ".";

export type SearchFormContextType = {
  searchValue: string;
  date?: Dayjs;
  people: {
    adults: number;
    children: number;
  };
  time?: {
    start: number;
    end: number;
  };
  autosuggestRef: React.RefObject<HTMLInputElement> | null;
  atHeader: boolean;
  atBeach: boolean;
  isBtnHovered: boolean;
  handleHover: (timing: "start" | "end") => void;
  handleChange: (newVal: string) => void;
  handleSelect: (id: SearchContextType["form"]["suggestions"]["data"][number]["id"]) => void;
  handleBtnClick: () => Promise<void>;
  handleDateSelect: (newDate: Dayjs) => void;
  handleTimeChange: ([start, end]: [number, number]) => void;
  handlePeopleChange: (type: "adults" | "children", newVal: string | number) => void;
  // showRest: boolean;
};

export const INITIAL_SEARCH_FORM_VALUES: SearchFormContextType = {
  searchValue: "",
  people: { adults: 1, children: 0 },
  autosuggestRef: null,
  atHeader: false,
  atBeach: false,
  isBtnHovered: false,
  handleHover: () => {},
  handleChange: () => {},
  handleSelect: () => {},
  handleBtnClick: () => Promise.resolve(),
  handleDateSelect: () => {},
  handleTimeChange: () => {},
  handlePeopleChange: () => {},
};

export const [SearchFormContextProvider, useSearchFormContext] = createCtx<SearchFormContextType>();
