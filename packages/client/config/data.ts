import range from "lodash/range";

const partial = {
  MIN_HOUR: 9,
  MAX_HOUR: 21,
  MAX_BEACH_IMGS: 4,
};

export const DATA = {
  ...partial,
  HOURS: range(partial.MIN_HOUR, partial.MAX_HOUR + 1),
  ICON_SIZE: 24,
  ICON_SIZE_LG: 28,
  PHOTOS_PER_SECTION: 6,
  MAP_MAX_ZOOM: 20,
};
