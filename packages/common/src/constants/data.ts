// Icon
const ICON_OBJ = {
  SWIMMING_POOL: { id: 1, publicId: "831", name: "swimming_pool" },
  PARKING_SIGN: { id: 2, publicId: "216", name: "parking_sign" },
  SNACKS: { id: 3, publicId: "400", name: "snacks" },
  WATER_SLIDES: { id: 4, publicId: "637", name: "water_slides" },
  BEACH_BALL: { id: 5, publicId: "888", name: "beach_ball" },
  BEACH: { id: 6, publicId: "742", name: "beach" },
  CHAIR: { id: 7, publicId: "850", name: "chair" },
  SUNBED: { id: 8, publicId: "218", name: "sunbed" },
  BEACH_UMBRELLA: { id: 9, publicId: "314", name: "beach_umbrella" },
  SUNBED_WITH_MATTRESS: { id: 10, publicId: "516", name: "sunbed_with_matress" },
  FRESH_JUICE: { id: 11, publicId: "358", name: "fresh_juice" },
  COFFEE_CUP: { id: 12, publicId: "756", name: "coffee_cup" },
  SOFT_DRINK: { id: 13, publicId: "853", name: "soft_drink" },
  REFRESHMENT_DRINK: { id: 14, publicId: "956", name: "refreshment_drink" },
  BEER: { id: 15, publicId: "457", name: "beer" },
  ALCHOHOLIC_DRINK: { id: 16, publicId: "159", name: "alchoholic_drink" },
  FOOD_CUTLERY: { id: 17, publicId: "356", name: "food_cutlery" },
} as const;

const ICON = Object.values(ICON_OBJ);

// BeachBar
const BEACH_BAR_CATEGORY = [
  { id: 1, name: "Beach bar" },
  { id: 2, name: "Hotel" },
  { id: 3, name: "Camping" },
  { id: 4, name: "Swimming pool" },
] as const;

const BEACH_BAR_STYLE_OBJ = {
  FAMILY_FRIENDLY: { id: 1, publicId: "558", name: "Family - friendly" },
  LOUD_MUSIC: { id: 2, publicId: "255", name: "Loud music" },
  PARTIES_AND_CONCERTS: { id: 3, publicId: "624", name: "Parties & concerts" },
  ROMANTIC: { id: 4, publicId: "780", name: "Romantic" },
  MODERN: { id: 5, publicId: "800", name: "Modern" },
  TROPICAL: { id: 6, publicId: "230", name: "Tropical" },
  SELF_SERVICE: { id: 7, publicId: "668", name: "Self - service" },
} as const;

const BEACH_BAR_STYLE = Object.values(BEACH_BAR_STYLE_OBJ);

const BEACH_BAR_SERVICE_OBJ = {
  SWIMMING_POOL: { id: 1, publicId: "831", name: "Swimming pool", icon: ICON_OBJ.SWIMMING_POOL },
  FREE_PARKING: { id: 2, publicId: "216", name: "Free parking", icon: ICON_OBJ.PARKING_SIGN },
  FOOD_SNACKS: { id: 3, publicId: "400", name: "Food snacks", icon: ICON_OBJ.SNACKS },
  WATER_SLIDES: { id: 4, publicId: "637", name: "Water slides", icon: ICON_OBJ.WATER_SLIDES },
  SEA_INFLATABLE_TOYS: { id: 5, publicId: "888", name: "Sea inflatable toys", icon: ICON_OBJ.BEACH_BALL },
  PRIVATE_BAY: { id: 6, publicId: "742", name: "Private bay", icon: ICON_OBJ.BEACH },
} as const;

const BEACH_BAR_SERVICE = Object.values(BEACH_BAR_SERVICE_OBJ);

// Product
const PRODUCT_COMPONENTS_OBJ = {
  CHAIR: { id: 1, publicId: "850", name: "Chair" },
  SUNBED: { id: 2, publicId: "218", name: "Sunbed" },
  SUNBED_WITH_MATTRESS: { id: 2, publicId: "516", name: "Sunbed with mattress" },
  UMBRELLA: { id: 3, publicId: "314", name: "Umbrella" },
} as const;

const PRODUCT_COMPONENT = Object.values(PRODUCT_COMPONENTS_OBJ);

const { CHAIR, SUNBED, SUNBED_WITH_MATTRESS, UMBRELLA } = PRODUCT_COMPONENTS_OBJ;

