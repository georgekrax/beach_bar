import { TABLES } from "./data";

const REVIEW_SCORES = {
  EXCELLENT: {
    id: 1,
    name: "Excellent",
    rating: 4,
    publicId: "229",
  },
  VERY_GOOD: {
    id: 2,
    name: "Very good",
    rating: 3,
    publicId: "475",
  },
  GOOD: {
    id: 3,
    name: "Good",
    rating: 2,
    publicId: "208",
  },
  DELIGHTFUL: {
    id: 4,
    name: "Delightful",
    rating: 1,
    publicId: "259",
  },
};

const DISTANCE_FILTERS = {
  "5KM": {
    km: 5,
    publicId: "213",
  },
  "10KM": {
    km: 10,
    publicId: "738",
  },
  "15KM": {
    km: 15,
    publicId: "456",
  },
};

const DATA = {
  REVIEW_SCORES_TOP: {
    id: 5,
    name: "Top",
    rating: 5,
    publicId: "698",
  },
  cartProductQuantity: { min: 1, max: 20 },
  searchSortFilters: {
    DISTANCE: {
      id: 1,
      name: "Distance",
      publicId: "",
    },
    POPULARITY: {
      id: 2,
      name: "Popularity",
      publicId: "",
    },
    "STARS (5 to 0)": {
      id: 3,
      name: "Stars (5 to 0)",
      publicId: "",
    },
    "STARS (0 to 5)": {
      id: 4,
      name: "Stars (0 to 5)",
      publicId: "",
    },
  },
  searchFilters: {
    GENERAL: {
      AVAILABLE: {
        id: 1,
        publicId: "118",
        name: "Show only available",
      },
      WITH_RESTAURANT: {
        id: 2,
        publicId: "926",
        name: "With restaurant / taverna",
      },
      FREE_PARKING: TABLES.BEACH_BAR_SERVICE_OBJ.FREE_PARKING,
      EXCELLENT: REVIEW_SCORES.EXCELLENT,
    },
    SERVICES: TABLES.BEACH_BAR_SERVICE,
    STYLE: TABLES.BEACH_BAR_STYLE_OBJ,
    REVIEW_SCORES,
    DISTANCE_FILTERS,
  },
};

export const COMMON_CONFIG = { DATA };
