const DATA = {
  cartProductQuantity: { min: 1, max: 20 },
  searchSortFilters: {
    DISTANCE: {
      id: 1,
      name: "Distance",
    },
    POPULARITY: {
      id: 2,
      name: "Popularity",
    },
    "STARS (5 to 0)": {
      id: 3,
      name: "Stars (5 to 0)"
    },
    "STARS (0 to 5)": {
      id: 4,
      name: "Stars (0 to 5)"
    }
  },
};

const HISTORY_ACTIVITY = {
  SEARCH_ID: 1,
  BEACH_BAR_QUERY_ID: 2,
};

export const COMMON_CONFIG = {
  DATA,
  HISTORY_ACTIVITY,
};