const PRODUCT_CATEGORY = [
  {
    id: 1,
    name: "Chair with sunbed",
    underscoredName: "chair_with_sunbed",
    // whitelist: true,
    // description: undefined,
    zeroPrice: true,
    components: [
      { component: CHAIR, quantity: 1 },
      { component: SUNBED, quantity: 1 },
    ],
  },
  {
    id: 2,
    name: "Sunbedb with umbrella",
    underscoredName: "sunbed_with_umbrella",
    // whitelist: false,
    // description: undefined,
    zeroPrice: false,
    components: [
      { component: SUNBED, quantity: 1 },
      { component: SUNBED_WITH_MATTRESS, quantity: 1 },
    ],
  },
  {
    id: 5,
    name: "Sunbed",
    underscoredName: "sunbed",
    // whitelist: true,
    // description: undefined,
    zeroPrice: true,
    components: [{ component: SUNBED, quantity: 1 }],
  },
  {
    id: 8,
    name: "2x Sunbeds with mattresses and an unmbrella",
    underscoredName: "2x_sunbeds_with_mattresses_and_an_unmbrella",
    // whitelist: false,
    // description: undefined,
    zeroPrice: false,
    components: [
      { component: SUNBED_WITH_MATTRESS, quantity: 2 },
      { component: UMBRELLA, quantity: 1 },
    ],
  },
] as const;

// Food
const FOOD_CATEGORY = [
  { id: 1, name: "Smoothies and fresh juices", publicId: "358" },
  { id: 2, name: "Coffee", publicId: "756" },
  { id: 3, name: "Soft drinks", publicId: "853" },
  { id: 4, name: "Beverages & refreshments", publicId: "956" },
  { id: 5, name: "Beer", publicId: "457" },
  { id: 6, name: "Alchoholic drinks", publicId: "159" },
  { id: 7, name: "Food & snacks", publicId: "356" },
] as const;

// Restaurant
const RESTAURANT_MENU_CATEGORY = [
  { id: 1, name: "Main sishes" },
  { id: 2, name: "Salads" },
] as const;

// Review
const REVIEW_VOTE_TYPE = [
  { id: 1, value: "upvote" },
  { id: 2, value: "downvote" },
] as const;

const REVIEW_VISIT_TYPE = [
  { id: 1, name: "Daily bath" },
  { id: 2, name: "Weekend gateway" },
  { id: 3, name: "Family" },
  { id: 4, name: "Couple" },
  { id: 5, name: "Group of 8+ people" },
] as const;

// Time
const HOUR_TIME = [
  { id: 1, value: 1, utcValue: "01:00:00" },
  { id: 2, value: 2, utcValue: "02:00:00" },
  { id: 3, value: 3, utcValue: "03:00:00" },
  { id: 4, value: 4, utcValue: "04:00:00" },
  { id: 5, value: 5, utcValue: "05:00:00" },
  { id: 6, value: 6, utcValue: "06:00:00" },
  { id: 7, value: 7, utcValue: "07:00:00" },
  { id: 8, value: 8, utcValue: "08:00:00" },
  { id: 9, value: 9, utcValue: "09:00:00" },
  { id: 10, value: 10, utcValue: "10:00:00" },
  { id: 11, value: 11, utcValue: "11:00:00" },
  { id: 12, value: 12, utcValue: "12:00:00" },
  { id: 13, value: 13, utcValue: "13:00:00" },
  { id: 14, value: 14, utcValue: "14:00:00" },
  { id: 15, value: 15, utcValue: "15:00:00" },
  { id: 16, value: 16, utcValue: "16:00:00" },
  { id: 17, value: 17, utcValue: "17:00:00" },
  { id: 18, value: 18, utcValue: "18:00:00" },
  { id: 19, value: 19, utcValue: "19:00:00" },
  { id: 20, value: 20, utcValue: "20:00:00" },
  { id: 21, value: 21, utcValue: "21:00:00" },
  { id: 22, value: 22, utcValue: "22:00:00" },
  { id: 23, value: 23, utcValue: "23:00:00" },
  { id: 24, value: 24, utcValue: "24:00:00" },
] as const;

