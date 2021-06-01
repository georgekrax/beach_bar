import range from "lodash/range";

const partial = {
  MIN_HOUR: 8,
  MAX_HOUR: 22,
  MAX_BEACH_IMGS: 4,
};

const REVIEW_VISIT_TYPES = {
  DAILY_BATH: {
    id: 1,
    name: "Daily bath",
  },
  WEEKEND_GATEWAY: {
    id: 2,
    name: "Weekend gateway",
  },
  FAMILY: {
    id: 3,
    name: "Family",
  },
  COUPLE: {
    id: 4,
    name: "Couple",
  },
  GROUP_OF_8PLUS_PEOPLE: {
    id: 5,
    name: "Group of 8+ people",
  },
};

export const DATA = {
  ...partial,
  HOURS: range(partial.MIN_HOUR, partial.MAX_HOUR + 1),
  ICON_SIZE: 24,
  ICON_SIZE_LG: 28,
  REVIEW_VISIT_TYPES,
};
