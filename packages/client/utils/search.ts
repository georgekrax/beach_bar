import { DATA } from "@/config/data";
import { UserSearchesQuery } from "@/graphql/generated";
import { COMMON_CONFIG } from "@beach_bar/common";
import { DAY_NAMES_ARR, MONTHS } from "@the_hashtag/common";
import distance from "@turf/distance";
import { Dayjs } from "dayjs";
import { SearchContextType } from "./contexts";

const {
  searchFilters: { REVIEW_SCORES },
  REVIEW_SCORES_TOP,
} = COMMON_CONFIG.DATA;

export const checkSearchDate = (day: Dayjs) => (day.hour() > DATA.MAX_HOUR ? day.add(1, "day") : day);

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const calcDist = (from: Coordinates, to: Coordinates) =>
  distance([from.latitude, from.longitude], [to.latitude, to.longitude], {
    units: "kilometers",
  });

export const formatDateShort = (day: Dayjs) => {
  const month = MONTHS[day.month()];
  const dayObj = DAY_NAMES_ARR[day.day()];
  return dayObj.name.substr(0, 3) + " " + day.date() + ", " + month.substr(0, 3);
};

export const formatHourTime = (hourId?: number, optionalTxt: string = "Optional") =>
  hourId ? `${hourId.toString().padStart(2, "0")}:00` : optionalTxt;

export const formatNumber = (num: number) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

export const filterByRating = <T extends { avgRating: number }>(
  publicIdsArr: string[],
  arrToFilter: T[],
  equal = false
): T[] => {
  const reviewScores = Object.values(REVIEW_SCORES)
    .concat(equal ? [REVIEW_SCORES_TOP] : [])
    .filter(({ publicId }) => publicIdsArr.includes(publicId));
  return arrToFilter.filter(({ avgRating }) =>
    reviewScores.some(({ rating }) => {
      if (equal) return avgRating === rating;
      else avgRating >= rating;
    })
  );
};

export const formatSearchValue = ({
  beachBar,
  city,
  region,
}: UserSearchesQuery["userSearches"][number]["inputValue"]) => {
  if (beachBar) return beachBar.name;
  else return city?.name + (region ? ", " + region.name : "");
};

export const formatPeopleAdults = (adults?: number) => ((adults || 1) > 1 ? "Adults" : "Adult");

export const formatPeopleChilden = (children?: number) =>
  (children || 0) === 0 || (children || 0) > 1 ? "Children" : "Child";

export const calcTotalPeople = (people: SearchContextType["people"]) => (people?.adults || 1) + (people?.children || 0);

export const formatPeople = (people: SearchContextType["people"]) => {
  if (!people) return "1 Adult";
  const { adults, children } = people;
  return adults + " " + formatPeopleAdults(adults) + (children ? `, ${children} ` + formatPeopleChilden(children) : "");
};

export const formatPeopleShort = (people: SearchContextType["people"]) => {
  const totalPeople = calcTotalPeople(people);
  return totalPeople + " " + (totalPeople <= 1 ? "Person" : "People");
};
