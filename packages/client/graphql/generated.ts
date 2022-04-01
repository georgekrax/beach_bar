import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `BigInt` scalar type represents non-fractional signed whole numeric values.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
   */
  BigInt: number;
  /** The `Byte` scalar type represents byte value as a Buffer */
  Bytes: any;
  /** Use JavaScript Date object for date-only fields. */
  Date: string;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: string;
  /** An arbitrary-precision Decimal type */
  Decimal: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  Email: string;
  /** A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4. */
  IPv4: string;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  Json: any;
  /** A time string at UTC, such as 10:15:30Z */
  Time: string;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: string;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

/** Represents a user's account */
export type Account = {
  readonly __typename?: 'Account';
  readonly address: Maybe<Scalars['String']>;
  readonly age: Maybe<Scalars['Int']>;
  readonly birthday: Maybe<Scalars['DateTime']>;
  readonly city: Maybe<Scalars['String']>;
  readonly country: Maybe<Country>;
  readonly honorificTitle: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly imgUrl: Maybe<Scalars['String']>;
  readonly phoneNumber: Maybe<Scalars['String']>;
  readonly telCountry: Maybe<Country>;
  readonly trackHistory: Scalars['Boolean'];
  readonly user: User;
  readonly zipCode: Maybe<Scalars['String']>;
};

/** Info to be returned when a payment is created (made) */
export type AddPayment = {
  readonly __typename?: 'AddPayment';
  /** A boolean that indicates if the payments have been successfully created (made) */
  readonly added: Scalars['Boolean'];
  /** The payment that is created (made) */
  readonly payment: Payment;
};

export type AddPaymentResult = AddPayment | Error;

/** Info to be returned when a product is marked (added) as a reserved one from a payment */
export type AddReservedProduct = {
  readonly __typename?: 'AddReservedProduct';
  /** A boolean that indicates if the product has been successfully marked as a reserved one */
  readonly added: Scalars['Boolean'];
  /** The product that is marked as a reserved one */
  readonly reservedProduct: ReservedProduct;
};

export type AddReservedProductResult = AddReservedProduct | Error;

/** Info to be returned, when checking if a #beach_bar product is available */
export type AvailableProduct = {
  readonly __typename?: 'AvailableProduct';
  /** The hour, to check if available */
  readonly hourTime: HourTime;
  /** A boolean that indicates if the product is available in the hour time */
  readonly isAvailable: Scalars['Boolean'];
};

/** Represents a #beach_bar */
export type BeachBar = {
  readonly __typename?: 'BeachBar';
  readonly avgRating: Scalars['Float'];
  readonly category: BeachBarCategory;
  readonly closingTime: HourTime;
  readonly contactPhoneNumber: Scalars['String'];
  readonly currency: Currency;
  readonly description: Maybe<Scalars['String']>;
  readonly displayRegardlessCapacity: Scalars['Boolean'];
  readonly entryFee: Maybe<Scalars['Decimal']>;
  readonly features: ReadonlyArray<BeachBarFeature>;
  readonly foods: ReadonlyArray<Food>;
  readonly hasCompletedSignUp: Maybe<Scalars['Boolean']>;
  readonly hidePhoneNumber: Scalars['Boolean'];
  readonly id: Scalars['ID'];
  readonly imgUrls: ReadonlyArray<BeachBarImgUrl>;
  readonly isActive: Scalars['Boolean'];
  readonly location: BeachBarLocation;
  readonly name: Scalars['String'];
  readonly openingTime: HourTime;
  readonly owners: ReadonlyArray<BeachBarOwner>;
  /** A list with all the payments of a #beach_bar */
  readonly payments: ReadonlyArray<Payment>;
  readonly products: ReadonlyArray<Product>;
  readonly restaurants: ReadonlyArray<BeachBarRestaurant>;
  readonly reviews: ReadonlyArray<BeachBarReview>;
  readonly slug: Scalars['String'];
  readonly styles: ReadonlyArray<BeachBarStyle>;
  readonly thumbnailUrl: Maybe<Scalars['String']>;
  readonly timestamp: Scalars['DateTime'];
  readonly updatedAt: Scalars['DateTime'];
  readonly zeroCartTotal: Scalars['Boolean'];
};

