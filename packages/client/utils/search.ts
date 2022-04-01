import { DATA } from "@/config/data";
import { CartQuery, DetailsBeachBarFragment, GetAllBeachBarsQuery, UserSearchesQuery } from "@/graphql/generated";
import { COMMON_CONFIG, TABLES } from "@beach_bar/common";
import { DAY_NAMES_ARR, MONTHS } from "@the_hashtag/common";
import distance from "@turf/distance";
import dayjs, { Dayjs } from "dayjs";
import { SearchContextType, SearchFormContextType } from "./contexts";

const {
  searchFilters: { REVIEW_SCORES },
  REVIEW_SCORES_TOP,
} = COMMON_CONFIG.DATA;

export const checkSearchDate = (_day: string | Dayjs = dayjs()) => {
  let day: Dayjs;
  if (typeof _day === "string") day = dayjs(_day);
  else day = _day;
  return day.hour() > DATA.MAX_HOUR ? day.add(1, "day") : day;
};

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

// TODO: Revisit later
export const formatSearchTime = (time?: SearchFormContextType["time"], optionalTxt: string = "Optional") =>
  time ? `${time.toString().padStart(2, "0")}:00` : optionalTxt;

export const formatNumber = (num: number) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

export const filterByRating = <T extends { avgRating: number }>(
  publicIdsArr: string[],
  arrToFilter: T[],
  equal = false
): readonly T[] => {
  const reviewScores = Object.values(REVIEW_SCORES)
    .concat(equal ? [REVIEW_SCORES_TOP] : [])
    .filter(({ publicId }) => publicIdsArr.includes(publicId));

  return arrToFilter.filter(({ avgRating }) =>
    reviewScores.some(({ rating }) => {
      if (equal) return avgRating === rating;
      else return avgRating >= rating;
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

export const calcTotalPeople = (people: SearchFormContextType["people"]) =>
  (people?.adults || 1) + (people?.children || 0);

export const calcCartTotalPeople = (products: CartQuery["cart"]["products"]) => {
  return products.reduce((prev, { people }) => prev + people, 0);
};

export const formatPeople = (people: SearchFormContextType["people"]) => {
  if (!people) return "1 Adult";
  const { adults, children } = people;
  return adults + " " + formatPeopleAdults(adults) + (children ? `, ${children} ` + formatPeopleChilden(children) : "");
};

export const formatPeopleShort = (people: SearchFormContextType["people"]) => {
  const totalPeople = calcTotalPeople(people);
  return totalPeople + " " + (totalPeople <= 1 ? "Person" : "People");
};

export const filterSuggestions = (arr: SearchContextType["form"]["suggestions"]["data"], newVal: string) =>
  arr.filter(({ formattedValue }) =>
    [...newVal].every(val => formattedValue.toLowerCase().indexOf(val.toLowerCase()) > -1)
  ) || [];

const { SERVICES, STYLE, DISTANCE_FILTERS, GENERAL } = COMMON_CONFIG.DATA.searchFilters;
const { BEACH_BAR_SERVICE_OBJ } = TABLES;

export const filterBeachBars = <
  T extends { beachBar: Omit<DetailsBeachBarFragment, "__typename"> } & Pick<
    SearchContextType["results"]["arr"][number],
    "hasCapacity"
  >
>(
  beachBars: readonly T[],
  filterIds: string[],
  coordinates: SearchContextType["coordinates"]
): readonly T[] => {
  let newArr = beachBars;
  filterIds.forEach(publicId => {
    switch (publicId) {
      case BEACH_BAR_SERVICE_OBJ.SWIMMING_POOL.publicId:
      case BEACH_BAR_SERVICE_OBJ.FOOD_SNACKS.publicId:
      case BEACH_BAR_SERVICE_OBJ.WATER_SLIDES.publicId:
      case BEACH_BAR_SERVICE_OBJ.SEA_INFLATABLE_TOYS.publicId:
      case BEACH_BAR_SERVICE_OBJ.PRIVATE_BAY.publicId:
      case BEACH_BAR_SERVICE_OBJ.FREE_PARKING.publicId:
      case GENERAL.FREE_PARKING.publicId:
        const service = Object.values(SERVICES).find(service => service.publicId === publicId);
        if (!service) break;
        newArr = newArr.filter(({ beachBar: { features } }) =>
          features.some(feature => feature?.service.name.toLowerCase() === service.name.toLowerCase())
        );
        break;
      case STYLE.FAMILY_FRIENDLY.publicId:
      case STYLE.LOUD_MUSIC.publicId:
      case STYLE.MODERN.publicId:
      case STYLE.PARTIES_AND_CONCERTS.publicId:
      case STYLE.ROMANTIC.publicId:
      case STYLE.SELF_SERVICE.publicId:
      case STYLE.TROPICAL.publicId:
        const style = Object.values(STYLE).find(style => style.publicId === publicId);
        if (!style) break;
        newArr = newArr.filter(({ beachBar: { styles } }) =>
          styles?.some(style => style?.name.toLowerCase() === style.name.toLowerCase())
        );
        break;
      case REVIEW_SCORES.VERY_GOOD.publicId:
      case REVIEW_SCORES.GOOD.publicId:
      case REVIEW_SCORES.DELIGHTFUL.publicId:
      case REVIEW_SCORES.EXCELLENT.publicId:
      case GENERAL.EXCELLENT.publicId:
        // @ts-ignore
        newArr = filterByRating<T["beachBar"]>(
          filterIds,
          newArr.map(({ beachBar }) => beachBar)
        ).map(beachBar => newArr.find(({ beachBar: { id } }) => id === beachBar.id));
        break;
      case DISTANCE_FILTERS["5KM"].publicId:
      case DISTANCE_FILTERS["15KM"].publicId:
      case DISTANCE_FILTERS["15KM"].publicId:
        const disFilter = Object.values(DISTANCE_FILTERS).find(filter => filter.publicId === publicId);
        newArr = newArr.filter(
          ({ beachBar }) => calcDist(coordinates, beachBar.location) <= (disFilter?.km ?? DISTANCE_FILTERS["15KM"].km)
        );
        break;
      case GENERAL.AVAILABLE.publicId:
        newArr = newArr.filter(({ hasCapacity }) => hasCapacity === true);
        break;
      case GENERAL.WITH_RESTAURANT.publicId:
        newArr = newArr.filter(({ beachBar: { restaurants } }) => restaurants && restaurants.length > 0);
        break;

      default:
        break;
    }
  });

  return newArr;
};

const {
  DISTANCE,
  POPULARITY,
  "STARS (0 to 5)": STARS_ASC,
  "STARS (5 to 0)": STARS_DESC,
} = COMMON_CONFIG.DATA.searchSortFilters;

export const sortBeachBars = <T extends { beachBar: GetAllBeachBarsQuery["getAllBeachBars"][number] }>(
  beachBars: readonly T[],
  sortId: string,
  coordinates: SearchContextType["coordinates"]
): readonly T[] => {
  const arr = Array.from(beachBars);
  const fCoords =
    coordinates && coordinates.latitude && coordinates.longitude
      ? (coordinates as Required<typeof coordinates>)
      : coordinates;

  let newArr: typeof arr = arr;
  switch (sortId) {
    case DISTANCE.id.toString():
      newArr = arr.sort((a, b) => {
        const aDis = calcDist(fCoords, a.beachBar.location);
        const bDis = calcDist(fCoords, b.beachBar.location);
        return aDis - bDis;
      });
      break;
    case POPULARITY.id.toString():
      newArr = arr.sort((a, b) => b.beachBar.payments.length - a.beachBar.payments.length);
      break;
    case STARS_ASC.id.toString():
      newArr = arr.sort((a, b) => a.beachBar.avgRating - b.beachBar.avgRating);
      break;
    case STARS_DESC.id.toString():
      newArr = arr.sort((a, b) => b.beachBar.avgRating - a.beachBar.avgRating);
      break;

    default:
      break;
  }

  return newArr;
};
