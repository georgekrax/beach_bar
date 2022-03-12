import { Dayjs } from "dayjs";
type StringOrNumber = string | number;
type DateOrString = Date | Dayjs | string;

import type { MyContext } from "./../../typings";
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin";
import type { core } from "nexus";
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * Use JavaScript Date object for date-only fields.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "Date";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    email<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "Email";
    /**
     * A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4.
     */
    ipV4<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "IPv4";
    /**
     * A time string at UTC, such as 10:15:30Z
     */
    time<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "Time";
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "Upload";
    /**
     * A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.
     */
    url<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "URL";
    /**
     * The `BigInt` scalar type represents non-fractional signed whole numeric values.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
     */
    bigInt<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "BigInt";
    /**
     * The `Byte` scalar type represents byte value as a Buffer
     */
    bytes<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "Bytes";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "DateTime";
    /**
     * An arbitrary-precision Decimal type
     */
    decimal<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "Decimal";
    /**
     * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "Json";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * Use JavaScript Date object for date-only fields.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Date";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    email<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Email";
    /**
     * A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4.
     */
    ipV4<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "IPv4";
    /**
     * A time string at UTC, such as 10:15:30Z
     */
    time<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Time";
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Upload";
    /**
     * A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.
     */
    url<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "URL";
    /**
     * The `BigInt` scalar type represents non-fractional signed whole numeric values.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
     */
    bigInt<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "BigInt";
    /**
     * The `Byte` scalar type represents byte value as a Buffer
     */
    bytes<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Bytes";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "DateTime";
    /**
     * An arbitrary-precision Decimal type
     */
    decimal<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Decimal";
    /**
     * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Json";
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  DashboardDatesArg: {
    // input type
    end?: NexusGenScalars["DateTime"] | null; // DateTime
    start?: NexusGenScalars["DateTime"] | null; // DateTime
  };
  OAuthUserInput: {
    // input type
    birthday?: NexusGenScalars["Date"] | null; // Date
    email: NexusGenScalars["Email"]; // Email!
    firstName?: string | null; // String
    id: StringOrNumber; // ID!
    imgUrl?: NexusGenScalars["URL"] | null; // URL
    lastName?: string | null; // String
    username?: string | null; // String
  };
  SearchInput: {
    // input type
    adults: number; // Int!
    children?: number | null; // Int
    date: NexusGenScalars["Date"]; // Date!
    endTimeId: StringOrNumber; // ID!
    startTimeId: StringOrNumber; // ID!
  };
  UserCredentials: {
    // input type
    email: NexusGenScalars["Email"]; // Email!
    password: string; // String!
  };
  UserLoginDetails: {
    // input type
    city?: string | null; // String
    countryAlpha2Code?: string | null; // String
  };
}

export interface NexusGenEnums {
  OAuthProvider: "Facebook" | "GitHub" | "Google" | "#hashtag" | "Instagram";
}

export interface NexusGenScalars {
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: StringOrNumber;
  BigInt: BigInt;
  Bytes: any;
  Date: DateOrString;
  DateTime: DateOrString;
  Decimal: any;
  Email: string;
  IPv4: string;
  Json: any;
  Time: any;
  URL: string;
  Upload: any;
}

export interface NexusGenObjects {
  Account: {
    // root type
    address?: string | null; // String
    age?: number | null; // Int
    birthday?: NexusGenScalars["DateTime"] | null; // DateTime
    city?: string | null; // String
    honorificTitle?: string | null; // String
    id: StringOrNumber; // ID!
    imgUrl?: string | null; // String
    phoneNumber?: string | null; // String
    trackHistory: boolean; // Boolean!
    zipCode?: string | null; // String
  };
  AddPayment: {
    // root type
    added: boolean; // Boolean!
    payment: NexusGenRootTypes["Payment"]; // Payment!
  };
  AddReservedProduct: {
    // root type
    added: boolean; // Boolean!
    reservedProduct: NexusGenRootTypes["ReservedProduct"]; // ReservedProduct!
  };
  AvailableProduct: {
    // root type
    hourTime: NexusGenRootTypes["HourTime"]; // HourTime!
    isAvailable: boolean; // Boolean!
  };
  BeachBar: {
    // root type
    contactPhoneNumber: string; // String!
    description?: string | null; // String
    displayRegardlessCapacity: boolean; // Boolean!
    entryFee?: NexusGenScalars["Decimal"] | null; // Decimal
    hasCompletedSignUp?: boolean | null; // Boolean
    hidePhoneNumber: boolean; // Boolean!
    id: StringOrNumber; // ID!
    isActive: boolean; // Boolean!
    name: string; // String!
    slug: string; // String!
    thumbnailUrl?: string | null; // String
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
    zeroCartTotal: boolean; // Boolean!
  };
  BeachBarCategory: {
    // root type
    description?: string | null; // String
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  BeachBarFeature: {
    // root type
    description?: string | null; // String
    id: NexusGenScalars["BigInt"]; // BigInt!
    quantity: number; // Int!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  BeachBarImgUrl: {
    // root type
    description?: string | null; // String
    id: NexusGenScalars["BigInt"]; // BigInt!
    imgUrl: string; // String!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  BeachBarLocation: {
    // root type
    address: string; // String!
    id: StringOrNumber; // ID!
    latitude: NexusGenScalars["Decimal"]; // Decimal!
    longitude: NexusGenScalars["Decimal"]; // Decimal!
    zipCode?: string | null; // String
  };
  BeachBarOwner: {
    // root type
    id: StringOrNumber; // ID!
    isPrimary: boolean; // Boolean!
    publicInfo?: boolean | null; // Boolean
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
  };
  BeachBarRestaurant: {
    // root type
    description?: string | null; // String
    id: StringOrNumber; // ID!
    isActive: boolean; // Boolean!
    name: string; // String!
  };
  BeachBarReview: {
    // root type
    answer?: string | null; // String
    body?: string | null; // String
    negativeComment?: string | null; // String
    positiveComment?: string | null; // String
    ratingValue: number; // Int!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  BeachBarService: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  BeachBarStyle: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  Card: {
    // root type
    cardholderName: string; // String!
    expMonth?: number | null; // Int
    expYear?: number | null; // Int
    id: NexusGenScalars["BigInt"]; // BigInt!
    isDefault: boolean; // Boolean!
    last4: string; // String!
    stripeId: string; // String!
    type: string; // String!
  };
  CardBrand: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  Cart: {
    // root type
    foodsTotal: NexusGenScalars["Decimal"]; // Decimal!
    id: NexusGenScalars["BigInt"]; // BigInt!
    productstotal: NexusGenScalars["Decimal"]; // Decimal!
    total: NexusGenScalars["Decimal"]; // Decimal!
  };
  CartFood: {
    // root type
    date?: NexusGenScalars["DateTime"] | null; // DateTime
    deletedAt?: NexusGenScalars["DateTime"] | null; // DateTime
    id: NexusGenScalars["BigInt"]; // BigInt!
    quantity: number; // Int!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  CartNote: {
    // root type
    body: string; // String!
    id: NexusGenScalars["BigInt"]; // BigInt!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
  };
  CartProduct: {
    // root type
    date: NexusGenScalars["DateTime"]; // DateTime!
    id: NexusGenScalars["BigInt"]; // BigInt!
    people: number; // Int!
    quantity: number; // Int!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
  };
  CitiesAndRegions: {
    // root type
    cities: NexusGenRootTypes["City"][]; // [City!]!
    regions: NexusGenRootTypes["Region"][]; // [Region!]!
  };
  City: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  Country: {
    // root type
    alpha2Code: string; // String!
    alpha3Code: string; // String!
    callingCode: string; // String!
    id: StringOrNumber; // ID!
    isEu: boolean; // Boolean!
    name: string; // String!
  };
  Currency: {
    // root type
    id: StringOrNumber; // ID!
    isoCode: string; // String!
    name: string; // String!
    secondSymbol?: string | null; // String
    symbol: string; // String!
  };
  Customer: {
    // root type
    email?: string | null; // String
    id: NexusGenScalars["BigInt"]; // BigInt!
    phoneNumber?: string | null; // String
  };
  DashboardBalance: {
    // root type
    grossVolume: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    revenue: number; // Float!
    successfulPayments: NexusGenRootTypes["Payment"][]; // [Payment!]!
  };
  DashboardBilling: {
    // root type
    avgFoods: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    avgProducts: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    customersCountries: NexusGenRootTypes["DashboardBillingCustomerCountries"][]; // [DashboardBillingCustomerCountries!]!
    foods: NexusGenRootTypes["DashboardBillingFoods"]; // DashboardBillingFoods!
    products: NexusGenRootTypes["DashboardBillingProducts"]; // DashboardBillingProducts!
    refundedPayments: NexusGenRootTypes["DashboardBillingRefundedPayments"][]; // [DashboardBillingRefundedPayments!]!
  };
  DashboardBillingCustomerCountries: {
    // root type
    country: NexusGenRootTypes["Country"]; // Country!
    value: number; // Int!
  };
  DashboardBillingFoods: {
    // root type
    mostCommon: NexusGenRootTypes["DashboardBillingMostCommonFoods"][]; // [DashboardBillingMostCommonFoods!]!
    revenue: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
  };
  DashboardBillingMostCommonFoods: {
    // root type
    food: NexusGenRootTypes["Food"]; // Food!
    timesPurchased: number; // Int!
  };
  DashboardBillingMostCommonProducts: {
    // root type
    product: NexusGenRootTypes["Product"]; // Product!
    timesBooked: number; // Int!
  };
  DashboardBillingProducts: {
    // root type
    mostCommon: NexusGenRootTypes["DashboardBillingMostCommonProducts"][]; // [DashboardBillingMostCommonProducts!]!
    revenue: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
  };
  DashboardBillingRefundedPayments: {
    // root type
    date: NexusGenScalars["Date"]; // Date!
    payments: NexusGenRootTypes["Payment"][]; // [Payment!]!
  };
  DashboardBookings: {
    // root type
    bookings: NexusGenRootTypes["Payment"][]; // [Payment!]!
    capacity: NexusGenRootTypes["DashboardBookingsCapacity"]; // DashboardBookingsCapacity!
    mostActive: NexusGenRootTypes["DashboardMostActive"]; // DashboardMostActive!
  };
  DashboardBookingsCapacity: {
    // root type
    arr: NexusGenRootTypes["DashboardCapacityPercentage"][]; // [DashboardCapacityPercentage!]!
    maxCapacity: NexusGenRootTypes["DashboardMaxCapacity"][]; // [DashboardMaxCapacity!]!
    totalCustomers: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    totalHourCustomers: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
  };
  DashboardCapacity: {
    // root type
    availableProducts: number; // Int!
    percentage: number; // Float!
    reservedProducts: number; // Int!
    totalHourCustomers: number; // Int!
    totalMaxPeopleCapacity: number; // Int!
  };
  DashboardCapacityPercentage: {
    // root type
    date: NexusGenScalars["Date"]; // Date!
    percentage: number; // Float!
  };
  DashboardDateValue: {
    // root type
    date: NexusGenScalars["DateTime"]; // DateTime!
    value: number; // Float!
  };
  DashboardHomePage: {
    // root type
    avgRating: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    avgSpendPerPerson: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    balance: NexusGenRootTypes["DashboardBalance"]; // DashboardBalance!
    capacity: NexusGenRootTypes["DashboardCapacity"]; // DashboardCapacity!
    grossVolume: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    newCustomers: NexusGenRootTypes["DashboardNewCustomers"][]; // [DashboardNewCustomers!]!
    totalCustomers: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
  };
  DashboardMaxCapacity: {
    // root type
    availableProducts: number; // Int!
    date: NexusGenScalars["Date"]; // Date!
    limitPeople: number; // Int!
  };
  DashboardMostActive: {
    // root type
    hour: number; // Int!
    weekDay: string; // String!
  };
  DashboardNewCustomers: {
    // root type
    customers: NexusGenRootTypes["Customer"][]; // [Customer!]!
    date: NexusGenScalars["Date"]; // Date!
  };
  Error: {
    // root type
    error?: NexusGenRootTypes["ErrorObject"] | null; // ErrorObject
  };
  ErrorObject: {
    // root type
    code?: string | null; // String
    message?: string | null; // String
  };
  File: {
    // root type
    encoding: string; // String!
    filename: string; // String!
    mimetype: string; // String!
  };
  Food: {
    // root type
    deletedAt?: NexusGenScalars["DateTime"] | null; // DateTime
    id: NexusGenScalars["BigInt"]; // BigInt!
    ingredients?: string | null; // String
    maxQuantity: number; // Int!
    name: string; // String!
    price: number; // Float!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  FoodCategory: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  HourTime: {
    // root type
    id: StringOrNumber; // ID!
  };
  Icon: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
    publicId: string; // String!
  };
  LoginAuthorize: {
    // root type
    accessToken: string; // String!
    isNewUser: boolean; // Boolean!
    refreshToken: string; // String!
    scope: string[]; // [String!]!
    user: NexusGenRootTypes["User"]; // User!
  };
  MonthTime: {
    // root type
    days: number; // Int!
    id: StringOrNumber; // ID!
    value: string; // String!
  };
  Mutation: {};
  Owner: {
    // root type
    id: StringOrNumber; // ID!
  };
  Payment: {
    // root type
    appFee: NexusGenScalars["Decimal"]; // Decimal!
    deletedAt?: NexusGenScalars["DateTime"] | null; // DateTime
    id: NexusGenScalars["BigInt"]; // BigInt!
    isRefunded: boolean; // Boolean!
    refCode: string; // String!
    stripeId: string; // String!
    stripeProccessingFee: NexusGenScalars["Decimal"]; // Decimal!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
  };
  PaymentStatus: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  PaymentVisits: {
    // root type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    visits: NexusGenRootTypes["Visit"][]; // [Visit!]!
  };
  PaymentVisitsDates: {
    // root type
    month: NexusGenRootTypes["MonthTime"]; // MonthTime!
    year: number; // Int!
  };
  Product: {
    // root type
    deletedAt?: NexusGenScalars["DateTime"] | null; // DateTime
    description?: string | null; // String
    id: StringOrNumber; // ID!
    imgUrl?: string | null; // String
    isActive: boolean; // Boolean!
    isIndividual: boolean; // Boolean!
    maxPeople: number; // Int!
    minFoodSpending?: number | null; // Float
    name: string; // String!
    price: number; // Float!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  ProductAvailability: {
    // root type
    product: NexusGenRootTypes["Product"]; // Product!
    quantity: number; // Int!
  };
  ProductAvailabilityHour: {
    // root type
    hourTime: NexusGenRootTypes["HourTime"]; // HourTime!
    isAvailable: boolean; // Boolean!
  };
  ProductCategory: {
    // root type
    description?: string | null; // String
    id: StringOrNumber; // ID!
    name: string; // String!
    underscoredName: string; // String!
  };
  ProductCategoryComponent: {
    // root type
    quantity: number; // Int!
  };
  ProductComponent: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  ProductRecommended: {
    // root type
    product: NexusGenRootTypes["Product"]; // Product!
    quantity: number; // Int!
  };
  ProductReservationLimit: {
    // root type
    from: NexusGenScalars["DateTime"]; // DateTime!
    id: NexusGenScalars["BigInt"]; // BigInt!
    limitNumber: number; // Int!
    to: NexusGenScalars["DateTime"]; // DateTime!
  };
  QuarterTime: {
    // root type
    id: StringOrNumber; // ID!
    value: NexusGenScalars["DateTime"]; // DateTime!
  };
  Query: {};
  Region: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  ReservedProduct: {
    // root type
    date: NexusGenScalars["DateTime"]; // DateTime!
    id: NexusGenScalars["BigInt"]; // BigInt!
    isRefunded: boolean; // Boolean!
  };
  RestaurantFoodItem: {
    // root type
    id: NexusGenScalars["BigInt"]; // BigInt!
    imgUrl?: string | null; // String
    name: string; // String!
    price: NexusGenScalars["Decimal"]; // Decimal!
  };
  RestaurantMenuCategory: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  ReviewVisitType: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  ReviewVote: {
    // root type
    id: NexusGenScalars["BigInt"]; // BigInt!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  ReviewVoteType: {
    // root type
    id: StringOrNumber; // ID!
    value: string; // String!
  };
  S3Payload: {
    // root type
    signedRequest: NexusGenScalars["URL"]; // URL!
    url: NexusGenScalars["URL"]; // URL!
  };
  Search: {
    // root type
    results: NexusGenRootTypes["SearchResultType"][]; // [SearchResultType!]!
    search: NexusGenRootTypes["UserSearch"]; // UserSearch!
  };
  SearchFilter: {
    // root type
    description?: string | null; // String
    id: StringOrNumber; // ID!
    name: string; // String!
    publicId: string; // String!
  };
  SearchInputValue: {
    // root type
    id: NexusGenScalars["BigInt"]; // BigInt!
    publicId: string; // String!
  };
  SearchResultType: {
    // root type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    hasCapacity: boolean; // Boolean!
    recommendedProducts: NexusGenRootTypes["ProductRecommended"][]; // [ProductRecommended!]!
    totalPrice: number; // Float!
  };
  SearchSort: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  UpdateReservedProduct: {
    // root type
    reservedProduct: NexusGenRootTypes["ReservedProduct"]; // ReservedProduct!
    updated: boolean; // Boolean!
  };
  User: {
    // root type
    email: string; // String!
    firstName?: string | null; // String
    id: StringOrNumber; // ID!
    lastName?: string | null; // String
  };
  UserFavoriteBar: {
    // root type
    id: NexusGenScalars["BigInt"]; // BigInt!
  };
  UserHistory: {
    // root type
    id: NexusGenScalars["BigInt"]; // BigInt!
    objectId?: NexusGenScalars["BigInt"] | null; // BigInt
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
  };
  UserHistoryActivity: {
    // root type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  UserHistoryExtended: {
    // root type
    beachBar?: NexusGenRootTypes["BeachBar"] | null; // BeachBar
    search?: NexusGenRootTypes["UserSearch"] | null; // UserSearch
    userHistory: NexusGenRootTypes["UserHistory"]; // UserHistory!
  };
  UserSearch: {
    // root type
    adults?: number | null; // Int
    children?: number | null; // Int
    date?: NexusGenScalars["DateTime"] | null; // DateTime
    id: NexusGenScalars["BigInt"]; // BigInt!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  Visit: {
    // root type
    date: NexusGenScalars["Date"]; // Date!
    endTime: NexusGenRootTypes["HourTime"]; // HourTime!
    isRefunded: boolean; // Boolean!
    isUpcoming: boolean; // Boolean!
    payment: NexusGenRootTypes["Payment"]; // Payment!
    startTime: NexusGenRootTypes["HourTime"]; // HourTime!
  };
  VoteCategory: {
    // root type
    description: string; // String!
    id: StringOrNumber; // ID!
    refCode: string; // String!
    title: string; // String!
  };
  VoteTag: {
    // root type
    downvotes: number; // Int!
    id: StringOrNumber; // ID!
    totalVotes?: number | null; // Int
    upvotes: number; // Int!
  };
}

export interface NexusGenInterfaces {
  DashboardBillingField: NexusGenRootTypes["DashboardBillingFoods"] | NexusGenRootTypes["DashboardBillingProducts"];
}

export interface NexusGenUnions {
  AddPaymentResult: NexusGenRootTypes["AddPayment"] | NexusGenRootTypes["Error"];
  AddReservedProductResult: NexusGenRootTypes["AddReservedProduct"] | NexusGenRootTypes["Error"];
  UpdateReservedProductResult: NexusGenRootTypes["Error"] | NexusGenRootTypes["UpdateReservedProduct"];
  UserTypeResult: NexusGenRootTypes["Error"] | NexusGenRootTypes["User"];
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects & NexusGenUnions;

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums;

export interface NexusGenFieldTypes {
  Account: {
    // field return type
    address: string | null; // String
    age: number | null; // Int
    birthday: NexusGenScalars["DateTime"] | null; // DateTime
    city: string | null; // String
    country: NexusGenRootTypes["Country"] | null; // Country
    honorificTitle: string | null; // String
    id: StringOrNumber; // ID!
    imgUrl: string | null; // String
    phoneNumber: string | null; // String
    telCountry: NexusGenRootTypes["Country"] | null; // Country
    trackHistory: boolean; // Boolean!
    user: NexusGenRootTypes["User"]; // User!
    zipCode: string | null; // String
  };
  AddPayment: {
    // field return type
    added: boolean; // Boolean!
    payment: NexusGenRootTypes["Payment"]; // Payment!
  };
  AddReservedProduct: {
    // field return type
    added: boolean; // Boolean!
    reservedProduct: NexusGenRootTypes["ReservedProduct"]; // ReservedProduct!
  };
  AvailableProduct: {
    // field return type
    hourTime: NexusGenRootTypes["HourTime"]; // HourTime!
    isAvailable: boolean; // Boolean!
  };
  BeachBar: {
    // field return type
    avgRating: number; // Float!
    category: NexusGenRootTypes["BeachBarCategory"]; // BeachBarCategory!
    closingTime: NexusGenRootTypes["HourTime"]; // HourTime!
    contactPhoneNumber: string; // String!
    currency: NexusGenRootTypes["Currency"]; // Currency!
    description: string | null; // String
    displayRegardlessCapacity: boolean; // Boolean!
    entryFee: NexusGenScalars["Decimal"] | null; // Decimal
    features: NexusGenRootTypes["BeachBarFeature"][]; // [BeachBarFeature!]!
    foods: NexusGenRootTypes["Food"][]; // [Food!]!
    hasCompletedSignUp: boolean | null; // Boolean
    hidePhoneNumber: boolean; // Boolean!
    id: StringOrNumber; // ID!
    imgUrls: NexusGenRootTypes["BeachBarImgUrl"][]; // [BeachBarImgUrl!]!
    isActive: boolean; // Boolean!
    location: NexusGenRootTypes["BeachBarLocation"]; // BeachBarLocation!
    name: string; // String!
    openingTime: NexusGenRootTypes["HourTime"]; // HourTime!
    owners: NexusGenRootTypes["BeachBarOwner"][]; // [BeachBarOwner!]!
    payments: NexusGenRootTypes["Payment"][]; // [Payment!]!
    products: NexusGenRootTypes["Product"][]; // [Product!]!
    restaurants: NexusGenRootTypes["BeachBarRestaurant"][]; // [BeachBarRestaurant!]!
    reviews: NexusGenRootTypes["BeachBarReview"][]; // [BeachBarReview!]!
    slug: string; // String!
    styles: NexusGenRootTypes["BeachBarStyle"][]; // [BeachBarStyle!]!
    thumbnailUrl: string | null; // String
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
    zeroCartTotal: boolean; // Boolean!
  };
  BeachBarCategory: {
    // field return type
    description: string | null; // String
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  BeachBarFeature: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    description: string | null; // String
    id: NexusGenScalars["BigInt"]; // BigInt!
    quantity: number; // Int!
    service: NexusGenRootTypes["BeachBarService"]; // BeachBarService!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  BeachBarImgUrl: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    description: string | null; // String
    id: NexusGenScalars["BigInt"]; // BigInt!
    imgUrl: string; // String!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  BeachBarLocation: {
    // field return type
    address: string; // String!
    city: NexusGenRootTypes["City"]; // City!
    country: NexusGenRootTypes["Country"]; // Country!
    formattedLocation: string; // String!
    id: StringOrNumber; // ID!
    latitude: NexusGenScalars["Decimal"]; // Decimal!
    longitude: NexusGenScalars["Decimal"]; // Decimal!
    region: NexusGenRootTypes["Region"] | null; // Region
    whereIs: number[] | null; // [Float!]
    zipCode: string | null; // String
  };
  BeachBarOwner: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    id: StringOrNumber; // ID!
    isPrimary: boolean; // Boolean!
    owner: NexusGenRootTypes["Owner"]; // Owner!
    publicInfo: boolean | null; // Boolean
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
  };
  BeachBarRestaurant: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    description: string | null; // String
    foodItems: NexusGenRootTypes["RestaurantFoodItem"][]; // [RestaurantFoodItem!]!
    id: StringOrNumber; // ID!
    isActive: boolean; // Boolean!
    name: string; // String!
  };
  BeachBarReview: {
    // field return type
    answer: string | null; // String
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    body: string | null; // String
    customer: NexusGenRootTypes["Customer"]; // Customer!
    id: StringOrNumber; // ID!
    month: NexusGenRootTypes["MonthTime"] | null; // MonthTime
    negativeComment: string | null; // String
    payment: NexusGenRootTypes["Payment"]; // Payment!
    positiveComment: string | null; // String
    ratingValue: number; // Int!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
    visitType: NexusGenRootTypes["ReviewVisitType"] | null; // ReviewVisitType
    votes: NexusGenRootTypes["ReviewVote"][]; // [ReviewVote!]!
  };
  BeachBarService: {
    // field return type
    icon: NexusGenRootTypes["Icon"]; // Icon!
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  BeachBarStyle: {
    // field return type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  Card: {
    // field return type
    brand: NexusGenRootTypes["CardBrand"] | null; // CardBrand
    cardholderName: string; // String!
    country: NexusGenRootTypes["Country"] | null; // Country
    customer: NexusGenRootTypes["Customer"]; // Customer!
    expMonth: number | null; // Int
    expYear: number | null; // Int
    id: NexusGenScalars["BigInt"]; // BigInt!
    isDefault: boolean; // Boolean!
    last4: string; // String!
    stripeId: string; // String!
    type: string; // String!
  };
  CardBrand: {
    // field return type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  Cart: {
    // field return type
    foods: NexusGenRootTypes["CartFood"][]; // [CartFood!]!
    foodsTotal: NexusGenScalars["Decimal"]; // Decimal!
    id: NexusGenScalars["BigInt"]; // BigInt!
    notes: NexusGenRootTypes["CartNote"][]; // [CartNote!]!
    products: NexusGenRootTypes["CartProduct"][]; // [CartProduct!]!
    productstotal: NexusGenScalars["Decimal"]; // Decimal!
    total: NexusGenScalars["Decimal"]; // Decimal!
    user: NexusGenRootTypes["User"] | null; // User
  };
  CartFood: {
    // field return type
    cart: NexusGenRootTypes["Cart"]; // Cart!
    date: NexusGenScalars["DateTime"] | null; // DateTime
    deletedAt: NexusGenScalars["DateTime"] | null; // DateTime
    food: NexusGenRootTypes["Food"]; // Food!
    id: NexusGenScalars["BigInt"]; // BigInt!
    quantity: number; // Int!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    total: number | null; // Float
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  CartNote: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    body: string; // String!
    cart: NexusGenRootTypes["Cart"]; // Cart!
    id: NexusGenScalars["BigInt"]; // BigInt!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
  };
  CartProduct: {
    // field return type
    cart: NexusGenRootTypes["Cart"]; // Cart!
    date: NexusGenScalars["DateTime"]; // DateTime!
    endTime: NexusGenRootTypes["HourTime"]; // HourTime!
    id: NexusGenScalars["BigInt"]; // BigInt!
    people: number; // Int!
    product: NexusGenRootTypes["Product"]; // Product!
    quantity: number; // Int!
    startTime: NexusGenRootTypes["HourTime"]; // HourTime!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    total: number | null; // Float
  };
  CitiesAndRegions: {
    // field return type
    cities: NexusGenRootTypes["City"][]; // [City!]!
    regions: NexusGenRootTypes["Region"][]; // [Region!]!
  };
  City: {
    // field return type
    country: NexusGenRootTypes["Country"]; // Country!
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  Country: {
    // field return type
    alpha2Code: string; // String!
    alpha3Code: string; // String!
    callingCode: string; // String!
    cities: NexusGenRootTypes["City"][]; // [City!]!
    currency: NexusGenRootTypes["Currency"]; // Currency!
    id: StringOrNumber; // ID!
    isEu: boolean; // Boolean!
    name: string; // String!
  };
  Currency: {
    // field return type
    id: StringOrNumber; // ID!
    isoCode: string; // String!
    name: string; // String!
    secondSymbol: string | null; // String
    symbol: string; // String!
  };
  Customer: {
    // field return type
    cards: NexusGenRootTypes["Card"][]; // [Card!]!
    country: NexusGenRootTypes["Country"] | null; // Country
    email: string | null; // String
    id: NexusGenScalars["BigInt"]; // BigInt!
    phoneNumber: string | null; // String
    user: NexusGenRootTypes["User"] | null; // User
  };
  DashboardBalance: {
    // field return type
    grossVolume: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    revenue: number; // Float!
    successfulPayments: NexusGenRootTypes["Payment"][]; // [Payment!]!
  };
  DashboardBilling: {
    // field return type
    avgFoods: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    avgProducts: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    customersCountries: NexusGenRootTypes["DashboardBillingCustomerCountries"][]; // [DashboardBillingCustomerCountries!]!
    foods: NexusGenRootTypes["DashboardBillingFoods"]; // DashboardBillingFoods!
    products: NexusGenRootTypes["DashboardBillingProducts"]; // DashboardBillingProducts!
    refundedPayments: NexusGenRootTypes["DashboardBillingRefundedPayments"][]; // [DashboardBillingRefundedPayments!]!
  };
  DashboardBillingCustomerCountries: {
    // field return type
    country: NexusGenRootTypes["Country"]; // Country!
    value: number; // Int!
  };
  DashboardBillingFoods: {
    // field return type
    mostCommon: NexusGenRootTypes["DashboardBillingMostCommonFoods"][]; // [DashboardBillingMostCommonFoods!]!
    revenue: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
  };
  DashboardBillingMostCommonFoods: {
    // field return type
    food: NexusGenRootTypes["Food"]; // Food!
    timesPurchased: number; // Int!
  };
  DashboardBillingMostCommonProducts: {
    // field return type
    product: NexusGenRootTypes["Product"]; // Product!
    timesBooked: number; // Int!
  };
  DashboardBillingProducts: {
    // field return type
    mostCommon: NexusGenRootTypes["DashboardBillingMostCommonProducts"][]; // [DashboardBillingMostCommonProducts!]!
    revenue: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
  };
  DashboardBillingRefundedPayments: {
    // field return type
    date: NexusGenScalars["Date"]; // Date!
    payments: NexusGenRootTypes["Payment"][]; // [Payment!]!
  };
  DashboardBookings: {
    // field return type
    bookings: NexusGenRootTypes["Payment"][]; // [Payment!]!
    capacity: NexusGenRootTypes["DashboardBookingsCapacity"]; // DashboardBookingsCapacity!
    mostActive: NexusGenRootTypes["DashboardMostActive"]; // DashboardMostActive!
  };
  DashboardBookingsCapacity: {
    // field return type
    arr: NexusGenRootTypes["DashboardCapacityPercentage"][]; // [DashboardCapacityPercentage!]!
    maxCapacity: NexusGenRootTypes["DashboardMaxCapacity"][]; // [DashboardMaxCapacity!]!
    totalCustomers: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    totalHourCustomers: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
  };
  DashboardCapacity: {
    // field return type
    availableProducts: number; // Int!
    percentage: number; // Float!
    reservedProducts: number; // Int!
    totalHourCustomers: number; // Int!
    totalMaxPeopleCapacity: number; // Int!
  };
  DashboardCapacityPercentage: {
    // field return type
    date: NexusGenScalars["Date"]; // Date!
    percentage: number; // Float!
  };
  DashboardDateValue: {
    // field return type
    date: NexusGenScalars["DateTime"]; // DateTime!
    value: number; // Float!
  };
  DashboardHomePage: {
    // field return type
    avgRating: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    avgSpendPerPerson: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    balance: NexusGenRootTypes["DashboardBalance"]; // DashboardBalance!
    capacity: NexusGenRootTypes["DashboardCapacity"]; // DashboardCapacity!
    grossVolume: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
    newCustomers: NexusGenRootTypes["DashboardNewCustomers"][]; // [DashboardNewCustomers!]!
    totalCustomers: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
  };
  DashboardMaxCapacity: {
    // field return type
    availableProducts: number; // Int!
    date: NexusGenScalars["Date"]; // Date!
    limitPeople: number; // Int!
  };
  DashboardMostActive: {
    // field return type
    hour: number; // Int!
    weekDay: string; // String!
  };
  DashboardNewCustomers: {
    // field return type
    customers: NexusGenRootTypes["Customer"][]; // [Customer!]!
    date: NexusGenScalars["Date"]; // Date!
  };
  Error: {
    // field return type
    error: NexusGenRootTypes["ErrorObject"] | null; // ErrorObject
  };
  ErrorObject: {
    // field return type
    code: string | null; // String
    message: string | null; // String
  };
  File: {
    // field return type
    encoding: string; // String!
    filename: string; // String!
    mimetype: string; // String!
  };
  Food: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    category: NexusGenRootTypes["FoodCategory"]; // FoodCategory!
    deletedAt: NexusGenScalars["DateTime"] | null; // DateTime
    id: NexusGenScalars["BigInt"]; // BigInt!
    ingredients: string | null; // String
    maxQuantity: number; // Int!
    name: string; // String!
    price: number; // Float!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  FoodCategory: {
    // field return type
    icon: NexusGenRootTypes["Icon"]; // Icon!
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  HourTime: {
    // field return type
    id: StringOrNumber; // ID!
    utcValue: NexusGenScalars["Time"]; // Time!
    value: number; // Int!
  };
  Icon: {
    // field return type
    id: StringOrNumber; // ID!
    name: string; // String!
    publicId: string; // String!
  };
  LoginAuthorize: {
    // field return type
    accessToken: string; // String!
    isNewUser: boolean; // Boolean!
    refreshToken: string; // String!
    scope: string[]; // [String!]!
    user: NexusGenRootTypes["User"]; // User!
  };
  MonthTime: {
    // field return type
    days: number; // Int!
    id: StringOrNumber; // ID!
    value: string; // String!
  };
  Mutation: {
    // field return type
    addBeachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    addBeachBarFeature: NexusGenRootTypes["BeachBarFeature"]; // BeachBarFeature!
    addBeachBarImgUrl: NexusGenRootTypes["BeachBarImgUrl"]; // BeachBarImgUrl!
    addBeachBarLocation: NexusGenRootTypes["BeachBarLocation"]; // BeachBarLocation!
    addBeachBarOwner: NexusGenRootTypes["BeachBarOwner"]; // BeachBarOwner!
    addBeachBarRestaurant: NexusGenRootTypes["BeachBarRestaurant"]; // BeachBarRestaurant!
    addBeachBarStyles: NexusGenRootTypes["BeachBarStyle"][]; // [BeachBarStyle!]!
    addCartFood: NexusGenRootTypes["CartFood"]; // CartFood!
    addCartNote: NexusGenRootTypes["CartNote"]; // CartNote!
    addCartProduct: NexusGenRootTypes["CartProduct"]; // CartProduct!
    addCustomerPaymentMethod: NexusGenRootTypes["Card"]; // Card!
    addFood: NexusGenRootTypes["Food"]; // Food!
    addProduct: NexusGenRootTypes["Product"]; // Product!
    addProductReservationLimit: NexusGenRootTypes["ProductReservationLimit"]; // ProductReservationLimit!
    addRestaurantFoodItem: NexusGenRootTypes["RestaurantFoodItem"]; // RestaurantFoodItem!
    addReview: NexusGenRootTypes["BeachBarReview"]; // BeachBarReview!
    authorize: NexusGenRootTypes["LoginAuthorize"]; // LoginAuthorize!
    authorizeWithFacebook: NexusGenRootTypes["LoginAuthorize"]; // LoginAuthorize!
    authorizeWithGoogle: NexusGenRootTypes["LoginAuthorize"]; // LoginAuthorize!
    authorizeWithInstagram: NexusGenRootTypes["LoginAuthorize"]; // LoginAuthorize!
    cacheBeachBars: boolean; // Boolean!
    changeUserPassword: boolean; // Boolean!
    checkout: NexusGenRootTypes["Payment"]; // Payment!
    completeBeachBarSignUp: boolean; // Boolean!
    deleteBeachBar: boolean; // Boolean!
    deleteBeachBarFeature: boolean; // Boolean!
    deleteBeachBarImgUrl: boolean; // Boolean!
    deleteBeachBarOwner: boolean; // Boolean!
    deleteBeachBarRestaurant: boolean; // Boolean!
    deleteBeachBarStyles: boolean; // Boolean!
    deleteCart: boolean; // Boolean!
    deleteCartFood: boolean; // Boolean!
    deleteCartProduct: boolean; // Boolean!
    deleteCustomer: boolean; // Boolean!
    deleteCustomerPaymentMethod: boolean; // Boolean!
    deleteFood: boolean; // Boolean!
    deleteProduct: boolean; // Boolean!
    deleteProductReservationLimit: boolean; // Boolean!
    deleteRestaurantFoodItem: boolean; // Boolean!
    deleteReview: boolean; // Boolean!
    deleteUserFavoriteBar: boolean; // Boolean!
    hello: string; // String!
    login: NexusGenRootTypes["LoginAuthorize"]; // LoginAuthorize!
    logout: boolean; // Boolean!
    refundPayment: boolean; // Boolean!
    restoreBeachBarProduct: NexusGenRootTypes["Product"]; // Product!
    sendForgotPasswordLink: boolean; // Boolean!
    signS3: NexusGenRootTypes["S3Payload"]; // S3Payload!
    signUp: NexusGenRootTypes["User"]; // User!
    updateBeachBaImgUrl: NexusGenRootTypes["BeachBarImgUrl"]; // BeachBarImgUrl!
    updateBeachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    updateBeachBarFeature: NexusGenRootTypes["BeachBarFeature"]; // BeachBarFeature!
    updateBeachBarLocation: NexusGenRootTypes["BeachBarLocation"]; // BeachBarLocation!
    updateBeachBarOwner: NexusGenRootTypes["BeachBarOwner"]; // BeachBarOwner!
    updateBeachBarRestaurant: NexusGenRootTypes["BeachBarRestaurant"]; // BeachBarRestaurant!
    updateCartFood: NexusGenRootTypes["CartFood"]; // CartFood!
    updateCartNote: NexusGenRootTypes["CartNote"]; // CartNote!
    updateCartProduct: NexusGenRootTypes["CartProduct"]; // CartProduct!
    updateCustomer: NexusGenRootTypes["Customer"]; // Customer!
    updateCustomerPaymentMethod: NexusGenRootTypes["Card"]; // Card!
    updateFavouriteBeachBar: NexusGenRootTypes["UserFavoriteBar"]; // UserFavoriteBar!
    updateFood: NexusGenRootTypes["Food"]; // Food!
    updateProduct: NexusGenRootTypes["Product"]; // Product!
    updateProductReservationLimit: NexusGenRootTypes["ProductReservationLimit"]; // ProductReservationLimit!
    updateRestaurantFoodItem: NexusGenRootTypes["RestaurantFoodItem"]; // RestaurantFoodItem!
    updateReview: NexusGenRootTypes["BeachBarReview"]; // BeachBarReview!
    updateReviewVote: NexusGenRootTypes["BeachBarReview"]; // BeachBarReview!
    updateSearch: NexusGenRootTypes["UserSearch"]; // UserSearch!
    updateUser: NexusGenRootTypes["User"]; // User!
    uploadSingleFile: NexusGenRootTypes["File"] | null; // File
    verifyUserPaymentForReview: boolean; // Boolean!
  };
  Owner: {
    // field return type
    id: StringOrNumber; // ID!
    user: NexusGenRootTypes["User"]; // User!
  };
  Payment: {
    // field return type
    appFee: NexusGenScalars["Decimal"]; // Decimal!
    card: NexusGenRootTypes["Card"]; // Card!
    cart: NexusGenRootTypes["Cart"]; // Cart!
    deletedAt: NexusGenScalars["DateTime"] | null; // DateTime
    id: NexusGenScalars["BigInt"]; // BigInt!
    isRefunded: boolean; // Boolean!
    refCode: string; // String!
    reservedProducts: NexusGenRootTypes["ReservedProduct"][]; // [ReservedProduct!]!
    status: NexusGenRootTypes["PaymentStatus"]; // PaymentStatus!
    stripeId: string; // String!
    stripeProccessingFee: NexusGenScalars["Decimal"]; // Decimal!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    total: number | null; // Float
  };
  PaymentStatus: {
    // field return type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  PaymentVisits: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    visits: NexusGenRootTypes["Visit"][]; // [Visit!]!
  };
  PaymentVisitsDates: {
    // field return type
    month: NexusGenRootTypes["MonthTime"]; // MonthTime!
    year: number; // Int!
  };
  Product: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    category: NexusGenRootTypes["ProductCategory"]; // ProductCategory!
    deletedAt: NexusGenScalars["DateTime"] | null; // DateTime
    description: string | null; // String
    id: StringOrNumber; // ID!
    imgUrl: string | null; // String
    isActive: boolean; // Boolean!
    isIndividual: boolean; // Boolean!
    maxPeople: number; // Int!
    minFoodSpending: number | null; // Float
    name: string; // String!
    price: number; // Float!
    reservationLimits: NexusGenRootTypes["ProductReservationLimit"][]; // [ProductReservationLimit!]!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
  };
  ProductAvailability: {
    // field return type
    product: NexusGenRootTypes["Product"]; // Product!
    quantity: number; // Int!
  };
  ProductAvailabilityHour: {
    // field return type
    hourTime: NexusGenRootTypes["HourTime"]; // HourTime!
    isAvailable: boolean; // Boolean!
  };
  ProductCategory: {
    // field return type
    components: NexusGenRootTypes["ProductCategoryComponent"][]; // [ProductCategoryComponent!]!
    description: string | null; // String
    id: StringOrNumber; // ID!
    name: string; // String!
    underscoredName: string; // String!
  };
  ProductCategoryComponent: {
    // field return type
    category: NexusGenRootTypes["ProductCategory"]; // ProductCategory!
    component: NexusGenRootTypes["ProductComponent"]; // ProductComponent!
    quantity: number; // Int!
  };
  ProductComponent: {
    // field return type
    icon: NexusGenRootTypes["Icon"]; // Icon!
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  ProductRecommended: {
    // field return type
    product: NexusGenRootTypes["Product"]; // Product!
    quantity: number; // Int!
  };
  ProductReservationLimit: {
    // field return type
    endTime: NexusGenRootTypes["HourTime"] | null; // HourTime
    from: NexusGenScalars["DateTime"]; // DateTime!
    id: NexusGenScalars["BigInt"]; // BigInt!
    limitNumber: number; // Int!
    product: NexusGenRootTypes["Product"]; // Product!
    startTime: NexusGenRootTypes["HourTime"] | null; // HourTime
    to: NexusGenScalars["DateTime"]; // DateTime!
  };
  QuarterTime: {
    // field return type
    id: StringOrNumber; // ID!
    utcValue: NexusGenScalars["Time"]; // Time!
    value: NexusGenScalars["DateTime"]; // DateTime!
  };
  Query: {
    // field return type
    accessToken: string; // String!
    account: NexusGenRootTypes["Account"] | null; // Account
    accountLink: string; // String!
    availableHours: NexusGenRootTypes["HourTime"][]; // [HourTime!]!
    availableProducts: NexusGenRootTypes["Product"][]; // [Product!]!
    beachBar: NexusGenRootTypes["BeachBar"] | null; // BeachBar
    beachBarImgs: NexusGenRootTypes["BeachBarImgUrl"][] | null; // [BeachBarImgUrl!]
    cart: NexusGenRootTypes["Cart"]; // Cart!
    cartEntryFees: number; // Float!
    citiesAndRegions: NexusGenRootTypes["CitiesAndRegions"]; // CitiesAndRegions!
    customer: NexusGenRootTypes["Customer"]; // Customer!
    customerPaymentMethods: NexusGenRootTypes["Card"][]; // [Card!]!
    dashboardBilling: NexusGenRootTypes["DashboardBilling"]; // DashboardBilling!
    dashboardBookings: NexusGenRootTypes["DashboardBookings"]; // DashboardBookings!
    dashboardHomePage: NexusGenRootTypes["DashboardHomePage"]; // DashboardHomePage!
    favouriteBeachBars: NexusGenRootTypes["UserFavoriteBar"][]; // [UserFavoriteBar!]!
    food: NexusGenRootTypes["Food"] | null; // Food
    foods: NexusGenRootTypes["Food"][]; // [Food!]!
    getAllBeachBars: NexusGenRootTypes["BeachBar"][]; // [BeachBar!]!
    getFacebookOAuthUrl: NexusGenScalars["URL"]; // URL!
    getGoogleOAuthUrl: NexusGenScalars["URL"]; // URL!
    getInstagramOAuthUrl: NexusGenScalars["URL"]; // URL!
    getPersonalizedBeachBars: NexusGenRootTypes["BeachBar"][]; // [BeachBar!]!
    getProductAvailabilityHours: NexusGenRootTypes["ProductAvailabilityHour"][]; // [ProductAvailabilityHour!]!
    getProductAvailabilityQuantity: number; // Int!
    getStripeLoginLink: NexusGenScalars["URL"]; // URL!
    hasProductReservationLimit: NexusGenRootTypes["AvailableProduct"][]; // [AvailableProduct!]!
    hello: string; // String!
    hey: boolean; // Boolean!
    me: NexusGenRootTypes["User"] | null; // User
    nearBeachBars: NexusGenRootTypes["BeachBar"][]; // [BeachBar!]!
    payment: NexusGenRootTypes["Payment"]; // Payment!
    paymentRefundAmount: number; // Float!
    payments: NexusGenRootTypes["PaymentVisits"][]; // [PaymentVisits!]!
    product: NexusGenRootTypes["Product"] | null; // Product
    products: NexusGenRootTypes["Product"][]; // [Product!]!
    review: NexusGenRootTypes["BeachBarReview"]; // BeachBarReview!
    reviews: NexusGenRootTypes["BeachBarReview"][] | null; // [BeachBarReview!]
    search: NexusGenRootTypes["Search"]; // Search!
    searchInputValues: NexusGenRootTypes["SearchInputValue"][]; // [SearchInputValue!]!
    stripeConnectUrl: NexusGenScalars["URL"] | null; // URL
    userHistory: NexusGenRootTypes["UserHistoryExtended"][]; // [UserHistoryExtended!]!
    userSearches: NexusGenRootTypes["UserSearch"][]; // [UserSearch!]!
    verifyZeroCartTotal: boolean; // Boolean!
  };
  Region: {
    // field return type
    city: NexusGenRootTypes["City"]; // City!
    country: NexusGenRootTypes["Country"]; // Country!
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  ReservedProduct: {
    // field return type
    date: NexusGenScalars["DateTime"]; // DateTime!
    endTime: NexusGenRootTypes["HourTime"]; // HourTime!
    id: NexusGenScalars["BigInt"]; // BigInt!
    isRefunded: boolean; // Boolean!
    payment: NexusGenRootTypes["Payment"]; // Payment!
    product: NexusGenRootTypes["Product"]; // Product!
    startTime: NexusGenRootTypes["HourTime"]; // HourTime!
  };
  RestaurantFoodItem: {
    // field return type
    id: NexusGenScalars["BigInt"]; // BigInt!
    imgUrl: string | null; // String
    menuCategory: NexusGenRootTypes["RestaurantMenuCategory"]; // RestaurantMenuCategory!
    name: string; // String!
    price: NexusGenScalars["Decimal"]; // Decimal!
  };
  RestaurantMenuCategory: {
    // field return type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  ReviewVisitType: {
    // field return type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  ReviewVote: {
    // field return type
    id: NexusGenScalars["BigInt"]; // BigInt!
    review: NexusGenRootTypes["BeachBarReview"]; // BeachBarReview!
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    type: NexusGenRootTypes["ReviewVoteType"]; // ReviewVoteType!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
    user: NexusGenRootTypes["User"]; // User!
  };
  ReviewVoteType: {
    // field return type
    id: StringOrNumber; // ID!
    value: string; // String!
  };
  S3Payload: {
    // field return type
    signedRequest: NexusGenScalars["URL"]; // URL!
    url: NexusGenScalars["URL"]; // URL!
  };
  Search: {
    // field return type
    results: NexusGenRootTypes["SearchResultType"][]; // [SearchResultType!]!
    search: NexusGenRootTypes["UserSearch"]; // UserSearch!
  };
  SearchFilter: {
    // field return type
    description: string | null; // String
    id: StringOrNumber; // ID!
    name: string; // String!
    publicId: string; // String!
  };
  SearchInputValue: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"] | null; // BeachBar
    city: NexusGenRootTypes["City"] | null; // City
    country: NexusGenRootTypes["Country"] | null; // Country
    formattedValue: string; // String!
    id: NexusGenScalars["BigInt"]; // BigInt!
    publicId: string; // String!
    region: NexusGenRootTypes["Region"] | null; // Region
  };
  SearchResultType: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    hasCapacity: boolean; // Boolean!
    recommendedProducts: NexusGenRootTypes["ProductRecommended"][]; // [ProductRecommended!]!
    totalPrice: number; // Float!
  };
  SearchSort: {
    // field return type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  UpdateReservedProduct: {
    // field return type
    reservedProduct: NexusGenRootTypes["ReservedProduct"]; // ReservedProduct!
    updated: boolean; // Boolean!
  };
  User: {
    // field return type
    account: NexusGenRootTypes["Account"] | null; // Account
    email: string; // String!
    favoriteBars: NexusGenRootTypes["UserFavoriteBar"][]; // [UserFavoriteBar!]!
    firstName: string | null; // String
    fullName: string | null; // String
    id: StringOrNumber; // ID!
    lastName: string | null; // String
    reviewVotes: NexusGenRootTypes["ReviewVote"][]; // [ReviewVote!]!
    reviews: NexusGenRootTypes["BeachBarReview"][] | null; // [BeachBarReview!]
  };
  UserFavoriteBar: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"]; // BeachBar!
    id: NexusGenScalars["BigInt"]; // BigInt!
    user: NexusGenRootTypes["User"]; // User!
  };
  UserHistory: {
    // field return type
    activity: NexusGenRootTypes["UserHistoryActivity"]; // UserHistoryActivity!
    id: NexusGenScalars["BigInt"]; // BigInt!
    objectId: NexusGenScalars["BigInt"] | null; // BigInt
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    user: NexusGenRootTypes["User"] | null; // User
  };
  UserHistoryActivity: {
    // field return type
    id: StringOrNumber; // ID!
    name: string; // String!
  };
  UserHistoryExtended: {
    // field return type
    beachBar: NexusGenRootTypes["BeachBar"] | null; // BeachBar
    search: NexusGenRootTypes["UserSearch"] | null; // UserSearch
    userHistory: NexusGenRootTypes["UserHistory"]; // UserHistory!
  };
  UserSearch: {
    // field return type
    adults: number | null; // Int
    children: number | null; // Int
    date: NexusGenScalars["DateTime"] | null; // DateTime
    filters: NexusGenRootTypes["SearchFilter"][]; // [SearchFilter!]!
    id: NexusGenScalars["BigInt"]; // BigInt!
    inputValue: NexusGenRootTypes["SearchInputValue"]; // SearchInputValue!
    sort: NexusGenRootTypes["SearchSort"] | null; // SearchSort
    timestamp: NexusGenScalars["DateTime"]; // DateTime!
    updatedAt: NexusGenScalars["DateTime"]; // DateTime!
    user: NexusGenRootTypes["User"] | null; // User
  };
  Visit: {
    // field return type
    date: NexusGenScalars["Date"]; // Date!
    endTime: NexusGenRootTypes["HourTime"]; // HourTime!
    isRefunded: boolean; // Boolean!
    isUpcoming: boolean; // Boolean!
    payment: NexusGenRootTypes["Payment"]; // Payment!
    startTime: NexusGenRootTypes["HourTime"]; // HourTime!
  };
  VoteCategory: {
    // field return type
    description: string; // String!
    id: StringOrNumber; // ID!
    refCode: string; // String!
    title: string; // String!
  };
  VoteTag: {
    // field return type
    category: NexusGenRootTypes["VoteCategory"]; // VoteCategory!
    downvotes: number; // Int!
    id: StringOrNumber; // ID!
    totalVotes: number | null; // Int
    upvotes: number; // Int!
  };
  DashboardBillingField: {
    // field return type
    revenue: NexusGenRootTypes["DashboardDateValue"][]; // [DashboardDateValue!]!
  };
}

export interface NexusGenFieldTypeNames {
  Account: {
    // field return type name
    address: "String";
    age: "Int";
    birthday: "DateTime";
    city: "String";
    country: "Country";
    honorificTitle: "String";
    id: "ID";
    imgUrl: "String";
    phoneNumber: "String";
    telCountry: "Country";
    trackHistory: "Boolean";
    user: "User";
    zipCode: "String";
  };
  AddPayment: {
    // field return type name
    added: "Boolean";
    payment: "Payment";
  };
  AddReservedProduct: {
    // field return type name
    added: "Boolean";
    reservedProduct: "ReservedProduct";
  };
  AvailableProduct: {
    // field return type name
    hourTime: "HourTime";
    isAvailable: "Boolean";
  };
  BeachBar: {
    // field return type name
    avgRating: "Float";
    category: "BeachBarCategory";
    closingTime: "HourTime";
    contactPhoneNumber: "String";
    currency: "Currency";
    description: "String";
    displayRegardlessCapacity: "Boolean";
    entryFee: "Decimal";
    features: "BeachBarFeature";
    foods: "Food";
    hasCompletedSignUp: "Boolean";
    hidePhoneNumber: "Boolean";
    id: "ID";
    imgUrls: "BeachBarImgUrl";
    isActive: "Boolean";
    location: "BeachBarLocation";
    name: "String";
    openingTime: "HourTime";
    owners: "BeachBarOwner";
    payments: "Payment";
    products: "Product";
    restaurants: "BeachBarRestaurant";
    reviews: "BeachBarReview";
    slug: "String";
    styles: "BeachBarStyle";
    thumbnailUrl: "String";
    timestamp: "DateTime";
    updatedAt: "DateTime";
    zeroCartTotal: "Boolean";
  };
  BeachBarCategory: {
    // field return type name
    description: "String";
    id: "ID";
    name: "String";
  };
  BeachBarFeature: {
    // field return type name
    beachBar: "BeachBar";
    description: "String";
    id: "BigInt";
    quantity: "Int";
    service: "BeachBarService";
    timestamp: "DateTime";
    updatedAt: "DateTime";
  };
  BeachBarImgUrl: {
    // field return type name
    beachBar: "BeachBar";
    description: "String";
    id: "BigInt";
    imgUrl: "String";
    timestamp: "DateTime";
    updatedAt: "DateTime";
  };
  BeachBarLocation: {
    // field return type name
    address: "String";
    city: "City";
    country: "Country";
    formattedLocation: "String";
    id: "ID";
    latitude: "Decimal";
    longitude: "Decimal";
    region: "Region";
    whereIs: "Float";
    zipCode: "String";
  };
  BeachBarOwner: {
    // field return type name
    beachBar: "BeachBar";
    id: "ID";
    isPrimary: "Boolean";
    owner: "Owner";
    publicInfo: "Boolean";
    timestamp: "DateTime";
  };
  BeachBarRestaurant: {
    // field return type name
    beachBar: "BeachBar";
    description: "String";
    foodItems: "RestaurantFoodItem";
    id: "ID";
    isActive: "Boolean";
    name: "String";
  };
  BeachBarReview: {
    // field return type name
    answer: "String";
    beachBar: "BeachBar";
    body: "String";
    customer: "Customer";
    id: "ID";
    month: "MonthTime";
    negativeComment: "String";
    payment: "Payment";
    positiveComment: "String";
    ratingValue: "Int";
    timestamp: "DateTime";
    updatedAt: "DateTime";
    visitType: "ReviewVisitType";
    votes: "ReviewVote";
  };
  BeachBarService: {
    // field return type name
    icon: "Icon";
    id: "ID";
    name: "String";
  };
  BeachBarStyle: {
    // field return type name
    id: "ID";
    name: "String";
  };
  Card: {
    // field return type name
    brand: "CardBrand";
    cardholderName: "String";
    country: "Country";
    customer: "Customer";
    expMonth: "Int";
    expYear: "Int";
    id: "BigInt";
    isDefault: "Boolean";
    last4: "String";
    stripeId: "String";
    type: "String";
  };
  CardBrand: {
    // field return type name
    id: "ID";
    name: "String";
  };
  Cart: {
    // field return type name
    foods: "CartFood";
    foodsTotal: "Decimal";
    id: "BigInt";
    notes: "CartNote";
    products: "CartProduct";
    productstotal: "Decimal";
    total: "Decimal";
    user: "User";
  };
  CartFood: {
    // field return type name
    cart: "Cart";
    date: "DateTime";
    deletedAt: "DateTime";
    food: "Food";
    id: "BigInt";
    quantity: "Int";
    timestamp: "DateTime";
    total: "Float";
    updatedAt: "DateTime";
  };
  CartNote: {
    // field return type name
    beachBar: "BeachBar";
    body: "String";
    cart: "Cart";
    id: "BigInt";
    timestamp: "DateTime";
  };
  CartProduct: {
    // field return type name
    cart: "Cart";
    date: "DateTime";
    endTime: "HourTime";
    id: "BigInt";
    people: "Int";
    product: "Product";
    quantity: "Int";
    startTime: "HourTime";
    timestamp: "DateTime";
    total: "Float";
  };
  CitiesAndRegions: {
    // field return type name
    cities: "City";
    regions: "Region";
  };
  City: {
    // field return type name
    country: "Country";
    id: "ID";
    name: "String";
  };
  Country: {
    // field return type name
    alpha2Code: "String";
    alpha3Code: "String";
    callingCode: "String";
    cities: "City";
    currency: "Currency";
    id: "ID";
    isEu: "Boolean";
    name: "String";
  };
  Currency: {
    // field return type name
    id: "ID";
    isoCode: "String";
    name: "String";
    secondSymbol: "String";
    symbol: "String";
  };
  Customer: {
    // field return type name
    cards: "Card";
    country: "Country";
    email: "String";
    id: "BigInt";
    phoneNumber: "String";
    user: "User";
  };
  DashboardBalance: {
    // field return type name
    grossVolume: "DashboardDateValue";
    revenue: "Float";
    successfulPayments: "Payment";
  };
  DashboardBilling: {
    // field return type name
    avgFoods: "DashboardDateValue";
    avgProducts: "DashboardDateValue";
    customersCountries: "DashboardBillingCustomerCountries";
    foods: "DashboardBillingFoods";
    products: "DashboardBillingProducts";
    refundedPayments: "DashboardBillingRefundedPayments";
  };
  DashboardBillingCustomerCountries: {
    // field return type name
    country: "Country";
    value: "Int";
  };
  DashboardBillingFoods: {
    // field return type name
    mostCommon: "DashboardBillingMostCommonFoods";
    revenue: "DashboardDateValue";
  };
  DashboardBillingMostCommonFoods: {
    // field return type name
    food: "Food";
    timesPurchased: "Int";
  };
  DashboardBillingMostCommonProducts: {
    // field return type name
    product: "Product";
    timesBooked: "Int";
  };
  DashboardBillingProducts: {
    // field return type name
    mostCommon: "DashboardBillingMostCommonProducts";
    revenue: "DashboardDateValue";
  };
  DashboardBillingRefundedPayments: {
    // field return type name
    date: "Date";
    payments: "Payment";
  };
  DashboardBookings: {
    // field return type name
    bookings: "Payment";
    capacity: "DashboardBookingsCapacity";
    mostActive: "DashboardMostActive";
  };
  DashboardBookingsCapacity: {
    // field return type name
    arr: "DashboardCapacityPercentage";
    maxCapacity: "DashboardMaxCapacity";
    totalCustomers: "DashboardDateValue";
    totalHourCustomers: "DashboardDateValue";
  };
  DashboardCapacity: {
    // field return type name
    availableProducts: "Int";
    percentage: "Float";
    reservedProducts: "Int";
    totalHourCustomers: "Int";
    totalMaxPeopleCapacity: "Int";
  };
  DashboardCapacityPercentage: {
    // field return type name
    date: "Date";
    percentage: "Float";
  };
  DashboardDateValue: {
    // field return type name
    date: "DateTime";
    value: "Float";
  };
  DashboardHomePage: {
    // field return type name
    avgRating: "DashboardDateValue";
    avgSpendPerPerson: "DashboardDateValue";
    balance: "DashboardBalance";
    capacity: "DashboardCapacity";
    grossVolume: "DashboardDateValue";
    newCustomers: "DashboardNewCustomers";
    totalCustomers: "DashboardDateValue";
  };
  DashboardMaxCapacity: {
    // field return type name
    availableProducts: "Int";
    date: "Date";
    limitPeople: "Int";
  };
  DashboardMostActive: {
    // field return type name
    hour: "Int";
    weekDay: "String";
  };
  DashboardNewCustomers: {
    // field return type name
    customers: "Customer";
    date: "Date";
  };
  Error: {
    // field return type name
    error: "ErrorObject";
  };
  ErrorObject: {
    // field return type name
    code: "String";
    message: "String";
  };
  File: {
    // field return type name
    encoding: "String";
    filename: "String";
    mimetype: "String";
  };
  Food: {
    // field return type name
    beachBar: "BeachBar";
    category: "FoodCategory";
    deletedAt: "DateTime";
    id: "BigInt";
    ingredients: "String";
    maxQuantity: "Int";
    name: "String";
    price: "Float";
    timestamp: "DateTime";
    updatedAt: "DateTime";
  };
  FoodCategory: {
    // field return type name
    icon: "Icon";
    id: "ID";
    name: "String";
  };
  HourTime: {
    // field return type name
    id: "ID";
    utcValue: "Time";
    value: "Int";
  };
  Icon: {
    // field return type name
    id: "ID";
    name: "String";
    publicId: "String";
  };
  LoginAuthorize: {
    // field return type name
    accessToken: "String";
    isNewUser: "Boolean";
    refreshToken: "String";
    scope: "String";
    user: "User";
  };
  MonthTime: {
    // field return type name
    days: "Int";
    id: "ID";
    value: "String";
  };
  Mutation: {
    // field return type name
    addBeachBar: "BeachBar";
    addBeachBarFeature: "BeachBarFeature";
    addBeachBarImgUrl: "BeachBarImgUrl";
    addBeachBarLocation: "BeachBarLocation";
    addBeachBarOwner: "BeachBarOwner";
    addBeachBarRestaurant: "BeachBarRestaurant";
    addBeachBarStyles: "BeachBarStyle";
    addCartFood: "CartFood";
    addCartNote: "CartNote";
    addCartProduct: "CartProduct";
    addCustomerPaymentMethod: "Card";
    addFood: "Food";
    addProduct: "Product";
    addProductReservationLimit: "ProductReservationLimit";
    addRestaurantFoodItem: "RestaurantFoodItem";
    addReview: "BeachBarReview";
    authorize: "LoginAuthorize";
    authorizeWithFacebook: "LoginAuthorize";
    authorizeWithGoogle: "LoginAuthorize";
    authorizeWithInstagram: "LoginAuthorize";
    cacheBeachBars: "Boolean";
    changeUserPassword: "Boolean";
    checkout: "Payment";
    completeBeachBarSignUp: "Boolean";
    deleteBeachBar: "Boolean";
    deleteBeachBarFeature: "Boolean";
    deleteBeachBarImgUrl: "Boolean";
    deleteBeachBarOwner: "Boolean";
    deleteBeachBarRestaurant: "Boolean";
    deleteBeachBarStyles: "Boolean";
    deleteCart: "Boolean";
    deleteCartFood: "Boolean";
    deleteCartProduct: "Boolean";
    deleteCustomer: "Boolean";
    deleteCustomerPaymentMethod: "Boolean";
    deleteFood: "Boolean";
    deleteProduct: "Boolean";
    deleteProductReservationLimit: "Boolean";
    deleteRestaurantFoodItem: "Boolean";
    deleteReview: "Boolean";
    deleteUserFavoriteBar: "Boolean";
    hello: "String";
    login: "LoginAuthorize";
    logout: "Boolean";
    refundPayment: "Boolean";
    restoreBeachBarProduct: "Product";
    sendForgotPasswordLink: "Boolean";
    signS3: "S3Payload";
    signUp: "User";
    updateBeachBaImgUrl: "BeachBarImgUrl";
    updateBeachBar: "BeachBar";
    updateBeachBarFeature: "BeachBarFeature";
    updateBeachBarLocation: "BeachBarLocation";
    updateBeachBarOwner: "BeachBarOwner";
    updateBeachBarRestaurant: "BeachBarRestaurant";
    updateCartFood: "CartFood";
    updateCartNote: "CartNote";
    updateCartProduct: "CartProduct";
    updateCustomer: "Customer";
    updateCustomerPaymentMethod: "Card";
    updateFavouriteBeachBar: "UserFavoriteBar";
    updateFood: "Food";
    updateProduct: "Product";
    updateProductReservationLimit: "ProductReservationLimit";
    updateRestaurantFoodItem: "RestaurantFoodItem";
    updateReview: "BeachBarReview";
    updateReviewVote: "BeachBarReview";
    updateSearch: "UserSearch";
    updateUser: "User";
    uploadSingleFile: "File";
    verifyUserPaymentForReview: "Boolean";
  };
  Owner: {
    // field return type name
    id: "ID";
    user: "User";
  };
  Payment: {
    // field return type name
    appFee: "Decimal";
    card: "Card";
    cart: "Cart";
    deletedAt: "DateTime";
    id: "BigInt";
    isRefunded: "Boolean";
    refCode: "String";
    reservedProducts: "ReservedProduct";
    status: "PaymentStatus";
    stripeId: "String";
    stripeProccessingFee: "Decimal";
    timestamp: "DateTime";
    total: "Float";
  };
  PaymentStatus: {
    // field return type name
    id: "ID";
    name: "String";
  };
  PaymentVisits: {
    // field return type name
    beachBar: "BeachBar";
    visits: "Visit";
  };
  PaymentVisitsDates: {
    // field return type name
    month: "MonthTime";
    year: "Int";
  };
  Product: {
    // field return type name
    beachBar: "BeachBar";
    category: "ProductCategory";
    deletedAt: "DateTime";
    description: "String";
    id: "ID";
    imgUrl: "String";
    isActive: "Boolean";
    isIndividual: "Boolean";
    maxPeople: "Int";
    minFoodSpending: "Float";
    name: "String";
    price: "Float";
    reservationLimits: "ProductReservationLimit";
    updatedAt: "DateTime";
  };
  ProductAvailability: {
    // field return type name
    product: "Product";
    quantity: "Int";
  };
  ProductAvailabilityHour: {
    // field return type name
    hourTime: "HourTime";
    isAvailable: "Boolean";
  };
  ProductCategory: {
    // field return type name
    components: "ProductCategoryComponent";
    description: "String";
    id: "ID";
    name: "String";
    underscoredName: "String";
  };
  ProductCategoryComponent: {
    // field return type name
    category: "ProductCategory";
    component: "ProductComponent";
    quantity: "Int";
  };
  ProductComponent: {
    // field return type name
    icon: "Icon";
    id: "ID";
    name: "String";
  };
  ProductRecommended: {
    // field return type name
    product: "Product";
    quantity: "Int";
  };
  ProductReservationLimit: {
    // field return type name
    endTime: "HourTime";
    from: "DateTime";
    id: "BigInt";
    limitNumber: "Int";
    product: "Product";
    startTime: "HourTime";
    to: "DateTime";
  };
  QuarterTime: {
    // field return type name
    id: "ID";
    utcValue: "Time";
    value: "DateTime";
  };
  Query: {
    // field return type name
    accessToken: "String";
    account: "Account";
    accountLink: "String";
    availableHours: "HourTime";
    availableProducts: "Product";
    beachBar: "BeachBar";
    beachBarImgs: "BeachBarImgUrl";
    cart: "Cart";
    cartEntryFees: "Float";
    citiesAndRegions: "CitiesAndRegions";
    customer: "Customer";
    customerPaymentMethods: "Card";
    dashboardBilling: "DashboardBilling";
    dashboardBookings: "DashboardBookings";
    dashboardHomePage: "DashboardHomePage";
    favouriteBeachBars: "UserFavoriteBar";
    food: "Food";
    foods: "Food";
    getAllBeachBars: "BeachBar";
    getFacebookOAuthUrl: "URL";
    getGoogleOAuthUrl: "URL";
    getInstagramOAuthUrl: "URL";
    getPersonalizedBeachBars: "BeachBar";
    getProductAvailabilityHours: "ProductAvailabilityHour";
    getProductAvailabilityQuantity: "Int";
    getStripeLoginLink: "URL";
    hasProductReservationLimit: "AvailableProduct";
    hello: "String";
    hey: "Boolean";
    me: "User";
    nearBeachBars: "BeachBar";
    payment: "Payment";
    paymentRefundAmount: "Float";
    payments: "PaymentVisits";
    product: "Product";
    products: "Product";
    review: "BeachBarReview";
    reviews: "BeachBarReview";
    search: "Search";
    searchInputValues: "SearchInputValue";
    stripeConnectUrl: "URL";
    userHistory: "UserHistoryExtended";
    userSearches: "UserSearch";
    verifyZeroCartTotal: "Boolean";
  };
  Region: {
    // field return type name
    city: "City";
    country: "Country";
    id: "ID";
    name: "String";
  };
  ReservedProduct: {
    // field return type name
    date: "DateTime";
    endTime: "HourTime";
    id: "BigInt";
    isRefunded: "Boolean";
    payment: "Payment";
    product: "Product";
    startTime: "HourTime";
  };
  RestaurantFoodItem: {
    // field return type name
    id: "BigInt";
    imgUrl: "String";
    menuCategory: "RestaurantMenuCategory";
    name: "String";
    price: "Decimal";
  };
  RestaurantMenuCategory: {
    // field return type name
    id: "ID";
    name: "String";
  };
  ReviewVisitType: {
    // field return type name
    id: "ID";
    name: "String";
  };
  ReviewVote: {
    // field return type name
    id: "BigInt";
    review: "BeachBarReview";
    timestamp: "DateTime";
    type: "ReviewVoteType";
    updatedAt: "DateTime";
    user: "User";
  };
  ReviewVoteType: {
    // field return type name
    id: "ID";
    value: "String";
  };
  S3Payload: {
    // field return type name
    signedRequest: "URL";
    url: "URL";
  };
  Search: {
    // field return type name
    results: "SearchResultType";
    search: "UserSearch";
  };
  SearchFilter: {
    // field return type name
    description: "String";
    id: "ID";
    name: "String";
    publicId: "String";
  };
  SearchInputValue: {
    // field return type name
    beachBar: "BeachBar";
    city: "City";
    country: "Country";
    formattedValue: "String";
    id: "BigInt";
    publicId: "String";
    region: "Region";
  };
  SearchResultType: {
    // field return type name
    beachBar: "BeachBar";
    hasCapacity: "Boolean";
    recommendedProducts: "ProductRecommended";
    totalPrice: "Float";
  };
  SearchSort: {
    // field return type name
    id: "ID";
    name: "String";
  };
  UpdateReservedProduct: {
    // field return type name
    reservedProduct: "ReservedProduct";
    updated: "Boolean";
  };
  User: {
    // field return type name
    account: "Account";
    email: "String";
    favoriteBars: "UserFavoriteBar";
    firstName: "String";
    fullName: "String";
    id: "ID";
    lastName: "String";
    reviewVotes: "ReviewVote";
    reviews: "BeachBarReview";
  };
  UserFavoriteBar: {
    // field return type name
    beachBar: "BeachBar";
    id: "BigInt";
    user: "User";
  };
  UserHistory: {
    // field return type name
    activity: "UserHistoryActivity";
    id: "BigInt";
    objectId: "BigInt";
    timestamp: "DateTime";
    user: "User";
  };
  UserHistoryActivity: {
    // field return type name
    id: "ID";
    name: "String";
  };
  UserHistoryExtended: {
    // field return type name
    beachBar: "BeachBar";
    search: "UserSearch";
    userHistory: "UserHistory";
  };
  UserSearch: {
    // field return type name
    adults: "Int";
    children: "Int";
    date: "DateTime";
    filters: "SearchFilter";
    id: "BigInt";
    inputValue: "SearchInputValue";
    sort: "SearchSort";
    timestamp: "DateTime";
    updatedAt: "DateTime";
    user: "User";
  };
  Visit: {
    // field return type name
    date: "Date";
    endTime: "HourTime";
    isRefunded: "Boolean";
    isUpcoming: "Boolean";
    payment: "Payment";
    startTime: "HourTime";
  };
  VoteCategory: {
    // field return type name
    description: "String";
    id: "ID";
    refCode: "String";
    title: "String";
  };
  VoteTag: {
    // field return type name
    category: "VoteCategory";
    downvotes: "Int";
    id: "ID";
    totalVotes: "Int";
    upvotes: "Int";
  };
  DashboardBillingField: {
    // field return type name
    revenue: "DashboardDateValue";
  };
}

export interface NexusGenArgTypes {
  Cart: {
    foods: {
      // args
      beachBarId?: StringOrNumber | null; // ID
    };
    notes: {
      // args
      beachBarId?: StringOrNumber | null; // ID
    };
    products: {
      // args
      beachBarId?: StringOrNumber | null; // ID
    };
  };
  Mutation: {
    addBeachBar: {
      // args
      categoryId: StringOrNumber; // ID!
      closingTimeId: StringOrNumber; // ID!
      code: string; // String!
      contactPhoneNumber: string; // String!
      description?: string | null; // String
      hidePhoneNumber?: boolean | null; // Boolean
      name: string; // String!
      openingTimeId: StringOrNumber; // ID!
      state: string; // String!
      thumbnailUrl?: NexusGenScalars["URL"] | null; // URL
      zeroCartTotal: boolean; // Boolean!
    };
    addBeachBarFeature: {
      // args
      beachBarId: StringOrNumber; // ID!
      description?: string | null; // String
      featureId: StringOrNumber; // ID!
      quantity: number; // Int!
    };
    addBeachBarImgUrl: {
      // args
      beachBarId: StringOrNumber; // ID!
      description?: string | null; // String
      imgUrl: NexusGenScalars["URL"]; // URL!
    };
    addBeachBarLocation: {
      // args
      address: string; // String!
      beachBarId: StringOrNumber; // ID!
      city: string; // String!
      countryId: StringOrNumber; // ID!
      latitude: string; // String!
      longitude: string; // String!
      region?: StringOrNumber | null; // ID
      zipCode?: string | null; // String
    };
    addBeachBarOwner: {
      // args
      beachBarId: StringOrNumber; // ID!
      isPrimary?: boolean | null; // Boolean
      userId?: StringOrNumber | null; // ID
    };
    addBeachBarRestaurant: {
      // args
      beachBarId: StringOrNumber; // ID!
      description?: string | null; // String
      isActive?: boolean | null; // Boolean
      name: string; // String!
    };
    addBeachBarStyles: {
      // args
      beachBarId: StringOrNumber; // ID!
      styleIds: StringOrNumber[]; // [ID!]!
    };
    addCartFood: {
      // args
      cartId: StringOrNumber; // ID!
      foodId: StringOrNumber; // ID!
      quantity?: number | null; // Int
    };
    addCartNote: {
      // args
      beachBarId: StringOrNumber; // ID!
      body: string; // String!
      cartId: StringOrNumber; // ID!
    };
    addCartProduct: {
      // args
      cartId: StringOrNumber; // ID!
      date: NexusGenScalars["Date"]; // Date!
      endTimeId: StringOrNumber; // ID!
      people: number; // Int!
      productId: StringOrNumber; // ID!
      quantity?: number | null; // Int
      startTimeId: StringOrNumber; // ID!
    };
    addCustomerPaymentMethod: {
      // args
      cardholderName: string; // String!
      customerId?: StringOrNumber | null; // ID
      isDefault?: boolean | null; // Boolean
      savedForFuture: boolean | null; // Boolean
      source: string; // String!
    };
    addFood: {
      // args
      beachBarId: StringOrNumber; // ID!
      categoryId: StringOrNumber; // ID!
      ingredients?: string | null; // String
      maxQuantity?: number | null; // Int
      name: string; // String!
      price: number; // Float!
    };
    addProduct: {
      // args
      beachBarId: StringOrNumber; // ID!
      categoryId: StringOrNumber; // ID!
      description?: string | null; // String
      imgUrl?: NexusGenScalars["URL"] | null; // URL
      isActive?: boolean | null; // Boolean
      maxPeople: number; // Int!
      minFoodSpending?: number | null; // Float
      name: string; // String!
      price: number; // Float!
    };
    addProductReservationLimit: {
      // args
      endTimeId?: StringOrNumber | null; // ID
      from: NexusGenScalars["Date"]; // Date!
      limit: number; // Int!
      productId: StringOrNumber; // ID!
      startTimeId?: StringOrNumber | null; // ID
      to: NexusGenScalars["Date"]; // Date!
    };
    addRestaurantFoodItem: {
      // args
      imgUrl?: NexusGenScalars["URL"] | null; // URL
      menuCategoryId: number; // Int!
      name: string; // String!
      price: number; // Float!
      restaurantId: StringOrNumber; // ID!
    };
    addReview: {
      // args
      beachBarId: StringOrNumber; // ID!
      body?: string | null; // String
      monthId?: StringOrNumber | null; // ID
      negativeComment?: string | null; // String
      paymentRefCode?: string | null; // String
      positiveComment?: string | null; // String
      ratingValue: number; // Int!
      visitTypeId?: StringOrNumber | null; // ID
    };
    authorize: {
      // args
      isPrimaryOwner?: boolean | null; // Boolean
      loginDetails?: NexusGenInputs["UserLoginDetails"] | null; // UserLoginDetails
      provider: NexusGenEnums["OAuthProvider"]; // OAuthProvider!
      user: NexusGenInputs["OAuthUserInput"]; // OAuthUserInput!
    };
    authorizeWithFacebook: {
      // args
      code: string; // String!
      isPrimaryOwner?: boolean | null; // Boolean
      loginDetails?: NexusGenInputs["UserLoginDetails"] | null; // UserLoginDetails
      state: string; // String!
    };
    authorizeWithGoogle: {
      // args
      code: string; // String!
      isPrimaryOwner?: boolean | null; // Boolean
      loginDetails?: NexusGenInputs["UserLoginDetails"] | null; // UserLoginDetails
      state: string; // String!
    };
    authorizeWithInstagram: {
      // args
      code: string; // String!
      email: NexusGenScalars["Email"]; // Email!
      isPrimaryOwner?: boolean | null; // Boolean
      loginDetails?: NexusGenInputs["UserLoginDetails"] | null; // UserLoginDetails
      state: string; // String!
    };
    changeUserPassword: {
      // args
      email: NexusGenScalars["Email"]; // Email!
      newPassword: string; // String!
      token: string; // String!
    };
    checkout: {
      // args
      cardId: StringOrNumber; // ID!
      cartId: StringOrNumber; // ID!
      voucherCode?: string | null; // String
    };
    completeBeachBarSignUp: {
      // args
      beachBarId: StringOrNumber; // ID!
    };
    deleteBeachBar: {
      // args
      id: StringOrNumber; // ID!
    };
    deleteBeachBarFeature: {
      // args
      id: StringOrNumber; // ID!
    };
    deleteBeachBarImgUrl: {
      // args
      id: StringOrNumber; // ID!
    };
    deleteBeachBarOwner: {
      // args
      beachBarId: StringOrNumber; // ID!
      ownerId: StringOrNumber; // ID!
    };
    deleteBeachBarRestaurant: {
      // args
      id: StringOrNumber; // ID!
    };
    deleteBeachBarStyles: {
      // args
      beachBarId: StringOrNumber; // ID!
      styleIds: StringOrNumber[]; // [ID!]!
    };
    deleteCart: {
      // args
      cartId: StringOrNumber; // ID!
    };
    deleteCartFood: {
      // args
      id: StringOrNumber; // ID!
    };
    deleteCartProduct: {
      // args
      id: StringOrNumber; // ID!
    };
    deleteCustomer: {
      // args
      customerId?: StringOrNumber | null; // ID
    };
    deleteCustomerPaymentMethod: {
      // args
      cardId: StringOrNumber; // ID!
    };
    deleteFood: {
      // args
      foodId: StringOrNumber; // ID!
    };
    deleteProduct: {
      // args
      productId: StringOrNumber; // ID!
    };
    deleteProductReservationLimit: {
      // args
      id: StringOrNumber; // ID!
    };
    deleteRestaurantFoodItem: {
      // args
      id: StringOrNumber; // ID!
    };
    deleteReview: {
      // args
      id: StringOrNumber; // ID!
    };
    deleteUserFavoriteBar: {
      // args
      beachBarId: StringOrNumber; // ID!
    };
    hello: {
      // args
      name?: string | null; // String
    };
    login: {
      // args
      loginDetails?: NexusGenInputs["UserLoginDetails"] | null; // UserLoginDetails
      userCredentials: NexusGenInputs["UserCredentials"]; // UserCredentials!
    };
    refundPayment: {
      // args
      id: StringOrNumber; // ID!
    };
    restoreBeachBarProduct: {
      // args
      productId: StringOrNumber; // ID!
    };
    sendForgotPasswordLink: {
      // args
      email: NexusGenScalars["Email"]; // Email!
    };
    signS3: {
      // args
      filename: string; // String!
      filetype: string; // String!
      s3Bucket: string; // String!
    };
    signUp: {
      // args
      isPrimaryOwner?: boolean | null; // Boolean
      userCredentials: NexusGenInputs["UserCredentials"]; // UserCredentials!
    };
    updateBeachBaImgUrl: {
      // args
      description?: string | null; // String
      id: StringOrNumber; // ID!
    };
    updateBeachBar: {
      // args
      categoryId?: StringOrNumber | null; // ID
      closingTimeId?: StringOrNumber | null; // ID
      contactPhoneNumber?: string | null; // String
      description?: string | null; // String
      displayRegardlessCapacity?: boolean | null; // Boolean
      hidePhoneNumber?: boolean | null; // Boolean
      id: StringOrNumber; // ID!
      isActive?: boolean | null; // Boolean
      name?: string | null; // String
      openingTimeId?: StringOrNumber | null; // ID
      thumbnailUrl?: NexusGenScalars["URL"] | null; // URL
      zeroCartTotal?: boolean | null; // Boolean
    };
    updateBeachBarFeature: {
      // args
      description?: string | null; // String
      id: StringOrNumber; // ID!
      quantity?: number | null; // Int
    };
    updateBeachBarLocation: {
      // args
      address?: string | null; // String
      city?: string | null; // String
      countryId?: StringOrNumber | null; // ID
      latitude?: string | null; // String
      locationId: StringOrNumber; // ID!
      longitude?: string | null; // String
      region?: string | null; // String
      zipCode?: string | null; // String
    };
    updateBeachBarOwner: {
      // args
      beachBarId: StringOrNumber; // ID!
      isPrimary?: boolean | null; // Boolean
      ownerId: StringOrNumber; // ID!
      publicInfo?: boolean | null; // Boolean
    };
    updateBeachBarRestaurant: {
      // args
      description?: string | null; // String
      isActive?: boolean | null; // Boolean
      name?: string | null; // String
      restaurantId: StringOrNumber; // ID!
    };
    updateCartFood: {
      // args
      id: StringOrNumber; // ID!
      quantity: number; // Int!
    };
    updateCartNote: {
      // args
      body: string; // String!
      id: StringOrNumber; // ID!
    };
    updateCartProduct: {
      // args
      id: StringOrNumber; // ID!
      quantity?: number | null; // Int
    };
    updateCustomer: {
      // args
      countryIsoCode?: string | null; // String
      customerId: StringOrNumber; // ID!
      phoneNumber?: string | null; // String
    };
    updateCustomerPaymentMethod: {
      // args
      cardId: StringOrNumber; // ID!
      cardholderName?: string | null; // String
      expMonth?: number | null; // Int
      expYear?: number | null; // Int
      isDefault?: boolean | null; // Boolean
    };
    updateFavouriteBeachBar: {
      // args
      slug: StringOrNumber; // ID!
    };
    updateFood: {
      // args
      categoryId?: StringOrNumber | null; // ID
      id: StringOrNumber; // ID!
      ingredients?: string | null; // String
      maxQuantity?: number | null; // Int
      name?: string | null; // String
      price?: number | null; // Float
    };
    updateProduct: {
      // args
      categoryId?: StringOrNumber | null; // ID
      description?: string | null; // String
      imgUrl?: NexusGenScalars["URL"] | null; // URL
      isActive?: boolean | null; // Boolean
      maxPeople?: number | null; // Int
      minFoodSpending?: number | null; // Float
      name?: string | null; // String
      price?: number | null; // Float
      productId: StringOrNumber; // ID!
    };
    updateProductReservationLimit: {
      // args
      id: StringOrNumber; // ID!
      limit?: number | null; // Int
    };
    updateRestaurantFoodItem: {
      // args
      foodItemId: StringOrNumber; // ID!
      imgUrl?: NexusGenScalars["URL"] | null; // URL
      menuCategoryId?: StringOrNumber | null; // ID
      name?: string | null; // String
      price?: number | null; // Float
    };
    updateReview: {
      // args
      answer?: string | null; // String
      body?: string | null; // String
      id: StringOrNumber; // ID!
      monthId?: StringOrNumber | null; // ID
      negativeComment?: string | null; // String
      positiveComment?: string | null; // String
      ratingValue?: number | null; // Int
      visitTypeId?: StringOrNumber | null; // ID
    };
    updateReviewVote: {
      // args
      downvote?: boolean | null; // Boolean
      reviewId: StringOrNumber; // ID!
      upvote?: boolean | null; // Boolean
    };
    updateSearch: {
      // args
      filterIds?: string[] | null; // [String!]
      searchId: StringOrNumber; // ID!
    };
    updateUser: {
      // args
      address?: string | null; // String
      birthday?: string | null; // String
      city?: string | null; // String
      countryId?: StringOrNumber | null; // ID
      email?: NexusGenScalars["Email"] | null; // Email
      firstName?: string | null; // String
      honorificTitle?: string | null; // String
      imgUrl?: NexusGenScalars["URL"] | null; // URL
      lastName?: string | null; // String
      phoneNumber?: string | null; // String
      telCountryId?: StringOrNumber | null; // ID
      trackHistory?: boolean | null; // Boolean
      zipCode?: string | null; // String
    };
    uploadSingleFile: {
      // args
      file: NexusGenScalars["Upload"]; // Upload!
    };
    verifyUserPaymentForReview: {
      // args
      beachBarId: StringOrNumber; // ID!
      refCode?: string | null; // String
    };
  };
  Payment: {
    total: {
      // args
      beachBarId?: StringOrNumber | null; // ID
    };
  };
  Query: {
    accountLink: {
      // args
      id: StringOrNumber; // ID!
    };
    availableHours: {
      // args
      beachBarId: StringOrNumber; // ID!
      date: NexusGenScalars["Date"]; // Date!
    };
    availableProducts: {
      // args
      availability?: NexusGenInputs["SearchInput"] | null; // SearchInput
      beachBarId: StringOrNumber; // ID!
    };
    beachBar: {
      // args
      id?: StringOrNumber | null; // ID
      slug?: string | null; // String
      userVisit: boolean | null; // Boolean
    };
    beachBarImgs: {
      // args
      slug: string; // String!
    };
    cart: {
      // args
      cartId?: StringOrNumber | null; // ID
    };
    cartEntryFees: {
      // args
      beachBarId?: StringOrNumber | null; // ID
      cartId: StringOrNumber; // ID!
    };
    customer: {
      // args
      countryId?: StringOrNumber | null; // ID
      email?: NexusGenScalars["Email"] | null; // Email
      phoneNumber?: string | null; // String
    };
    dashboardBilling: {
      // args
      beachBarId: StringOrNumber; // ID!
      dates?: NexusGenInputs["DashboardDatesArg"] | null; // DashboardDatesArg
    };
    dashboardBookings: {
      // args
      beachBarId: StringOrNumber; // ID!
      dates?: NexusGenInputs["DashboardDatesArg"] | null; // DashboardDatesArg
    };
    dashboardHomePage: {
      // args
      beachBarId: StringOrNumber; // ID!
      dates?: NexusGenInputs["DashboardDatesArg"] | null; // DashboardDatesArg
    };
    favouriteBeachBars: {
      // args
      limit?: number | null; // Int
    };
    food: {
      // args
      id: StringOrNumber; // ID!
    };
    foods: {
      // args
      beachBarId: StringOrNumber; // ID!
    };
    getProductAvailabilityHours: {
      // args
      date: NexusGenScalars["Date"]; // Date!
      productId: StringOrNumber; // ID!
    };
    getProductAvailabilityQuantity: {
      // args
      date: NexusGenScalars["Date"]; // Date!
      endTimeId: number; // Int!
      productId: StringOrNumber; // ID!
      startTimeId: number; // Int!
    };
    getStripeLoginLink: {
      // args
      beachBarId: StringOrNumber; // ID!
    };
    hasProductReservationLimit: {
      // args
      date: NexusGenScalars["Date"]; // Date!
      productId: StringOrNumber; // ID!
    };
    nearBeachBars: {
      // args
      latitude: string; // String!
      longitude: string; // String!
      take?: number | null; // Int
    };
    payment: {
      // args
      refCode: StringOrNumber; // ID!
    };
    paymentRefundAmount: {
      // args
      refCode: StringOrNumber; // ID!
    };
    payments: {
      // args
      monthId?: StringOrNumber | null; // ID
      year?: number | null; // Int
    };
    product: {
      // args
      id: StringOrNumber; // ID!
    };
    products: {
      // args
      beachBarId: StringOrNumber; // ID!
    };
    review: {
      // args
      reviewId: StringOrNumber; // ID!
    };
    search: {
      // args
      availability?: NexusGenInputs["SearchInput"] | null; // SearchInput
      filterIds?: string[] | null; // [String!]
      inputId?: StringOrNumber | null; // ID
      searchId?: StringOrNumber | null; // ID
      searchValue?: string | null; // String
      sortId?: StringOrNumber | null; // ID
    };
    stripeConnectUrl: {
      // args
      phoneNumber?: string | null; // String
    };
    userSearches: {
      // args
      limit?: number | null; // Int
    };
    verifyZeroCartTotal: {
      // args
      cartId: StringOrNumber; // ID!
    };
  };
}

export interface NexusGenAbstractTypeMembers {
  AddPaymentResult: "AddPayment" | "Error";
  AddReservedProductResult: "AddReservedProduct" | "Error";
  UpdateReservedProductResult: "Error" | "UpdateReservedProduct";
  UserTypeResult: "Error" | "User";
  DashboardBillingField: "DashboardBillingFoods" | "DashboardBillingProducts";
}

export interface NexusGenTypeInterfaces {
  DashboardBillingFoods: "DashboardBillingField";
  DashboardBillingProducts: "DashboardBillingField";
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = keyof NexusGenUnions;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType =
  | "AddPaymentResult"
  | "AddReservedProductResult"
  | "DashboardBillingField"
  | "UpdateReservedProductResult"
  | "UserTypeResult";

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false;
    resolveType: true;
    __typename: false;
  };
};

export interface NexusGenTypes {
  context: MyContext;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes["inputNames"] | NexusGenTypes["enumNames"] | NexusGenTypes["scalarNames"];
  allOutputTypes:
    | NexusGenTypes["objectNames"]
    | NexusGenTypes["enumNames"]
    | NexusGenTypes["unionNames"]
    | NexusGenTypes["interfaceNames"]
    | NexusGenTypes["scalarNames"];
  allNamedTypes: NexusGenTypes["allInputTypes"] | NexusGenTypes["allOutputTypes"];
  abstractTypes: NexusGenTypes["interfaceNames"] | NexusGenTypes["unionNames"];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}

declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>;
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {}
  interface NexusGenPluginSchemaConfig {}
  interface NexusGenPluginArgConfig {}
}