// prettier-ignore
const QUARTER_TIME = [
  { id: 1, utcValue: "01:00:00" }, { id: 2, utcValue: "01:15:00" }, { id: 3, utcValue: "01:30:00" },
  { id: 4, utcValue: "01:45:00" }, { id: 5, utcValue: "02:00:00" }, { id: 6, utcValue: "02:15:00" },
  { id: 7, utcValue: "02:30:00" }, { id: 8, utcValue: "02:45:00" }, { id: 9, utcValue: "03:00:00" },
  { id: 10, utcValue: "03:15:00" }, { id: 11, utcValue: "03:30:00" }, { id: 12, utcValue: "03:45:00" },
  { id: 13, utcValue: "04:00:00" }, { id: 14, utcValue: "04:15:00" }, { id: 15, utcValue: "04:30:00" },
  { id: 16, utcValue: "04:45:00" }, { id: 17, utcValue: "05:00:00" }, { id: 18, utcValue: "05:15:00" },
  { id: 19, utcValue: "05:30:00" }, { id: 20, utcValue: "05:45:00" }, { id: 21, utcValue: "06:00:00" },
  { id: 22, utcValue: "06:15:00" }, { id: 23, utcValue: "06:30:00" }, { id: 24, utcValue: "06:45:00" },
  { id: 25, utcValue: "07:00:00" }, { id: 26, utcValue: "07:15:00" }, { id: 27, utcValue: "07:30:00" },
  { id: 28, utcValue: "07:45:00" }, { id: 29, utcValue: "08:00:00" }, { id: 30, utcValue: "08:15:00" },
  { id: 31, utcValue: "08:30:00" }, { id: 32, utcValue: "08:45:00" }, { id: 33, utcValue: "09:00:00" },
  { id: 34, utcValue: "09:15:00" }, { id: 35, utcValue: "09:30:00" }, { id: 36, utcValue: "09:45:00" },
  { id: 37, utcValue: "10:00:00" }, { id: 38, utcValue: "10:15:00" }, { id: 39, utcValue: "10:30:00" },
  { id: 40, utcValue: "10:45:00" }, { id: 41, utcValue: "11:00:00" }, { id: 42, utcValue: "11:15:00" },
  { id: 43, utcValue: "11:30:00" }, { id: 44, utcValue: "11:45:00" }, { id: 45, utcValue: "12:00:00" },
  { id: 46, utcValue: "12:15:00" }, { id: 47, utcValue: "12:30:00" }, { id: 48, utcValue: "12:45:00" },
  { id: 49, utcValue: "13:00:00" }, { id: 50, utcValue: "13:15:00" }, { id: 51, utcValue: "13:30:00" },
  { id: 52, utcValue: "13:45:00" }, { id: 53, utcValue: "14:00:00" }, { id: 54, utcValue: "14:15:00" },
  { id: 55, utcValue: "14:30:00" }, { id: 56, utcValue: "14:45:00" }, { id: 57, utcValue: "15:00:00" },
  { id: 58, utcValue: "15:15:00" }, { id: 59, utcValue: "15:30:00" }, { id: 60, utcValue: "15:45:00" },
  { id: 61, utcValue: "16:00:00" }, { id: 62, utcValue: "16:15:00" }, { id: 63, utcValue: "16:30:00" },
  { id: 64, utcValue: "16:45:00" }, { id: 65, utcValue: "17:00:00" }, { id: 66, utcValue: "17:15:00" },
  { id: 67, utcValue: "17:30:00" }, { id: 68, utcValue: "17:45:00" }, { id: 69, utcValue: "18:00:00" },
  { id: 70, utcValue: "18:15:00" }, { id: 71, utcValue: "18:30:00" }, { id: 72, utcValue: "18:45:00" },
  { id: 73, utcValue: "19:00:00" }, { id: 74, utcValue: "19:15:00" }, { id: 75, utcValue: "19:30:00" },
  { id: 76, utcValue: "19:45:00" }, { id: 77, utcValue: "20:00:00" }, { id: 78, utcValue: "20:15:00" },
  { id: 79, utcValue: "20:30:00" }, { id: 80, utcValue: "20:45:00" }, { id: 81, utcValue: "21:00:00" },
  { id: 82, utcValue: "21:15:00" }, { id: 83, utcValue: "21:30:00" }, { id: 84, utcValue: "21:45:00" },
  { id: 85, utcValue: "22:00:00" }, { id: 86, utcValue: "22:15:00" }, { id: 87, utcValue: "22:30:00" },
  { id: 88, utcValue: "22:45:00" }, { id: 89, utcValue: "23:00:00" }, { id: 90, utcValue: "23:15:00" },
  { id: 91, utcValue: "23:30:00" }, { id: 92, utcValue: "23:45:00" }, { id: 93, utcValue: "00:00:00" },
  { id: 94, utcValue: "00:15:00" }, { id: 95, utcValue: "00:30:00" }, { id: 96, utcValue: "00:45:00" },
] as const;

// prettier-ignore
const MONTH_TIME = [
  { id: 1, name: "January", days: 31 }, { id: 2, name: "February", days: 28 },
  { id: 3, name: "March", days: 31 }, { id: 4, name: "April", days: 30 },
  { id: 5, name: "May", days: 31 }, { id: 6, name: "June", days: 30 },
  { id: 7, name: "July", days: 31 }, { id: 8, name: "August", days: 31 },
  { id: 9, name: "September", days: 30 }, { id: 10, name: "October", days: 31 },
  { id: 11, name: "November", days: 30 }, { id: 12, name: "December", days: 31 },
] as const;