/** Represents a #beach_bar's category */
export type BeachBarCategory = {
  readonly __typename?: 'BeachBarCategory';
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a #beach_bar's feature (service) & its details */
export type BeachBarFeature = {
  readonly __typename?: 'BeachBarFeature';
  readonly beachBar: BeachBar;
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['BigInt'];
  readonly quantity: Scalars['Int'];
  readonly service: BeachBarService;
  readonly timestamp: Scalars['DateTime'];
  readonly updatedAt: Scalars['DateTime'];
};

/** Represents a #beach_bar's image (URL value) */
export type BeachBarImgUrl = {
  readonly __typename?: 'BeachBarImgUrl';
  readonly beachBar: BeachBar;
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['BigInt'];
  readonly imgUrl: Scalars['String'];
  readonly timestamp: Scalars['DateTime'];
  readonly updatedAt: Scalars['DateTime'];
};

/** Represents a #beach_bar's location details */
export type BeachBarLocation = {
  readonly __typename?: 'BeachBarLocation';
  readonly address: Scalars['String'];
  readonly city: City;
  readonly country: Country;
  /** Get the location of the #beach_bar formatted */
  readonly formattedLocation: Scalars['String'];
  readonly id: Scalars['ID'];
  readonly latitude: Scalars['Decimal'];
  readonly longitude: Scalars['Decimal'];
  readonly region: Maybe<Region>;
  /** The 'point' value generated from latitude & longitude, provided by the PostGIS PostgreSQL extension */
  readonly whereIs: Maybe<ReadonlyArray<Scalars['Float']>>;
  readonly zipCode: Maybe<Scalars['String']>;
};

/** Represents a #beach_bar's owner */
export type BeachBarOwner = {
  readonly __typename?: 'BeachBarOwner';
  readonly beachBar: BeachBar;
  readonly id: Scalars['ID'];
  readonly isPrimary: Scalars['Boolean'];
  readonly owner: Owner;
  readonly publicInfo: Maybe<Scalars['Boolean']>;
  readonly timestamp: Scalars['DateTime'];
};

/** Represents a #beach_bar's restaurant */
export type BeachBarRestaurant = {
  readonly __typename?: 'BeachBarRestaurant';
  readonly beachBar: BeachBar;
  readonly description: Maybe<Scalars['String']>;
  readonly foodItems: ReadonlyArray<RestaurantFoodItem>;
  readonly id: Scalars['ID'];
  readonly isActive: Scalars['Boolean'];
  readonly name: Scalars['String'];
};

/** Represents a #beach_bar's review, by a customer */
export type BeachBarReview = {
  readonly __typename?: 'BeachBarReview';
  readonly answer: Maybe<Scalars['String']>;
  readonly beachBar: BeachBar;
  readonly body: Maybe<Scalars['String']>;
  readonly customer: Customer;
  readonly id: Scalars['ID'];
  readonly month: Maybe<MonthTime>;
  readonly negativeComment: Maybe<Scalars['String']>;
  readonly payment: Payment;
  readonly positiveComment: Maybe<Scalars['String']>;
  readonly ratingValue: Scalars['Int'];
  readonly timestamp: Scalars['DateTime'];
  readonly updatedAt: Scalars['DateTime'];
  readonly visitType: Maybe<ReviewVisitType>;
  readonly votes: ReadonlyArray<ReviewVote>;
};

/** Represents a service (feature), which a #beach_bar can provide */
export type BeachBarService = {
  readonly __typename?: 'BeachBarService';
  readonly icon: Icon;
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** The style of a #beach_bar */
export type BeachBarStyle = {
  readonly __typename?: 'BeachBarStyle';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a customer's credit or debit card */
export type Card = {
  readonly __typename?: 'Card';
  readonly brand: Maybe<CardBrand>;
  readonly cardholderName: Scalars['String'];
  readonly country: Maybe<Country>;
  readonly customer: Customer;
  readonly expMonth: Maybe<Scalars['Int']>;
  readonly expYear: Maybe<Scalars['Int']>;
  readonly id: Scalars['BigInt'];
  readonly isDefault: Scalars['Boolean'];
  readonly last4: Scalars['String'];
  readonly stripeId: Scalars['String'];
  readonly type: Scalars['String'];
};

/** Represents the brand of a credit or debit card */
export type CardBrand = {
  readonly __typename?: 'CardBrand';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a shopping cart */
export type Cart = {
  readonly __typename?: 'Cart';
  readonly foods: ReadonlyArray<CartFood>;
  readonly foodsTotal: Scalars['Decimal'];
  readonly id: Scalars['BigInt'];
  readonly notes: ReadonlyArray<CartNote>;
  readonly products: ReadonlyArray<CartProduct>;
  readonly productstotal: Scalars['Decimal'];
  readonly total: Scalars['Decimal'];
  readonly user: Maybe<User>;
};


/** Represents a shopping cart */
export type CartFoodsArgs = {
  beachBarId: InputMaybe<Scalars['ID']>;
};


/** Represents a shopping cart */
export type CartNotesArgs = {
  beachBarId: InputMaybe<Scalars['ID']>;
};


/** Represents a shopping cart */
export type CartProductsArgs = {
  beachBarId: InputMaybe<Scalars['ID']>;
};

/** Represents a food listed in a shoppingcart */
export type CartFood = {
  readonly __typename?: 'CartFood';
  readonly cart: Cart;
  readonly date: Maybe<Scalars['DateTime']>;
  readonly deletedAt: Maybe<Scalars['DateTime']>;
  readonly food: Food;
  readonly id: Scalars['BigInt'];
  readonly quantity: Scalars['Int'];
  readonly timestamp: Scalars['DateTime'];
  readonly total: Maybe<Scalars['Float']>;
  readonly updatedAt: Scalars['DateTime'];
};

/** Represents a note of the user, added in its shopping cart, for the #beach_bar(s), it is going to visit */
export type CartNote = {
  readonly __typename?: 'CartNote';
  readonly beachBar: BeachBar;
  readonly body: Scalars['String'];
  readonly cart: Cart;
  readonly id: Scalars['BigInt'];
  readonly timestamp: Scalars['DateTime'];
};

/** Represents a shopping cart with its products */
export type CartProduct = {
  readonly __typename?: 'CartProduct';
  readonly cart: Cart;
  readonly date: Scalars['DateTime'];
  readonly endTime: HourTime;
  readonly id: Scalars['BigInt'];
  readonly people: Scalars['Int'];
  readonly product: Product;
  readonly quantity: Scalars['Int'];
  readonly startTime: HourTime;
  readonly timestamp: Scalars['DateTime'];
  readonly total: Maybe<Scalars['Float']>;
};

/** Represents an object with an array of cities and regions */
export type CitiesAndRegions = {
  readonly __typename?: 'CitiesAndRegions';
  readonly cities: ReadonlyArray<City>;
  readonly regions: ReadonlyArray<Region>;
};

/** Represents a city of a country */
export type City = {
  readonly __typename?: 'City';
  readonly country: Country;
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a country */
export type Country = {
  readonly __typename?: 'Country';
  readonly alpha2Code: Scalars['String'];
  readonly alpha3Code: Scalars['String'];
  readonly callingCode: Scalars['String'];
  readonly cities: ReadonlyArray<City>;
  readonly currency: Currency;
  readonly id: Scalars['ID'];
  readonly isEu: Scalars['Boolean'];
  readonly name: Scalars['String'];
};

/** Represents a currency */
export type Currency = {
  readonly __typename?: 'Currency';
  readonly id: Scalars['ID'];
  readonly isoCode: Scalars['String'];
  readonly name: Scalars['String'];
  readonly secondSymbol: Maybe<Scalars['String']>;
  readonly symbol: Scalars['String'];
};

/** Represents a customer */
export type Customer = {
  readonly __typename?: 'Customer';
  readonly cards: ReadonlyArray<Card>;
  readonly country: Maybe<Country>;
  readonly email: Maybe<Scalars['String']>;
  readonly id: Scalars['BigInt'];
  readonly phoneNumber: Maybe<Scalars['String']>;
  readonly user: Maybe<User>;
};

/** Revenue and number of successful payments of a #beach_bar */
export type DashboardBalance = {
  readonly __typename?: 'DashboardBalance';
  /** Today's gross volume of each operating hour */
  readonly grossVolume: ReadonlyArray<DashboardDateValue>;
  readonly revenue: Scalars['Float'];
  readonly successfulPayments: ReadonlyArray<Payment>;
};

/** Data fetched for the dashboard billing page */
export type DashboardBilling = {
  readonly __typename?: 'DashboardBilling';
  /** Average foods purchased per payment */
  readonly avgFoods: ReadonlyArray<DashboardDateValue>;
  /** Average product booked per payment */
  readonly avgProducts: ReadonlyArray<DashboardDateValue>;
  readonly customersCountries: ReadonlyArray<DashboardBillingCustomerCountries>;
  readonly foods: DashboardBillingFoods;
  readonly products: DashboardBillingProducts;
  readonly refundedPayments: ReadonlyArray<DashboardBillingRefundedPayments>;
};

export type DashboardBillingCustomerCountries = {
  readonly __typename?: 'DashboardBillingCustomerCountries';
  readonly country: Country;
  readonly value: Scalars['Int'];
};

export type DashboardBillingField = {
  readonly revenue: ReadonlyArray<DashboardDateValue>;
};

/** Foods revenue, difference from the yesterday, average foods per payment */
export type DashboardBillingFoods = DashboardBillingField & {
  readonly __typename?: 'DashboardBillingFoods';
  readonly mostCommon: ReadonlyArray<DashboardBillingMostCommonFoods>;
  readonly revenue: ReadonlyArray<DashboardDateValue>;
};

export type DashboardBillingMostCommonFoods = {
  readonly __typename?: 'DashboardBillingMostCommonFoods';
  readonly food: Food;
  readonly timesPurchased: Scalars['Int'];
};

export type DashboardBillingMostCommonProducts = {
  readonly __typename?: 'DashboardBillingMostCommonProducts';
  readonly product: Product;
  readonly timesBooked: Scalars['Int'];
};

/** Products revenue, difference from the yesterday, average products per payment */
export type DashboardBillingProducts = DashboardBillingField & {
  readonly __typename?: 'DashboardBillingProducts';
  readonly mostCommon: ReadonlyArray<DashboardBillingMostCommonProducts>;
  readonly revenue: ReadonlyArray<DashboardDateValue>;
};

export type DashboardBillingRefundedPayments = {
  readonly __typename?: 'DashboardBillingRefundedPayments';
  readonly date: Scalars['Date'];
  readonly payments: ReadonlyArray<Payment>;
};

/** Data fetched for the dashboard bookings page */
export type DashboardBookings = {
  readonly __typename?: 'DashboardBookings';
  readonly bookings: ReadonlyArray<Payment>;
  readonly capacity: DashboardBookingsCapacity;
  readonly mostActive: DashboardMostActive;
};

/** Capacity percentage of customers and number of products booked */
export type DashboardBookingsCapacity = {
  readonly __typename?: 'DashboardBookingsCapacity';
  readonly arr: ReadonlyArray<DashboardCapacityPercentage>;
  readonly maxCapacity: ReadonlyArray<DashboardMaxCapacity>;
  readonly totalCustomers: ReadonlyArray<DashboardDateValue>;
  readonly totalHourCustomers: ReadonlyArray<DashboardDateValue>;
};

/** Capacity percentage of customers and number of products booked */
export type DashboardCapacity = {
  readonly __typename?: 'DashboardCapacity';
  readonly availableProducts: Scalars['Int'];
  readonly percentage: Scalars['Float'];
  readonly reservedProducts: Scalars['Int'];
  readonly totalHourCustomers: Scalars['Int'];
  readonly totalMaxPeopleCapacity: Scalars['Int'];
};

export type DashboardCapacityPercentage = {
  readonly __typename?: 'DashboardCapacityPercentage';
  readonly date: Scalars['Date'];
  readonly percentage: Scalars['Float'];
};

export type DashboardDateValue = {
  readonly __typename?: 'DashboardDateValue';
  readonly date: Scalars['DateTime'];
  readonly value: Scalars['Float'];
};

/** The arguments to fetch data for a specific time period */
export type DashboardDatesArg = {
  readonly end: InputMaybe<Scalars['DateTime']>;
  readonly start: InputMaybe<Scalars['DateTime']>;
};

/** Data (of the day) fetched for a #beach_bar's dashboard homepage */
export type DashboardHomePage = {
  readonly __typename?: 'DashboardHomePage';
  readonly avgRating: ReadonlyArray<DashboardDateValue>;
  readonly avgSpendPerPerson: ReadonlyArray<DashboardDateValue>;
  readonly balance: DashboardBalance;
  readonly capacity: DashboardCapacity;
  readonly grossVolume: ReadonlyArray<DashboardDateValue>;
  readonly newCustomers: ReadonlyArray<DashboardNewCustomers>;
  readonly totalCustomers: ReadonlyArray<DashboardDateValue>;
};

export type DashboardMaxCapacity = {
  readonly __typename?: 'DashboardMaxCapacity';
  readonly availableProducts: Scalars['Int'];
  readonly date: Scalars['Date'];
  readonly limitPeople: Scalars['Int'];
};

export type DashboardMostActive = {
  readonly __typename?: 'DashboardMostActive';
  readonly hour: Scalars['Int'];
  readonly weekDay: Scalars['String'];
};

/** The new customers of a #beach_bar on a specific date */
export type DashboardNewCustomers = {
  readonly __typename?: 'DashboardNewCustomers';
  readonly customers: ReadonlyArray<Customer>;
  readonly date: Scalars['Date'];
};

/** Represents a formatted error */
export type Error = {
  readonly __typename?: 'Error';
  /** Returns an error in a type of string, if there is one, with a status and a message */
  readonly error: Maybe<ErrorObject>;
};

/** Represents an error object */
export type ErrorObject = {
  readonly __typename?: 'ErrorObject';
  /** The error code of the operation, it can be found in a list in the documentation */
  readonly code: Maybe<Scalars['String']>;
  /** A short description for the error occurred */
  readonly message: Maybe<Scalars['String']>;
};

/** Represents a user's uploaded file */
export type File = {
  readonly __typename?: 'File';
  /** A string representing the file encoding, such as 7bit */
  readonly encoding: Scalars['String'];
  /** A string representing the name of the uploaded file */
  readonly filename: Scalars['String'];
  /** A string representing the MIME type of the uploaded file, such as image/jpeg */
  readonly mimetype: Scalars['String'];
};

/** Represents a food item - product of a #beach_bar */
export type Food = {
  readonly __typename?: 'Food';
  readonly beachBar: BeachBar;
  readonly category: FoodCategory;
  readonly deletedAt: Maybe<Scalars['DateTime']>;
  readonly id: Scalars['BigInt'];
  readonly ingredients: Maybe<Scalars['String']>;
  readonly maxQuantity: Scalars['Int'];
  readonly name: Scalars['String'];
  readonly price: Scalars['Decimal'];
  readonly timestamp: Scalars['DateTime'];
  readonly updatedAt: Scalars['DateTime'];
};

/** Represents a category of a food a #beach_bar provides */
export type FoodCategory = {
  readonly __typename?: 'FoodCategory';
  readonly icon: Icon;
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents each hour of the day */
export type HourTime = {
  readonly __typename?: 'HourTime';
  readonly id: Scalars['ID'];
  readonly utcValue: Scalars['Time'];
  readonly value: Scalars['Int'];
};

/** Represents a SVG icon to be used in the front-end */
export type Icon = {
  readonly __typename?: 'Icon';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly publicId: Scalars['String'];
};

/** User info to be returned on login */
export type LoginAuthorize = {
  readonly __typename?: 'LoginAuthorize';
  /** The access token to authenticate & authorize the user */
  readonly accessToken: Scalars['String'];
  /** A boolean that indicates if the user has also signed up, because it is a new one */
  readonly isNewUser: Scalars['Boolean'];
  /** The access token to authenticate & authorize the user */
  readonly refreshToken: Scalars['String'];
  /** A list of the user scopes */
  readonly scope: ReadonlyArray<Scalars['String']>;
  /** The user (object) that logins */
  readonly user: User;
};

/** Represents each month of the year */
export type MonthTime = {
  readonly __typename?: 'MonthTime';
  readonly days: Scalars['Int'];
  readonly id: Scalars['ID'];
  readonly value: Scalars['String'];
};

/** Mutation */
export type Mutation = {
  readonly __typename?: 'Mutation';
  /** Add (register) a new #beach_bar to the platform */
  readonly addBeachBar: BeachBar;
  /** Add (assign) a feature to a #beach_bar. */
  readonly addBeachBarFeature: BeachBarFeature;
  /** Add an image (URL) to a #beach_bar */
  readonly addBeachBarImgUrl: BeachBarImgUrl;
  /** Add (assign) a location to a #beach_bar */
  readonly addBeachBarLocation: BeachBarLocation;
  /** Add (assign) another owner to a #beach_bar too. Only available for the primary owner of a #beach_bar */
  readonly addBeachBarOwner: BeachBarOwner;
  /** Add a restaurant of a #beach_bar */
  readonly addBeachBarRestaurant: BeachBarRestaurant;
  /** Add (assign) styles to a #beach_bar */
  readonly addBeachBarStyles: ReadonlyArray<BeachBarStyle>;
  /** Add a food to a shopping cart */
  readonly addCartFood: CartFood;
  /** Add a note to a shopping cart's #beach_bar */
  readonly addCartNote: CartNote;
  /** Add a product to a shopping cart */
  readonly addCartProduct: CartProduct;
  /** Add a payment method (credit / debit card) to a customer */
  readonly addCustomerPaymentMethod: Card;
  /** Add a food to a #beach_bar */
  readonly addFood: Food;
  /** Add a product to a #beach_bar */
  readonly addProduct: Product;
  /** Add a reservation limit to a #beach_bar product */
  readonly addProductReservationLimit: ProductReservationLimit;
  /** Add a food item to a #beach_bar restaurant */
  readonly addRestaurantFoodItem: RestaurantFoodItem;
  /** Add a customer's review on a #beach_bar */
  readonly addReview: BeachBarReview;
  readonly authorize: LoginAuthorize;
  /** Authorize a user with Facebook */
  readonly authorizeWithFacebook: LoginAuthorize;
  /** Authorize a user with Google */
  readonly authorizeWithGoogle: LoginAuthorize;
  /** Authorize a user with Instagram */
  readonly authorizeWithInstagram: LoginAuthorize;
  readonly cacheBeachBars: Scalars['Boolean'];
  /** Change a user's password */
  readonly changeUserPassword: Scalars['Boolean'];
  /** Make a payment using a customer's shopping cart */
  readonly checkout: Payment;
  /** Event fired when a #beach_bar has completed the sign up process */
  readonly completeBeachBarSignUp: Scalars['Boolean'];
  /** Delete (remove) a #beach_bar from the platform */
  readonly deleteBeachBar: Scalars['Boolean'];
  /** Delete (remove) a feature (service) from a #beach_bar. */
  readonly deleteBeachBarFeature: Scalars['Boolean'];
  /** Delete an image (URL) from a #beach_bar */
  readonly deleteBeachBarImgUrl: Scalars['Boolean'];
  /** Delete (remove) an owner from a #beach_bar */
  readonly deleteBeachBarOwner: Scalars['Boolean'];
  /** Delete (remove) a restaurant from a #beach_bar */
  readonly deleteBeachBarRestaurant: Scalars['Boolean'];
  /** Delete (remove) styles from a #beach_bar */
  readonly deleteBeachBarStyles: Scalars['Boolean'];
  /** Delete a cart after a transaction. This mutation is also called if the user is not authenticated & closes the browser tab */
  readonly deleteCart: Scalars['Boolean'];
  /** Delete (remove) a food from a shopping cart */
  readonly deleteCartFood: Scalars['Boolean'];
  /** Delete (remove) a product from a shopping cart */
  readonly deleteCartProduct: Scalars['Boolean'];
  /** Delete (remove) a customer */
  readonly deleteCustomer: Scalars['Boolean'];
  /** Delete (remove) a payment method (credit / debit card) from a customer */
  readonly deleteCustomerPaymentMethod: Scalars['Boolean'];
  /** Delete (remove) a food from a #beach_bar */
  readonly deleteFood: Scalars['Boolean'];
  /** Delete (remove) a product from a #beach_bar */
  readonly deleteProduct: Scalars['Boolean'];
  /** Delete a or some reservation limit(s) from a #beach_bar's product */
  readonly deleteProductReservationLimit: Scalars['Boolean'];
  /** Delete (remove) a food item from a #beach_bar's restaurant */
  readonly deleteRestaurantFoodItem: Scalars['Boolean'];
  /** Delete a customer's review on a #beach_bar */
  readonly deleteReview: Scalars['Boolean'];
  /**
   * Remove a #beach_bar from a user's favorites list
   * @deprecated You should use the `updateUserFavoriteBar` mutation operation, which handles automatically the creation and removement of a user's #beach_bar
   */
  readonly deleteUserFavoriteBar: Scalars['Boolean'];
  /** Sample mutation */
  readonly hello: Scalars['String'];
  /** Login a user */
  readonly login: LoginAuthorize;
  /** Logout a user */
  readonly logout: Scalars['Boolean'];
  /** Refund a payment */
  readonly refundPayment: Scalars['Boolean'];
  /** Restore a (soft) deleted #beach_bar product */
  readonly restoreBeachBarProduct: Product;
  /** Sends a link to the user's email address to change its password */
  readonly sendForgotPasswordLink: Scalars['Boolean'];
  /** Sign the S3 URL for an object */
  readonly signS3: S3Payload;
  /** Sign up a user */
  readonly signUp: User;
  /** Update the details of a #beach_bar's image */
  readonly updateBeachBaImgUrl: BeachBarImgUrl;
  /** Update a #beach_bar details */
  readonly updateBeachBar: BeachBar;
  /** Update a feature of a #beach_bar. */
  readonly updateBeachBarFeature: BeachBarFeature;
  /** Update the location details of a #beach_bar */
  readonly updateBeachBarLocation: BeachBarLocation;
  /** Update a #beach_bar's owner info */
  readonly updateBeachBarOwner: BeachBarOwner;
  /** Update the restaurant details of a #beach_bar */
  readonly updateBeachBarRestaurant: BeachBarRestaurant;
  /** Update the quantity of a food in a shopping cart */
  readonly updateCartFood: CartFood;
  /** Update the body of a shopping's cart note */
  readonly updateCartNote: CartNote;
  /** Update the quantity of a product in a shopping cart */
  readonly updateCartProduct: CartProduct;
  /** Update a customer's details */
  readonly updateCustomer: Customer;
  /** Update the details of customer's card */
  readonly updateCustomerPaymentMethod: Card;
  /** Update a user's #beach_bar favourites list */
  readonly updateFavouriteBeachBar: UserFavoriteBar;
  /** Update a #beach_bar's food info */
  readonly updateFood: Food;
  /** Update a #beach_bar's product info */
  readonly updateProduct: Product;
  /** Update a #beach_bar's product reservation limit */
  readonly updateProductReservationLimit: ProductReservationLimit;
  /** Update a #beach_bar's restaurant food item details */
  readonly updateRestaurantFoodItem: RestaurantFoodItem;
  /** Update a customer's review on a #beach_bar */
  readonly updateReview: BeachBarReview;
  /** Upvote or downvote a customer's review on a #beach_bar */
  readonly updateReviewVote: BeachBarReview;
  /** Update a previous user's search */
  readonly updateSearch: UserSearch;
  /** Update a user's info */
  readonly updateUser: User;
  /** Upload a single file */
  readonly uploadSingleFile: Maybe<File>;
  /** Verify a user's payment to submit review */
  readonly verifyUserPaymentForReview: Scalars['Boolean'];
};


/** Mutation */
export type MutationAddBeachBarArgs = {
  categoryId: Scalars['ID'];
  closingTimeId: Scalars['ID'];
  code: Scalars['String'];
  contactPhoneNumber: Scalars['String'];
  description: InputMaybe<Scalars['String']>;
  hidePhoneNumber?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  openingTimeId: Scalars['ID'];
  state: Scalars['String'];
  thumbnailUrl: InputMaybe<Scalars['URL']>;
  zeroCartTotal: Scalars['Boolean'];
};


/** Mutation */
export type MutationAddBeachBarFeatureArgs = {
  beachBarId: Scalars['ID'];
  description: InputMaybe<Scalars['String']>;
  featureId: Scalars['ID'];
  quantity?: Scalars['Int'];
};


/** Mutation */
export type MutationAddBeachBarImgUrlArgs = {
  beachBarId: Scalars['ID'];
  description: InputMaybe<Scalars['String']>;
  imgUrl: Scalars['URL'];
};


/** Mutation */
export type MutationAddBeachBarLocationArgs = {
  address: Scalars['String'];
  beachBarId: Scalars['ID'];
  city: Scalars['String'];
  countryId: Scalars['ID'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  region: InputMaybe<Scalars['ID']>;
  zipCode: InputMaybe<Scalars['String']>;
};


/** Mutation */
export type MutationAddBeachBarOwnerArgs = {
  beachBarId: Scalars['ID'];
  isPrimary?: InputMaybe<Scalars['Boolean']>;
  userId: InputMaybe<Scalars['ID']>;
};


/** Mutation */
export type MutationAddBeachBarRestaurantArgs = {
  beachBarId: Scalars['ID'];
  description: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
};


/** Mutation */
export type MutationAddBeachBarStylesArgs = {
  beachBarId: Scalars['ID'];
  styleIds: ReadonlyArray<Scalars['ID']>;
};


/** Mutation */
export type MutationAddCartFoodArgs = {
  cartId: Scalars['ID'];
  foodId: Scalars['ID'];
  quantity: InputMaybe<Scalars['Int']>;
};


/** Mutation */
export type MutationAddCartNoteArgs = {
  beachBarId: Scalars['ID'];
  body: Scalars['String'];
  cartId: Scalars['ID'];
};


/** Mutation */
export type MutationAddCartProductArgs = {
  cartId: Scalars['ID'];
  date: Scalars['Date'];
  endTimeId: Scalars['ID'];
  people: Scalars['Int'];
  productId: Scalars['ID'];
  quantity: InputMaybe<Scalars['Int']>;
  startTimeId: Scalars['ID'];
};


/** Mutation */
export type MutationAddCustomerPaymentMethodArgs = {
  cardholderName: Scalars['String'];
  customerId: InputMaybe<Scalars['ID']>;
  isDefault?: InputMaybe<Scalars['Boolean']>;
  savedForFuture?: InputMaybe<Scalars['Boolean']>;
  source: Scalars['String'];
};


/** Mutation */
export type MutationAddFoodArgs = {
  beachBarId: Scalars['ID'];
  categoryId: Scalars['ID'];
  ingredients: InputMaybe<Scalars['String']>;
  maxQuantity: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  price: Scalars['Float'];
};


/** Mutation */
export type MutationAddProductArgs = {
  beachBarId: Scalars['ID'];
  categoryId: Scalars['ID'];
  description: InputMaybe<Scalars['String']>;
  imgUrl: InputMaybe<Scalars['URL']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  maxPeople: Scalars['Int'];
  minFoodSpending: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  price: Scalars['Float'];
};


/** Mutation */
export type MutationAddProductReservationLimitArgs = {
  endTimeId: InputMaybe<Scalars['ID']>;
  from: Scalars['Date'];
  limit: Scalars['Int'];
  productId: Scalars['ID'];
  startTimeId: InputMaybe<Scalars['ID']>;
  to: Scalars['Date'];
};


/** Mutation */
export type MutationAddRestaurantFoodItemArgs = {
  imgUrl: InputMaybe<Scalars['URL']>;
  menuCategoryId: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
  restaurantId: Scalars['ID'];
};


/** Mutation */
export type MutationAddReviewArgs = {
  beachBarId: Scalars['ID'];
  body: InputMaybe<Scalars['String']>;
  monthId: InputMaybe<Scalars['ID']>;
  negativeComment: InputMaybe<Scalars['String']>;
  paymentRefCode: InputMaybe<Scalars['String']>;
  positiveComment: InputMaybe<Scalars['String']>;
  ratingValue: Scalars['Int'];
  visitTypeId: InputMaybe<Scalars['ID']>;
};


/** Mutation */
export type MutationAuthorizeArgs = {
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
  loginDetails: InputMaybe<UserLoginDetails>;
  provider: OAuthProvider;
  user: OAuthUserInput;
};


/** Mutation */
export type MutationAuthorizeWithFacebookArgs = {
  code: Scalars['String'];
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
  loginDetails: InputMaybe<UserLoginDetails>;
  state: Scalars['String'];
};


/** Mutation */
export type MutationAuthorizeWithGoogleArgs = {
  code: Scalars['String'];
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
  loginDetails: InputMaybe<UserLoginDetails>;
  state: Scalars['String'];
};


/** Mutation */
export type MutationAuthorizeWithInstagramArgs = {
  code: Scalars['String'];
  email: Scalars['Email'];
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
  loginDetails: InputMaybe<UserLoginDetails>;
  state: Scalars['String'];
};


/** Mutation */
export type MutationChangeUserPasswordArgs = {
  email: Scalars['Email'];
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


/** Mutation */
export type MutationCheckoutArgs = {
  cardId: Scalars['ID'];
  cartId: Scalars['ID'];
  voucherCode: InputMaybe<Scalars['String']>;
};


/** Mutation */
export type MutationCompleteBeachBarSignUpArgs = {
  beachBarId: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteBeachBarArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteBeachBarFeatureArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteBeachBarImgUrlArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteBeachBarOwnerArgs = {
  beachBarId: Scalars['ID'];
  ownerId: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteBeachBarRestaurantArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteBeachBarStylesArgs = {
  beachBarId: Scalars['ID'];
  styleIds: ReadonlyArray<Scalars['ID']>;
};


/** Mutation */
export type MutationDeleteCartArgs = {
  cartId: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteCartFoodArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteCartProductArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteCustomerArgs = {
  customerId: InputMaybe<Scalars['ID']>;
};


/** Mutation */
export type MutationDeleteCustomerPaymentMethodArgs = {
  cardId: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteFoodArgs = {
  foodId: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteProductArgs = {
  productId: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteProductReservationLimitArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteRestaurantFoodItemArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteReviewArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteUserFavoriteBarArgs = {
  beachBarId: Scalars['ID'];
};


/** Mutation */
export type MutationHelloArgs = {
  name: InputMaybe<Scalars['String']>;
};


/** Mutation */
export type MutationLoginArgs = {
  loginDetails: InputMaybe<UserLoginDetails>;
  userCredentials: UserCredentials;
};


/** Mutation */
export type MutationRefundPaymentArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationRestoreBeachBarProductArgs = {
  productId: Scalars['ID'];
};


/** Mutation */
export type MutationSendForgotPasswordLinkArgs = {
  email: Scalars['Email'];
};


/** Mutation */
export type MutationSignS3Args = {
  filename: Scalars['String'];
  filetype: Scalars['String'];
  s3Bucket: Scalars['String'];
};


/** Mutation */
export type MutationSignUpArgs = {
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
  userCredentials: UserCredentials;
};


/** Mutation */
export type MutationUpdateBeachBaImgUrlArgs = {
  description: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateBeachBarArgs = {
  categoryId: InputMaybe<Scalars['ID']>;
  closingTimeId: InputMaybe<Scalars['ID']>;
  contactPhoneNumber: InputMaybe<Scalars['String']>;
  description: InputMaybe<Scalars['String']>;
  displayRegardlessCapacity: InputMaybe<Scalars['Boolean']>;
  hidePhoneNumber: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isActive: InputMaybe<Scalars['Boolean']>;
  name: InputMaybe<Scalars['String']>;
  openingTimeId: InputMaybe<Scalars['ID']>;
  thumbnailUrl: InputMaybe<Scalars['URL']>;
  zeroCartTotal: InputMaybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationUpdateBeachBarFeatureArgs = {
  description: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  quantity: InputMaybe<Scalars['Int']>;
};


/** Mutation */
export type MutationUpdateBeachBarLocationArgs = {
  address: InputMaybe<Scalars['String']>;
  city: InputMaybe<Scalars['String']>;
  countryId: InputMaybe<Scalars['ID']>;
  latitude: InputMaybe<Scalars['String']>;
  locationId: Scalars['ID'];
  longitude: InputMaybe<Scalars['String']>;
  region: InputMaybe<Scalars['String']>;
  zipCode: InputMaybe<Scalars['String']>;
};


/** Mutation */
export type MutationUpdateBeachBarOwnerArgs = {
  beachBarId: Scalars['ID'];
  isPrimary?: InputMaybe<Scalars['Boolean']>;
  ownerId: Scalars['ID'];
  publicInfo: InputMaybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationUpdateBeachBarRestaurantArgs = {
  description: InputMaybe<Scalars['String']>;
  isActive: InputMaybe<Scalars['Boolean']>;
  name: InputMaybe<Scalars['String']>;
  restaurantId: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateCartFoodArgs = {
  id: Scalars['ID'];
  quantity: Scalars['Int'];
};


/** Mutation */
export type MutationUpdateCartNoteArgs = {
  body: Scalars['String'];
  id: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateCartProductArgs = {
  id: Scalars['ID'];
  quantity: InputMaybe<Scalars['Int']>;
};


/** Mutation */
export type MutationUpdateCustomerArgs = {
  countryIsoCode: InputMaybe<Scalars['String']>;
  customerId: Scalars['ID'];
  phoneNumber: InputMaybe<Scalars['String']>;
};


/** Mutation */
export type MutationUpdateCustomerPaymentMethodArgs = {
  cardId: Scalars['ID'];
  cardholderName: InputMaybe<Scalars['String']>;
  expMonth: InputMaybe<Scalars['Int']>;
  expYear: InputMaybe<Scalars['Int']>;
  isDefault: InputMaybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationUpdateFavouriteBeachBarArgs = {
  slug: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateFoodArgs = {
  categoryId: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  ingredients: InputMaybe<Scalars['String']>;
  maxQuantity: InputMaybe<Scalars['Int']>;
  name: InputMaybe<Scalars['String']>;
  price: InputMaybe<Scalars['Float']>;
};


/** Mutation */
export type MutationUpdateProductArgs = {
  categoryId: InputMaybe<Scalars['ID']>;
  description: InputMaybe<Scalars['String']>;
  imgUrl: InputMaybe<Scalars['URL']>;
  isActive: InputMaybe<Scalars['Boolean']>;
  maxPeople: InputMaybe<Scalars['Int']>;
  minFoodSpending: InputMaybe<Scalars['Float']>;
  name: InputMaybe<Scalars['String']>;
  price: InputMaybe<Scalars['Float']>;
  productId: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateProductReservationLimitArgs = {
  id: Scalars['ID'];
  limit: InputMaybe<Scalars['Int']>;
};


/** Mutation */
export type MutationUpdateRestaurantFoodItemArgs = {
  foodItemId: Scalars['ID'];
  imgUrl: InputMaybe<Scalars['URL']>;
  menuCategoryId: InputMaybe<Scalars['ID']>;
  name: InputMaybe<Scalars['String']>;
  price: InputMaybe<Scalars['Float']>;
};


/** Mutation */
export type MutationUpdateReviewArgs = {
  answer: InputMaybe<Scalars['String']>;
  body: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  monthId: InputMaybe<Scalars['ID']>;
  negativeComment: InputMaybe<Scalars['String']>;
  positiveComment: InputMaybe<Scalars['String']>;
  ratingValue: InputMaybe<Scalars['Int']>;
  visitTypeId: InputMaybe<Scalars['ID']>;
};


/** Mutation */
export type MutationUpdateReviewVoteArgs = {
  downvote: InputMaybe<Scalars['Boolean']>;
  reviewId: Scalars['ID'];
  upvote: InputMaybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationUpdateSearchArgs = {
  filterIds: InputMaybe<ReadonlyArray<Scalars['String']>>;
  searchId: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateUserArgs = {
  address: InputMaybe<Scalars['String']>;
  birthday: InputMaybe<Scalars['String']>;
  city: InputMaybe<Scalars['String']>;
  countryId: InputMaybe<Scalars['ID']>;
  email: InputMaybe<Scalars['Email']>;
  firstName: InputMaybe<Scalars['String']>;
  honorificTitle: InputMaybe<Scalars['String']>;
  imgUrl: InputMaybe<Scalars['URL']>;
  lastName: InputMaybe<Scalars['String']>;
  phoneNumber: InputMaybe<Scalars['String']>;
  telCountryId: InputMaybe<Scalars['ID']>;
  trackHistory: InputMaybe<Scalars['Boolean']>;
  zipCode: InputMaybe<Scalars['String']>;
};


/** Mutation */
export type MutationUploadSingleFileArgs = {
  file: Scalars['Upload'];
};


/** Mutation */
export type MutationVerifyUserPaymentForReviewArgs = {
  beachBarId: Scalars['ID'];
  refCode: InputMaybe<Scalars['String']>;
};

export enum OAuthProvider {
  Facebook = 'Facebook',
  GitHub = 'GitHub',
  Google = 'Google',
  Hashtag = 'Hashtag',
  Instagram = 'Instagram'
}

/** User details in when authorizing with an OAuth Provider */
export type OAuthUserInput = {
  readonly birthday: InputMaybe<Scalars['Date']>;
  readonly email: Scalars['Email'];
  readonly firstName: InputMaybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly imgUrl: InputMaybe<Scalars['URL']>;
  readonly lastName: InputMaybe<Scalars['String']>;
  readonly username: InputMaybe<Scalars['String']>;
};

/** Represents a user that is an owner of a #beach_bar */
export type Owner = {
  readonly __typename?: 'Owner';
  readonly id: Scalars['ID'];
  readonly user: User;
};

/** Represents a payment */
export type Payment = {
  readonly __typename?: 'Payment';
  readonly appFee: Scalars['Decimal'];
  readonly card: Card;
  readonly cart: Cart;
  readonly deletedAt: Maybe<Scalars['DateTime']>;
  readonly id: Scalars['BigInt'];
  readonly isRefunded: Scalars['Boolean'];
  readonly refCode: Scalars['String'];
  readonly reservedProducts: ReadonlyArray<ReservedProduct>;
  readonly status: PaymentStatus;
  readonly stripeId: Scalars['String'];
  readonly stripeProccessingFee: Scalars['Decimal'];
  readonly timestamp: Scalars['DateTime'];
  readonly total: Maybe<Scalars['Float']>;
};


/** Represents a payment */
export type PaymentTotalArgs = {
  beachBarId: InputMaybe<Scalars['ID']>;
};

/** Represents the status of a payment */
export type PaymentStatus = {
  readonly __typename?: 'PaymentStatus';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a payment as a user's visit */
export type PaymentVisits = {
  readonly __typename?: 'PaymentVisits';
  readonly beachBar: BeachBar;
  readonly visits: ReadonlyArray<Visit>;
};

/** Represents a user's payment visit month and years list */
export type PaymentVisitsDates = {
  readonly __typename?: 'PaymentVisitsDates';
  readonly month: MonthTime;
  readonly year: Scalars['Int'];
};

/** Represents a product of a #beach_bar */
export type Product = {
  readonly __typename?: 'Product';
  readonly beachBar: BeachBar;
  readonly category: ProductCategory;
  readonly deletedAt: Maybe<Scalars['DateTime']>;
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly imgUrl: Maybe<Scalars['String']>;
  readonly isActive: Scalars['Boolean'];
  readonly isIndividual: Scalars['Boolean'];
  readonly maxPeople: Scalars['Int'];
  readonly minFoodSpending: Maybe<Scalars['Float']>;
  readonly name: Scalars['String'];
  readonly price: Scalars['Float'];
  readonly reservationLimits: ReadonlyArray<ProductReservationLimit>;
  readonly updatedAt: Scalars['DateTime'];
};

/** Represents a product of a #beach_bar, and info about it's rest availability quantity */
export type ProductAvailability = {
  readonly __typename?: 'ProductAvailability';
  readonly product: Product;
  /** How many other's products of this type are available for purchase */
  readonly quantity: Scalars['Int'];
};

/** The info to be returned when checking for a #beach_bar product's availability hour times */
export type ProductAvailabilityHour = {
  readonly __typename?: 'ProductAvailabilityHour';
  /** The hour time of a day */
  readonly hourTime: HourTime;
  readonly isAvailable: Scalars['Boolean'];
};

/** Represents a #beach_bar's product category */
export type ProductCategory = {
  readonly __typename?: 'ProductCategory';
  readonly components: ReadonlyArray<ProductCategoryComponent>;
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly underscoredName: Scalars['String'];
};

/** Represents a component of a product category, including the quantity that each category has. */
export type ProductCategoryComponent = {
  readonly __typename?: 'ProductCategoryComponent';
  readonly category: ProductCategory;
  readonly component: ProductComponent;
  readonly quantity: Scalars['Int'];
};

/** Represents a component of a product. For example a sunbed. */
export type ProductComponent = {
  readonly __typename?: 'ProductComponent';
  readonly icon: Icon;
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a recommended product of a #beach_bar, depending on a user's search */
export type ProductRecommended = {
  readonly __typename?: 'ProductRecommended';
  readonly product: Product;
  /** How many other's products of this type to purchase */
  readonly quantity: Scalars['Int'];
};

/** Represents a the limit number, on how many times a product can be provided by a #beach_bar on a specific date */
export type ProductReservationLimit = {
  readonly __typename?: 'ProductReservationLimit';
  readonly endTime: Maybe<HourTime>;
  readonly from: Scalars['DateTime'];
  readonly id: Scalars['BigInt'];
  readonly limitNumber: Scalars['Int'];
  readonly product: Product;
  readonly startTime: Maybe<HourTime>;
  readonly to: Scalars['DateTime'];
};

/** Represents each quarter of the day */
export type QuarterTime = {
  readonly __typename?: 'QuarterTime';
  readonly id: Scalars['ID'];
  readonly utcValue: Scalars['Time'];
  readonly value: Scalars['DateTime'];
};

/** Query */
export type Query = {
  readonly __typename?: 'Query';
  readonly accessToken: Scalars['String'];
  readonly account: Maybe<Account>;
  readonly accountLink: Scalars['String'];
  /** Fetch the other available hours a #beach_bar is available during that time */
  readonly availableHours: ReadonlyArray<HourTime>;
  /** Fetch the available product of a #beach_bar for a date and a time period */
  readonly availableProducts: ReadonlyArray<Product>;
  /** Get the details of a #beach_bar */
  readonly beachBar: Maybe<BeachBar>;
  /** Get the images of a #beach_bar */
  readonly beachBarImgs: Maybe<ReadonlyArray<BeachBarImgUrl>>;
  /** Get the latest cart of an authenticated user or create one */
  readonly cart: Cart;
  readonly cartEntryFees: Scalars['Float'];
  /** Fetch all the cities of #beach_bar's locations */
  readonly citiesAndRegions: CitiesAndRegions;
  /** Get or create a customer, depending on current authenticated or not user */
  readonly customer: Customer;
  /** Get a list with all the payments methods (credit / debit cards) of the current authenticated user */
  readonly customerPaymentMethods: ReadonlyArray<Card>;
  /** Fetch the billing data for the dashboard */
  readonly dashboardBilling: DashboardBilling;
  /** Fetch the booking data (reservations) for the dashboard */
  readonly dashboardBookings: DashboardBookings;
  /** Fetch the homepage data (of the day) for #beach_bar's dashboard */
  readonly dashboardHomePage: DashboardHomePage;
  /** Get a user's favourite #beach_bars list */
  readonly favouriteBeachBars: ReadonlyArray<UserFavoriteBar>;
  /** Get information for a food or drink of a #beach_bar */
  readonly food: Maybe<Food>;
  /** Get all foods and drinks of a #beach_bar */
  readonly foods: ReadonlyArray<Food>;
  /** A list with all the available #beach_bars */
  readonly getAllBeachBars: ReadonlyArray<BeachBar>;
  /** Returns the URL where the user will be redirected to login with Facebook */
  readonly getFacebookOAuthUrl: Scalars['URL'];
  /** Returns the URL where the user will be redirected to login with Google */
  readonly getGoogleOAuthUrl: Scalars['URL'];
  /** Returns the URL where the user will be redirected to login with Instagram */
  readonly getInstagramOAuthUrl: Scalars['URL'];
  /** A list with all the #beach_bars, related to a user or are top selections */
  readonly getPersonalizedBeachBars: ReadonlyArray<BeachBar>;
  /** Fetch a list with all the available hour times of a product */
  readonly getProductAvailabilityHours: ReadonlyArray<ProductAvailabilityHour>;
  readonly getProductAvailabilityQuantity: Scalars['Int'];
  /** Returns the Stripe dashboard URL where the #beach_bar can access its Stripe dashboard, to view all transactions and payments */
  readonly getStripeLoginLink: Scalars['URL'];
  /** Get a list with all the hours this product has reservation limits */
  readonly hasProductReservationLimit: ReadonlyArray<AvailableProduct>;
  readonly hello: Scalars['String'];
  readonly hey: Scalars['Boolean'];
  /** Returns current authenticated user */
  readonly me: Maybe<User>;
  /** A list with #beach_bars, near to the user's location */
  readonly nearBeachBars: ReadonlyArray<BeachBar>;
  /** Get the details of a specific payment / trip */
  readonly payment: Payment;
  /** Get the amount of refund of a specific payment / trip */
  readonly paymentRefundAmount: Scalars['Float'];
  /** Get a list of payments for a specific / latest month of an authenticated user */
  readonly payments: ReadonlyArray<PaymentVisits>;
  /** Get a #beach_bar's product information */
  readonly product: Maybe<Product>;
  /** Get all products of a #beach_bar */
  readonly products: ReadonlyArray<Product>;
  /** Get the details of a a review of an authenticated user */
  readonly review: BeachBarReview;
  /** Get a list of all the reviews of an authenticated user */
  readonly reviews: Maybe<ReadonlyArray<BeachBarReview>>;
  /** Search for available #beach_bars */
  readonly search: Search;
  /** Returns a list of formatted search input values */
  readonly searchInputValues: ReadonlyArray<SearchInputValue>;
  /** Returns the URL where the #beach_bar (owner) will be redirected to authorize and register with Stripe, for its connect account */
  readonly stripeConnectUrl: Maybe<Scalars['URL']>;
  /** Returns a list of user's recorded / saved history */
  readonly userHistory: ReadonlyArray<UserHistoryExtended>;
  /** Get a list with a user's latest searches */
  readonly userSearches: ReadonlyArray<UserSearch>;
  readonly verifyZeroCartTotal: Scalars['Boolean'];
};


/** Query */
export type QueryAccountLinkArgs = {
  id: Scalars['ID'];
};


/** Query */
export type QueryAvailableHoursArgs = {
  beachBarId: Scalars['ID'];
  date: Scalars['Date'];
};


/** Query */
export type QueryAvailableProductsArgs = {
  availability: InputMaybe<SearchInput>;
  beachBarId: Scalars['ID'];
};


/** Query */
export type QueryBeachBarArgs = {
  id: InputMaybe<Scalars['ID']>;
  slug: InputMaybe<Scalars['String']>;
  userVisit?: InputMaybe<Scalars['Boolean']>;
};


/** Query */
export type QueryBeachBarImgsArgs = {
  slug: Scalars['String'];
};


/** Query */
export type QueryCartArgs = {
  cartId: InputMaybe<Scalars['ID']>;
};


/** Query */
export type QueryCartEntryFeesArgs = {
  beachBarId: InputMaybe<Scalars['ID']>;
  cartId: Scalars['ID'];
};


/** Query */
export type QueryCustomerArgs = {
  countryId: InputMaybe<Scalars['ID']>;
  email: InputMaybe<Scalars['Email']>;
  phoneNumber: InputMaybe<Scalars['String']>;
};


/** Query */
export type QueryDashboardBillingArgs = {
  beachBarId: Scalars['ID'];
  dates: InputMaybe<DashboardDatesArg>;
};


/** Query */
export type QueryDashboardBookingsArgs = {
  beachBarId: Scalars['ID'];
  dates: InputMaybe<DashboardDatesArg>;
};


/** Query */
export type QueryDashboardHomePageArgs = {
  beachBarId: Scalars['ID'];
  dates: InputMaybe<DashboardDatesArg>;
};


/** Query */
export type QueryFavouriteBeachBarsArgs = {
  limit: InputMaybe<Scalars['Int']>;
};


/** Query */
export type QueryFoodArgs = {
  id: Scalars['ID'];
};


/** Query */
export type QueryFoodsArgs = {
  beachBarId: Scalars['ID'];
};


/** Query */
export type QueryGetProductAvailabilityHoursArgs = {
  date: Scalars['Date'];
  productId: Scalars['ID'];
};


/** Query */
export type QueryGetProductAvailabilityQuantityArgs = {
  date: Scalars['Date'];
  endTimeId: Scalars['Int'];
  productId: Scalars['ID'];
  startTimeId: Scalars['Int'];
};


/** Query */
export type QueryGetStripeLoginLinkArgs = {
  beachBarId: Scalars['ID'];
};


/** Query */
export type QueryHasProductReservationLimitArgs = {
  date: Scalars['Date'];
  productId: Scalars['ID'];
};


/** Query */
export type QueryNearBeachBarsArgs = {
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  take: InputMaybe<Scalars['Int']>;
};


/** Query */
export type QueryPaymentArgs = {
  refCode: Scalars['ID'];
};


/** Query */
export type QueryPaymentRefundAmountArgs = {
  refCode: Scalars['ID'];
};


/** Query */
export type QueryPaymentsArgs = {
  monthId: InputMaybe<Scalars['ID']>;
  year: InputMaybe<Scalars['Int']>;
};


/** Query */
export type QueryProductArgs = {
  id: Scalars['ID'];
};


/** Query */
export type QueryProductsArgs = {
  beachBarId: Scalars['ID'];
};


/** Query */
export type QueryReviewArgs = {
  reviewId: Scalars['ID'];
};


/** Query */
export type QuerySearchArgs = {
  availability: InputMaybe<SearchInput>;
  filterIds: InputMaybe<ReadonlyArray<Scalars['String']>>;
  inputId: InputMaybe<Scalars['ID']>;
  searchId: InputMaybe<Scalars['ID']>;
  searchValue: InputMaybe<Scalars['String']>;
  sortId: InputMaybe<Scalars['ID']>;
};


/** Query */
export type QueryStripeConnectUrlArgs = {
  phoneNumber: InputMaybe<Scalars['String']>;
};


/** Query */
export type QueryUserSearchesArgs = {
  limit: InputMaybe<Scalars['Int']>;
};


/** Query */
export type QueryVerifyZeroCartTotalArgs = {
  cartId: Scalars['ID'];
};

/** Represents a country's or city's region */
export type Region = {
  readonly __typename?: 'Region';
  readonly city: City;
  readonly country: Country;
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a reserved product */
export type ReservedProduct = {
  readonly __typename?: 'ReservedProduct';
  readonly date: Scalars['DateTime'];
  readonly endTime: HourTime;
  readonly id: Scalars['BigInt'];
  readonly isRefunded: Scalars['Boolean'];
  readonly payment: Payment;
  readonly product: Product;
  readonly startTime: HourTime;
};

/** Represents a #beach_bar's restaurant food item (product) in its menu catalog */
export type RestaurantFoodItem = {
  readonly __typename?: 'RestaurantFoodItem';
  readonly id: Scalars['BigInt'];
  readonly imgUrl: Maybe<Scalars['String']>;
  readonly menuCategory: RestaurantMenuCategory;
  readonly name: Scalars['String'];
  readonly price: Scalars['Decimal'];
};

/** Represents a category of a #beach_bar's restaurant menu */
export type RestaurantMenuCategory = {
  readonly __typename?: 'RestaurantMenuCategory';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a review's visit type, by the user */
export type ReviewVisitType = {
  readonly __typename?: 'ReviewVisitType';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a vote for a user's review */
export type ReviewVote = {
  readonly __typename?: 'ReviewVote';
  readonly id: Scalars['BigInt'];
  readonly review: BeachBarReview;
  readonly timestamp: Scalars['DateTime'];
  readonly type: ReviewVoteType;
  readonly updatedAt: Scalars['DateTime'];
  readonly user: User;
};

/** Represents a vote for a user's review */
export type ReviewVoteType = {
  readonly __typename?: 'ReviewVoteType';
  readonly id: Scalars['ID'];
  readonly value: Scalars['String'];
};

/** Represents the payload (data) of Amazon Web Services (AWS) S3 */
export type S3Payload = {
  readonly __typename?: 'S3Payload';
  readonly signedRequest: Scalars['URL'];
  /** The presigned URL gives you access to the object identified in the URL, to upload the user's image */
  readonly url: Scalars['URL'];
};

/** Represents the info to be returned when a user searches for (availability) at #beach_bars */
export type Search = {
  readonly __typename?: 'Search';
  /** The results of the user search */
  readonly results: ReadonlyArray<SearchResultType>;
  /** The details of the search, made by a user */
  readonly search: UserSearch;
};

/** Represents a filter used by users when searching for (availability at) #beach_bars */
export type SearchFilter = {
  readonly __typename?: 'SearchFilter';
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly publicId: Scalars['String'];
};

/** The arguments (args) used at #beach_bar search or availability */
export type SearchInput = {
  /** The number of adults to search availability at #beach_bars. Its value should be less or equal to 12 adults */
  readonly adults: Scalars['Int'];
  /** The number of children to search availability at #beach_bars. Its value should be less or equal to 8 children */
  readonly children: InputMaybe<Scalars['Int']>;
  /** The date to search availability at #beach_bars */
  readonly date: Scalars['Date'];
  /** The ID value of the hour time the user will leave the #beach_bar */
  readonly endTimeId: Scalars['ID'];
  /** The ID value of the hour time the user will arrive at the #beach_bar */
  readonly startTimeId: Scalars['ID'];
};

/** Represents a potential input value of a user's search */
export type SearchInputValue = {
  readonly __typename?: 'SearchInputValue';
  readonly beachBar: Maybe<BeachBar>;
  readonly city: Maybe<City>;
  readonly country: Maybe<Country>;
  /** The search input value formatted into a string */
  readonly formattedValue: Scalars['String'];
  readonly id: Scalars['BigInt'];
  readonly publicId: Scalars['String'];
  readonly region: Maybe<Region>;
};

/** Represents the info (results) to be returned on user search */
export type SearchResultType = {
  readonly __typename?: 'SearchResultType';
  /** The #beach_bar (object) found in the search */
  readonly beachBar: BeachBar;
  /** A boolean that indicates if the #beach_bar has availability for the people selected */
  readonly hasCapacity: Scalars['Boolean'];
  /** A list with all the recommended products for a user's search, depending on #beach_bar's availability and products prices */
  readonly recommendedProducts: ReadonlyArray<ProductRecommended>;
  /** The total price of the recommended products */
  readonly totalPrice: Scalars['Float'];
};

/** Represents a type of user's search sort filter */
export type SearchSort = {
  readonly __typename?: 'SearchSort';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Info to be returned when a reserved product details are updated */
export type UpdateReservedProduct = {
  readonly __typename?: 'UpdateReservedProduct';
  /** The reserved product that is updated */
  readonly reservedProduct: ReservedProduct;
  /** A boolean that indicates if the reserved product details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateReservedProductResult = Error | UpdateReservedProduct;

/** Represents a user */
export type User = {
  readonly __typename?: 'User';
  readonly account: Maybe<Account>;
  readonly email: Scalars['String'];
  readonly favoriteBars: ReadonlyArray<UserFavoriteBar>;
  readonly firstName: Maybe<Scalars['String']>;
  /** User's first and last name combines */
  readonly fullName: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly lastName: Maybe<Scalars['String']>;
  readonly reviewVotes: ReadonlyArray<ReviewVote>;
  /** A user's review on a #beach_bar */
  readonly reviews: Maybe<ReadonlyArray<BeachBarReview>>;
};

/** Credentials of user to sign up / login */
export type UserCredentials = {
  /** Email of user to sign up */
  readonly email: Scalars['Email'];
  /** Password of user */
  readonly password: Scalars['String'];
};

/** A user's favorite #beach_bar */
export type UserFavoriteBar = {
  readonly __typename?: 'UserFavoriteBar';
  readonly beachBar: BeachBar;
  readonly id: Scalars['BigInt'];
  readonly user: User;
};

/** Represents a user's recorded / saved action */
export type UserHistory = {
  readonly __typename?: 'UserHistory';
  readonly activity: UserHistoryActivity;
  readonly id: Scalars['BigInt'];
  readonly objectId: Maybe<Scalars['BigInt']>;
  readonly timestamp: Scalars['DateTime'];
  readonly user: Maybe<User>;
};

/** Represents the type of action a user made */
export type UserHistoryActivity = {
  readonly __typename?: 'UserHistoryActivity';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a user's action, with details about the objectId */
export type UserHistoryExtended = {
  readonly __typename?: 'UserHistoryExtended';
  /** Details about the #beach_bar the user may have visited */
  readonly beachBar: Maybe<BeachBar>;
  /** Details about what the user searched */
  readonly search: Maybe<UserSearch>;
  /** The info of the recorded / saved action of the user */
  readonly userHistory: UserHistory;
};

/** User details in login. The user's IP address is passed via the context */
export type UserLoginDetails = {
  readonly city: InputMaybe<Scalars['String']>;
  /** The alpha 2 code of the country, from where the user logins */
  readonly countryAlpha2Code: InputMaybe<Scalars['String']>;
};

/** Represents a user search */
export type UserSearch = {
  readonly __typename?: 'UserSearch';
  readonly adults: Maybe<Scalars['Int']>;
  readonly children: Maybe<Scalars['Int']>;
  readonly date: Maybe<Scalars['DateTime']>;
  readonly filters: ReadonlyArray<SearchFilter>;
  readonly id: Scalars['BigInt'];
  readonly inputValue: SearchInputValue;
  readonly sort: Maybe<SearchSort>;
  readonly timestamp: Scalars['DateTime'];
  readonly updatedAt: Scalars['DateTime'];
  readonly user: Maybe<User>;
};

export type UserTypeResult = Error | User;

export type Visit = {
  readonly __typename?: 'Visit';
  readonly date: Scalars['Date'];
  readonly endTime: HourTime;
  readonly isRefunded: Scalars['Boolean'];
  readonly isUpcoming: Scalars['Boolean'];
  readonly payment: Payment;
  readonly startTime: HourTime;
};

/** Represents a voting category */
export type VoteCategory = {
  readonly __typename?: 'VoteCategory';
  readonly description: Scalars['String'];
  readonly id: Scalars['ID'];
  readonly refCode: Scalars['String'];
  readonly title: Scalars['String'];
};

/** Represents the votes (voting result) of a voting category */
export type VoteTag = {
  readonly __typename?: 'VoteTag';
  /** The voting category these vote results are assigned to */
  readonly category: VoteCategory;
  readonly downvotes: Scalars['Int'];
  readonly id: Scalars['ID'];
  readonly totalVotes: Maybe<Scalars['Int']>;
  readonly upvotes: Scalars['Int'];
};

export type BeachBarBaseFragment = { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly description: string | undefined, readonly avgRating: number, readonly displayRegardlessCapacity: boolean, readonly contactPhoneNumber: string, readonly hidePhoneNumber: boolean, readonly zeroCartTotal: boolean, readonly hasCompletedSignUp: boolean | undefined, readonly isActive: boolean };

export type DetailsBeachBarFragment = { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly description: string | undefined, readonly avgRating: number, readonly displayRegardlessCapacity: boolean, readonly contactPhoneNumber: string, readonly hidePhoneNumber: boolean, readonly zeroCartTotal: boolean, readonly hasCompletedSignUp: boolean | undefined, readonly isActive: boolean, readonly category: { readonly __typename?: 'BeachBarCategory', readonly id: string, readonly name: string }, readonly location: { readonly __typename?: 'BeachBarLocation', readonly id: string, readonly address: string, readonly zipCode: string | undefined, readonly longitude: any, readonly latitude: any, readonly formattedLocation: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined }, readonly features: ReadonlyArray<{ readonly __typename?: 'BeachBarFeature', readonly quantity: number, readonly service: { readonly __typename?: 'BeachBarService', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }>, readonly styles: ReadonlyArray<{ readonly __typename?: 'BeachBarStyle', readonly id: string, readonly name: string }>, readonly restaurants: ReadonlyArray<{ readonly __typename?: 'BeachBarRestaurant', readonly id: string }> };

export type SearchBeachBarFragment = { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly description: string | undefined, readonly avgRating: number, readonly displayRegardlessCapacity: boolean, readonly contactPhoneNumber: string, readonly hidePhoneNumber: boolean, readonly zeroCartTotal: boolean, readonly hasCompletedSignUp: boolean | undefined, readonly isActive: boolean, readonly reviews: ReadonlyArray<{ readonly __typename?: 'BeachBarReview', readonly id: string }>, readonly payments: ReadonlyArray<{ readonly __typename?: 'Payment', readonly id: number }>, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string }, readonly category: { readonly __typename?: 'BeachBarCategory', readonly id: string, readonly name: string }, readonly location: { readonly __typename?: 'BeachBarLocation', readonly id: string, readonly address: string, readonly zipCode: string | undefined, readonly longitude: any, readonly latitude: any, readonly formattedLocation: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined }, readonly features: ReadonlyArray<{ readonly __typename?: 'BeachBarFeature', readonly quantity: number, readonly service: { readonly __typename?: 'BeachBarService', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }>, readonly styles: ReadonlyArray<{ readonly __typename?: 'BeachBarStyle', readonly id: string, readonly name: string }>, readonly restaurants: ReadonlyArray<{ readonly __typename?: 'BeachBarRestaurant', readonly id: string }> };

export type FeatureBaseFragment = { readonly __typename?: 'BeachBarFeature', readonly id: number, readonly quantity: number, readonly description: string | undefined, readonly service: { readonly __typename?: 'BeachBarService', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly name: string, readonly publicId: string } } };

export type BeachBarImgUrlBaseFragment = { readonly __typename?: 'BeachBarImgUrl', readonly id: number, readonly imgUrl: string, readonly description: string | undefined, readonly updatedAt: string, readonly timestamp: string };

export type BeachBarReviewBaseFragment = { readonly __typename?: 'BeachBarReview', readonly id: string, readonly ratingValue: number, readonly body: string | undefined, readonly answer: string | undefined, readonly positiveComment: string | undefined, readonly negativeComment: string | undefined, readonly updatedAt: string, readonly timestamp: string, readonly votes: ReadonlyArray<{ readonly __typename?: 'ReviewVote', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string }, readonly type: { readonly __typename?: 'ReviewVoteType', readonly id: string, readonly value: string } }>, readonly month: { readonly __typename?: 'MonthTime', readonly id: string, readonly value: string } | undefined, readonly visitType: { readonly __typename?: 'ReviewVisitType', readonly id: string, readonly name: string } | undefined, readonly customer: { readonly __typename?: 'Customer', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string, readonly fullName: string | undefined, readonly account: { readonly __typename?: 'Account', readonly id: string, readonly imgUrl: string | undefined } | undefined } | undefined } };

export type BasicCardFragment = { readonly __typename?: 'Card', readonly id: number, readonly expMonth: number | undefined, readonly expYear: number | undefined, readonly last4: string, readonly cardholderName: string, readonly isDefault: boolean, readonly brand: { readonly __typename?: 'CardBrand', readonly id: string, readonly name: string } | undefined };

export type CartFoodBaseFragment = { readonly __typename?: 'CartFood', readonly id: number, readonly quantity: number, readonly timestamp: string, readonly food: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string }, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } } };

export type CartFoodWithCartFragment = { readonly __typename?: 'CartFood', readonly id: number, readonly quantity: number, readonly timestamp: string, readonly cart: { readonly __typename?: 'Cart', readonly id: number, readonly total: any }, readonly food: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string }, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } } };

export type CartNoteBaseFragment = { readonly __typename?: 'CartNote', readonly id: number, readonly body: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string } };

export type CartProductBaseFragment = { readonly __typename?: 'CartProduct', readonly id: number, readonly quantity: number, readonly date: string, readonly people: number, readonly timestamp: string, readonly startTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly endTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly product: { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly price: number, readonly imgUrl: string | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly formattedLocation: string }, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string } } } };

export type CountryBaseFragment = { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean };

export type CountryFragment = { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean, readonly cities: ReadonlyArray<{ readonly __typename?: 'City', readonly id: string, readonly name: string }>, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly name: string, readonly isoCode: string, readonly symbol: string, readonly secondSymbol: string | undefined } };

export type DashboardDateValueFragment = { readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number };

type DashboardBillingField_DashboardBillingFoods_Fragment = { readonly __typename?: 'DashboardBillingFoods', readonly revenue: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }> };

type DashboardBillingField_DashboardBillingProducts_Fragment = { readonly __typename?: 'DashboardBillingProducts', readonly revenue: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }> };

export type DashboardBillingFieldFragment = DashboardBillingField_DashboardBillingFoods_Fragment | DashboardBillingField_DashboardBillingProducts_Fragment;

export type FoodBaseFragment = { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number };

export type FoodDetailsFragment = { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } };

export type LoginAuthorizeFragment = { readonly __typename?: 'LoginAuthorize', readonly accessToken: string, readonly refreshToken: string, readonly scope: ReadonlyArray<string>, readonly user: { readonly __typename?: 'User', readonly id: string, readonly email: string, readonly firstName: string | undefined, readonly lastName: string | undefined, readonly fullName: string | undefined, readonly account: { readonly __typename?: 'Account', readonly imgUrl: string | undefined } | undefined } };

export type ProductBaseFragment = { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly description: string | undefined, readonly imgUrl: string | undefined, readonly price: number, readonly maxPeople: number, readonly minFoodSpending: number | undefined, readonly category: { readonly __typename?: 'ProductCategory', readonly id: string, readonly components: ReadonlyArray<{ readonly __typename?: 'ProductCategoryComponent', readonly quantity: number, readonly component: { readonly __typename?: 'ProductComponent', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }> } };

export type ProductDetailsFragment = { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly description: string | undefined, readonly imgUrl: string | undefined, readonly price: number, readonly maxPeople: number, readonly minFoodSpending: number | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string } }, readonly reservationLimits: ReadonlyArray<{ readonly __typename?: 'ProductReservationLimit', readonly id: number, readonly from: string, readonly to: string, readonly limitNumber: number }>, readonly category: { readonly __typename?: 'ProductCategory', readonly id: string, readonly components: ReadonlyArray<{ readonly __typename?: 'ProductCategoryComponent', readonly quantity: number, readonly component: { readonly __typename?: 'ProductComponent', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }> } };

export type ProductReservationLimitBaseFragment = { readonly __typename?: 'ProductReservationLimit', readonly id: number, readonly from: string, readonly to: string, readonly limitNumber: number, readonly product: { readonly __typename?: 'Product', readonly id: string }, readonly startTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number } | undefined, readonly endTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number } | undefined };

export type SearchInputValueFragment = { readonly __typename?: 'SearchInputValue', readonly id: number, readonly publicId: string, readonly formattedValue: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } | undefined, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } } | undefined, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } } | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly longitude: any, readonly latitude: any, readonly formattedLocation: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined } } | undefined };

export type HourValueFragment = { readonly __typename?: 'HourTime', readonly id: string, readonly value: number };

export type AddBeachBarMutationVariables = Exact<{
  name: Scalars['String'];
  description: Scalars['String'];
  thumbnailUrl: Scalars['URL'];
  contactPhoneNumber: Scalars['String'];
  hidePhoneNumber?: InputMaybe<Scalars['Boolean']>;
  zeroCartTotal: Scalars['Boolean'];
  categoryId: Scalars['ID'];
  openingTimeId: Scalars['ID'];
  closingTimeId: Scalars['ID'];
  code: Scalars['String'];
  state: Scalars['String'];
}>;


export type AddBeachBarMutation = { readonly __typename?: 'Mutation', readonly addBeachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly description: string | undefined, readonly avgRating: number, readonly displayRegardlessCapacity: boolean, readonly contactPhoneNumber: string, readonly hidePhoneNumber: boolean, readonly zeroCartTotal: boolean, readonly hasCompletedSignUp: boolean | undefined, readonly isActive: boolean } };

export type AddBeachBarFeatureMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  featureId: Scalars['ID'];
  quantity?: InputMaybe<Scalars['Int']>;
  description: InputMaybe<Scalars['String']>;
}>;


export type AddBeachBarFeatureMutation = { readonly __typename?: 'Mutation', readonly addBeachBarFeature: { readonly __typename?: 'BeachBarFeature', readonly id: number, readonly quantity: number, readonly description: string | undefined, readonly service: { readonly __typename?: 'BeachBarService', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly name: string, readonly publicId: string } } } };

export type AddBeachBarImgUrlMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  imgUrl: Scalars['URL'];
  description: InputMaybe<Scalars['String']>;
}>;


export type AddBeachBarImgUrlMutation = { readonly __typename?: 'Mutation', readonly addBeachBarImgUrl: { readonly __typename?: 'BeachBarImgUrl', readonly id: number, readonly imgUrl: string, readonly description: string | undefined, readonly updatedAt: string, readonly timestamp: string } };

export type AddBeachBarLocationMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  address: Scalars['String'];
  zipCode: InputMaybe<Scalars['String']>;
  countryId: Scalars['ID'];
  city: Scalars['String'];
  region: InputMaybe<Scalars['ID']>;
  latitude: Scalars['String'];
  longitude: Scalars['String'];
}>;


export type AddBeachBarLocationMutation = { readonly __typename?: 'Mutation', readonly addBeachBarLocation: { readonly __typename?: 'BeachBarLocation', readonly id: string, readonly address: string, readonly zipCode: string | undefined, readonly latitude: any, readonly longitude: any, readonly whereIs: ReadonlyArray<number> | undefined, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined } };

export type AddBeachBarOwnerMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  userId: InputMaybe<Scalars['ID']>;
  isPrimary?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddBeachBarOwnerMutation = { readonly __typename?: 'Mutation', readonly addBeachBarOwner: { readonly __typename?: 'BeachBarOwner', readonly id: string, readonly isPrimary: boolean, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string }, readonly owner: { readonly __typename?: 'Owner', readonly id: string, readonly user: { readonly __typename?: 'User', readonly id: string } } } };

export type AddBeachBarStylesMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  styleIds: ReadonlyArray<Scalars['ID']> | Scalars['ID'];
}>;


