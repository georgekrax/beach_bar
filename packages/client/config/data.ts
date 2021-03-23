import range from "lodash/range";

const partial = {
  MIN_HOUR: 8,
  MAX_HOUR: 22,
};

export const DATA = {
  ...partial,
  HOURS: range(partial.MIN_HOUR, partial.MAX_HOUR + 1),
  ICON_SIZE: 24,
  ICON_SIZE_LG: 28,
};