// Card
const CARD_BRAND = [
  { id: 1, name: "MasterCard" },
  { id: 2, name: "Visa" },
  { id: 3, name: "AMEX" },
] as const;

// History
const HISTORY_ACTIVITY = [
  { id: 1, name: "search" },
  { id: 2, name: "beach_bar_query" },
] as const;

// Search
// const SEARCH_FILTER = [] as const;

// Payment
const PAYMENT_STATUS = [
  { id: 1, name: "CREATED" },
  { id: 2, name: "PAID" },
  { id: 3, name: "REFUNDED" },
] as const;

const REFUND_PERCENTAGE = [
  { id: 1, daysLimit: 1, percentageValue: 0, daysMilliseconds: BigInt(86400000) },
  { id: 2, daysLimit: 2, percentageValue: 15, daysMilliseconds: BigInt(172800000) },
  { id: 3, daysLimit: 3, percentageValue: 20, daysMilliseconds: BigInt(259200000) },
  { id: 4, daysLimit: 4, percentageValue: 25, daysMilliseconds: BigInt(345600000) },
  { id: 5, daysLimit: 5, percentageValue: 30, daysMilliseconds: BigInt(432000000) },
  { id: 6, daysLimit: 6, percentageValue: 35, daysMilliseconds: BigInt(518400000) },
  { id: 7, daysLimit: 7, percentageValue: 40, daysMilliseconds: BigInt(604800000) },
  { id: 8, daysLimit: 14, percentageValue: 58, daysMilliseconds: BigInt(1209600000) },
  { id: 9, daysLimit: 30, percentageValue: 69, daysMilliseconds: BigInt(2592000000) },
  { id: 10, daysLimit: 45, percentageValue: 93, daysMilliseconds: BigInt(3888000000) },
  { id: 11, daysLimit: 60, percentageValue: 100, daysMilliseconds: BigInt(5184000000) },
] as const;

// prettier-ignore
const STRIPE_MINIMUM_CURRENCY = [
  { id: 1, currencyId: 2, minAmount: 0.5 }, { id: 2, currencyId: 136, minAmount: 2.0 },
  { id: 3, currencyId: 8, minAmount: 0.5 }, { id: 4, currencyId: 23, minAmount: 1.0 },
  { id: 5, currencyId: 21, minAmount: 0.5 }, { id: 6, currencyId: 27, minAmount: 0.5 },
  { id: 7, currencyId: 74, minAmount: 0.5 }, { id: 8, currencyId: 36, minAmount: 15.0 },
  { id: 9, currencyId: 38, minAmount: 2.5 }, { id: 10, currencyId: 1, minAmount: 0.5 },
  { id: 11, currencyId: 137, minAmount: 0.3 }, { id: 12, currencyId: 155, minAmount: 4.0 },
  { id: 13, currencyId: 54, minAmount: 175.0 }, { id: 14, currencyId: 56, minAmount: 0.5 },
  { id: 15, currencyId: 62, minAmount: 50 }, { id: 16, currencyId: 81, minAmount: 10 },
  { id: 17, currencyId: 77, minAmount: 2.0 }, { id: 18, currencyId: 94, minAmount: 3.0 },
  { id: 19, currencyId: 89, minAmount: 0.5 }, { id: 20, currencyId: 102, minAmount: 2.0 },
  { id: 21, currencyId: 104, minAmount: 2.0 }, { id: 22, currencyId: 123, minAmount: 3.0 },
  { id: 23, currencyId: 113, minAmount: 0.5 },
] as const;

export const TABLES = {
  ICON,
  ICON_OBJ,
  HOUR_TIME,
  QUARTER_TIME,
  MONTH_TIME,
  CARD_BRAND,
  PAYMENT_STATUS,
  REFUND_PERCENTAGE,
  STRIPE_MINIMUM_CURRENCY,
  BEACH_BAR_STYLE,
  BEACH_BAR_STYLE_OBJ,
  HISTORY_ACTIVITY,
  BEACH_BAR_SERVICE,
  BEACH_BAR_SERVICE_OBJ,
  BEACH_BAR_CATEGORY,
  PRODUCT_CATEGORY,
  PRODUCT_COMPONENT,
  PRODUCT_COMPONENTS_OBJ,
  FOOD_CATEGORY,
  RESTAURANT_MENU_CATEGORY,
  REVIEW_VOTE_TYPE,
  REVIEW_VISIT_TYPE,
};