export type AddBeachBarStylesMutation = { readonly __typename?: 'Mutation', readonly addBeachBarStyles: ReadonlyArray<{ readonly __typename?: 'BeachBarStyle', readonly id: string, readonly name: string }> };

export type AddCartFoodMutationVariables = Exact<{
  cartId: Scalars['ID'];
  foodId: Scalars['ID'];
  quantity: InputMaybe<Scalars['Int']>;
}>;


export type AddCartFoodMutation = { readonly __typename?: 'Mutation', readonly addCartFood: { readonly __typename?: 'CartFood', readonly id: number, readonly quantity: number, readonly timestamp: string, readonly cart: { readonly __typename?: 'Cart', readonly id: number, readonly total: any }, readonly food: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string }, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } } } };

export type AddCartNoteMutationVariables = Exact<{
  cartId: Scalars['ID'];
  beachBarId: Scalars['ID'];
  body: Scalars['String'];
}>;


export type AddCartNoteMutation = { readonly __typename?: 'Mutation', readonly addCartNote: { readonly __typename?: 'CartNote', readonly id: number, readonly body: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string } } };

export type AddCartProductMutationVariables = Exact<{
  cartId: Scalars['ID'];
  productId: Scalars['ID'];
  quantity: InputMaybe<Scalars['Int']>;
  date: Scalars['Date'];
  people: Scalars['Int'];
  startTimeId: Scalars['ID'];
  endTimeId: Scalars['ID'];
}>;


export type AddCartProductMutation = { readonly __typename?: 'Mutation', readonly addCartProduct: { readonly __typename?: 'CartProduct', readonly id: number, readonly quantity: number, readonly people: number, readonly product: { readonly __typename?: 'Product', readonly id: string, readonly name: string } } };

export type AddCustomerPaymentMethodMutationVariables = Exact<{
  token: Scalars['String'];
  customerId: Scalars['ID'];
  cardholderName: Scalars['String'];
  isDefault?: InputMaybe<Scalars['Boolean']>;
  savedForFuture?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddCustomerPaymentMethodMutation = { readonly __typename?: 'Mutation', readonly addCustomerPaymentMethod: { readonly __typename?: 'Card', readonly id: number, readonly expMonth: number | undefined, readonly expYear: number | undefined, readonly last4: string, readonly cardholderName: string, readonly isDefault: boolean, readonly brand: { readonly __typename?: 'CardBrand', readonly id: string, readonly name: string } | undefined } };

export type AddFoodMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  name: Scalars['String'];
  categoryId: Scalars['ID'];
  ingredients: InputMaybe<Scalars['String']>;
  price: Scalars['Float'];
  maxQuantity: InputMaybe<Scalars['Int']>;
}>;


export type AddFoodMutation = { readonly __typename?: 'Mutation', readonly addFood: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } } };

export type AddProductMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  name: Scalars['String'];
  description: InputMaybe<Scalars['String']>;
  categoryId: Scalars['ID'];
  price: Scalars['Float'];
  maxPeople: Scalars['Int'];
  minFoodSpending: InputMaybe<Scalars['Float']>;
  imgUrl: InputMaybe<Scalars['URL']>;
}>;


export type AddProductMutation = { readonly __typename?: 'Mutation', readonly addProduct: { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly description: string | undefined, readonly imgUrl: string | undefined, readonly price: number, readonly maxPeople: number, readonly minFoodSpending: number | undefined, readonly category: { readonly __typename?: 'ProductCategory', readonly id: string, readonly components: ReadonlyArray<{ readonly __typename?: 'ProductCategoryComponent', readonly quantity: number, readonly component: { readonly __typename?: 'ProductComponent', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }> } } };

export type AddProductReservationLimitMutationVariables = Exact<{
  productId: Scalars['ID'];
  limit: Scalars['Int'];
  from: Scalars['Date'];
  to: Scalars['Date'];
  startTimeId: InputMaybe<Scalars['ID']>;
  endTimeId: InputMaybe<Scalars['ID']>;
}>;


export type AddProductReservationLimitMutation = { readonly __typename?: 'Mutation', readonly addProductReservationLimit: { readonly __typename?: 'ProductReservationLimit', readonly id: number, readonly from: string, readonly to: string, readonly limitNumber: number, readonly product: { readonly __typename?: 'Product', readonly id: string }, readonly startTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number } | undefined, readonly endTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number } | undefined } };

export type AddReviewMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  paymentRefCode?: InputMaybe<Scalars['String']>;
  ratingValue: Scalars['Int'];
  visitTypeId?: InputMaybe<Scalars['ID']>;
  monthId?: InputMaybe<Scalars['ID']>;
  positiveComment?: InputMaybe<Scalars['String']>;
  negativeComment?: InputMaybe<Scalars['String']>;
  body?: InputMaybe<Scalars['String']>;
}>;


export type AddReviewMutation = { readonly __typename?: 'Mutation', readonly addReview: { readonly __typename?: 'BeachBarReview', readonly id: string } };

export type AuthorizeMutationVariables = Exact<{
  user: OAuthUserInput;
  provider: OAuthProvider;
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
  loginDetails?: InputMaybe<UserLoginDetails>;
}>;


export type AuthorizeMutation = { readonly __typename?: 'Mutation', readonly authorize: { readonly __typename?: 'LoginAuthorize', readonly accessToken: string, readonly refreshToken: string, readonly scope: ReadonlyArray<string>, readonly user: { readonly __typename?: 'User', readonly id: string, readonly email: string, readonly firstName: string | undefined, readonly lastName: string | undefined, readonly fullName: string | undefined, readonly account: { readonly __typename?: 'Account', readonly imgUrl: string | undefined } | undefined } } };

export type ChangeUserPasswordMutationVariables = Exact<{
  email: Scalars['Email'];
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangeUserPasswordMutation = { readonly __typename?: 'Mutation', readonly changeUserPassword: boolean };

export type CheckoutMutationVariables = Exact<{
  cartId: Scalars['ID'];
  cardId: Scalars['ID'];
}>;


export type CheckoutMutation = { readonly __typename?: 'Mutation', readonly checkout: { readonly __typename?: 'Payment', readonly id: number, readonly refCode: string } };

export type CompleteBeachBarSignUpMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
}>;


export type CompleteBeachBarSignUpMutation = { readonly __typename?: 'Mutation', readonly completeBeachBarSignUp: boolean };

export type DeleteBeachBarFeatureMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteBeachBarFeatureMutation = { readonly __typename?: 'Mutation', readonly deleteBeachBarFeature: boolean };

export type DeleteBeachBarImgUrlMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteBeachBarImgUrlMutation = { readonly __typename?: 'Mutation', readonly deleteBeachBarImgUrl: boolean };

export type DeleteCartFoodMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCartFoodMutation = { readonly __typename?: 'Mutation', readonly deleteCartFood: boolean };

export type DeleteCartProductMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCartProductMutation = { readonly __typename?: 'Mutation', readonly deleteCartProduct: boolean };

export type DeleteCustomerPaymentMethodMutationVariables = Exact<{
  cardId: Scalars['ID'];
}>;


export type DeleteCustomerPaymentMethodMutation = { readonly __typename?: 'Mutation', readonly deleteCustomerPaymentMethod: boolean };

export type DeleteFoodMutationVariables = Exact<{
  foodId: Scalars['ID'];
}>;


export type DeleteFoodMutation = { readonly __typename?: 'Mutation', readonly deleteFood: boolean };

export type DeleteProductMutationVariables = Exact<{
  productId: Scalars['ID'];
}>;


export type DeleteProductMutation = { readonly __typename?: 'Mutation', readonly deleteProduct: boolean };

export type DeleteProductReservationLimitMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProductReservationLimitMutation = { readonly __typename?: 'Mutation', readonly deleteProductReservationLimit: boolean };

export type DeleteReviewMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteReviewMutation = { readonly __typename?: 'Mutation', readonly deleteReview: boolean };

export type HelloMutationVariables = Exact<{
  name: InputMaybe<Scalars['String']>;
}>;


export type HelloMutation = { readonly __typename?: 'Mutation', readonly hello: string };

export type LoginMutationVariables = Exact<{
  userCredentials: UserCredentials;
  loginDetails?: InputMaybe<UserLoginDetails>;
}>;


export type LoginMutation = { readonly __typename?: 'Mutation', readonly login: { readonly __typename?: 'LoginAuthorize', readonly accessToken: string, readonly refreshToken: string, readonly scope: ReadonlyArray<string>, readonly user: { readonly __typename?: 'User', readonly id: string, readonly email: string, readonly firstName: string | undefined, readonly lastName: string | undefined, readonly fullName: string | undefined, readonly account: { readonly __typename?: 'Account', readonly imgUrl: string | undefined } | undefined } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { readonly __typename?: 'Mutation', readonly logout: boolean };

export type RefundPaymentMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RefundPaymentMutation = { readonly __typename?: 'Mutation', readonly refundPayment: boolean };

export type SendForgotPasswordLinkMutationVariables = Exact<{
  email: Scalars['Email'];
}>;


export type SendForgotPasswordLinkMutation = { readonly __typename?: 'Mutation', readonly sendForgotPasswordLink: boolean };

export type SignS3MutationVariables = Exact<{
  filename: Scalars['String'];
  filetype: Scalars['String'];
  s3Bucket: Scalars['String'];
}>;


export type SignS3Mutation = { readonly __typename?: 'Mutation', readonly signS3: { readonly __typename?: 'S3Payload', readonly signedRequest: string, readonly url: string } };

export type SignUpMutationVariables = Exact<{
  userCredentials: UserCredentials;
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
}>;


export type SignUpMutation = { readonly __typename?: 'Mutation', readonly signUp: { readonly __typename?: 'User', readonly id: string } };

export type UpdateBeachBarMutationVariables = Exact<{
  id: Scalars['ID'];
  name: InputMaybe<Scalars['String']>;
  description: InputMaybe<Scalars['String']>;
  thumbnailUrl: InputMaybe<Scalars['URL']>;
  contactPhoneNumber: InputMaybe<Scalars['String']>;
  hidePhoneNumber: InputMaybe<Scalars['Boolean']>;
  zeroCartTotal: InputMaybe<Scalars['Boolean']>;
  isActive: InputMaybe<Scalars['Boolean']>;
  displayRegardlessCapacity: InputMaybe<Scalars['Boolean']>;
  categoryId: InputMaybe<Scalars['ID']>;
  openingTimeId: InputMaybe<Scalars['ID']>;
  closingTimeId: InputMaybe<Scalars['ID']>;
}>;


export type UpdateBeachBarMutation = { readonly __typename?: 'Mutation', readonly updateBeachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly description: string | undefined, readonly avgRating: number, readonly displayRegardlessCapacity: boolean, readonly contactPhoneNumber: string, readonly hidePhoneNumber: boolean, readonly zeroCartTotal: boolean, readonly hasCompletedSignUp: boolean | undefined, readonly isActive: boolean } };

export type UpdateBeachBarFeatureMutationVariables = Exact<{
  id: Scalars['ID'];
  quantity?: InputMaybe<Scalars['Int']>;
  description: InputMaybe<Scalars['String']>;
}>;


export type UpdateBeachBarFeatureMutation = { readonly __typename?: 'Mutation', readonly updateBeachBarFeature: { readonly __typename?: 'BeachBarFeature', readonly id: number, readonly quantity: number, readonly description: string | undefined, readonly service: { readonly __typename?: 'BeachBarService', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly name: string, readonly publicId: string } } } };

export type UpdateBeachBarImgUrlMutationVariables = Exact<{
  id: Scalars['ID'];
  description: InputMaybe<Scalars['String']>;
}>;


export type UpdateBeachBarImgUrlMutation = { readonly __typename?: 'Mutation', readonly updateBeachBaImgUrl: { readonly __typename?: 'BeachBarImgUrl', readonly id: number, readonly imgUrl: string, readonly description: string | undefined, readonly updatedAt: string, readonly timestamp: string } };

export type UpdateCartFoodMutationVariables = Exact<{
  id: Scalars['ID'];
  quantity: Scalars['Int'];
}>;


export type UpdateCartFoodMutation = { readonly __typename?: 'Mutation', readonly updateCartFood: { readonly __typename?: 'CartFood', readonly id: number, readonly quantity: number, readonly timestamp: string, readonly cart: { readonly __typename?: 'Cart', readonly id: number, readonly total: any }, readonly food: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string }, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } } } };

export type UpdateCartNoteMutationVariables = Exact<{
  id: Scalars['ID'];
  body: Scalars['String'];
}>;


export type UpdateCartNoteMutation = { readonly __typename?: 'Mutation', readonly updateCartNote: { readonly __typename?: 'CartNote', readonly id: number, readonly body: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string } } };

export type UpdateCartProductMutationVariables = Exact<{
  id: Scalars['ID'];
  quantity: InputMaybe<Scalars['Int']>;
}>;


export type UpdateCartProductMutation = { readonly __typename?: 'Mutation', readonly updateCartProduct: { readonly __typename?: 'CartProduct', readonly id: number, readonly quantity: number } };

export type UpdateCustomerPaymentMethodMutationVariables = Exact<{
  cardId: Scalars['ID'];
  expMonth: InputMaybe<Scalars['Int']>;
  expYear: InputMaybe<Scalars['Int']>;
  cardholderName: InputMaybe<Scalars['String']>;
  isDefault: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateCustomerPaymentMethodMutation = { readonly __typename?: 'Mutation', readonly updateCustomerPaymentMethod: { readonly __typename?: 'Card', readonly id: number, readonly expMonth: number | undefined, readonly expYear: number | undefined, readonly cardholderName: string, readonly isDefault: boolean, readonly last4: string, readonly brand: { readonly __typename?: 'CardBrand', readonly id: string, readonly name: string } | undefined } };

export type UpdateFavouriteBeachBarMutationVariables = Exact<{
  slug: Scalars['ID'];
}>;


export type UpdateFavouriteBeachBarMutation = { readonly __typename?: 'Mutation', readonly updateFavouriteBeachBar: { readonly __typename?: 'UserFavoriteBar', readonly id: number, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined } } };

export type UpdateFoodMutationVariables = Exact<{
  id: Scalars['ID'];
  name: InputMaybe<Scalars['String']>;
  categoryId: InputMaybe<Scalars['ID']>;
  ingredients: InputMaybe<Scalars['String']>;
  price: InputMaybe<Scalars['Float']>;
  maxQuantity: InputMaybe<Scalars['Int']>;
}>;


export type UpdateFoodMutation = { readonly __typename?: 'Mutation', readonly updateFood: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } } };

export type UpdateProductMutationVariables = Exact<{
  productId: Scalars['ID'];
  name: InputMaybe<Scalars['String']>;
  description: InputMaybe<Scalars['String']>;
  categoryId: InputMaybe<Scalars['ID']>;
  price: InputMaybe<Scalars['Float']>;
  maxPeople: InputMaybe<Scalars['Int']>;
  minFoodSpending: InputMaybe<Scalars['Float']>;
  imgUrl: InputMaybe<Scalars['URL']>;
}>;


export type UpdateProductMutation = { readonly __typename?: 'Mutation', readonly updateProduct: { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly description: string | undefined, readonly imgUrl: string | undefined, readonly price: number, readonly maxPeople: number, readonly minFoodSpending: number | undefined, readonly category: { readonly __typename?: 'ProductCategory', readonly id: string, readonly components: ReadonlyArray<{ readonly __typename?: 'ProductCategoryComponent', readonly quantity: number, readonly component: { readonly __typename?: 'ProductComponent', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }> } } };

export type UpdateProductReservationLimitMutationVariables = Exact<{
  id: Scalars['ID'];
  limit: Scalars['Int'];
}>;


export type UpdateProductReservationLimitMutation = { readonly __typename?: 'Mutation', readonly updateProductReservationLimit: { readonly __typename?: 'ProductReservationLimit', readonly id: number, readonly from: string, readonly to: string, readonly limitNumber: number, readonly product: { readonly __typename?: 'Product', readonly id: string }, readonly startTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number } | undefined, readonly endTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number } | undefined } };

export type UpdateReviewMutationVariables = Exact<{
  id: Scalars['ID'];
  ratingValue: InputMaybe<Scalars['Int']>;
  visitTypeId: InputMaybe<Scalars['ID']>;
  monthId: InputMaybe<Scalars['ID']>;
  positiveComment: InputMaybe<Scalars['String']>;
  negativeComment: InputMaybe<Scalars['String']>;
  body: InputMaybe<Scalars['String']>;
  answer: InputMaybe<Scalars['String']>;
}>;


export type UpdateReviewMutation = { readonly __typename?: 'Mutation', readonly updateReview: { readonly __typename?: 'BeachBarReview', readonly id: string, readonly ratingValue: number, readonly positiveComment: string | undefined, readonly negativeComment: string | undefined, readonly body: string | undefined, readonly answer: string | undefined, readonly updatedAt: string, readonly timestamp: string, readonly votes: ReadonlyArray<{ readonly __typename?: 'ReviewVote', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string }, readonly type: { readonly __typename?: 'ReviewVoteType', readonly id: string, readonly value: string } }>, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string }, readonly visitType: { readonly __typename?: 'ReviewVisitType', readonly id: string, readonly name: string } | undefined, readonly month: { readonly __typename?: 'MonthTime', readonly id: string, readonly value: string } | undefined } };

