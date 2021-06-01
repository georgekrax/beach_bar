<<<<<<< HEAD
const BEACH_BAR_SERVICES = {
  SWIMMING_POOL: {
    id: 1,
    publicId: "831",
    name: "Swimming pool",
  },
  FREE_PARKING: {
    id: 2,
    publicId: "216",
    name: "Free parking",
  },
  FOOD_SNACKS: {
    id: 3,
    publicId: "400",
    name: "Food snacks",
  },
  WATER_SLIDES: {
    id: 4,
    publicId: "637",
    name: "Water slides",
  },
  SEA_INFLATABLE_TOYS: {
    id: 5,
    publicId: "888",
    name: "Sea inflatable toys",
  },
  PRIVATE_BAY: {
    id: 6,
    publicId: "742",
    name: "Private bay",
  },
};

const BEACH_BAR_STYLES = {
  FAMILY_FRIENDLY: {
    id: 1,
    publicId: "558",
    name: "Family - friendly",
  },
  MODERN: {
    id: 2,
    publicId: "800",
    name: "Modern",
  },
  SELF_SERVICE: {
    id: 3,
    publicId: "668",
    name: "Self - service",
  },
  ROMANTIC: {
    id: 4,
    publicId: "780",
    name: "Romantic",
  },
  TROPICAL: {
    id: 5,
    publicId: "230",
    name: "Tropical",
  },
  LOUD_MUSIC: {
    id: 6,
    publicId: "255",
    name: "Loud music",
  },
  PARTIES_AND_CONCERTS: {
    id: 7,
    publicId: "624",
    name: "Parties & concerts",
  },
};

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

const PRODUCT_COMPONENTS = {
  CHAIR: { id: 1, publicId: "850", name: "Chair" },
  SUNBED: { id: 2, publicId: "218", name: "Sunbed" },
  SUNBED_WITH_MATTRESS: { id: 2, publicId: "516", name: "Sunbed with mattress" },
  UMBRELLA: { id: 3, publicId: "314", name: "Umbrella" },
};

const DATA = {
  PRODUCT_COMPONENTS,
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
      FREE_PARKING: BEACH_BAR_SERVICES.FREE_PARKING,
      EXCELLENT: REVIEW_SCORES.EXCELLENT,
    },
    SERVICES: BEACH_BAR_SERVICES,
    STYLE: BEACH_BAR_STYLES,
    REVIEW_SCORES,
    DISTANCE_FILTERS,
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
=======
const BEACH_BAR_SERVICES = {
  SWIMMING_POOL: {
    id: 1,
    publicId: "831",
    name: "Swimming pool",
  },
  FREE_PARKING: {
    id: 2,
    publicId: "216",
    name: "Free parking",
  },
  FOOD_SNACKS: {
    id: 3,
    publicId: "400",
    name: "Food snacks",
  },
  WATER_SLIDES: {
    id: 4,
    publicId: "637",
    name: "Water slides",
  },
  SEA_INFLATABLE_TOYS: {
    id: 5,
    publicId: "888",
    name: "Sea inflatable toys",
  },
  PRIVATE_BAY: {
    id: 6,
    publicId: "742",
    name: "Private bay",
  },
};

const BEACH_BAR_STYLES = {
  FAMILY_FRIENDLY: {
    id: 1,
    publicId: "558",
    name: "Family - friendly",
  },
  MODERN: {
    id: 2,
    publicId: "800",
    name: "Modern",
  },
  SELF_SERVICE: {
    id: 3,
    publicId: "668",
    name: "Self - service",
  },
  ROMANTIC: {
    id: 4,
    publicId: "780",
    name: "Romantic",
  },
  TROPICAL: {
    id: 5,
    publicId: "230",
    name: "Tropical",
  },
  LOUD_MUSIC: {
    id: 6,
    publicId: "255",
    name: "Loud music",
  },
  PARTIES_AND_CONCERTS: {
    id: 7,
    publicId: "624",
    name: "Parties & concerts",
  },
};

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

const PRODUCT_COMPONENTS = {
  CHAIR: { id: 1, publicId: "850", name: "Chair" },
  SUNBED: { id: 2, publicId: "218", name: "Sunbed" },
  SUNBED_WITH_MATTRESS: { id: 2, publicId: "516", name: "Sunbed with mattress" },
  UMBRELLA: { id: 3, publicId: "314", name: "Umbrella" },
};

const DATA = {
  PRODUCT_COMPONENTS,
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
      FREE_PARKING: BEACH_BAR_SERVICES.FREE_PARKING,
      EXCELLENT: REVIEW_SCORES.EXCELLENT,
    },
    SERVICES: BEACH_BAR_SERVICES,
    STYLE: BEACH_BAR_STYLES,
    REVIEW_SCORES,
    DISTANCE_FILTERS,
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