export type UpdateReviewVoteMutationVariables = Exact<{
  reviewId: Scalars['ID'];
  upvote: InputMaybe<Scalars['Boolean']>;
  downvote: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateReviewVoteMutation = { readonly __typename?: 'Mutation', readonly updateReviewVote: { readonly __typename?: 'BeachBarReview', readonly id: string, readonly ratingValue: number, readonly votes: ReadonlyArray<{ readonly __typename?: 'ReviewVote', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string }, readonly type: { readonly __typename?: 'ReviewVoteType', readonly id: string, readonly value: string } }> } };

export type UpdateUserMutationVariables = Exact<{
  email: InputMaybe<Scalars['Email']>;
  firstName: InputMaybe<Scalars['String']>;
  lastName: InputMaybe<Scalars['String']>;
  imgUrl: InputMaybe<Scalars['URL']>;
  honorificTitle: InputMaybe<Scalars['String']>;
  birthday: InputMaybe<Scalars['String']>;
  countryId: InputMaybe<Scalars['ID']>;
  city: InputMaybe<Scalars['String']>;
  phoneNumber: InputMaybe<Scalars['String']>;
  telCountryId: InputMaybe<Scalars['ID']>;
  address: InputMaybe<Scalars['String']>;
  zipCode: InputMaybe<Scalars['String']>;
  trackHistory: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateUserMutation = { readonly __typename?: 'Mutation', readonly updateUser: { readonly __typename?: 'User', readonly id: string, readonly email: string, readonly firstName: string | undefined, readonly lastName: string | undefined, readonly account: { readonly __typename?: 'Account', readonly id: string, readonly honorificTitle: string | undefined, readonly birthday: string | undefined, readonly age: number | undefined, readonly address: string | undefined, readonly zipCode: string | undefined, readonly trackHistory: boolean, readonly imgUrl: string | undefined, readonly city: string | undefined, readonly phoneNumber: string | undefined, readonly telCountry: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } | undefined, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly name: string } } | undefined } | undefined } };

export type VerifyUserPaymentForReviewMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  refCode: InputMaybe<Scalars['String']>;
}>;


export type VerifyUserPaymentForReviewMutation = { readonly __typename?: 'Mutation', readonly verifyUserPaymentForReview: boolean };

export type AuthorizeWithFacebookMutationVariables = Exact<{
  code: Scalars['String'];
  state: Scalars['String'];
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
  loginDetails: InputMaybe<UserLoginDetails>;
}>;


export type AuthorizeWithFacebookMutation = { readonly __typename?: 'Mutation', readonly authorizeWithFacebook: { readonly __typename?: 'LoginAuthorize', readonly user: { readonly __typename?: 'User', readonly id: string, readonly email: string } } };

export type AuthorizeWithGoogleMutationVariables = Exact<{
  code: Scalars['String'];
  state: Scalars['String'];
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
  loginDetails: InputMaybe<UserLoginDetails>;
}>;


export type AuthorizeWithGoogleMutation = { readonly __typename?: 'Mutation', readonly authorizeWithGoogle: { readonly __typename?: 'LoginAuthorize', readonly user: { readonly __typename?: 'User', readonly id: string, readonly email: string } } };

export type AuthorizeWithInstagramMutationVariables = Exact<{
  code: Scalars['String'];
  state: Scalars['String'];
  email: Scalars['Email'];
  isPrimaryOwner?: InputMaybe<Scalars['Boolean']>;
  loginDetails: InputMaybe<UserLoginDetails>;
}>;


export type AuthorizeWithInstagramMutation = { readonly __typename?: 'Mutation', readonly authorizeWithInstagram: { readonly __typename?: 'LoginAuthorize', readonly user: { readonly __typename?: 'User', readonly id: string, readonly email: string } } };

export type AvailableHoursQueryVariables = Exact<{
  beachBarId: Scalars['ID'];
  date: Scalars['Date'];
}>;


export type AvailableHoursQuery = { readonly __typename?: 'Query', readonly availableHours: ReadonlyArray<{ readonly __typename?: 'HourTime', readonly id: string, readonly value: number, readonly utcValue: string }> };

export type AvailableProductsQueryVariables = Exact<{
  beachBarId: Scalars['ID'];
  availability: InputMaybe<SearchInput>;
}>;


export type AvailableProductsQuery = { readonly __typename?: 'Query', readonly availableProducts: ReadonlyArray<{ readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly description: string | undefined, readonly imgUrl: string | undefined, readonly price: number, readonly maxPeople: number, readonly minFoodSpending: number | undefined, readonly category: { readonly __typename?: 'ProductCategory', readonly id: string, readonly components: ReadonlyArray<{ readonly __typename?: 'ProductCategoryComponent', readonly quantity: number, readonly component: { readonly __typename?: 'ProductComponent', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }> } }> };

export type BeachBarQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  userVisit?: InputMaybe<Scalars['Boolean']>;
}>;


export type BeachBarQuery = { readonly __typename?: 'Query', readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly description: string | undefined, readonly avgRating: number, readonly displayRegardlessCapacity: boolean, readonly contactPhoneNumber: string, readonly hidePhoneNumber: boolean, readonly zeroCartTotal: boolean, readonly hasCompletedSignUp: boolean | undefined, readonly isActive: boolean, readonly openingTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number, readonly utcValue: string }, readonly closingTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number, readonly utcValue: string }, readonly reviews: ReadonlyArray<{ readonly __typename?: 'BeachBarReview', readonly id: string, readonly ratingValue: number, readonly body: string | undefined, readonly answer: string | undefined, readonly positiveComment: string | undefined, readonly negativeComment: string | undefined, readonly updatedAt: string, readonly timestamp: string, readonly payment: { readonly __typename?: 'Payment', readonly id: number, readonly timestamp: string }, readonly votes: ReadonlyArray<{ readonly __typename?: 'ReviewVote', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string }, readonly type: { readonly __typename?: 'ReviewVoteType', readonly id: string, readonly value: string } }>, readonly month: { readonly __typename?: 'MonthTime', readonly id: string, readonly value: string } | undefined, readonly visitType: { readonly __typename?: 'ReviewVisitType', readonly id: string, readonly name: string } | undefined, readonly customer: { readonly __typename?: 'Customer', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string, readonly fullName: string | undefined, readonly account: { readonly __typename?: 'Account', readonly id: string, readonly imgUrl: string | undefined } | undefined } | undefined } }>, readonly imgUrls: ReadonlyArray<{ readonly __typename?: 'BeachBarImgUrl', readonly id: number, readonly imgUrl: string, readonly description: string | undefined, readonly timestamp: string }>, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string }, readonly features: ReadonlyArray<{ readonly __typename?: 'BeachBarFeature', readonly quantity: number, readonly id: number, readonly description: string | undefined, readonly service: { readonly __typename?: 'BeachBarService', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string, readonly name: string } } }>, readonly products: ReadonlyArray<{ readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly description: string | undefined, readonly imgUrl: string | undefined, readonly price: number, readonly maxPeople: number, readonly minFoodSpending: number | undefined, readonly category: { readonly __typename?: 'ProductCategory', readonly id: string, readonly components: ReadonlyArray<{ readonly __typename?: 'ProductCategoryComponent', readonly quantity: number, readonly component: { readonly __typename?: 'ProductComponent', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }> } }>, readonly foods: ReadonlyArray<{ readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }>, readonly category: { readonly __typename?: 'BeachBarCategory', readonly id: string, readonly name: string }, readonly location: { readonly __typename?: 'BeachBarLocation', readonly id: string, readonly address: string, readonly zipCode: string | undefined, readonly longitude: any, readonly latitude: any, readonly formattedLocation: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined }, readonly styles: ReadonlyArray<{ readonly __typename?: 'BeachBarStyle', readonly id: string, readonly name: string }>, readonly restaurants: ReadonlyArray<{ readonly __typename?: 'BeachBarRestaurant', readonly id: string }> } | undefined };

export type CartQueryVariables = Exact<{
  cartId: InputMaybe<Scalars['ID']>;
}>;


export type CartQuery = { readonly __typename?: 'Query', readonly cart: { readonly __typename?: 'Cart', readonly id: number, readonly total: any, readonly products: ReadonlyArray<{ readonly __typename?: 'CartProduct', readonly id: number, readonly quantity: number, readonly date: string, readonly people: number, readonly timestamp: string, readonly startTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly endTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly product: { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly price: number, readonly imgUrl: string | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly formattedLocation: string }, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string } } } }>, readonly foods: ReadonlyArray<{ readonly __typename?: 'CartFood', readonly id: number, readonly quantity: number, readonly timestamp: string, readonly food: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string }, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } } }>, readonly notes: ReadonlyArray<{ readonly __typename?: 'CartNote', readonly id: number, readonly body: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string } }> } };

export type CartEntryFeesQueryVariables = Exact<{
  cartId: Scalars['ID'];
  beachBarId?: InputMaybe<Scalars['ID']>;
}>;


export type CartEntryFeesQuery = { readonly __typename?: 'Query', readonly cartEntryFees: number };

export type CitiesAndRegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type CitiesAndRegionsQuery = { readonly __typename?: 'Query', readonly citiesAndRegions: { readonly __typename?: 'CitiesAndRegions', readonly cities: ReadonlyArray<{ readonly __typename?: 'City', readonly id: string, readonly name: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } }>, readonly regions: ReadonlyArray<{ readonly __typename?: 'Region', readonly id: string, readonly name: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string } }> } };

export type CustomerQueryVariables = Exact<{
  email: InputMaybe<Scalars['Email']>;
  phoneNumber: InputMaybe<Scalars['String']>;
  countryId: InputMaybe<Scalars['ID']>;
}>;


export type CustomerQuery = { readonly __typename?: 'Query', readonly customer: { readonly __typename?: 'Customer', readonly id: number, readonly email: string | undefined, readonly user: { readonly __typename?: 'User', readonly id: string, readonly email: string } | undefined, readonly cards: ReadonlyArray<{ readonly __typename?: 'Card', readonly id: number, readonly expMonth: number | undefined, readonly expYear: number | undefined, readonly last4: string, readonly cardholderName: string, readonly isDefault: boolean, readonly brand: { readonly __typename?: 'CardBrand', readonly id: string, readonly name: string } | undefined }> } };

export type CustomerPaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomerPaymentMethodsQuery = { readonly __typename?: 'Query', readonly customerPaymentMethods: ReadonlyArray<{ readonly __typename?: 'Card', readonly id: number, readonly expMonth: number | undefined, readonly expYear: number | undefined, readonly last4: string, readonly cardholderName: string, readonly isDefault: boolean, readonly brand: { readonly __typename?: 'CardBrand', readonly id: string, readonly name: string } | undefined }> };

export type DashboardBillingQueryVariables = Exact<{
  beachBarId: Scalars['ID'];
  dates?: InputMaybe<DashboardDatesArg>;
}>;


export type DashboardBillingQuery = { readonly __typename?: 'Query', readonly dashboardBilling: { readonly __typename?: 'DashboardBilling', readonly avgProducts: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly avgFoods: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly products: { readonly __typename?: 'DashboardBillingProducts', readonly revenue: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly mostCommon: ReadonlyArray<{ readonly __typename?: 'DashboardBillingMostCommonProducts', readonly timesBooked: number, readonly product: { readonly __typename?: 'Product', readonly id: string, readonly name: string } }> }, readonly foods: { readonly __typename?: 'DashboardBillingFoods', readonly revenue: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly mostCommon: ReadonlyArray<{ readonly __typename?: 'DashboardBillingMostCommonFoods', readonly timesPurchased: number, readonly food: { readonly __typename?: 'Food', readonly id: number, readonly name: string } }> }, readonly refundedPayments: ReadonlyArray<{ readonly __typename?: 'DashboardBillingRefundedPayments', readonly date: string, readonly payments: ReadonlyArray<{ readonly __typename?: 'Payment', readonly id: number, readonly refCode: string, readonly isRefunded: boolean }> }>, readonly customersCountries: ReadonlyArray<{ readonly __typename?: 'DashboardBillingCustomerCountries', readonly value: number, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } }> } };

export type DashboardBookingsQueryVariables = Exact<{
  beachBarId: Scalars['ID'];
  dates?: InputMaybe<DashboardDatesArg>;
}>;


export type DashboardBookingsQuery = { readonly __typename?: 'Query', readonly dashboardBookings: { readonly __typename?: 'DashboardBookings', readonly mostActive: { readonly __typename?: 'DashboardMostActive', readonly hour: number, readonly weekDay: string }, readonly capacity: { readonly __typename?: 'DashboardBookingsCapacity', readonly arr: ReadonlyArray<{ readonly __typename?: 'DashboardCapacityPercentage', readonly date: string, readonly percentage: number }>, readonly totalCustomers: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly totalHourCustomers: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly maxCapacity: ReadonlyArray<{ readonly __typename?: 'DashboardMaxCapacity', readonly date: string, readonly limitPeople: number, readonly availableProducts: number }> }, readonly bookings: ReadonlyArray<{ readonly __typename?: 'Payment', readonly id: number, readonly refCode: string, readonly isRefunded: boolean, readonly timestamp: string, readonly deletedAt: string | undefined, readonly total: number | undefined, readonly status: { readonly __typename?: 'PaymentStatus', readonly id: string, readonly name: string }, readonly cart: { readonly __typename?: 'Cart', readonly id: number, readonly notes: ReadonlyArray<{ readonly __typename?: 'CartNote', readonly id: number, readonly body: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string } }>, readonly products: ReadonlyArray<{ readonly __typename?: 'CartProduct', readonly id: number, readonly date: string, readonly quantity: number, readonly people: number, readonly total: number | undefined, readonly startTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly endTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly product: { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string } } }>, readonly foods: ReadonlyArray<{ readonly __typename?: 'CartFood', readonly id: number, readonly date: string | undefined, readonly quantity: number, readonly total: number | undefined, readonly food: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string } } }> }, readonly card: { readonly __typename?: 'Card', readonly id: number, readonly customer: { readonly __typename?: 'Customer', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string, readonly fullName: string | undefined } | undefined }, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly name: string, readonly symbol: string } } | undefined } }> } };

export type DashboardHomePageQueryVariables = Exact<{
  beachBarId: Scalars['ID'];
  dates?: InputMaybe<DashboardDatesArg>;
}>;


export type DashboardHomePageQuery = { readonly __typename?: 'Query', readonly dashboardHomePage: { readonly __typename?: 'DashboardHomePage', readonly balance: { readonly __typename?: 'DashboardBalance', readonly revenue: number, readonly grossVolume: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly successfulPayments: ReadonlyArray<{ readonly __typename?: 'Payment', readonly id: number }> }, readonly capacity: { readonly __typename?: 'DashboardCapacity', readonly percentage: number, readonly totalMaxPeopleCapacity: number, readonly totalHourCustomers: number, readonly reservedProducts: number, readonly availableProducts: number }, readonly totalCustomers: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly grossVolume: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly avgSpendPerPerson: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly avgRating: ReadonlyArray<{ readonly __typename?: 'DashboardDateValue', readonly date: string, readonly value: number }>, readonly newCustomers: ReadonlyArray<{ readonly __typename?: 'DashboardNewCustomers', readonly date: string, readonly customers: ReadonlyArray<{ readonly __typename?: 'Customer', readonly id: number }> }> } };

export type FavouriteBeachBarsQueryVariables = Exact<{
  limit: InputMaybe<Scalars['Int']>;
}>;


export type FavouriteBeachBarsQuery = { readonly __typename?: 'Query', readonly favouriteBeachBars: ReadonlyArray<{ readonly __typename?: 'UserFavoriteBar', readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined } }> };

export type GetUserFavouriteBeachBarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserFavouriteBeachBarsQuery = { readonly __typename?: 'Query', readonly favouriteBeachBars: ReadonlyArray<{ readonly __typename?: 'UserFavoriteBar', readonly id: number, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string } }> };

export type FoodQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FoodQuery = { readonly __typename?: 'Query', readonly food: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } } | undefined };

export type FoodsQueryVariables = Exact<{
  beachBarId: Scalars['ID'];
}>;


export type FoodsQuery = { readonly __typename?: 'Query', readonly foods: ReadonlyArray<{ readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }> };

export type GetPersonalizedBeachBarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPersonalizedBeachBarsQuery = { readonly __typename?: 'Query', readonly getPersonalizedBeachBars: ReadonlyArray<{ readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly latitude: any, readonly longitude: any, readonly formattedLocation: string, readonly city: { readonly __typename?: 'City', readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly name: string } | undefined } }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'User', readonly id: string, readonly email: string, readonly firstName: string | undefined, readonly lastName: string | undefined, readonly fullName: string | undefined, readonly account: { readonly __typename?: 'Account', readonly id: string, readonly honorificTitle: string | undefined, readonly birthday: string | undefined, readonly age: number | undefined, readonly address: string | undefined, readonly zipCode: string | undefined, readonly imgUrl: string | undefined, readonly city: string | undefined, readonly trackHistory: boolean, readonly phoneNumber: string | undefined, readonly telCountry: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } | undefined, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string } } | undefined } | undefined, readonly reviewVotes: ReadonlyArray<{ readonly __typename?: 'ReviewVote', readonly id: number, readonly type: { readonly __typename?: 'ReviewVoteType', readonly id: string, readonly value: string }, readonly review: { readonly __typename?: 'BeachBarReview', readonly id: string } }>, readonly favoriteBars: ReadonlyArray<{ readonly __typename?: 'UserFavoriteBar', readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly id: string, readonly formattedLocation: string, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined } } }> } | undefined };

export type NearBeachBarsQueryVariables = Exact<{
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  take?: InputMaybe<Scalars['Int']>;
}>;


export type NearBeachBarsQuery = { readonly __typename?: 'Query', readonly nearBeachBars: ReadonlyArray<{ readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly latitude: any, readonly longitude: any } }> };

export type PaymentQueryVariables = Exact<{
  refCode: Scalars['ID'];
  beachBarId?: InputMaybe<Scalars['ID']>;
}>;


export type PaymentQuery = { readonly __typename?: 'Query', readonly payment: { readonly __typename?: 'Payment', readonly id: number, readonly refCode: string, readonly isRefunded: boolean, readonly stripeId: string, readonly stripeProccessingFee: any, readonly appFee: any, readonly total: number | undefined, readonly timestamp: string, readonly cart: { readonly __typename?: 'Cart', readonly id: number, readonly total: any, readonly products: ReadonlyArray<{ readonly __typename?: 'CartProduct', readonly id: number, readonly quantity: number, readonly date: string, readonly people: number, readonly timestamp: string, readonly startTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly endTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly product: { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly price: number, readonly imgUrl: string | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly formattedLocation: string }, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string } } } }>, readonly foods: ReadonlyArray<{ readonly __typename?: 'CartFood', readonly id: number, readonly quantity: number, readonly timestamp: string, readonly food: { readonly __typename?: 'Food', readonly id: number, readonly name: string, readonly price: any, readonly ingredients: string | undefined, readonly maxQuantity: number, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string }, readonly category: { readonly __typename?: 'FoodCategory', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } } }>, readonly notes: ReadonlyArray<{ readonly __typename?: 'CartNote', readonly id: number, readonly body: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string } }> }, readonly card: { readonly __typename?: 'Card', readonly id: number, readonly last4: string, readonly brand: { readonly __typename?: 'CardBrand', readonly id: string, readonly name: string } | undefined, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string } } | undefined, readonly customer: { readonly __typename?: 'Customer', readonly id: number, readonly email: string | undefined, readonly phoneNumber: string | undefined, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } | undefined } }, readonly status: { readonly __typename?: 'PaymentStatus', readonly id: string, readonly name: string } } };

export type PaymentRefundAmountQueryVariables = Exact<{
  refCode: Scalars['ID'];
}>;


export type PaymentRefundAmountQuery = { readonly __typename?: 'Query', readonly paymentRefundAmount: number };

export type PaymentsQueryVariables = Exact<{
  monthId: InputMaybe<Scalars['ID']>;
  year: InputMaybe<Scalars['Int']>;
}>;


export type PaymentsQuery = { readonly __typename?: 'Query', readonly payments: ReadonlyArray<{ readonly __typename?: 'PaymentVisits', readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly city: { readonly __typename?: 'City', readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly name: string } | undefined } }, readonly visits: ReadonlyArray<{ readonly __typename?: 'Visit', readonly isUpcoming: boolean, readonly isRefunded: boolean, readonly date: string, readonly startTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly endTime: { readonly __typename?: 'HourTime', readonly id: string, readonly value: number }, readonly payment: { readonly __typename?: 'Payment', readonly id: number, readonly refCode: string } }> }> };

export type ProductQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProductQuery = { readonly __typename?: 'Query', readonly product: { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly description: string | undefined, readonly imgUrl: string | undefined, readonly price: number, readonly maxPeople: number, readonly minFoodSpending: number | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string } }, readonly reservationLimits: ReadonlyArray<{ readonly __typename?: 'ProductReservationLimit', readonly id: number, readonly from: string, readonly to: string, readonly limitNumber: number }>, readonly category: { readonly __typename?: 'ProductCategory', readonly id: string, readonly components: ReadonlyArray<{ readonly __typename?: 'ProductCategoryComponent', readonly quantity: number, readonly component: { readonly __typename?: 'ProductComponent', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }> } } | undefined };

export type ProductsQueryVariables = Exact<{
  beachBarId: Scalars['ID'];
}>;


export type ProductsQuery = { readonly __typename?: 'Query', readonly products: ReadonlyArray<{ readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly description: string | undefined, readonly imgUrl: string | undefined, readonly price: number, readonly maxPeople: number, readonly minFoodSpending: number | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string } }, readonly reservationLimits: ReadonlyArray<{ readonly __typename?: 'ProductReservationLimit', readonly id: number, readonly from: string, readonly to: string, readonly limitNumber: number }>, readonly category: { readonly __typename?: 'ProductCategory', readonly id: string, readonly components: ReadonlyArray<{ readonly __typename?: 'ProductCategoryComponent', readonly quantity: number, readonly component: { readonly __typename?: 'ProductComponent', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }> } }> };

export type ReviewQueryVariables = Exact<{
  reviewId: Scalars['ID'];
}>;


export type ReviewQuery = { readonly __typename?: 'Query', readonly review: { readonly __typename?: 'BeachBarReview', readonly id: string, readonly ratingValue: number, readonly body: string | undefined, readonly answer: string | undefined, readonly positiveComment: string | undefined, readonly negativeComment: string | undefined, readonly updatedAt: string, readonly timestamp: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly location: { readonly __typename?: 'BeachBarLocation', readonly formattedLocation: string } }, readonly votes: ReadonlyArray<{ readonly __typename?: 'ReviewVote', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string }, readonly type: { readonly __typename?: 'ReviewVoteType', readonly id: string, readonly value: string } }>, readonly month: { readonly __typename?: 'MonthTime', readonly id: string, readonly value: string } | undefined, readonly visitType: { readonly __typename?: 'ReviewVisitType', readonly id: string, readonly name: string } | undefined, readonly customer: { readonly __typename?: 'Customer', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string, readonly fullName: string | undefined, readonly account: { readonly __typename?: 'Account', readonly id: string, readonly imgUrl: string | undefined } | undefined } | undefined } } };

export type ReviewsQueryVariables = Exact<{ [key: string]: never; }>;


export type ReviewsQuery = { readonly __typename?: 'Query', readonly reviews: ReadonlyArray<{ readonly __typename?: 'BeachBarReview', readonly id: string, readonly ratingValue: number, readonly body: string | undefined, readonly answer: string | undefined, readonly positiveComment: string | undefined, readonly negativeComment: string | undefined, readonly updatedAt: string, readonly timestamp: string, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string }, readonly payment: { readonly __typename?: 'Payment', readonly id: number, readonly timestamp: string }, readonly votes: ReadonlyArray<{ readonly __typename?: 'ReviewVote', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string }, readonly type: { readonly __typename?: 'ReviewVoteType', readonly id: string, readonly value: string } }>, readonly month: { readonly __typename?: 'MonthTime', readonly id: string, readonly value: string } | undefined, readonly visitType: { readonly __typename?: 'ReviewVisitType', readonly id: string, readonly name: string } | undefined, readonly customer: { readonly __typename?: 'Customer', readonly id: number, readonly user: { readonly __typename?: 'User', readonly id: string, readonly fullName: string | undefined, readonly account: { readonly __typename?: 'Account', readonly id: string, readonly imgUrl: string | undefined } | undefined } | undefined } }> | undefined };

export type SearchQueryVariables = Exact<{
  inputId: InputMaybe<Scalars['ID']>;
  searchValue: InputMaybe<Scalars['String']>;
  availability: InputMaybe<SearchInput>;
  searchId?: InputMaybe<Scalars['ID']>;
  filterIds?: InputMaybe<ReadonlyArray<Scalars['String']> | Scalars['String']>;
  sortId?: InputMaybe<Scalars['ID']>;
}>;


export type SearchQuery = { readonly __typename?: 'Query', readonly search: { readonly __typename?: 'Search', readonly results: ReadonlyArray<{ readonly __typename?: 'SearchResultType', readonly hasCapacity: boolean, readonly totalPrice: number, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly description: string | undefined, readonly avgRating: number, readonly displayRegardlessCapacity: boolean, readonly contactPhoneNumber: string, readonly hidePhoneNumber: boolean, readonly zeroCartTotal: boolean, readonly hasCompletedSignUp: boolean | undefined, readonly isActive: boolean, readonly reviews: ReadonlyArray<{ readonly __typename?: 'BeachBarReview', readonly id: string }>, readonly payments: ReadonlyArray<{ readonly __typename?: 'Payment', readonly id: number }>, readonly currency: { readonly __typename?: 'Currency', readonly id: string, readonly symbol: string }, readonly category: { readonly __typename?: 'BeachBarCategory', readonly id: string, readonly name: string }, readonly location: { readonly __typename?: 'BeachBarLocation', readonly id: string, readonly address: string, readonly zipCode: string | undefined, readonly longitude: any, readonly latitude: any, readonly formattedLocation: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined }, readonly features: ReadonlyArray<{ readonly __typename?: 'BeachBarFeature', readonly quantity: number, readonly service: { readonly __typename?: 'BeachBarService', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }>, readonly styles: ReadonlyArray<{ readonly __typename?: 'BeachBarStyle', readonly id: string, readonly name: string }>, readonly restaurants: ReadonlyArray<{ readonly __typename?: 'BeachBarRestaurant', readonly id: string }> }, readonly recommendedProducts: ReadonlyArray<{ readonly __typename?: 'ProductRecommended', readonly quantity: number, readonly product: { readonly __typename?: 'Product', readonly id: string, readonly name: string, readonly maxPeople: number, readonly price: number } }> }>, readonly search: { readonly __typename?: 'UserSearch', readonly id: number, readonly date: string | undefined, readonly filters: ReadonlyArray<{ readonly __typename?: 'SearchFilter', readonly id: string, readonly publicId: string }>, readonly sort: { readonly __typename?: 'SearchSort', readonly id: string, readonly name: string } | undefined, readonly inputValue: { readonly __typename?: 'SearchInputValue', readonly id: number, readonly publicId: string, readonly formattedValue: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } | undefined, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } } | undefined, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } } | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly longitude: any, readonly latitude: any, readonly formattedLocation: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined } } | undefined } } } };

export type SearchInputValuesQueryVariables = Exact<{ [key: string]: never; }>;


export type SearchInputValuesQuery = { readonly __typename?: 'Query', readonly searchInputValues: ReadonlyArray<{ readonly __typename?: 'SearchInputValue', readonly id: number, readonly publicId: string, readonly formattedValue: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } | undefined, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } } | undefined, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean } } | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly longitude: any, readonly latitude: any, readonly formattedLocation: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined } } | undefined }> };

export type StripeConnectUrlQueryVariables = Exact<{
  phoneNumber: InputMaybe<Scalars['String']>;
}>;


export type StripeConnectUrlQuery = { readonly __typename?: 'Query', readonly stripeConnectUrl: string | undefined };

export type UserHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type UserHistoryQuery = { readonly __typename?: 'Query', readonly userHistory: ReadonlyArray<{ readonly __typename?: 'UserHistoryExtended', readonly userHistory: { readonly __typename?: 'UserHistory', readonly id: number, readonly objectId: number | undefined, readonly timestamp: string, readonly activity: { readonly __typename?: 'UserHistoryActivity', readonly id: string, readonly name: string } }, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly location: { readonly __typename?: 'BeachBarLocation', readonly formattedLocation: string } } | undefined, readonly search: { readonly __typename?: 'UserSearch', readonly id: number, readonly date: string | undefined, readonly adults: number | undefined, readonly children: number | undefined, readonly inputValue: { readonly __typename?: 'SearchInputValue', readonly formattedValue: string } } | undefined }> };

export type UserSearchesQueryVariables = Exact<{
  limit: InputMaybe<Scalars['Int']>;
}>;


export type UserSearchesQuery = { readonly __typename?: 'Query', readonly userSearches: ReadonlyArray<{ readonly __typename?: 'UserSearch', readonly id: number, readonly date: string | undefined, readonly adults: number | undefined, readonly children: number | undefined, readonly inputValue: { readonly __typename?: 'SearchInputValue', readonly id: number, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string } | undefined, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined, readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined } | undefined } }> };

export type GetFacebookOAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFacebookOAuthUrlQuery = { readonly __typename?: 'Query', readonly getFacebookOAuthUrl: string };

export type GetGoogleOAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGoogleOAuthUrlQuery = { readonly __typename?: 'Query', readonly getGoogleOAuthUrl: string };

export type GetInstagramOAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInstagramOAuthUrlQuery = { readonly __typename?: 'Query', readonly getInstagramOAuthUrl: string };

export type IndexPageQueryVariables = Exact<{ [key: string]: never; }>;


export type IndexPageQuery = { readonly __typename?: 'Query', readonly getPersonalizedBeachBars: ReadonlyArray<{ readonly __typename?: 'BeachBar', readonly name: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly city: { readonly __typename?: 'City', readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly name: string } | undefined } }>, readonly favouriteBeachBars: ReadonlyArray<{ readonly __typename?: 'UserFavoriteBar', readonly beachBar: { readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly thumbnailUrl: string | undefined, readonly location: { readonly __typename?: 'BeachBarLocation', readonly city: { readonly __typename?: 'City', readonly name: string } } } }> };

export type GetAllBeachBarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBeachBarsQuery = { readonly __typename?: 'Query', readonly getAllBeachBars: ReadonlyArray<{ readonly __typename?: 'BeachBar', readonly id: string, readonly name: string, readonly slug: string, readonly thumbnailUrl: string | undefined, readonly description: string | undefined, readonly avgRating: number, readonly displayRegardlessCapacity: boolean, readonly contactPhoneNumber: string, readonly hidePhoneNumber: boolean, readonly zeroCartTotal: boolean, readonly hasCompletedSignUp: boolean | undefined, readonly isActive: boolean, readonly payments: ReadonlyArray<{ readonly __typename?: 'Payment', readonly id: number }>, readonly category: { readonly __typename?: 'BeachBarCategory', readonly id: string, readonly name: string }, readonly location: { readonly __typename?: 'BeachBarLocation', readonly id: string, readonly address: string, readonly zipCode: string | undefined, readonly longitude: any, readonly latitude: any, readonly formattedLocation: string, readonly country: { readonly __typename?: 'Country', readonly id: string, readonly name: string, readonly alpha2Code: string, readonly alpha3Code: string, readonly callingCode: string, readonly isEu: boolean }, readonly city: { readonly __typename?: 'City', readonly id: string, readonly name: string }, readonly region: { readonly __typename?: 'Region', readonly id: string, readonly name: string } | undefined }, readonly features: ReadonlyArray<{ readonly __typename?: 'BeachBarFeature', readonly quantity: number, readonly service: { readonly __typename?: 'BeachBarService', readonly id: string, readonly name: string, readonly icon: { readonly __typename?: 'Icon', readonly id: string, readonly publicId: string } } }>, readonly styles: ReadonlyArray<{ readonly __typename?: 'BeachBarStyle', readonly id: string, readonly name: string }>, readonly restaurants: ReadonlyArray<{ readonly __typename?: 'BeachBarRestaurant', readonly id: string }> }> };

export const BeachBarBaseFragmentDoc = gql`
    fragment BeachBarBase on BeachBar {
  id
  name
  slug
  thumbnailUrl
  description
  avgRating
  displayRegardlessCapacity
  contactPhoneNumber
  hidePhoneNumber
  zeroCartTotal
  hasCompletedSignUp
  isActive
  displayRegardlessCapacity
}
    `;
export const CountryBaseFragmentDoc = gql`
    fragment CountryBase on Country {
  id
  name
  alpha2Code
  alpha3Code
  callingCode
  isEu
}
    `;
export const DetailsBeachBarFragmentDoc = gql`
    fragment DetailsBeachBar on BeachBar {
  ...BeachBarBase
  category {
    id
    name
  }
  location {
    id
    address
    zipCode
    longitude
    latitude
    formattedLocation
    country {
      ...CountryBase
    }
    city {
      id
      name
    }
    region {
      id
      name
    }
  }
  features {
    quantity
    service {
      id
      name
      icon {
        id
        publicId
      }
    }
  }
  styles {
    id
    name
  }
  restaurants {
    id
  }
}
    ${BeachBarBaseFragmentDoc}
${CountryBaseFragmentDoc}`;
export const SearchBeachBarFragmentDoc = gql`
    fragment SearchBeachBar on BeachBar {
  ...DetailsBeachBar
  reviews {
    id
  }
  payments {
    id
  }
  currency {
    id
    symbol
  }
}
    ${DetailsBeachBarFragmentDoc}`;
export const FeatureBaseFragmentDoc = gql`
    fragment FeatureBase on BeachBarFeature {
  id
  quantity
  description
  service {
    id
    name
    icon {
      id
      name
      publicId
    }
  }
}
    `;
export const BeachBarImgUrlBaseFragmentDoc = gql`
    fragment BeachBarImgUrlBase on BeachBarImgUrl {
  id
  imgUrl
  description
  updatedAt
  timestamp
}
    `;
export const BeachBarReviewBaseFragmentDoc = gql`
    fragment BeachBarReviewBase on BeachBarReview {
  id
  ratingValue
  body
  answer
  positiveComment
  negativeComment
  updatedAt
  timestamp
  votes {
    id
    user {
      id
    }
    type {
      id
      value
    }
  }
  month {
    id
    value
  }
  visitType {
    id
    name
  }
  customer {
    id
    user {
      id
      fullName
      account {
        id
        imgUrl
      }
    }
  }
}
    `;
export const BasicCardFragmentDoc = gql`
    fragment BasicCard on Card {
  id
  expMonth
  expYear
  last4
  cardholderName
  isDefault
  brand {
    id
    name
  }
}
    `;
export const FoodBaseFragmentDoc = gql`
    fragment FoodBase on Food {
  id
  name
  price
  ingredients
  maxQuantity
}
    `;
export const CartFoodBaseFragmentDoc = gql`
    fragment CartFoodBase on CartFood {
  id
  quantity
  timestamp
  food {
    ...FoodBase
    beachBar {
      id
    }
    category {
      id
      name
      icon {
        id
        publicId
      }
    }
  }
}
    ${FoodBaseFragmentDoc}`;
export const CartFoodWithCartFragmentDoc = gql`
    fragment CartFoodWithCart on CartFood {
  ...CartFoodBase
  cart {
    id
    total
  }
}
    ${CartFoodBaseFragmentDoc}`;
export const CartNoteBaseFragmentDoc = gql`
    fragment CartNoteBase on CartNote {
  id
  body
  beachBar {
    id
  }
}
    `;
export const CartProductBaseFragmentDoc = gql`
    fragment CartProductBase on CartProduct {
  id
  quantity
  date
  people
  timestamp
  startTime {
    id
    value
  }
  endTime {
    id
    value
  }
  product {
    id
    name
    price
    imgUrl
    beachBar {
      id
      name
      thumbnailUrl
      location {
        formattedLocation
      }
      currency {
        id
        symbol
      }
    }
  }
}
    `;
export const CountryFragmentDoc = gql`
    fragment Country on Country {
  ...CountryBase
  cities {
    id
    name
  }
  currency {
    id
    name
    isoCode
    symbol
    secondSymbol
  }
}
    ${CountryBaseFragmentDoc}`;
export const DashboardDateValueFragmentDoc = gql`
    fragment DashboardDateValue on DashboardDateValue {
  date
  value
}
    `;
export const DashboardBillingFieldFragmentDoc = gql`
    fragment DashboardBillingField on DashboardBillingField {
  revenue {
    ...DashboardDateValue
  }
}
    ${DashboardDateValueFragmentDoc}`;
export const FoodDetailsFragmentDoc = gql`
    fragment FoodDetails on Food {
  ...FoodBase
  category {
    id
    name
    icon {
      id
      publicId
    }
  }
}
    ${FoodBaseFragmentDoc}`;
export const LoginAuthorizeFragmentDoc = gql`
    fragment LoginAuthorize on LoginAuthorize {
  accessToken
  refreshToken
  scope
  user {
    id
    email
    firstName
    lastName
    fullName
    account {
      imgUrl
    }
  }
}
    `;
export const ProductBaseFragmentDoc = gql`
    fragment ProductBase on Product {
  id
  name
  description
  imgUrl
  price
  maxPeople
  minFoodSpending
  category {
    id
    components {
      quantity
      component {
        id
        name
        icon {
          id
          publicId
        }
      }
    }
  }
}
    `;
export const ProductDetailsFragmentDoc = gql`
    fragment ProductDetails on Product {
  ...ProductBase
  beachBar {
    id
    currency {
      id
      symbol
    }
  }
  reservationLimits {
    id
    from
    to
    limitNumber
  }
}
    ${ProductBaseFragmentDoc}`;
export const ProductReservationLimitBaseFragmentDoc = gql`
    fragment ProductReservationLimitBase on ProductReservationLimit {
  id
  from
  to
  limitNumber
  product {
    id
  }
  startTime {
    id
    value
  }
  endTime {
    id
    value
  }
}
    `;
export const SearchInputValueFragmentDoc = gql`
    fragment SearchInputValue on SearchInputValue {
  id
  publicId
  formattedValue
  country {
    ...CountryBase
  }
  city {
    id
    name
    country {
      ...CountryBase
    }
  }
  region {
    id
    name
    country {
      ...CountryBase
    }
  }
  beachBar {
    id
    name
    thumbnailUrl
    location {
      longitude
      latitude
      formattedLocation
      country {
        ...CountryBase
      }
      city {
        id
        name
      }
      region {
        id
        name
      }
    }
  }
}
    ${CountryBaseFragmentDoc}`;
export const HourValueFragmentDoc = gql`
    fragment HourValue on HourTime {
  id
  value
}
    `;
export const AddBeachBarDocument = gql`
    mutation AddBeachBar($name: String!, $description: String!, $thumbnailUrl: URL!, $contactPhoneNumber: String!, $hidePhoneNumber: Boolean = false, $zeroCartTotal: Boolean!, $categoryId: ID!, $openingTimeId: ID!, $closingTimeId: ID!, $code: String!, $state: String!) {
  addBeachBar(
    name: $name
    description: $description
    thumbnailUrl: $thumbnailUrl
    contactPhoneNumber: $contactPhoneNumber
    hidePhoneNumber: $hidePhoneNumber
    zeroCartTotal: $zeroCartTotal
    categoryId: $categoryId
    openingTimeId: $openingTimeId
    closingTimeId: $closingTimeId
    code: $code
    state: $state
  ) {
    ...BeachBarBase
  }
}
    ${BeachBarBaseFragmentDoc}`;
export type AddBeachBarMutationFn = Apollo.MutationFunction<AddBeachBarMutation, AddBeachBarMutationVariables>;

/**
 * __useAddBeachBarMutation__
 *
 * To run a mutation, you first call `useAddBeachBarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBeachBarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBeachBarMutation, { data, loading, error }] = useAddBeachBarMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      thumbnailUrl: // value for 'thumbnailUrl'
 *      contactPhoneNumber: // value for 'contactPhoneNumber'
 *      hidePhoneNumber: // value for 'hidePhoneNumber'
 *      zeroCartTotal: // value for 'zeroCartTotal'
 *      categoryId: // value for 'categoryId'
 *      openingTimeId: // value for 'openingTimeId'
 *      closingTimeId: // value for 'closingTimeId'
 *      code: // value for 'code'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useAddBeachBarMutation(baseOptions?: Apollo.MutationHookOptions<AddBeachBarMutation, AddBeachBarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBeachBarMutation, AddBeachBarMutationVariables>(AddBeachBarDocument, options);
      }
export type AddBeachBarMutationHookResult = ReturnType<typeof useAddBeachBarMutation>;
export type AddBeachBarMutationResult = Apollo.MutationResult<AddBeachBarMutation>;
export type AddBeachBarMutationOptions = Apollo.BaseMutationOptions<AddBeachBarMutation, AddBeachBarMutationVariables>;
export const AddBeachBarFeatureDocument = gql`
    mutation AddBeachBarFeature($beachBarId: ID!, $featureId: ID!, $quantity: Int = 1, $description: String) {
  addBeachBarFeature(
    beachBarId: $beachBarId
    featureId: $featureId
    quantity: $quantity
    description: $description
  ) {
    ...FeatureBase
  }
}
    ${FeatureBaseFragmentDoc}`;
export type AddBeachBarFeatureMutationFn = Apollo.MutationFunction<AddBeachBarFeatureMutation, AddBeachBarFeatureMutationVariables>;

/**
 * __useAddBeachBarFeatureMutation__
 *
 * To run a mutation, you first call `useAddBeachBarFeatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBeachBarFeatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBeachBarFeatureMutation, { data, loading, error }] = useAddBeachBarFeatureMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      featureId: // value for 'featureId'
 *      quantity: // value for 'quantity'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useAddBeachBarFeatureMutation(baseOptions?: Apollo.MutationHookOptions<AddBeachBarFeatureMutation, AddBeachBarFeatureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBeachBarFeatureMutation, AddBeachBarFeatureMutationVariables>(AddBeachBarFeatureDocument, options);
      }
export type AddBeachBarFeatureMutationHookResult = ReturnType<typeof useAddBeachBarFeatureMutation>;
export type AddBeachBarFeatureMutationResult = Apollo.MutationResult<AddBeachBarFeatureMutation>;
export type AddBeachBarFeatureMutationOptions = Apollo.BaseMutationOptions<AddBeachBarFeatureMutation, AddBeachBarFeatureMutationVariables>;
export const AddBeachBarImgUrlDocument = gql`
    mutation AddBeachBarImgUrl($beachBarId: ID!, $imgUrl: URL!, $description: String) {
  addBeachBarImgUrl(
    beachBarId: $beachBarId
    imgUrl: $imgUrl
    description: $description
  ) {
    ...BeachBarImgUrlBase
  }
}
    ${BeachBarImgUrlBaseFragmentDoc}`;
export type AddBeachBarImgUrlMutationFn = Apollo.MutationFunction<AddBeachBarImgUrlMutation, AddBeachBarImgUrlMutationVariables>;

/**
 * __useAddBeachBarImgUrlMutation__
 *
 * To run a mutation, you first call `useAddBeachBarImgUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBeachBarImgUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBeachBarImgUrlMutation, { data, loading, error }] = useAddBeachBarImgUrlMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      imgUrl: // value for 'imgUrl'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useAddBeachBarImgUrlMutation(baseOptions?: Apollo.MutationHookOptions<AddBeachBarImgUrlMutation, AddBeachBarImgUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBeachBarImgUrlMutation, AddBeachBarImgUrlMutationVariables>(AddBeachBarImgUrlDocument, options);
      }
export type AddBeachBarImgUrlMutationHookResult = ReturnType<typeof useAddBeachBarImgUrlMutation>;
export type AddBeachBarImgUrlMutationResult = Apollo.MutationResult<AddBeachBarImgUrlMutation>;
export type AddBeachBarImgUrlMutationOptions = Apollo.BaseMutationOptions<AddBeachBarImgUrlMutation, AddBeachBarImgUrlMutationVariables>;
export const AddBeachBarLocationDocument = gql`
    mutation AddBeachBarLocation($beachBarId: ID!, $address: String!, $zipCode: String, $countryId: ID!, $city: String!, $region: ID, $latitude: String!, $longitude: String!) {
  addBeachBarLocation(
    beachBarId: $beachBarId
    address: $address
    zipCode: $zipCode
    countryId: $countryId
    city: $city
    region: $region
    latitude: $latitude
    longitude: $longitude
  ) {
    id
    address
    zipCode
    latitude
    longitude
    whereIs
    country {
      ...CountryBase
    }
    city {
      id
      name
    }
    region {
      id
      name
    }
  }
}
    ${CountryBaseFragmentDoc}`;
export type AddBeachBarLocationMutationFn = Apollo.MutationFunction<AddBeachBarLocationMutation, AddBeachBarLocationMutationVariables>;

/**
 * __useAddBeachBarLocationMutation__
 *
 * To run a mutation, you first call `useAddBeachBarLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBeachBarLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBeachBarLocationMutation, { data, loading, error }] = useAddBeachBarLocationMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      address: // value for 'address'
 *      zipCode: // value for 'zipCode'
 *      countryId: // value for 'countryId'
 *      city: // value for 'city'
 *      region: // value for 'region'
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *   },
 * });
 */
export function useAddBeachBarLocationMutation(baseOptions?: Apollo.MutationHookOptions<AddBeachBarLocationMutation, AddBeachBarLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBeachBarLocationMutation, AddBeachBarLocationMutationVariables>(AddBeachBarLocationDocument, options);
      }
export type AddBeachBarLocationMutationHookResult = ReturnType<typeof useAddBeachBarLocationMutation>;
export type AddBeachBarLocationMutationResult = Apollo.MutationResult<AddBeachBarLocationMutation>;
export type AddBeachBarLocationMutationOptions = Apollo.BaseMutationOptions<AddBeachBarLocationMutation, AddBeachBarLocationMutationVariables>;
export const AddBeachBarOwnerDocument = gql`
    mutation AddBeachBarOwner($beachBarId: ID!, $userId: ID, $isPrimary: Boolean = false) {
  addBeachBarOwner(
    beachBarId: $beachBarId
    userId: $userId
    isPrimary: $isPrimary
  ) {
    id
    isPrimary
    beachBar {
      id
    }
    owner {
      id
      user {
        id
      }
    }
  }
}
    `;
export type AddBeachBarOwnerMutationFn = Apollo.MutationFunction<AddBeachBarOwnerMutation, AddBeachBarOwnerMutationVariables>;

/**
 * __useAddBeachBarOwnerMutation__
 *
 * To run a mutation, you first call `useAddBeachBarOwnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBeachBarOwnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBeachBarOwnerMutation, { data, loading, error }] = useAddBeachBarOwnerMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      userId: // value for 'userId'
 *      isPrimary: // value for 'isPrimary'
 *   },
 * });
 */
export function useAddBeachBarOwnerMutation(baseOptions?: Apollo.MutationHookOptions<AddBeachBarOwnerMutation, AddBeachBarOwnerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBeachBarOwnerMutation, AddBeachBarOwnerMutationVariables>(AddBeachBarOwnerDocument, options);
      }
export type AddBeachBarOwnerMutationHookResult = ReturnType<typeof useAddBeachBarOwnerMutation>;
export type AddBeachBarOwnerMutationResult = Apollo.MutationResult<AddBeachBarOwnerMutation>;
export type AddBeachBarOwnerMutationOptions = Apollo.BaseMutationOptions<AddBeachBarOwnerMutation, AddBeachBarOwnerMutationVariables>;
export const AddBeachBarStylesDocument = gql`
    mutation AddBeachBarStyles($beachBarId: ID!, $styleIds: [ID!]!) {
  addBeachBarStyles(beachBarId: $beachBarId, styleIds: $styleIds) {
    id
    name
  }
}
    `;
export type AddBeachBarStylesMutationFn = Apollo.MutationFunction<AddBeachBarStylesMutation, AddBeachBarStylesMutationVariables>;

/**
 * __useAddBeachBarStylesMutation__
 *
 * To run a mutation, you first call `useAddBeachBarStylesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBeachBarStylesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBeachBarStylesMutation, { data, loading, error }] = useAddBeachBarStylesMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      styleIds: // value for 'styleIds'
 *   },
 * });
 */
export function useAddBeachBarStylesMutation(baseOptions?: Apollo.MutationHookOptions<AddBeachBarStylesMutation, AddBeachBarStylesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBeachBarStylesMutation, AddBeachBarStylesMutationVariables>(AddBeachBarStylesDocument, options);
      }
export type AddBeachBarStylesMutationHookResult = ReturnType<typeof useAddBeachBarStylesMutation>;
export type AddBeachBarStylesMutationResult = Apollo.MutationResult<AddBeachBarStylesMutation>;
export type AddBeachBarStylesMutationOptions = Apollo.BaseMutationOptions<AddBeachBarStylesMutation, AddBeachBarStylesMutationVariables>;
export const AddCartFoodDocument = gql`
    mutation AddCartFood($cartId: ID!, $foodId: ID!, $quantity: Int) {
  addCartFood(cartId: $cartId, foodId: $foodId, quantity: $quantity) {
    ...CartFoodWithCart
  }
}
    ${CartFoodWithCartFragmentDoc}`;
export type AddCartFoodMutationFn = Apollo.MutationFunction<AddCartFoodMutation, AddCartFoodMutationVariables>;

/**
 * __useAddCartFoodMutation__
 *
 * To run a mutation, you first call `useAddCartFoodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCartFoodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCartFoodMutation, { data, loading, error }] = useAddCartFoodMutation({
 *   variables: {
 *      cartId: // value for 'cartId'
 *      foodId: // value for 'foodId'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useAddCartFoodMutation(baseOptions?: Apollo.MutationHookOptions<AddCartFoodMutation, AddCartFoodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCartFoodMutation, AddCartFoodMutationVariables>(AddCartFoodDocument, options);
      }
export type AddCartFoodMutationHookResult = ReturnType<typeof useAddCartFoodMutation>;
export type AddCartFoodMutationResult = Apollo.MutationResult<AddCartFoodMutation>;
export type AddCartFoodMutationOptions = Apollo.BaseMutationOptions<AddCartFoodMutation, AddCartFoodMutationVariables>;
export const AddCartNoteDocument = gql`
    mutation AddCartNote($cartId: ID!, $beachBarId: ID!, $body: String!) {
  addCartNote(cartId: $cartId, beachBarId: $beachBarId, body: $body) {
    ...CartNoteBase
  }
}
    ${CartNoteBaseFragmentDoc}`;
export type AddCartNoteMutationFn = Apollo.MutationFunction<AddCartNoteMutation, AddCartNoteMutationVariables>;

/**
 * __useAddCartNoteMutation__
 *
 * To run a mutation, you first call `useAddCartNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCartNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCartNoteMutation, { data, loading, error }] = useAddCartNoteMutation({
 *   variables: {
 *      cartId: // value for 'cartId'
 *      beachBarId: // value for 'beachBarId'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useAddCartNoteMutation(baseOptions?: Apollo.MutationHookOptions<AddCartNoteMutation, AddCartNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCartNoteMutation, AddCartNoteMutationVariables>(AddCartNoteDocument, options);
      }
export type AddCartNoteMutationHookResult = ReturnType<typeof useAddCartNoteMutation>;
export type AddCartNoteMutationResult = Apollo.MutationResult<AddCartNoteMutation>;
export type AddCartNoteMutationOptions = Apollo.BaseMutationOptions<AddCartNoteMutation, AddCartNoteMutationVariables>;
export const AddCartProductDocument = gql`
    mutation AddCartProduct($cartId: ID!, $productId: ID!, $quantity: Int, $date: Date!, $people: Int!, $startTimeId: ID!, $endTimeId: ID!) {
  addCartProduct(
    cartId: $cartId
    productId: $productId
    quantity: $quantity
    date: $date
    people: $people
    startTimeId: $startTimeId
    endTimeId: $endTimeId
  ) {
    id
    quantity
    people
    product {
      id
      name
    }
  }
}
    `;
export type AddCartProductMutationFn = Apollo.MutationFunction<AddCartProductMutation, AddCartProductMutationVariables>;

/**
 * __useAddCartProductMutation__
 *
 * To run a mutation, you first call `useAddCartProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCartProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCartProductMutation, { data, loading, error }] = useAddCartProductMutation({
 *   variables: {
 *      cartId: // value for 'cartId'
 *      productId: // value for 'productId'
 *      quantity: // value for 'quantity'
 *      date: // value for 'date'
 *      people: // value for 'people'
 *      startTimeId: // value for 'startTimeId'
 *      endTimeId: // value for 'endTimeId'
 *   },
 * });
 */
export function useAddCartProductMutation(baseOptions?: Apollo.MutationHookOptions<AddCartProductMutation, AddCartProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCartProductMutation, AddCartProductMutationVariables>(AddCartProductDocument, options);
      }
export type AddCartProductMutationHookResult = ReturnType<typeof useAddCartProductMutation>;
export type AddCartProductMutationResult = Apollo.MutationResult<AddCartProductMutation>;
export type AddCartProductMutationOptions = Apollo.BaseMutationOptions<AddCartProductMutation, AddCartProductMutationVariables>;
export const AddCustomerPaymentMethodDocument = gql`
    mutation AddCustomerPaymentMethod($token: String!, $customerId: ID!, $cardholderName: String!, $isDefault: Boolean = false, $savedForFuture: Boolean = true) {
  addCustomerPaymentMethod(
    source: $token
    customerId: $customerId
    cardholderName: $cardholderName
    isDefault: $isDefault
    savedForFuture: $savedForFuture
  ) {
    id
    expMonth
    expYear
    last4
    cardholderName
    isDefault
    brand {
      id
      name
    }
  }
}
    `;
export type AddCustomerPaymentMethodMutationFn = Apollo.MutationFunction<AddCustomerPaymentMethodMutation, AddCustomerPaymentMethodMutationVariables>;

/**
 * __useAddCustomerPaymentMethodMutation__
 *
 * To run a mutation, you first call `useAddCustomerPaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCustomerPaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCustomerPaymentMethodMutation, { data, loading, error }] = useAddCustomerPaymentMethodMutation({
 *   variables: {
 *      token: // value for 'token'
 *      customerId: // value for 'customerId'
 *      cardholderName: // value for 'cardholderName'
 *      isDefault: // value for 'isDefault'
 *      savedForFuture: // value for 'savedForFuture'
 *   },
 * });
 */
export function useAddCustomerPaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<AddCustomerPaymentMethodMutation, AddCustomerPaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCustomerPaymentMethodMutation, AddCustomerPaymentMethodMutationVariables>(AddCustomerPaymentMethodDocument, options);
      }
export type AddCustomerPaymentMethodMutationHookResult = ReturnType<typeof useAddCustomerPaymentMethodMutation>;
export type AddCustomerPaymentMethodMutationResult = Apollo.MutationResult<AddCustomerPaymentMethodMutation>;
export type AddCustomerPaymentMethodMutationOptions = Apollo.BaseMutationOptions<AddCustomerPaymentMethodMutation, AddCustomerPaymentMethodMutationVariables>;
export const AddFoodDocument = gql`
    mutation AddFood($beachBarId: ID!, $name: String!, $categoryId: ID!, $ingredients: String, $price: Float!, $maxQuantity: Int) {
  addFood(
    beachBarId: $beachBarId
    name: $name
    categoryId: $categoryId
    ingredients: $ingredients
    price: $price
    maxQuantity: $maxQuantity
  ) {
    ...FoodDetails
  }
}
    ${FoodDetailsFragmentDoc}`;
export type AddFoodMutationFn = Apollo.MutationFunction<AddFoodMutation, AddFoodMutationVariables>;

/**
 * __useAddFoodMutation__
 *
 * To run a mutation, you first call `useAddFoodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFoodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFoodMutation, { data, loading, error }] = useAddFoodMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      name: // value for 'name'
 *      categoryId: // value for 'categoryId'
 *      ingredients: // value for 'ingredients'
 *      price: // value for 'price'
 *      maxQuantity: // value for 'maxQuantity'
 *   },
 * });
 */
export function useAddFoodMutation(baseOptions?: Apollo.MutationHookOptions<AddFoodMutation, AddFoodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFoodMutation, AddFoodMutationVariables>(AddFoodDocument, options);
      }
export type AddFoodMutationHookResult = ReturnType<typeof useAddFoodMutation>;
export type AddFoodMutationResult = Apollo.MutationResult<AddFoodMutation>;
export type AddFoodMutationOptions = Apollo.BaseMutationOptions<AddFoodMutation, AddFoodMutationVariables>;
export const AddProductDocument = gql`
    mutation AddProduct($beachBarId: ID!, $name: String!, $description: String, $categoryId: ID!, $price: Float!, $maxPeople: Int!, $minFoodSpending: Float, $imgUrl: URL) {
  addProduct(
    beachBarId: $beachBarId
    name: $name
    description: $description
    categoryId: $categoryId
    price: $price
    maxPeople: $maxPeople
    minFoodSpending: $minFoodSpending
    imgUrl: $imgUrl
  ) {
    ...ProductBase
  }
}
    ${ProductBaseFragmentDoc}`;
export type AddProductMutationFn = Apollo.MutationFunction<AddProductMutation, AddProductMutationVariables>;

/**
 * __useAddProductMutation__
 *
 * To run a mutation, you first call `useAddProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductMutation, { data, loading, error }] = useAddProductMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      categoryId: // value for 'categoryId'
 *      price: // value for 'price'
 *      maxPeople: // value for 'maxPeople'
 *      minFoodSpending: // value for 'minFoodSpending'
 *      imgUrl: // value for 'imgUrl'
 *   },
 * });
 */
export function useAddProductMutation(baseOptions?: Apollo.MutationHookOptions<AddProductMutation, AddProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProductMutation, AddProductMutationVariables>(AddProductDocument, options);
      }
export type AddProductMutationHookResult = ReturnType<typeof useAddProductMutation>;
export type AddProductMutationResult = Apollo.MutationResult<AddProductMutation>;
export type AddProductMutationOptions = Apollo.BaseMutationOptions<AddProductMutation, AddProductMutationVariables>;
export const AddProductReservationLimitDocument = gql`
    mutation AddProductReservationLimit($productId: ID!, $limit: Int!, $from: Date!, $to: Date!, $startTimeId: ID, $endTimeId: ID) {
  addProductReservationLimit(
    productId: $productId
    limit: $limit
    from: $from
    to: $to
    startTimeId: $startTimeId
    endTimeId: $endTimeId
  ) {
    ...ProductReservationLimitBase
  }
}
    ${ProductReservationLimitBaseFragmentDoc}`;
export type AddProductReservationLimitMutationFn = Apollo.MutationFunction<AddProductReservationLimitMutation, AddProductReservationLimitMutationVariables>;

/**
 * __useAddProductReservationLimitMutation__
 *
 * To run a mutation, you first call `useAddProductReservationLimitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductReservationLimitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductReservationLimitMutation, { data, loading, error }] = useAddProductReservationLimitMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      limit: // value for 'limit'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *      startTimeId: // value for 'startTimeId'
 *      endTimeId: // value for 'endTimeId'
 *   },
 * });
 */
export function useAddProductReservationLimitMutation(baseOptions?: Apollo.MutationHookOptions<AddProductReservationLimitMutation, AddProductReservationLimitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProductReservationLimitMutation, AddProductReservationLimitMutationVariables>(AddProductReservationLimitDocument, options);
      }
export type AddProductReservationLimitMutationHookResult = ReturnType<typeof useAddProductReservationLimitMutation>;
export type AddProductReservationLimitMutationResult = Apollo.MutationResult<AddProductReservationLimitMutation>;
export type AddProductReservationLimitMutationOptions = Apollo.BaseMutationOptions<AddProductReservationLimitMutation, AddProductReservationLimitMutationVariables>;
export const AddReviewDocument = gql`
    mutation AddReview($beachBarId: ID!, $paymentRefCode: String = null, $ratingValue: Int!, $visitTypeId: ID = null, $monthId: ID = null, $positiveComment: String = null, $negativeComment: String = null, $body: String = null) {
  addReview(
    beachBarId: $beachBarId
    paymentRefCode: $paymentRefCode
    ratingValue: $ratingValue
    visitTypeId: $visitTypeId
    monthId: $monthId
    positiveComment: $positiveComment
    negativeComment: $negativeComment
    body: $body
  ) {
    id
  }
}
    `;
export type AddReviewMutationFn = Apollo.MutationFunction<AddReviewMutation, AddReviewMutationVariables>;

/**
 * __useAddReviewMutation__
 *
 * To run a mutation, you first call `useAddReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addReviewMutation, { data, loading, error }] = useAddReviewMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      paymentRefCode: // value for 'paymentRefCode'
 *      ratingValue: // value for 'ratingValue'
 *      visitTypeId: // value for 'visitTypeId'
 *      monthId: // value for 'monthId'
 *      positiveComment: // value for 'positiveComment'
 *      negativeComment: // value for 'negativeComment'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useAddReviewMutation(baseOptions?: Apollo.MutationHookOptions<AddReviewMutation, AddReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddReviewMutation, AddReviewMutationVariables>(AddReviewDocument, options);
      }
export type AddReviewMutationHookResult = ReturnType<typeof useAddReviewMutation>;
export type AddReviewMutationResult = Apollo.MutationResult<AddReviewMutation>;
export type AddReviewMutationOptions = Apollo.BaseMutationOptions<AddReviewMutation, AddReviewMutationVariables>;
export const AuthorizeDocument = gql`
    mutation Authorize($user: OAuthUserInput!, $provider: OAuthProvider!, $isPrimaryOwner: Boolean = false, $loginDetails: UserLoginDetails = null) {
  authorize(
    user: $user
    provider: $provider
    isPrimaryOwner: $isPrimaryOwner
    loginDetails: $loginDetails
  ) {
    ...LoginAuthorize
  }
}
    ${LoginAuthorizeFragmentDoc}`;
export type AuthorizeMutationFn = Apollo.MutationFunction<AuthorizeMutation, AuthorizeMutationVariables>;

/**
 * __useAuthorizeMutation__
 *
 * To run a mutation, you first call `useAuthorizeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthorizeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authorizeMutation, { data, loading, error }] = useAuthorizeMutation({
 *   variables: {
 *      user: // value for 'user'
 *      provider: // value for 'provider'
 *      isPrimaryOwner: // value for 'isPrimaryOwner'
 *      loginDetails: // value for 'loginDetails'
 *   },
 * });
 */
export function useAuthorizeMutation(baseOptions?: Apollo.MutationHookOptions<AuthorizeMutation, AuthorizeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AuthorizeMutation, AuthorizeMutationVariables>(AuthorizeDocument, options);
      }
export type AuthorizeMutationHookResult = ReturnType<typeof useAuthorizeMutation>;
export type AuthorizeMutationResult = Apollo.MutationResult<AuthorizeMutation>;
export type AuthorizeMutationOptions = Apollo.BaseMutationOptions<AuthorizeMutation, AuthorizeMutationVariables>;
export const ChangeUserPasswordDocument = gql`
    mutation ChangeUserPassword($email: Email!, $token: String!, $newPassword: String!) {
  changeUserPassword(email: $email, token: $token, newPassword: $newPassword)
}
    `;
export type ChangeUserPasswordMutationFn = Apollo.MutationFunction<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;

/**
 * __useChangeUserPasswordMutation__
 *
 * To run a mutation, you first call `useChangeUserPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUserPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUserPasswordMutation, { data, loading, error }] = useChangeUserPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangeUserPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>(ChangeUserPasswordDocument, options);
      }
export type ChangeUserPasswordMutationHookResult = ReturnType<typeof useChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationResult = Apollo.MutationResult<ChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationOptions = Apollo.BaseMutationOptions<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;
export const CheckoutDocument = gql`
    mutation Checkout($cartId: ID!, $cardId: ID!) {
  checkout(cartId: $cartId, cardId: $cardId) {
    id
    refCode
  }
}
    `;
export type CheckoutMutationFn = Apollo.MutationFunction<CheckoutMutation, CheckoutMutationVariables>;

/**
 * __useCheckoutMutation__
 *
 * To run a mutation, you first call `useCheckoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutMutation, { data, loading, error }] = useCheckoutMutation({
 *   variables: {
 *      cartId: // value for 'cartId'
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function useCheckoutMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutMutation, CheckoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutMutation, CheckoutMutationVariables>(CheckoutDocument, options);
      }
export type CheckoutMutationHookResult = ReturnType<typeof useCheckoutMutation>;
export type CheckoutMutationResult = Apollo.MutationResult<CheckoutMutation>;
export type CheckoutMutationOptions = Apollo.BaseMutationOptions<CheckoutMutation, CheckoutMutationVariables>;
export const CompleteBeachBarSignUpDocument = gql`
    mutation CompleteBeachBarSignUp($beachBarId: ID!) {
  completeBeachBarSignUp(beachBarId: $beachBarId)
}
    `;
export type CompleteBeachBarSignUpMutationFn = Apollo.MutationFunction<CompleteBeachBarSignUpMutation, CompleteBeachBarSignUpMutationVariables>;

/**
 * __useCompleteBeachBarSignUpMutation__
 *
 * To run a mutation, you first call `useCompleteBeachBarSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteBeachBarSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeBeachBarSignUpMutation, { data, loading, error }] = useCompleteBeachBarSignUpMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *   },
 * });
 */
export function useCompleteBeachBarSignUpMutation(baseOptions?: Apollo.MutationHookOptions<CompleteBeachBarSignUpMutation, CompleteBeachBarSignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteBeachBarSignUpMutation, CompleteBeachBarSignUpMutationVariables>(CompleteBeachBarSignUpDocument, options);
      }
export type CompleteBeachBarSignUpMutationHookResult = ReturnType<typeof useCompleteBeachBarSignUpMutation>;
export type CompleteBeachBarSignUpMutationResult = Apollo.MutationResult<CompleteBeachBarSignUpMutation>;
export type CompleteBeachBarSignUpMutationOptions = Apollo.BaseMutationOptions<CompleteBeachBarSignUpMutation, CompleteBeachBarSignUpMutationVariables>;
export const DeleteBeachBarFeatureDocument = gql`
    mutation DeleteBeachBarFeature($id: ID!) {
  deleteBeachBarFeature(id: $id)
}
    `;
export type DeleteBeachBarFeatureMutationFn = Apollo.MutationFunction<DeleteBeachBarFeatureMutation, DeleteBeachBarFeatureMutationVariables>;

/**
 * __useDeleteBeachBarFeatureMutation__
 *
 * To run a mutation, you first call `useDeleteBeachBarFeatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBeachBarFeatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBeachBarFeatureMutation, { data, loading, error }] = useDeleteBeachBarFeatureMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBeachBarFeatureMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBeachBarFeatureMutation, DeleteBeachBarFeatureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBeachBarFeatureMutation, DeleteBeachBarFeatureMutationVariables>(DeleteBeachBarFeatureDocument, options);
      }
export type DeleteBeachBarFeatureMutationHookResult = ReturnType<typeof useDeleteBeachBarFeatureMutation>;
export type DeleteBeachBarFeatureMutationResult = Apollo.MutationResult<DeleteBeachBarFeatureMutation>;
export type DeleteBeachBarFeatureMutationOptions = Apollo.BaseMutationOptions<DeleteBeachBarFeatureMutation, DeleteBeachBarFeatureMutationVariables>;
export const DeleteBeachBarImgUrlDocument = gql`
    mutation DeleteBeachBarImgUrl($id: ID!) {
  deleteBeachBarImgUrl(id: $id)
}
    `;
export type DeleteBeachBarImgUrlMutationFn = Apollo.MutationFunction<DeleteBeachBarImgUrlMutation, DeleteBeachBarImgUrlMutationVariables>;

/**
 * __useDeleteBeachBarImgUrlMutation__
 *
 * To run a mutation, you first call `useDeleteBeachBarImgUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBeachBarImgUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBeachBarImgUrlMutation, { data, loading, error }] = useDeleteBeachBarImgUrlMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBeachBarImgUrlMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBeachBarImgUrlMutation, DeleteBeachBarImgUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBeachBarImgUrlMutation, DeleteBeachBarImgUrlMutationVariables>(DeleteBeachBarImgUrlDocument, options);
      }
export type DeleteBeachBarImgUrlMutationHookResult = ReturnType<typeof useDeleteBeachBarImgUrlMutation>;
export type DeleteBeachBarImgUrlMutationResult = Apollo.MutationResult<DeleteBeachBarImgUrlMutation>;
export type DeleteBeachBarImgUrlMutationOptions = Apollo.BaseMutationOptions<DeleteBeachBarImgUrlMutation, DeleteBeachBarImgUrlMutationVariables>;
export const DeleteCartFoodDocument = gql`
    mutation DeleteCartFood($id: ID!) {
  deleteCartFood(id: $id)
}
    `;
export type DeleteCartFoodMutationFn = Apollo.MutationFunction<DeleteCartFoodMutation, DeleteCartFoodMutationVariables>;

/**
 * __useDeleteCartFoodMutation__
 *
 * To run a mutation, you first call `useDeleteCartFoodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCartFoodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCartFoodMutation, { data, loading, error }] = useDeleteCartFoodMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCartFoodMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCartFoodMutation, DeleteCartFoodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCartFoodMutation, DeleteCartFoodMutationVariables>(DeleteCartFoodDocument, options);
      }
export type DeleteCartFoodMutationHookResult = ReturnType<typeof useDeleteCartFoodMutation>;
export type DeleteCartFoodMutationResult = Apollo.MutationResult<DeleteCartFoodMutation>;
export type DeleteCartFoodMutationOptions = Apollo.BaseMutationOptions<DeleteCartFoodMutation, DeleteCartFoodMutationVariables>;
export const DeleteCartProductDocument = gql`
    mutation DeleteCartProduct($id: ID!) {
  deleteCartProduct(id: $id)
}
    `;
export type DeleteCartProductMutationFn = Apollo.MutationFunction<DeleteCartProductMutation, DeleteCartProductMutationVariables>;

/**
 * __useDeleteCartProductMutation__
 *
 * To run a mutation, you first call `useDeleteCartProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCartProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCartProductMutation, { data, loading, error }] = useDeleteCartProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCartProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCartProductMutation, DeleteCartProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCartProductMutation, DeleteCartProductMutationVariables>(DeleteCartProductDocument, options);
      }
export type DeleteCartProductMutationHookResult = ReturnType<typeof useDeleteCartProductMutation>;
export type DeleteCartProductMutationResult = Apollo.MutationResult<DeleteCartProductMutation>;
export type DeleteCartProductMutationOptions = Apollo.BaseMutationOptions<DeleteCartProductMutation, DeleteCartProductMutationVariables>;
export const DeleteCustomerPaymentMethodDocument = gql`
    mutation DeleteCustomerPaymentMethod($cardId: ID!) {
  deleteCustomerPaymentMethod(cardId: $cardId)
}
    `;
export type DeleteCustomerPaymentMethodMutationFn = Apollo.MutationFunction<DeleteCustomerPaymentMethodMutation, DeleteCustomerPaymentMethodMutationVariables>;

/**
 * __useDeleteCustomerPaymentMethodMutation__
 *
 * To run a mutation, you first call `useDeleteCustomerPaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCustomerPaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCustomerPaymentMethodMutation, { data, loading, error }] = useDeleteCustomerPaymentMethodMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function useDeleteCustomerPaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCustomerPaymentMethodMutation, DeleteCustomerPaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCustomerPaymentMethodMutation, DeleteCustomerPaymentMethodMutationVariables>(DeleteCustomerPaymentMethodDocument, options);
      }
export type DeleteCustomerPaymentMethodMutationHookResult = ReturnType<typeof useDeleteCustomerPaymentMethodMutation>;
export type DeleteCustomerPaymentMethodMutationResult = Apollo.MutationResult<DeleteCustomerPaymentMethodMutation>;
export type DeleteCustomerPaymentMethodMutationOptions = Apollo.BaseMutationOptions<DeleteCustomerPaymentMethodMutation, DeleteCustomerPaymentMethodMutationVariables>;
export const DeleteFoodDocument = gql`
    mutation DeleteFood($foodId: ID!) {
  deleteFood(foodId: $foodId)
}
    `;
export type DeleteFoodMutationFn = Apollo.MutationFunction<DeleteFoodMutation, DeleteFoodMutationVariables>;

/**
 * __useDeleteFoodMutation__
 *
 * To run a mutation, you first call `useDeleteFoodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFoodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFoodMutation, { data, loading, error }] = useDeleteFoodMutation({
 *   variables: {
 *      foodId: // value for 'foodId'
 *   },
 * });
 */
export function useDeleteFoodMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFoodMutation, DeleteFoodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFoodMutation, DeleteFoodMutationVariables>(DeleteFoodDocument, options);
      }
export type DeleteFoodMutationHookResult = ReturnType<typeof useDeleteFoodMutation>;
export type DeleteFoodMutationResult = Apollo.MutationResult<DeleteFoodMutation>;
export type DeleteFoodMutationOptions = Apollo.BaseMutationOptions<DeleteFoodMutation, DeleteFoodMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($productId: ID!) {
  deleteProduct(productId: $productId)
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const DeleteProductReservationLimitDocument = gql`
    mutation DeleteProductReservationLimit($id: ID!) {
  deleteProductReservationLimit(id: $id)
}
    `;
export type DeleteProductReservationLimitMutationFn = Apollo.MutationFunction<DeleteProductReservationLimitMutation, DeleteProductReservationLimitMutationVariables>;

/**
 * __useDeleteProductReservationLimitMutation__
 *
 * To run a mutation, you first call `useDeleteProductReservationLimitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductReservationLimitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductReservationLimitMutation, { data, loading, error }] = useDeleteProductReservationLimitMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductReservationLimitMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductReservationLimitMutation, DeleteProductReservationLimitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductReservationLimitMutation, DeleteProductReservationLimitMutationVariables>(DeleteProductReservationLimitDocument, options);
      }
export type DeleteProductReservationLimitMutationHookResult = ReturnType<typeof useDeleteProductReservationLimitMutation>;
export type DeleteProductReservationLimitMutationResult = Apollo.MutationResult<DeleteProductReservationLimitMutation>;
export type DeleteProductReservationLimitMutationOptions = Apollo.BaseMutationOptions<DeleteProductReservationLimitMutation, DeleteProductReservationLimitMutationVariables>;
export const DeleteReviewDocument = gql`
    mutation DeleteReview($id: ID!) {
  deleteReview(id: $id)
}
    `;
export type DeleteReviewMutationFn = Apollo.MutationFunction<DeleteReviewMutation, DeleteReviewMutationVariables>;

/**
 * __useDeleteReviewMutation__
 *
 * To run a mutation, you first call `useDeleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReviewMutation, { data, loading, error }] = useDeleteReviewMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteReviewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReviewMutation, DeleteReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, options);
      }
export type DeleteReviewMutationHookResult = ReturnType<typeof useDeleteReviewMutation>;
export type DeleteReviewMutationResult = Apollo.MutationResult<DeleteReviewMutation>;
export type DeleteReviewMutationOptions = Apollo.BaseMutationOptions<DeleteReviewMutation, DeleteReviewMutationVariables>;
export const HelloDocument = gql`
    mutation Hello($name: String) {
  hello(name: $name)
}
    `;
export type HelloMutationFn = Apollo.MutationFunction<HelloMutation, HelloMutationVariables>;

/**
 * __useHelloMutation__
 *
 * To run a mutation, you first call `useHelloMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHelloMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [helloMutation, { data, loading, error }] = useHelloMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useHelloMutation(baseOptions?: Apollo.MutationHookOptions<HelloMutation, HelloMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HelloMutation, HelloMutationVariables>(HelloDocument, options);
      }
export type HelloMutationHookResult = ReturnType<typeof useHelloMutation>;
export type HelloMutationResult = Apollo.MutationResult<HelloMutation>;
export type HelloMutationOptions = Apollo.BaseMutationOptions<HelloMutation, HelloMutationVariables>;
export const LoginDocument = gql`
    mutation Login($userCredentials: UserCredentials!, $loginDetails: UserLoginDetails = null) {
  login(userCredentials: $userCredentials, loginDetails: $loginDetails) {
    ...LoginAuthorize
  }
}
    ${LoginAuthorizeFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      userCredentials: // value for 'userCredentials'
 *      loginDetails: // value for 'loginDetails'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RefundPaymentDocument = gql`
    mutation RefundPayment($id: ID!) {
  refundPayment(id: $id)
}
    `;
export type RefundPaymentMutationFn = Apollo.MutationFunction<RefundPaymentMutation, RefundPaymentMutationVariables>;

/**
 * __useRefundPaymentMutation__
 *
 * To run a mutation, you first call `useRefundPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefundPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refundPaymentMutation, { data, loading, error }] = useRefundPaymentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRefundPaymentMutation(baseOptions?: Apollo.MutationHookOptions<RefundPaymentMutation, RefundPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefundPaymentMutation, RefundPaymentMutationVariables>(RefundPaymentDocument, options);
      }
export type RefundPaymentMutationHookResult = ReturnType<typeof useRefundPaymentMutation>;
export type RefundPaymentMutationResult = Apollo.MutationResult<RefundPaymentMutation>;
export type RefundPaymentMutationOptions = Apollo.BaseMutationOptions<RefundPaymentMutation, RefundPaymentMutationVariables>;
export const SendForgotPasswordLinkDocument = gql`
    mutation SendForgotPasswordLink($email: Email!) {
  sendForgotPasswordLink(email: $email)
}
    `;
export type SendForgotPasswordLinkMutationFn = Apollo.MutationFunction<SendForgotPasswordLinkMutation, SendForgotPasswordLinkMutationVariables>;

/**
 * __useSendForgotPasswordLinkMutation__
 *
 * To run a mutation, you first call `useSendForgotPasswordLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendForgotPasswordLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendForgotPasswordLinkMutation, { data, loading, error }] = useSendForgotPasswordLinkMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSendForgotPasswordLinkMutation(baseOptions?: Apollo.MutationHookOptions<SendForgotPasswordLinkMutation, SendForgotPasswordLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendForgotPasswordLinkMutation, SendForgotPasswordLinkMutationVariables>(SendForgotPasswordLinkDocument, options);
      }
export type SendForgotPasswordLinkMutationHookResult = ReturnType<typeof useSendForgotPasswordLinkMutation>;
export type SendForgotPasswordLinkMutationResult = Apollo.MutationResult<SendForgotPasswordLinkMutation>;
export type SendForgotPasswordLinkMutationOptions = Apollo.BaseMutationOptions<SendForgotPasswordLinkMutation, SendForgotPasswordLinkMutationVariables>;
export const SignS3Document = gql`
    mutation SignS3($filename: String!, $filetype: String!, $s3Bucket: String!) {
  signS3(filename: $filename, filetype: $filetype, s3Bucket: $s3Bucket) {
    signedRequest
    url
  }
}
    `;
export type SignS3MutationFn = Apollo.MutationFunction<SignS3Mutation, SignS3MutationVariables>;

/**
 * __useSignS3Mutation__
 *
 * To run a mutation, you first call `useSignS3Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignS3Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signS3Mutation, { data, loading, error }] = useSignS3Mutation({
 *   variables: {
 *      filename: // value for 'filename'
 *      filetype: // value for 'filetype'
 *      s3Bucket: // value for 's3Bucket'
 *   },
 * });
 */
export function useSignS3Mutation(baseOptions?: Apollo.MutationHookOptions<SignS3Mutation, SignS3MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignS3Mutation, SignS3MutationVariables>(SignS3Document, options);
      }
export type SignS3MutationHookResult = ReturnType<typeof useSignS3Mutation>;
export type SignS3MutationResult = Apollo.MutationResult<SignS3Mutation>;
export type SignS3MutationOptions = Apollo.BaseMutationOptions<SignS3Mutation, SignS3MutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($userCredentials: UserCredentials!, $isPrimaryOwner: Boolean = false) {
  signUp(userCredentials: $userCredentials, isPrimaryOwner: $isPrimaryOwner) {
    id
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      userCredentials: // value for 'userCredentials'
 *      isPrimaryOwner: // value for 'isPrimaryOwner'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const UpdateBeachBarDocument = gql`
    mutation UpdateBeachBar($id: ID!, $name: String, $description: String, $thumbnailUrl: URL, $contactPhoneNumber: String, $hidePhoneNumber: Boolean, $zeroCartTotal: Boolean, $isActive: Boolean, $displayRegardlessCapacity: Boolean, $categoryId: ID, $openingTimeId: ID, $closingTimeId: ID) {
  updateBeachBar(
    id: $id
    name: $name
    description: $description
    thumbnailUrl: $thumbnailUrl
    contactPhoneNumber: $contactPhoneNumber
    hidePhoneNumber: $hidePhoneNumber
    zeroCartTotal: $zeroCartTotal
    isActive: $isActive
    displayRegardlessCapacity: $displayRegardlessCapacity
    categoryId: $categoryId
    openingTimeId: $openingTimeId
    closingTimeId: $closingTimeId
  ) {
    ...BeachBarBase
  }
}
    ${BeachBarBaseFragmentDoc}`;
export type UpdateBeachBarMutationFn = Apollo.MutationFunction<UpdateBeachBarMutation, UpdateBeachBarMutationVariables>;

/**
 * __useUpdateBeachBarMutation__
 *
 * To run a mutation, you first call `useUpdateBeachBarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBeachBarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBeachBarMutation, { data, loading, error }] = useUpdateBeachBarMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      thumbnailUrl: // value for 'thumbnailUrl'
 *      contactPhoneNumber: // value for 'contactPhoneNumber'
 *      hidePhoneNumber: // value for 'hidePhoneNumber'
 *      zeroCartTotal: // value for 'zeroCartTotal'
 *      isActive: // value for 'isActive'
 *      displayRegardlessCapacity: // value for 'displayRegardlessCapacity'
 *      categoryId: // value for 'categoryId'
 *      openingTimeId: // value for 'openingTimeId'
 *      closingTimeId: // value for 'closingTimeId'
 *   },
 * });
 */
export function useUpdateBeachBarMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBeachBarMutation, UpdateBeachBarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBeachBarMutation, UpdateBeachBarMutationVariables>(UpdateBeachBarDocument, options);
      }
export type UpdateBeachBarMutationHookResult = ReturnType<typeof useUpdateBeachBarMutation>;
export type UpdateBeachBarMutationResult = Apollo.MutationResult<UpdateBeachBarMutation>;
export type UpdateBeachBarMutationOptions = Apollo.BaseMutationOptions<UpdateBeachBarMutation, UpdateBeachBarMutationVariables>;
export const UpdateBeachBarFeatureDocument = gql`
    mutation UpdateBeachBarFeature($id: ID!, $quantity: Int = 1, $description: String) {
  updateBeachBarFeature(id: $id, quantity: $quantity, description: $description) {
    ...FeatureBase
  }
}
    ${FeatureBaseFragmentDoc}`;
export type UpdateBeachBarFeatureMutationFn = Apollo.MutationFunction<UpdateBeachBarFeatureMutation, UpdateBeachBarFeatureMutationVariables>;

/**
 * __useUpdateBeachBarFeatureMutation__
 *
 * To run a mutation, you first call `useUpdateBeachBarFeatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBeachBarFeatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBeachBarFeatureMutation, { data, loading, error }] = useUpdateBeachBarFeatureMutation({
 *   variables: {
 *      id: // value for 'id'
 *      quantity: // value for 'quantity'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateBeachBarFeatureMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBeachBarFeatureMutation, UpdateBeachBarFeatureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBeachBarFeatureMutation, UpdateBeachBarFeatureMutationVariables>(UpdateBeachBarFeatureDocument, options);
      }
export type UpdateBeachBarFeatureMutationHookResult = ReturnType<typeof useUpdateBeachBarFeatureMutation>;
export type UpdateBeachBarFeatureMutationResult = Apollo.MutationResult<UpdateBeachBarFeatureMutation>;
export type UpdateBeachBarFeatureMutationOptions = Apollo.BaseMutationOptions<UpdateBeachBarFeatureMutation, UpdateBeachBarFeatureMutationVariables>;
export const UpdateBeachBarImgUrlDocument = gql`
    mutation UpdateBeachBarImgUrl($id: ID!, $description: String) {
  updateBeachBaImgUrl(id: $id, description: $description) {
    ...BeachBarImgUrlBase
  }
}
    ${BeachBarImgUrlBaseFragmentDoc}`;
export type UpdateBeachBarImgUrlMutationFn = Apollo.MutationFunction<UpdateBeachBarImgUrlMutation, UpdateBeachBarImgUrlMutationVariables>;

/**
 * __useUpdateBeachBarImgUrlMutation__
 *
 * To run a mutation, you first call `useUpdateBeachBarImgUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBeachBarImgUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBeachBarImgUrlMutation, { data, loading, error }] = useUpdateBeachBarImgUrlMutation({
 *   variables: {
 *      id: // value for 'id'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateBeachBarImgUrlMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBeachBarImgUrlMutation, UpdateBeachBarImgUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBeachBarImgUrlMutation, UpdateBeachBarImgUrlMutationVariables>(UpdateBeachBarImgUrlDocument, options);
      }
export type UpdateBeachBarImgUrlMutationHookResult = ReturnType<typeof useUpdateBeachBarImgUrlMutation>;
export type UpdateBeachBarImgUrlMutationResult = Apollo.MutationResult<UpdateBeachBarImgUrlMutation>;
export type UpdateBeachBarImgUrlMutationOptions = Apollo.BaseMutationOptions<UpdateBeachBarImgUrlMutation, UpdateBeachBarImgUrlMutationVariables>;
export const UpdateCartFoodDocument = gql`
    mutation UpdateCartFood($id: ID!, $quantity: Int!) {
  updateCartFood(id: $id, quantity: $quantity) {
    ...CartFoodWithCart
  }
}
    ${CartFoodWithCartFragmentDoc}`;
export type UpdateCartFoodMutationFn = Apollo.MutationFunction<UpdateCartFoodMutation, UpdateCartFoodMutationVariables>;

/**
 * __useUpdateCartFoodMutation__
 *
 * To run a mutation, you first call `useUpdateCartFoodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCartFoodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCartFoodMutation, { data, loading, error }] = useUpdateCartFoodMutation({
 *   variables: {
 *      id: // value for 'id'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useUpdateCartFoodMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCartFoodMutation, UpdateCartFoodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCartFoodMutation, UpdateCartFoodMutationVariables>(UpdateCartFoodDocument, options);
      }
export type UpdateCartFoodMutationHookResult = ReturnType<typeof useUpdateCartFoodMutation>;
export type UpdateCartFoodMutationResult = Apollo.MutationResult<UpdateCartFoodMutation>;
export type UpdateCartFoodMutationOptions = Apollo.BaseMutationOptions<UpdateCartFoodMutation, UpdateCartFoodMutationVariables>;
export const UpdateCartNoteDocument = gql`
    mutation UpdateCartNote($id: ID!, $body: String!) {
  updateCartNote(id: $id, body: $body) {
    ...CartNoteBase
  }
}
    ${CartNoteBaseFragmentDoc}`;
export type UpdateCartNoteMutationFn = Apollo.MutationFunction<UpdateCartNoteMutation, UpdateCartNoteMutationVariables>;

/**
 * __useUpdateCartNoteMutation__
 *
 * To run a mutation, you first call `useUpdateCartNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCartNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCartNoteMutation, { data, loading, error }] = useUpdateCartNoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useUpdateCartNoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCartNoteMutation, UpdateCartNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCartNoteMutation, UpdateCartNoteMutationVariables>(UpdateCartNoteDocument, options);
      }
export type UpdateCartNoteMutationHookResult = ReturnType<typeof useUpdateCartNoteMutation>;
export type UpdateCartNoteMutationResult = Apollo.MutationResult<UpdateCartNoteMutation>;
export type UpdateCartNoteMutationOptions = Apollo.BaseMutationOptions<UpdateCartNoteMutation, UpdateCartNoteMutationVariables>;
export const UpdateCartProductDocument = gql`
    mutation UpdateCartProduct($id: ID!, $quantity: Int) {
  updateCartProduct(id: $id, quantity: $quantity) {
    id
    quantity
  }
}
    `;
export type UpdateCartProductMutationFn = Apollo.MutationFunction<UpdateCartProductMutation, UpdateCartProductMutationVariables>;

/**
 * __useUpdateCartProductMutation__
 *
 * To run a mutation, you first call `useUpdateCartProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCartProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCartProductMutation, { data, loading, error }] = useUpdateCartProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useUpdateCartProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCartProductMutation, UpdateCartProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCartProductMutation, UpdateCartProductMutationVariables>(UpdateCartProductDocument, options);
      }
export type UpdateCartProductMutationHookResult = ReturnType<typeof useUpdateCartProductMutation>;
export type UpdateCartProductMutationResult = Apollo.MutationResult<UpdateCartProductMutation>;
export type UpdateCartProductMutationOptions = Apollo.BaseMutationOptions<UpdateCartProductMutation, UpdateCartProductMutationVariables>;
export const UpdateCustomerPaymentMethodDocument = gql`
    mutation UpdateCustomerPaymentMethod($cardId: ID!, $expMonth: Int, $expYear: Int, $cardholderName: String, $isDefault: Boolean) {
  updateCustomerPaymentMethod(
    cardId: $cardId
    expMonth: $expMonth
    expYear: $expYear
    cardholderName: $cardholderName
    isDefault: $isDefault
  ) {
    id
    expMonth
    expYear
    cardholderName
    isDefault
    last4
    brand {
      id
      name
    }
  }
}
    `;
export type UpdateCustomerPaymentMethodMutationFn = Apollo.MutationFunction<UpdateCustomerPaymentMethodMutation, UpdateCustomerPaymentMethodMutationVariables>;

/**
 * __useUpdateCustomerPaymentMethodMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerPaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerPaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerPaymentMethodMutation, { data, loading, error }] = useUpdateCustomerPaymentMethodMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      expMonth: // value for 'expMonth'
 *      expYear: // value for 'expYear'
 *      cardholderName: // value for 'cardholderName'
 *      isDefault: // value for 'isDefault'
 *   },
 * });
 */
export function useUpdateCustomerPaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerPaymentMethodMutation, UpdateCustomerPaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerPaymentMethodMutation, UpdateCustomerPaymentMethodMutationVariables>(UpdateCustomerPaymentMethodDocument, options);
      }
export type UpdateCustomerPaymentMethodMutationHookResult = ReturnType<typeof useUpdateCustomerPaymentMethodMutation>;
export type UpdateCustomerPaymentMethodMutationResult = Apollo.MutationResult<UpdateCustomerPaymentMethodMutation>;
export type UpdateCustomerPaymentMethodMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerPaymentMethodMutation, UpdateCustomerPaymentMethodMutationVariables>;
export const UpdateFavouriteBeachBarDocument = gql`
    mutation UpdateFavouriteBeachBar($slug: ID!) {
  updateFavouriteBeachBar(slug: $slug) {
    id
    beachBar {
      id
      name
      thumbnailUrl
    }
  }
}
    `;
export type UpdateFavouriteBeachBarMutationFn = Apollo.MutationFunction<UpdateFavouriteBeachBarMutation, UpdateFavouriteBeachBarMutationVariables>;

/**
 * __useUpdateFavouriteBeachBarMutation__
 *
 * To run a mutation, you first call `useUpdateFavouriteBeachBarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFavouriteBeachBarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFavouriteBeachBarMutation, { data, loading, error }] = useUpdateFavouriteBeachBarMutation({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useUpdateFavouriteBeachBarMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFavouriteBeachBarMutation, UpdateFavouriteBeachBarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFavouriteBeachBarMutation, UpdateFavouriteBeachBarMutationVariables>(UpdateFavouriteBeachBarDocument, options);
      }
export type UpdateFavouriteBeachBarMutationHookResult = ReturnType<typeof useUpdateFavouriteBeachBarMutation>;
export type UpdateFavouriteBeachBarMutationResult = Apollo.MutationResult<UpdateFavouriteBeachBarMutation>;
export type UpdateFavouriteBeachBarMutationOptions = Apollo.BaseMutationOptions<UpdateFavouriteBeachBarMutation, UpdateFavouriteBeachBarMutationVariables>;
export const UpdateFoodDocument = gql`
    mutation UpdateFood($id: ID!, $name: String, $categoryId: ID, $ingredients: String, $price: Float, $maxQuantity: Int) {
  updateFood(
    id: $id
    name: $name
    categoryId: $categoryId
    ingredients: $ingredients
    price: $price
    maxQuantity: $maxQuantity
  ) {
    ...FoodDetails
  }
}
    ${FoodDetailsFragmentDoc}`;
export type UpdateFoodMutationFn = Apollo.MutationFunction<UpdateFoodMutation, UpdateFoodMutationVariables>;

/**
 * __useUpdateFoodMutation__
 *
 * To run a mutation, you first call `useUpdateFoodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFoodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFoodMutation, { data, loading, error }] = useUpdateFoodMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      categoryId: // value for 'categoryId'
 *      ingredients: // value for 'ingredients'
 *      price: // value for 'price'
 *      maxQuantity: // value for 'maxQuantity'
 *   },
 * });
 */
export function useUpdateFoodMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFoodMutation, UpdateFoodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFoodMutation, UpdateFoodMutationVariables>(UpdateFoodDocument, options);
      }
export type UpdateFoodMutationHookResult = ReturnType<typeof useUpdateFoodMutation>;
export type UpdateFoodMutationResult = Apollo.MutationResult<UpdateFoodMutation>;
export type UpdateFoodMutationOptions = Apollo.BaseMutationOptions<UpdateFoodMutation, UpdateFoodMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($productId: ID!, $name: String, $description: String, $categoryId: ID, $price: Float, $maxPeople: Int, $minFoodSpending: Float, $imgUrl: URL) {
  updateProduct(
    productId: $productId
    name: $name
    description: $description
    categoryId: $categoryId
    price: $price
    maxPeople: $maxPeople
    minFoodSpending: $minFoodSpending
    imgUrl: $imgUrl
  ) {
    ...ProductBase
  }
}
    ${ProductBaseFragmentDoc}`;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      categoryId: // value for 'categoryId'
 *      price: // value for 'price'
 *      maxPeople: // value for 'maxPeople'
 *      minFoodSpending: // value for 'minFoodSpending'
 *      imgUrl: // value for 'imgUrl'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const UpdateProductReservationLimitDocument = gql`
    mutation UpdateProductReservationLimit($id: ID!, $limit: Int!) {
  updateProductReservationLimit(id: $id, limit: $limit) {
    ...ProductReservationLimitBase
  }
}
    ${ProductReservationLimitBaseFragmentDoc}`;
export type UpdateProductReservationLimitMutationFn = Apollo.MutationFunction<UpdateProductReservationLimitMutation, UpdateProductReservationLimitMutationVariables>;

/**
 * __useUpdateProductReservationLimitMutation__
 *
 * To run a mutation, you first call `useUpdateProductReservationLimitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductReservationLimitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductReservationLimitMutation, { data, loading, error }] = useUpdateProductReservationLimitMutation({
 *   variables: {
 *      id: // value for 'id'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useUpdateProductReservationLimitMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductReservationLimitMutation, UpdateProductReservationLimitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductReservationLimitMutation, UpdateProductReservationLimitMutationVariables>(UpdateProductReservationLimitDocument, options);
      }
export type UpdateProductReservationLimitMutationHookResult = ReturnType<typeof useUpdateProductReservationLimitMutation>;
export type UpdateProductReservationLimitMutationResult = Apollo.MutationResult<UpdateProductReservationLimitMutation>;
export type UpdateProductReservationLimitMutationOptions = Apollo.BaseMutationOptions<UpdateProductReservationLimitMutation, UpdateProductReservationLimitMutationVariables>;
export const UpdateReviewDocument = gql`
    mutation UpdateReview($id: ID!, $ratingValue: Int, $visitTypeId: ID, $monthId: ID, $positiveComment: String, $negativeComment: String, $body: String, $answer: String) {
  updateReview(
    id: $id
    ratingValue: $ratingValue
    visitTypeId: $visitTypeId
    monthId: $monthId
    positiveComment: $positiveComment
    negativeComment: $negativeComment
    body: $body
    answer: $answer
  ) {
    id
    ratingValue
    positiveComment
    negativeComment
    body
    answer
    updatedAt
    timestamp
    votes {
      id
      user {
        id
      }
      type {
        id
        value
      }
    }
    beachBar {
      id
      name
    }
    visitType {
      id
      name
    }
    month {
      id
      value
    }
  }
}
    `;
export type UpdateReviewMutationFn = Apollo.MutationFunction<UpdateReviewMutation, UpdateReviewMutationVariables>;

/**
 * __useUpdateReviewMutation__
 *
 * To run a mutation, you first call `useUpdateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReviewMutation, { data, loading, error }] = useUpdateReviewMutation({
 *   variables: {
 *      id: // value for 'id'
 *      ratingValue: // value for 'ratingValue'
 *      visitTypeId: // value for 'visitTypeId'
 *      monthId: // value for 'monthId'
 *      positiveComment: // value for 'positiveComment'
 *      negativeComment: // value for 'negativeComment'
 *      body: // value for 'body'
 *      answer: // value for 'answer'
 *   },
 * });
 */
export function useUpdateReviewMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReviewMutation, UpdateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReviewMutation, UpdateReviewMutationVariables>(UpdateReviewDocument, options);
      }
export type UpdateReviewMutationHookResult = ReturnType<typeof useUpdateReviewMutation>;
export type UpdateReviewMutationResult = Apollo.MutationResult<UpdateReviewMutation>;
export type UpdateReviewMutationOptions = Apollo.BaseMutationOptions<UpdateReviewMutation, UpdateReviewMutationVariables>;
export const UpdateReviewVoteDocument = gql`
    mutation UpdateReviewVote($reviewId: ID!, $upvote: Boolean, $downvote: Boolean) {
  updateReviewVote(reviewId: $reviewId, upvote: $upvote, downvote: $downvote) {
    id
    ratingValue
    votes {
      id
      user {
        id
      }
      type {
        id
        value
      }
    }
  }
}
    `;
export type UpdateReviewVoteMutationFn = Apollo.MutationFunction<UpdateReviewVoteMutation, UpdateReviewVoteMutationVariables>;

/**
 * __useUpdateReviewVoteMutation__
 *
 * To run a mutation, you first call `useUpdateReviewVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReviewVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReviewVoteMutation, { data, loading, error }] = useUpdateReviewVoteMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *      upvote: // value for 'upvote'
 *      downvote: // value for 'downvote'
 *   },
 * });
 */
export function useUpdateReviewVoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReviewVoteMutation, UpdateReviewVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReviewVoteMutation, UpdateReviewVoteMutationVariables>(UpdateReviewVoteDocument, options);
      }
export type UpdateReviewVoteMutationHookResult = ReturnType<typeof useUpdateReviewVoteMutation>;
export type UpdateReviewVoteMutationResult = Apollo.MutationResult<UpdateReviewVoteMutation>;
export type UpdateReviewVoteMutationOptions = Apollo.BaseMutationOptions<UpdateReviewVoteMutation, UpdateReviewVoteMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($email: Email, $firstName: String, $lastName: String, $imgUrl: URL, $honorificTitle: String, $birthday: String, $countryId: ID, $city: String, $phoneNumber: String, $telCountryId: ID, $address: String, $zipCode: String, $trackHistory: Boolean) {
  updateUser(
    email: $email
    firstName: $firstName
    lastName: $lastName
    imgUrl: $imgUrl
    honorificTitle: $honorificTitle
    birthday: $birthday
    countryId: $countryId
    city: $city
    phoneNumber: $phoneNumber
    telCountryId: $telCountryId
    address: $address
    zipCode: $zipCode
    trackHistory: $trackHistory
  ) {
    id
    email
    firstName
    lastName
    account {
      id
      honorificTitle
      birthday
      age
      address
      zipCode
      trackHistory
      imgUrl
      city
      phoneNumber
      telCountry {
        ...CountryBase
      }
      country {
        ...CountryBase
        currency {
          id
          name
        }
      }
    }
  }
}
    ${CountryBaseFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      imgUrl: // value for 'imgUrl'
 *      honorificTitle: // value for 'honorificTitle'
 *      birthday: // value for 'birthday'
 *      countryId: // value for 'countryId'
 *      city: // value for 'city'
 *      phoneNumber: // value for 'phoneNumber'
 *      telCountryId: // value for 'telCountryId'
 *      address: // value for 'address'
 *      zipCode: // value for 'zipCode'
 *      trackHistory: // value for 'trackHistory'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const VerifyUserPaymentForReviewDocument = gql`
    mutation VerifyUserPaymentForReview($beachBarId: ID!, $refCode: String) {
  verifyUserPaymentForReview(beachBarId: $beachBarId, refCode: $refCode)
}
    `;
export type VerifyUserPaymentForReviewMutationFn = Apollo.MutationFunction<VerifyUserPaymentForReviewMutation, VerifyUserPaymentForReviewMutationVariables>;

/**
 * __useVerifyUserPaymentForReviewMutation__
 *
 * To run a mutation, you first call `useVerifyUserPaymentForReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyUserPaymentForReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyUserPaymentForReviewMutation, { data, loading, error }] = useVerifyUserPaymentForReviewMutation({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      refCode: // value for 'refCode'
 *   },
 * });
 */
export function useVerifyUserPaymentForReviewMutation(baseOptions?: Apollo.MutationHookOptions<VerifyUserPaymentForReviewMutation, VerifyUserPaymentForReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyUserPaymentForReviewMutation, VerifyUserPaymentForReviewMutationVariables>(VerifyUserPaymentForReviewDocument, options);
      }
export type VerifyUserPaymentForReviewMutationHookResult = ReturnType<typeof useVerifyUserPaymentForReviewMutation>;
export type VerifyUserPaymentForReviewMutationResult = Apollo.MutationResult<VerifyUserPaymentForReviewMutation>;
export type VerifyUserPaymentForReviewMutationOptions = Apollo.BaseMutationOptions<VerifyUserPaymentForReviewMutation, VerifyUserPaymentForReviewMutationVariables>;
export const AuthorizeWithFacebookDocument = gql`
    mutation AuthorizeWithFacebook($code: String!, $state: String!, $isPrimaryOwner: Boolean = false, $loginDetails: UserLoginDetails) {
  authorizeWithFacebook(
    code: $code
    state: $state
    isPrimaryOwner: $isPrimaryOwner
    loginDetails: $loginDetails
  ) {
    user {
      id
      email
    }
  }
}
    `;
export type AuthorizeWithFacebookMutationFn = Apollo.MutationFunction<AuthorizeWithFacebookMutation, AuthorizeWithFacebookMutationVariables>;

/**
 * __useAuthorizeWithFacebookMutation__
 *
 * To run a mutation, you first call `useAuthorizeWithFacebookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthorizeWithFacebookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authorizeWithFacebookMutation, { data, loading, error }] = useAuthorizeWithFacebookMutation({
 *   variables: {
 *      code: // value for 'code'
 *      state: // value for 'state'
 *      isPrimaryOwner: // value for 'isPrimaryOwner'
 *      loginDetails: // value for 'loginDetails'
 *   },
 * });
 */
export function useAuthorizeWithFacebookMutation(baseOptions?: Apollo.MutationHookOptions<AuthorizeWithFacebookMutation, AuthorizeWithFacebookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AuthorizeWithFacebookMutation, AuthorizeWithFacebookMutationVariables>(AuthorizeWithFacebookDocument, options);
      }
export type AuthorizeWithFacebookMutationHookResult = ReturnType<typeof useAuthorizeWithFacebookMutation>;
export type AuthorizeWithFacebookMutationResult = Apollo.MutationResult<AuthorizeWithFacebookMutation>;
export type AuthorizeWithFacebookMutationOptions = Apollo.BaseMutationOptions<AuthorizeWithFacebookMutation, AuthorizeWithFacebookMutationVariables>;
export const AuthorizeWithGoogleDocument = gql`
    mutation AuthorizeWithGoogle($code: String!, $state: String!, $isPrimaryOwner: Boolean = false, $loginDetails: UserLoginDetails) {
  authorizeWithGoogle(
    code: $code
    state: $state
    isPrimaryOwner: $isPrimaryOwner
    loginDetails: $loginDetails
  ) {
    user {
      id
      email
    }
  }
}
    `;
export type AuthorizeWithGoogleMutationFn = Apollo.MutationFunction<AuthorizeWithGoogleMutation, AuthorizeWithGoogleMutationVariables>;

/**
 * __useAuthorizeWithGoogleMutation__
 *
 * To run a mutation, you first call `useAuthorizeWithGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthorizeWithGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authorizeWithGoogleMutation, { data, loading, error }] = useAuthorizeWithGoogleMutation({
 *   variables: {
 *      code: // value for 'code'
 *      state: // value for 'state'
 *      isPrimaryOwner: // value for 'isPrimaryOwner'
 *      loginDetails: // value for 'loginDetails'
 *   },
 * });
 */
export function useAuthorizeWithGoogleMutation(baseOptions?: Apollo.MutationHookOptions<AuthorizeWithGoogleMutation, AuthorizeWithGoogleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AuthorizeWithGoogleMutation, AuthorizeWithGoogleMutationVariables>(AuthorizeWithGoogleDocument, options);
      }
export type AuthorizeWithGoogleMutationHookResult = ReturnType<typeof useAuthorizeWithGoogleMutation>;
export type AuthorizeWithGoogleMutationResult = Apollo.MutationResult<AuthorizeWithGoogleMutation>;
export type AuthorizeWithGoogleMutationOptions = Apollo.BaseMutationOptions<AuthorizeWithGoogleMutation, AuthorizeWithGoogleMutationVariables>;
export const AuthorizeWithInstagramDocument = gql`
    mutation AuthorizeWithInstagram($code: String!, $state: String!, $email: Email!, $isPrimaryOwner: Boolean = false, $loginDetails: UserLoginDetails) {
  authorizeWithInstagram(
    code: $code
    state: $state
    email: $email
    isPrimaryOwner: $isPrimaryOwner
    loginDetails: $loginDetails
  ) {
    user {
      id
      email
    }
  }
}
    `;
export type AuthorizeWithInstagramMutationFn = Apollo.MutationFunction<AuthorizeWithInstagramMutation, AuthorizeWithInstagramMutationVariables>;

/**
 * __useAuthorizeWithInstagramMutation__
 *
 * To run a mutation, you first call `useAuthorizeWithInstagramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthorizeWithInstagramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authorizeWithInstagramMutation, { data, loading, error }] = useAuthorizeWithInstagramMutation({
 *   variables: {
 *      code: // value for 'code'
 *      state: // value for 'state'
 *      email: // value for 'email'
 *      isPrimaryOwner: // value for 'isPrimaryOwner'
 *      loginDetails: // value for 'loginDetails'
 *   },
 * });
 */
export function useAuthorizeWithInstagramMutation(baseOptions?: Apollo.MutationHookOptions<AuthorizeWithInstagramMutation, AuthorizeWithInstagramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AuthorizeWithInstagramMutation, AuthorizeWithInstagramMutationVariables>(AuthorizeWithInstagramDocument, options);
      }
export type AuthorizeWithInstagramMutationHookResult = ReturnType<typeof useAuthorizeWithInstagramMutation>;
export type AuthorizeWithInstagramMutationResult = Apollo.MutationResult<AuthorizeWithInstagramMutation>;
export type AuthorizeWithInstagramMutationOptions = Apollo.BaseMutationOptions<AuthorizeWithInstagramMutation, AuthorizeWithInstagramMutationVariables>;
export const AvailableHoursDocument = gql`
    query AvailableHours($beachBarId: ID!, $date: Date!) {
  availableHours(beachBarId: $beachBarId, date: $date) {
    id
    value
    utcValue
  }
}
    `;

/**
 * __useAvailableHoursQuery__
 *
 * To run a query within a React component, call `useAvailableHoursQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableHoursQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableHoursQuery({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useAvailableHoursQuery(baseOptions: Apollo.QueryHookOptions<AvailableHoursQuery, AvailableHoursQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableHoursQuery, AvailableHoursQueryVariables>(AvailableHoursDocument, options);
      }
export function useAvailableHoursLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableHoursQuery, AvailableHoursQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableHoursQuery, AvailableHoursQueryVariables>(AvailableHoursDocument, options);
        }
export type AvailableHoursQueryHookResult = ReturnType<typeof useAvailableHoursQuery>;
export type AvailableHoursLazyQueryHookResult = ReturnType<typeof useAvailableHoursLazyQuery>;
export type AvailableHoursQueryResult = Apollo.QueryResult<AvailableHoursQuery, AvailableHoursQueryVariables>;
export const AvailableProductsDocument = gql`
    query AvailableProducts($beachBarId: ID!, $availability: SearchInput) {
  availableProducts(beachBarId: $beachBarId, availability: $availability) {
    ...ProductBase
  }
}
    ${ProductBaseFragmentDoc}`;

/**
 * __useAvailableProductsQuery__
 *
 * To run a query within a React component, call `useAvailableProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableProductsQuery({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      availability: // value for 'availability'
 *   },
 * });
 */
export function useAvailableProductsQuery(baseOptions: Apollo.QueryHookOptions<AvailableProductsQuery, AvailableProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableProductsQuery, AvailableProductsQueryVariables>(AvailableProductsDocument, options);
      }
export function useAvailableProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableProductsQuery, AvailableProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableProductsQuery, AvailableProductsQueryVariables>(AvailableProductsDocument, options);
        }
export type AvailableProductsQueryHookResult = ReturnType<typeof useAvailableProductsQuery>;
export type AvailableProductsLazyQueryHookResult = ReturnType<typeof useAvailableProductsLazyQuery>;
export type AvailableProductsQueryResult = Apollo.QueryResult<AvailableProductsQuery, AvailableProductsQueryVariables>;
export const BeachBarDocument = gql`
    query BeachBar($slug: String = null, $id: ID = null, $userVisit: Boolean = true) {
  beachBar(slug: $slug, id: $id, userVisit: $userVisit) {
    ...DetailsBeachBar
    openingTime {
      id
      value
      utcValue
    }
    closingTime {
      id
      value
      utcValue
    }
    reviews {
      ...BeachBarReviewBase
      payment {
        id
        timestamp
      }
    }
    imgUrls {
      id
      imgUrl
      description
      timestamp
    }
    currency {
      id
      symbol
    }
    features {
      ...FeatureBase
    }
    products {
      ...ProductBase
    }
    foods {
      ...FoodDetails
    }
  }
}
    ${DetailsBeachBarFragmentDoc}
${BeachBarReviewBaseFragmentDoc}
${FeatureBaseFragmentDoc}
${ProductBaseFragmentDoc}
${FoodDetailsFragmentDoc}`;

/**
 * __useBeachBarQuery__
 *
 * To run a query within a React component, call `useBeachBarQuery` and pass it any options that fit your needs.
 * When your component renders, `useBeachBarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBeachBarQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      id: // value for 'id'
 *      userVisit: // value for 'userVisit'
 *   },
 * });
 */
export function useBeachBarQuery(baseOptions?: Apollo.QueryHookOptions<BeachBarQuery, BeachBarQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BeachBarQuery, BeachBarQueryVariables>(BeachBarDocument, options);
      }
export function useBeachBarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BeachBarQuery, BeachBarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BeachBarQuery, BeachBarQueryVariables>(BeachBarDocument, options);
        }
export type BeachBarQueryHookResult = ReturnType<typeof useBeachBarQuery>;
export type BeachBarLazyQueryHookResult = ReturnType<typeof useBeachBarLazyQuery>;
export type BeachBarQueryResult = Apollo.QueryResult<BeachBarQuery, BeachBarQueryVariables>;
export const CartDocument = gql`
    query Cart($cartId: ID) {
  cart(cartId: $cartId) {
    id
    total
    products {
      ...CartProductBase
    }
    foods {
      ...CartFoodBase
    }
    notes {
      ...CartNoteBase
    }
  }
}
    ${CartProductBaseFragmentDoc}
${CartFoodBaseFragmentDoc}
${CartNoteBaseFragmentDoc}`;

/**
 * __useCartQuery__
 *
 * To run a query within a React component, call `useCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCartQuery({
 *   variables: {
 *      cartId: // value for 'cartId'
 *   },
 * });
 */
export function useCartQuery(baseOptions?: Apollo.QueryHookOptions<CartQuery, CartQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CartQuery, CartQueryVariables>(CartDocument, options);
      }
export function useCartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CartQuery, CartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CartQuery, CartQueryVariables>(CartDocument, options);
        }
export type CartQueryHookResult = ReturnType<typeof useCartQuery>;
export type CartLazyQueryHookResult = ReturnType<typeof useCartLazyQuery>;
export type CartQueryResult = Apollo.QueryResult<CartQuery, CartQueryVariables>;
export const CartEntryFeesDocument = gql`
    query CartEntryFees($cartId: ID!, $beachBarId: ID = null) {
  cartEntryFees(cartId: $cartId, beachBarId: $beachBarId)
}
    `;

/**
 * __useCartEntryFeesQuery__
 *
 * To run a query within a React component, call `useCartEntryFeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCartEntryFeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCartEntryFeesQuery({
 *   variables: {
 *      cartId: // value for 'cartId'
 *      beachBarId: // value for 'beachBarId'
 *   },
 * });
 */
export function useCartEntryFeesQuery(baseOptions: Apollo.QueryHookOptions<CartEntryFeesQuery, CartEntryFeesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CartEntryFeesQuery, CartEntryFeesQueryVariables>(CartEntryFeesDocument, options);
      }
export function useCartEntryFeesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CartEntryFeesQuery, CartEntryFeesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CartEntryFeesQuery, CartEntryFeesQueryVariables>(CartEntryFeesDocument, options);
        }
export type CartEntryFeesQueryHookResult = ReturnType<typeof useCartEntryFeesQuery>;
export type CartEntryFeesLazyQueryHookResult = ReturnType<typeof useCartEntryFeesLazyQuery>;
export type CartEntryFeesQueryResult = Apollo.QueryResult<CartEntryFeesQuery, CartEntryFeesQueryVariables>;
export const CitiesAndRegionsDocument = gql`
    query CitiesAndRegions {
  citiesAndRegions {
    cities {
      id
      name
      country {
        ...CountryBase
      }
    }
    regions {
      id
      name
      country {
        ...CountryBase
      }
      city {
        id
        name
      }
    }
  }
}
    ${CountryBaseFragmentDoc}`;

/**
 * __useCitiesAndRegionsQuery__
 *
 * To run a query within a React component, call `useCitiesAndRegionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCitiesAndRegionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCitiesAndRegionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCitiesAndRegionsQuery(baseOptions?: Apollo.QueryHookOptions<CitiesAndRegionsQuery, CitiesAndRegionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CitiesAndRegionsQuery, CitiesAndRegionsQueryVariables>(CitiesAndRegionsDocument, options);
      }
export function useCitiesAndRegionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CitiesAndRegionsQuery, CitiesAndRegionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CitiesAndRegionsQuery, CitiesAndRegionsQueryVariables>(CitiesAndRegionsDocument, options);
        }
export type CitiesAndRegionsQueryHookResult = ReturnType<typeof useCitiesAndRegionsQuery>;
export type CitiesAndRegionsLazyQueryHookResult = ReturnType<typeof useCitiesAndRegionsLazyQuery>;
export type CitiesAndRegionsQueryResult = Apollo.QueryResult<CitiesAndRegionsQuery, CitiesAndRegionsQueryVariables>;
export const CustomerDocument = gql`
    query Customer($email: Email, $phoneNumber: String, $countryId: ID) {
  customer(email: $email, phoneNumber: $phoneNumber, countryId: $countryId) {
    id
    email
    user {
      id
      email
    }
    cards {
      ...BasicCard
    }
  }
}
    ${BasicCardFragmentDoc}`;

/**
 * __useCustomerQuery__
 *
 * To run a query within a React component, call `useCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerQuery({
 *   variables: {
 *      email: // value for 'email'
 *      phoneNumber: // value for 'phoneNumber'
 *      countryId: // value for 'countryId'
 *   },
 * });
 */
export function useCustomerQuery(baseOptions?: Apollo.QueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, options);
      }
export function useCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, options);
        }
export type CustomerQueryHookResult = ReturnType<typeof useCustomerQuery>;
export type CustomerLazyQueryHookResult = ReturnType<typeof useCustomerLazyQuery>;
export type CustomerQueryResult = Apollo.QueryResult<CustomerQuery, CustomerQueryVariables>;
export const CustomerPaymentMethodsDocument = gql`
    query CustomerPaymentMethods {
  customerPaymentMethods {
    ...BasicCard
  }
}
    ${BasicCardFragmentDoc}`;

/**
 * __useCustomerPaymentMethodsQuery__
 *
 * To run a query within a React component, call `useCustomerPaymentMethodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerPaymentMethodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerPaymentMethodsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCustomerPaymentMethodsQuery(baseOptions?: Apollo.QueryHookOptions<CustomerPaymentMethodsQuery, CustomerPaymentMethodsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomerPaymentMethodsQuery, CustomerPaymentMethodsQueryVariables>(CustomerPaymentMethodsDocument, options);
      }
export function useCustomerPaymentMethodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomerPaymentMethodsQuery, CustomerPaymentMethodsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomerPaymentMethodsQuery, CustomerPaymentMethodsQueryVariables>(CustomerPaymentMethodsDocument, options);
        }
export type CustomerPaymentMethodsQueryHookResult = ReturnType<typeof useCustomerPaymentMethodsQuery>;
export type CustomerPaymentMethodsLazyQueryHookResult = ReturnType<typeof useCustomerPaymentMethodsLazyQuery>;
export type CustomerPaymentMethodsQueryResult = Apollo.QueryResult<CustomerPaymentMethodsQuery, CustomerPaymentMethodsQueryVariables>;
export const DashboardBillingDocument = gql`
    query DashboardBilling($beachBarId: ID!, $dates: DashboardDatesArg = null) {
  dashboardBilling(beachBarId: $beachBarId, dates: $dates) {
    avgProducts {
      ...DashboardDateValue
    }
    avgFoods {
      ...DashboardDateValue
    }
    products {
      revenue {
        ...DashboardDateValue
      }
      mostCommon {
        timesBooked
        product {
          id
          name
        }
      }
    }
    foods {
      revenue {
        ...DashboardDateValue
      }
      mostCommon {
        timesPurchased
        food {
          id
          name
        }
      }
    }
    refundedPayments {
      date
      payments {
        id
        refCode
        isRefunded
      }
    }
    customersCountries {
      value
      country {
        ...CountryBase
      }
    }
  }
}
    ${DashboardDateValueFragmentDoc}
${CountryBaseFragmentDoc}`;

/**
 * __useDashboardBillingQuery__
 *
 * To run a query within a React component, call `useDashboardBillingQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardBillingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardBillingQuery({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      dates: // value for 'dates'
 *   },
 * });
 */
export function useDashboardBillingQuery(baseOptions: Apollo.QueryHookOptions<DashboardBillingQuery, DashboardBillingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardBillingQuery, DashboardBillingQueryVariables>(DashboardBillingDocument, options);
      }
export function useDashboardBillingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardBillingQuery, DashboardBillingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardBillingQuery, DashboardBillingQueryVariables>(DashboardBillingDocument, options);
        }
export type DashboardBillingQueryHookResult = ReturnType<typeof useDashboardBillingQuery>;
export type DashboardBillingLazyQueryHookResult = ReturnType<typeof useDashboardBillingLazyQuery>;
export type DashboardBillingQueryResult = Apollo.QueryResult<DashboardBillingQuery, DashboardBillingQueryVariables>;
export const DashboardBookingsDocument = gql`
    query DashboardBookings($beachBarId: ID!, $dates: DashboardDatesArg = null) {
  dashboardBookings(beachBarId: $beachBarId, dates: $dates) {
    mostActive {
      hour
      weekDay
    }
    capacity {
      arr {
        date
        percentage
      }
      totalCustomers {
        ...DashboardDateValue
      }
      totalHourCustomers {
        ...DashboardDateValue
      }
      maxCapacity {
        date
        limitPeople
        availableProducts
      }
    }
    bookings {
      id
      refCode
      isRefunded
      timestamp
      deletedAt
      total(beachBarId: $beachBarId)
      status {
        id
        name
      }
      cart {
        id
        notes(beachBarId: $beachBarId) {
          id
          body
          beachBar {
            id
          }
        }
        products(beachBarId: $beachBarId) {
          id
          date
          quantity
          people
          total
          startTime {
            ...HourValue
          }
          endTime {
            ...HourValue
          }
          product {
            id
            name
            beachBar {
              id
            }
          }
        }
        foods(beachBarId: $beachBarId) {
          id
          date
          quantity
          total
          food {
            id
            name
            beachBar {
              id
            }
          }
        }
      }
      card {
        id
        customer {
          id
          user {
            id
            fullName
          }
        }
        country {
          id
          currency {
            id
            name
            symbol
          }
        }
      }
    }
  }
}
    ${DashboardDateValueFragmentDoc}
${HourValueFragmentDoc}`;

/**
 * __useDashboardBookingsQuery__
 *
 * To run a query within a React component, call `useDashboardBookingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardBookingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardBookingsQuery({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      dates: // value for 'dates'
 *   },
 * });
 */
export function useDashboardBookingsQuery(baseOptions: Apollo.QueryHookOptions<DashboardBookingsQuery, DashboardBookingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardBookingsQuery, DashboardBookingsQueryVariables>(DashboardBookingsDocument, options);
      }
export function useDashboardBookingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardBookingsQuery, DashboardBookingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardBookingsQuery, DashboardBookingsQueryVariables>(DashboardBookingsDocument, options);
        }
export type DashboardBookingsQueryHookResult = ReturnType<typeof useDashboardBookingsQuery>;
export type DashboardBookingsLazyQueryHookResult = ReturnType<typeof useDashboardBookingsLazyQuery>;
export type DashboardBookingsQueryResult = Apollo.QueryResult<DashboardBookingsQuery, DashboardBookingsQueryVariables>;
export const DashboardHomePageDocument = gql`
    query DashboardHomePage($beachBarId: ID!, $dates: DashboardDatesArg = null) {
  dashboardHomePage(beachBarId: $beachBarId, dates: $dates) {
    balance {
      revenue
      grossVolume {
        ...DashboardDateValue
      }
      successfulPayments {
        id
      }
    }
    capacity {
      percentage
      totalMaxPeopleCapacity
      totalHourCustomers
      reservedProducts
      availableProducts
    }
    totalCustomers {
      ...DashboardDateValue
    }
    grossVolume {
      ...DashboardDateValue
    }
    avgSpendPerPerson {
      ...DashboardDateValue
    }
    avgRating {
      ...DashboardDateValue
    }
    newCustomers {
      date
      customers {
        id
      }
    }
  }
}
    ${DashboardDateValueFragmentDoc}`;

/**
 * __useDashboardHomePageQuery__
 *
 * To run a query within a React component, call `useDashboardHomePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardHomePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardHomePageQuery({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *      dates: // value for 'dates'
 *   },
 * });
 */
export function useDashboardHomePageQuery(baseOptions: Apollo.QueryHookOptions<DashboardHomePageQuery, DashboardHomePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardHomePageQuery, DashboardHomePageQueryVariables>(DashboardHomePageDocument, options);
      }
export function useDashboardHomePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardHomePageQuery, DashboardHomePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardHomePageQuery, DashboardHomePageQueryVariables>(DashboardHomePageDocument, options);
        }
export type DashboardHomePageQueryHookResult = ReturnType<typeof useDashboardHomePageQuery>;
export type DashboardHomePageLazyQueryHookResult = ReturnType<typeof useDashboardHomePageLazyQuery>;
export type DashboardHomePageQueryResult = Apollo.QueryResult<DashboardHomePageQuery, DashboardHomePageQueryVariables>;
export const FavouriteBeachBarsDocument = gql`
    query FavouriteBeachBars($limit: Int) {
  favouriteBeachBars(limit: $limit) {
    beachBar {
      id
      name
      slug
      thumbnailUrl
    }
  }
}
    `;

/**
 * __useFavouriteBeachBarsQuery__
 *
 * To run a query within a React component, call `useFavouriteBeachBarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFavouriteBeachBarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFavouriteBeachBarsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useFavouriteBeachBarsQuery(baseOptions?: Apollo.QueryHookOptions<FavouriteBeachBarsQuery, FavouriteBeachBarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FavouriteBeachBarsQuery, FavouriteBeachBarsQueryVariables>(FavouriteBeachBarsDocument, options);
      }
export function useFavouriteBeachBarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FavouriteBeachBarsQuery, FavouriteBeachBarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FavouriteBeachBarsQuery, FavouriteBeachBarsQueryVariables>(FavouriteBeachBarsDocument, options);
        }
export type FavouriteBeachBarsQueryHookResult = ReturnType<typeof useFavouriteBeachBarsQuery>;
export type FavouriteBeachBarsLazyQueryHookResult = ReturnType<typeof useFavouriteBeachBarsLazyQuery>;
export type FavouriteBeachBarsQueryResult = Apollo.QueryResult<FavouriteBeachBarsQuery, FavouriteBeachBarsQueryVariables>;
export const GetUserFavouriteBeachBarsDocument = gql`
    query GetUserFavouriteBeachBars {
  favouriteBeachBars {
    id
    beachBar {
      id
      name
      slug
    }
  }
}
    `;

/**
 * __useGetUserFavouriteBeachBarsQuery__
 *
 * To run a query within a React component, call `useGetUserFavouriteBeachBarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFavouriteBeachBarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFavouriteBeachBarsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserFavouriteBeachBarsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserFavouriteBeachBarsQuery, GetUserFavouriteBeachBarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserFavouriteBeachBarsQuery, GetUserFavouriteBeachBarsQueryVariables>(GetUserFavouriteBeachBarsDocument, options);
      }
export function useGetUserFavouriteBeachBarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserFavouriteBeachBarsQuery, GetUserFavouriteBeachBarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserFavouriteBeachBarsQuery, GetUserFavouriteBeachBarsQueryVariables>(GetUserFavouriteBeachBarsDocument, options);
        }
export type GetUserFavouriteBeachBarsQueryHookResult = ReturnType<typeof useGetUserFavouriteBeachBarsQuery>;
export type GetUserFavouriteBeachBarsLazyQueryHookResult = ReturnType<typeof useGetUserFavouriteBeachBarsLazyQuery>;
export type GetUserFavouriteBeachBarsQueryResult = Apollo.QueryResult<GetUserFavouriteBeachBarsQuery, GetUserFavouriteBeachBarsQueryVariables>;
export const FoodDocument = gql`
    query Food($id: ID!) {
  food(id: $id) {
    ...FoodDetails
  }
}
    ${FoodDetailsFragmentDoc}`;

/**
 * __useFoodQuery__
 *
 * To run a query within a React component, call `useFoodQuery` and pass it any options that fit your needs.
 * When your component renders, `useFoodQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFoodQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFoodQuery(baseOptions: Apollo.QueryHookOptions<FoodQuery, FoodQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FoodQuery, FoodQueryVariables>(FoodDocument, options);
      }
export function useFoodLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FoodQuery, FoodQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FoodQuery, FoodQueryVariables>(FoodDocument, options);
        }
export type FoodQueryHookResult = ReturnType<typeof useFoodQuery>;
export type FoodLazyQueryHookResult = ReturnType<typeof useFoodLazyQuery>;
export type FoodQueryResult = Apollo.QueryResult<FoodQuery, FoodQueryVariables>;
export const FoodsDocument = gql`
    query Foods($beachBarId: ID!) {
  foods(beachBarId: $beachBarId) {
    ...FoodDetails
  }
}
    ${FoodDetailsFragmentDoc}`;

/**
 * __useFoodsQuery__
 *
 * To run a query within a React component, call `useFoodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFoodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFoodsQuery({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *   },
 * });
 */
export function useFoodsQuery(baseOptions: Apollo.QueryHookOptions<FoodsQuery, FoodsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FoodsQuery, FoodsQueryVariables>(FoodsDocument, options);
      }
export function useFoodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FoodsQuery, FoodsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FoodsQuery, FoodsQueryVariables>(FoodsDocument, options);
        }
export type FoodsQueryHookResult = ReturnType<typeof useFoodsQuery>;
export type FoodsLazyQueryHookResult = ReturnType<typeof useFoodsLazyQuery>;
export type FoodsQueryResult = Apollo.QueryResult<FoodsQuery, FoodsQueryVariables>;
export const GetPersonalizedBeachBarsDocument = gql`
    query GetPersonalizedBeachBars {
  getPersonalizedBeachBars {
    id
    name
    slug
    thumbnailUrl
    location {
      latitude
      longitude
      formattedLocation
      city {
        name
      }
      region {
        name
      }
    }
  }
}
    `;

/**
 * __useGetPersonalizedBeachBarsQuery__
 *
 * To run a query within a React component, call `useGetPersonalizedBeachBarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonalizedBeachBarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonalizedBeachBarsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPersonalizedBeachBarsQuery(baseOptions?: Apollo.QueryHookOptions<GetPersonalizedBeachBarsQuery, GetPersonalizedBeachBarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPersonalizedBeachBarsQuery, GetPersonalizedBeachBarsQueryVariables>(GetPersonalizedBeachBarsDocument, options);
      }
export function useGetPersonalizedBeachBarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPersonalizedBeachBarsQuery, GetPersonalizedBeachBarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPersonalizedBeachBarsQuery, GetPersonalizedBeachBarsQueryVariables>(GetPersonalizedBeachBarsDocument, options);
        }
export type GetPersonalizedBeachBarsQueryHookResult = ReturnType<typeof useGetPersonalizedBeachBarsQuery>;
export type GetPersonalizedBeachBarsLazyQueryHookResult = ReturnType<typeof useGetPersonalizedBeachBarsLazyQuery>;
export type GetPersonalizedBeachBarsQueryResult = Apollo.QueryResult<GetPersonalizedBeachBarsQuery, GetPersonalizedBeachBarsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    firstName
    lastName
    fullName
    account {
      id
      honorificTitle
      birthday
      age
      address
      zipCode
      imgUrl
      city
      trackHistory
      phoneNumber
      telCountry {
        ...CountryBase
      }
      country {
        ...CountryBase
        currency {
          id
          symbol
        }
      }
    }
    reviewVotes {
      id
      type {
        id
        value
      }
      review {
        id
      }
    }
    favoriteBars {
      beachBar {
        id
        name
        slug
        thumbnailUrl
        location {
          id
          formattedLocation
          city {
            id
            name
          }
          region {
            id
            name
          }
        }
      }
    }
  }
}
    ${CountryBaseFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const NearBeachBarsDocument = gql`
    query NearBeachBars($latitude: String!, $longitude: String!, $take: Int = 6) {
  nearBeachBars(latitude: $latitude, longitude: $longitude, take: $take) {
    id
    name
    slug
    thumbnailUrl
    location {
      latitude
      longitude
    }
  }
}
    `;

/**
 * __useNearBeachBarsQuery__
 *
 * To run a query within a React component, call `useNearBeachBarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNearBeachBarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNearBeachBarsQuery({
 *   variables: {
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useNearBeachBarsQuery(baseOptions: Apollo.QueryHookOptions<NearBeachBarsQuery, NearBeachBarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NearBeachBarsQuery, NearBeachBarsQueryVariables>(NearBeachBarsDocument, options);
      }
export function useNearBeachBarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NearBeachBarsQuery, NearBeachBarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NearBeachBarsQuery, NearBeachBarsQueryVariables>(NearBeachBarsDocument, options);
        }
export type NearBeachBarsQueryHookResult = ReturnType<typeof useNearBeachBarsQuery>;
export type NearBeachBarsLazyQueryHookResult = ReturnType<typeof useNearBeachBarsLazyQuery>;
export type NearBeachBarsQueryResult = Apollo.QueryResult<NearBeachBarsQuery, NearBeachBarsQueryVariables>;
export const PaymentDocument = gql`
    query Payment($refCode: ID!, $beachBarId: ID = null) {
  payment(refCode: $refCode) {
    id
    refCode
    isRefunded
    stripeId
    stripeProccessingFee
    appFee
    total(beachBarId: $beachBarId)
    timestamp
    cart {
      id
      total
      products(beachBarId: $beachBarId) {
        ...CartProductBase
      }
      foods(beachBarId: $beachBarId) {
        ...CartFoodBase
      }
      notes(beachBarId: $beachBarId) {
        ...CartNoteBase
      }
    }
    card {
      id
      last4
      brand {
        id
        name
      }
      country {
        id
        currency {
          id
          symbol
        }
      }
      customer {
        id
        email
        phoneNumber
        country {
          ...CountryBase
        }
      }
    }
    status {
      id
      name
    }
  }
}
    ${CartProductBaseFragmentDoc}
${CartFoodBaseFragmentDoc}
${CartNoteBaseFragmentDoc}
${CountryBaseFragmentDoc}`;

/**
 * __usePaymentQuery__
 *
 * To run a query within a React component, call `usePaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentQuery({
 *   variables: {
 *      refCode: // value for 'refCode'
 *      beachBarId: // value for 'beachBarId'
 *   },
 * });
 */
export function usePaymentQuery(baseOptions: Apollo.QueryHookOptions<PaymentQuery, PaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaymentQuery, PaymentQueryVariables>(PaymentDocument, options);
      }
export function usePaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaymentQuery, PaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaymentQuery, PaymentQueryVariables>(PaymentDocument, options);
        }
export type PaymentQueryHookResult = ReturnType<typeof usePaymentQuery>;
export type PaymentLazyQueryHookResult = ReturnType<typeof usePaymentLazyQuery>;
export type PaymentQueryResult = Apollo.QueryResult<PaymentQuery, PaymentQueryVariables>;
export const PaymentRefundAmountDocument = gql`
    query PaymentRefundAmount($refCode: ID!) {
  paymentRefundAmount(refCode: $refCode)
}
    `;

/**
 * __usePaymentRefundAmountQuery__
 *
 * To run a query within a React component, call `usePaymentRefundAmountQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentRefundAmountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentRefundAmountQuery({
 *   variables: {
 *      refCode: // value for 'refCode'
 *   },
 * });
 */
export function usePaymentRefundAmountQuery(baseOptions: Apollo.QueryHookOptions<PaymentRefundAmountQuery, PaymentRefundAmountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaymentRefundAmountQuery, PaymentRefundAmountQueryVariables>(PaymentRefundAmountDocument, options);
      }
export function usePaymentRefundAmountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaymentRefundAmountQuery, PaymentRefundAmountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaymentRefundAmountQuery, PaymentRefundAmountQueryVariables>(PaymentRefundAmountDocument, options);
        }
export type PaymentRefundAmountQueryHookResult = ReturnType<typeof usePaymentRefundAmountQuery>;
export type PaymentRefundAmountLazyQueryHookResult = ReturnType<typeof usePaymentRefundAmountLazyQuery>;
export type PaymentRefundAmountQueryResult = Apollo.QueryResult<PaymentRefundAmountQuery, PaymentRefundAmountQueryVariables>;
export const PaymentsDocument = gql`
    query Payments($monthId: ID, $year: Int) {
  payments(monthId: $monthId, year: $year) {
    beachBar {
      id
      name
      thumbnailUrl
      location {
        city {
          name
        }
        region {
          name
        }
      }
    }
    visits {
      isUpcoming
      isRefunded
      date
      startTime {
        id
        value
      }
      endTime {
        id
        value
      }
      payment {
        id
        refCode
      }
    }
  }
}
    `;

/**
 * __usePaymentsQuery__
 *
 * To run a query within a React component, call `usePaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentsQuery({
 *   variables: {
 *      monthId: // value for 'monthId'
 *      year: // value for 'year'
 *   },
 * });
 */
export function usePaymentsQuery(baseOptions?: Apollo.QueryHookOptions<PaymentsQuery, PaymentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaymentsQuery, PaymentsQueryVariables>(PaymentsDocument, options);
      }
export function usePaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaymentsQuery, PaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaymentsQuery, PaymentsQueryVariables>(PaymentsDocument, options);
        }
export type PaymentsQueryHookResult = ReturnType<typeof usePaymentsQuery>;
export type PaymentsLazyQueryHookResult = ReturnType<typeof usePaymentsLazyQuery>;
export type PaymentsQueryResult = Apollo.QueryResult<PaymentsQuery, PaymentsQueryVariables>;
export const ProductDocument = gql`
    query Product($id: ID!) {
  product(id: $id) {
    ...ProductDetails
  }
}
    ${ProductDetailsFragmentDoc}`;

/**
 * __useProductQuery__
 *
 * To run a query within a React component, call `useProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductQuery(baseOptions: Apollo.QueryHookOptions<ProductQuery, ProductQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
      }
export function useProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductQuery, ProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
        }
export type ProductQueryHookResult = ReturnType<typeof useProductQuery>;
export type ProductLazyQueryHookResult = ReturnType<typeof useProductLazyQuery>;
export type ProductQueryResult = Apollo.QueryResult<ProductQuery, ProductQueryVariables>;
export const ProductsDocument = gql`
    query Products($beachBarId: ID!) {
  products(beachBarId: $beachBarId) {
    ...ProductDetails
  }
}
    ${ProductDetailsFragmentDoc}`;

/**
 * __useProductsQuery__
 *
 * To run a query within a React component, call `useProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsQuery({
 *   variables: {
 *      beachBarId: // value for 'beachBarId'
 *   },
 * });
 */
export function useProductsQuery(baseOptions: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
      }
export function useProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<typeof useProductsLazyQuery>;
export type ProductsQueryResult = Apollo.QueryResult<ProductsQuery, ProductsQueryVariables>;
export const ReviewDocument = gql`
    query Review($reviewId: ID!) {
  review(reviewId: $reviewId) {
    ...BeachBarReviewBase
    beachBar {
      id
      name
      location {
        formattedLocation
      }
    }
  }
}
    ${BeachBarReviewBaseFragmentDoc}`;

/**
 * __useReviewQuery__
 *
 * To run a query within a React component, call `useReviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewQuery({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *   },
 * });
 */
export function useReviewQuery(baseOptions: Apollo.QueryHookOptions<ReviewQuery, ReviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, options);
      }
export function useReviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewQuery, ReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, options);
        }
export type ReviewQueryHookResult = ReturnType<typeof useReviewQuery>;
export type ReviewLazyQueryHookResult = ReturnType<typeof useReviewLazyQuery>;
export type ReviewQueryResult = Apollo.QueryResult<ReviewQuery, ReviewQueryVariables>;
export const ReviewsDocument = gql`
    query Reviews {
  reviews {
    ...BeachBarReviewBase
    beachBar {
      id
      name
      slug
    }
    payment {
      id
      timestamp
    }
  }
}
    ${BeachBarReviewBaseFragmentDoc}`;

/**
 * __useReviewsQuery__
 *
 * To run a query within a React component, call `useReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewsQuery({
 *   variables: {
 *   },
 * });
 */
export function useReviewsQuery(baseOptions?: Apollo.QueryHookOptions<ReviewsQuery, ReviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReviewsQuery, ReviewsQueryVariables>(ReviewsDocument, options);
      }
export function useReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewsQuery, ReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReviewsQuery, ReviewsQueryVariables>(ReviewsDocument, options);
        }
export type ReviewsQueryHookResult = ReturnType<typeof useReviewsQuery>;
export type ReviewsLazyQueryHookResult = ReturnType<typeof useReviewsLazyQuery>;
export type ReviewsQueryResult = Apollo.QueryResult<ReviewsQuery, ReviewsQueryVariables>;
export const SearchDocument = gql`
    query Search($inputId: ID, $searchValue: String, $availability: SearchInput, $searchId: ID = null, $filterIds: [String!] = null, $sortId: ID = null) {
  search(
    inputId: $inputId
    searchValue: $searchValue
    availability: $availability
    searchId: $searchId
    filterIds: $filterIds
    sortId: $sortId
  ) {
    results {
      beachBar {
        ...SearchBeachBar
      }
      hasCapacity
      totalPrice
      recommendedProducts {
        product {
          id
          name
          maxPeople
          price
        }
        quantity
      }
    }
    search {
      id
      date
      filters {
        id
        publicId
      }
      sort {
        id
        name
      }
      inputValue {
        ...SearchInputValue
      }
    }
  }
}
    ${SearchBeachBarFragmentDoc}
${SearchInputValueFragmentDoc}`;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      inputId: // value for 'inputId'
 *      searchValue: // value for 'searchValue'
 *      availability: // value for 'availability'
 *      searchId: // value for 'searchId'
 *      filterIds: // value for 'filterIds'
 *      sortId: // value for 'sortId'
 *   },
 * });
 */
export function useSearchQuery(baseOptions?: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const SearchInputValuesDocument = gql`
    query SearchInputValues {
  searchInputValues {
    ...SearchInputValue
  }
}
    ${SearchInputValueFragmentDoc}`;

/**
 * __useSearchInputValuesQuery__
 *
 * To run a query within a React component, call `useSearchInputValuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchInputValuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchInputValuesQuery({
 *   variables: {
 *   },
 * });
 */
export function useSearchInputValuesQuery(baseOptions?: Apollo.QueryHookOptions<SearchInputValuesQuery, SearchInputValuesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchInputValuesQuery, SearchInputValuesQueryVariables>(SearchInputValuesDocument, options);
      }
export function useSearchInputValuesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchInputValuesQuery, SearchInputValuesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchInputValuesQuery, SearchInputValuesQueryVariables>(SearchInputValuesDocument, options);
        }
export type SearchInputValuesQueryHookResult = ReturnType<typeof useSearchInputValuesQuery>;
export type SearchInputValuesLazyQueryHookResult = ReturnType<typeof useSearchInputValuesLazyQuery>;
export type SearchInputValuesQueryResult = Apollo.QueryResult<SearchInputValuesQuery, SearchInputValuesQueryVariables>;
export const StripeConnectUrlDocument = gql`
    query StripeConnectUrl($phoneNumber: String) {
  stripeConnectUrl(phoneNumber: $phoneNumber)
}
    `;

/**
 * __useStripeConnectUrlQuery__
 *
 * To run a query within a React component, call `useStripeConnectUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useStripeConnectUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStripeConnectUrlQuery({
 *   variables: {
 *      phoneNumber: // value for 'phoneNumber'
 *   },
 * });
 */
export function useStripeConnectUrlQuery(baseOptions?: Apollo.QueryHookOptions<StripeConnectUrlQuery, StripeConnectUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StripeConnectUrlQuery, StripeConnectUrlQueryVariables>(StripeConnectUrlDocument, options);
      }
export function useStripeConnectUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StripeConnectUrlQuery, StripeConnectUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StripeConnectUrlQuery, StripeConnectUrlQueryVariables>(StripeConnectUrlDocument, options);
        }
export type StripeConnectUrlQueryHookResult = ReturnType<typeof useStripeConnectUrlQuery>;
export type StripeConnectUrlLazyQueryHookResult = ReturnType<typeof useStripeConnectUrlLazyQuery>;
export type StripeConnectUrlQueryResult = Apollo.QueryResult<StripeConnectUrlQuery, StripeConnectUrlQueryVariables>;
export const UserHistoryDocument = gql`
    query UserHistory {
  userHistory {
    userHistory {
      id
      objectId
      timestamp
      activity {
        id
        name
      }
    }
    beachBar {
      id
      name
      location {
        formattedLocation
      }
    }
    search {
      id
      date
      adults
      children
      inputValue {
        formattedValue
      }
    }
  }
}
    `;

/**
 * __useUserHistoryQuery__
 *
 * To run a query within a React component, call `useUserHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserHistoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserHistoryQuery(baseOptions?: Apollo.QueryHookOptions<UserHistoryQuery, UserHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserHistoryQuery, UserHistoryQueryVariables>(UserHistoryDocument, options);
      }
export function useUserHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserHistoryQuery, UserHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserHistoryQuery, UserHistoryQueryVariables>(UserHistoryDocument, options);
        }
export type UserHistoryQueryHookResult = ReturnType<typeof useUserHistoryQuery>;
export type UserHistoryLazyQueryHookResult = ReturnType<typeof useUserHistoryLazyQuery>;
export type UserHistoryQueryResult = Apollo.QueryResult<UserHistoryQuery, UserHistoryQueryVariables>;
export const UserSearchesDocument = gql`
    query UserSearches($limit: Int) {
  userSearches(limit: $limit) {
    id
    date
    adults
    children
    inputValue {
      id
      city {
        id
        name
      }
      region {
        id
        name
      }
      beachBar {
        id
        name
        thumbnailUrl
      }
    }
  }
}
    `;

/**
 * __useUserSearchesQuery__
 *
 * To run a query within a React component, call `useUserSearchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserSearchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSearchesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useUserSearchesQuery(baseOptions?: Apollo.QueryHookOptions<UserSearchesQuery, UserSearchesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserSearchesQuery, UserSearchesQueryVariables>(UserSearchesDocument, options);
      }
export function useUserSearchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserSearchesQuery, UserSearchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserSearchesQuery, UserSearchesQueryVariables>(UserSearchesDocument, options);
        }
export type UserSearchesQueryHookResult = ReturnType<typeof useUserSearchesQuery>;
export type UserSearchesLazyQueryHookResult = ReturnType<typeof useUserSearchesLazyQuery>;
export type UserSearchesQueryResult = Apollo.QueryResult<UserSearchesQuery, UserSearchesQueryVariables>;
export const GetFacebookOAuthUrlDocument = gql`
    query GetFacebookOAuthUrl {
  getFacebookOAuthUrl
}
    `;

/**
 * __useGetFacebookOAuthUrlQuery__
 *
 * To run a query within a React component, call `useGetFacebookOAuthUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFacebookOAuthUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFacebookOAuthUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFacebookOAuthUrlQuery(baseOptions?: Apollo.QueryHookOptions<GetFacebookOAuthUrlQuery, GetFacebookOAuthUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFacebookOAuthUrlQuery, GetFacebookOAuthUrlQueryVariables>(GetFacebookOAuthUrlDocument, options);
      }
export function useGetFacebookOAuthUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFacebookOAuthUrlQuery, GetFacebookOAuthUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFacebookOAuthUrlQuery, GetFacebookOAuthUrlQueryVariables>(GetFacebookOAuthUrlDocument, options);
        }
export type GetFacebookOAuthUrlQueryHookResult = ReturnType<typeof useGetFacebookOAuthUrlQuery>;
export type GetFacebookOAuthUrlLazyQueryHookResult = ReturnType<typeof useGetFacebookOAuthUrlLazyQuery>;
export type GetFacebookOAuthUrlQueryResult = Apollo.QueryResult<GetFacebookOAuthUrlQuery, GetFacebookOAuthUrlQueryVariables>;
export const GetGoogleOAuthUrlDocument = gql`
    query GetGoogleOAuthUrl {
  getGoogleOAuthUrl
}
    `;

/**
 * __useGetGoogleOAuthUrlQuery__
 *
 * To run a query within a React component, call `useGetGoogleOAuthUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoogleOAuthUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoogleOAuthUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGoogleOAuthUrlQuery(baseOptions?: Apollo.QueryHookOptions<GetGoogleOAuthUrlQuery, GetGoogleOAuthUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoogleOAuthUrlQuery, GetGoogleOAuthUrlQueryVariables>(GetGoogleOAuthUrlDocument, options);
      }
export function useGetGoogleOAuthUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoogleOAuthUrlQuery, GetGoogleOAuthUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoogleOAuthUrlQuery, GetGoogleOAuthUrlQueryVariables>(GetGoogleOAuthUrlDocument, options);
        }
export type GetGoogleOAuthUrlQueryHookResult = ReturnType<typeof useGetGoogleOAuthUrlQuery>;
export type GetGoogleOAuthUrlLazyQueryHookResult = ReturnType<typeof useGetGoogleOAuthUrlLazyQuery>;
export type GetGoogleOAuthUrlQueryResult = Apollo.QueryResult<GetGoogleOAuthUrlQuery, GetGoogleOAuthUrlQueryVariables>;
export const GetInstagramOAuthUrlDocument = gql`
    query GetInstagramOAuthUrl {
  getInstagramOAuthUrl
}
    `;

/**
 * __useGetInstagramOAuthUrlQuery__
 *
 * To run a query within a React component, call `useGetInstagramOAuthUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstagramOAuthUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstagramOAuthUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetInstagramOAuthUrlQuery(baseOptions?: Apollo.QueryHookOptions<GetInstagramOAuthUrlQuery, GetInstagramOAuthUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInstagramOAuthUrlQuery, GetInstagramOAuthUrlQueryVariables>(GetInstagramOAuthUrlDocument, options);
      }
export function useGetInstagramOAuthUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstagramOAuthUrlQuery, GetInstagramOAuthUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInstagramOAuthUrlQuery, GetInstagramOAuthUrlQueryVariables>(GetInstagramOAuthUrlDocument, options);
        }
export type GetInstagramOAuthUrlQueryHookResult = ReturnType<typeof useGetInstagramOAuthUrlQuery>;
export type GetInstagramOAuthUrlLazyQueryHookResult = ReturnType<typeof useGetInstagramOAuthUrlLazyQuery>;
export type GetInstagramOAuthUrlQueryResult = Apollo.QueryResult<GetInstagramOAuthUrlQuery, GetInstagramOAuthUrlQueryVariables>;
export const IndexPageDocument = gql`
    query IndexPage {
  getPersonalizedBeachBars {
    name
    thumbnailUrl
    location {
      city {
        name
      }
      region {
        name
      }
    }
  }
  favouriteBeachBars {
    beachBar {
      id
      name
      thumbnailUrl
      location {
        city {
          name
        }
      }
    }
  }
}
    `;

/**
 * __useIndexPageQuery__
 *
 * To run a query within a React component, call `useIndexPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useIndexPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIndexPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useIndexPageQuery(baseOptions?: Apollo.QueryHookOptions<IndexPageQuery, IndexPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IndexPageQuery, IndexPageQueryVariables>(IndexPageDocument, options);
      }
export function useIndexPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IndexPageQuery, IndexPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IndexPageQuery, IndexPageQueryVariables>(IndexPageDocument, options);
        }
export type IndexPageQueryHookResult = ReturnType<typeof useIndexPageQuery>;
export type IndexPageLazyQueryHookResult = ReturnType<typeof useIndexPageLazyQuery>;
export type IndexPageQueryResult = Apollo.QueryResult<IndexPageQuery, IndexPageQueryVariables>;
export const GetAllBeachBarsDocument = gql`
    query GetAllBeachBars {
  getAllBeachBars {
    ...DetailsBeachBar
    payments {
      id
    }
  }
}
    ${DetailsBeachBarFragmentDoc}`;

/**
 * __useGetAllBeachBarsQuery__
 *
 * To run a query within a React component, call `useGetAllBeachBarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBeachBarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBeachBarsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllBeachBarsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllBeachBarsQuery, GetAllBeachBarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBeachBarsQuery, GetAllBeachBarsQueryVariables>(GetAllBeachBarsDocument, options);
      }
export function useGetAllBeachBarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBeachBarsQuery, GetAllBeachBarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBeachBarsQuery, GetAllBeachBarsQueryVariables>(GetAllBeachBarsDocument, options);
        }
export type GetAllBeachBarsQueryHookResult = ReturnType<typeof useGetAllBeachBarsQuery>;
export type GetAllBeachBarsLazyQueryHookResult = ReturnType<typeof useGetAllBeachBarsLazyQuery>;
export type GetAllBeachBarsQueryResult = Apollo.QueryResult<GetAllBeachBarsQuery, GetAllBeachBarsQueryVariables>;