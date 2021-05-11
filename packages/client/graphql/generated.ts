import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
  /** Use JavaScript Date object for date-only fields. */
  Date: any;
  /** Use JavaScript Date object for date/time fields. */
  DateTime: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  Email: any;
  /** A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4. */
  IPv4: any;
  /** The `JSON` scalar type represents JSON values as specified by ECMA-404 */
  JSON: any;
  /** A time string at UTC, such as 10:15:30Z */
  Time: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: string;
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






/** Represents the payload (data) of Amazon Web Services (AWS) S3 */
export type S3Payload = {
  readonly __typename?: 'S3Payload';
  readonly signedRequest: Scalars['URL'];
  /** The presigned URL gives you access to the object identified in the URL, to upload the user's image */
  readonly url: Scalars['URL'];
};

/** Represents a #beach_bar's image (URL value) */
export type BeachBarImgUrl = {
  readonly __typename?: 'BeachBarImgUrl';
  readonly id: Scalars['ID'];
  readonly imgUrl: Scalars['URL'];
  /** A short description about what the image represents. The characters of the description should not exceed the number 175 */
  readonly description: Maybe<Scalars['String']>;
  readonly beachBar: BeachBar;
  readonly updatedAt: Scalars['DateTime'];
  readonly timestamp: Scalars['DateTime'];
};

/** Info to be returned when an image (URL) is added to a #beach_bar */
export type AddBeachBarImgUrl = {
  readonly __typename?: 'AddBeachBarImgUrl';
  /** The image that is added */
  readonly imgUrl: BeachBarImgUrl;
  /** Indicates if the image (URL) has been successfully been added to the #beach_bar */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when the details of #beach_bar's image, are updated */
export type UpdateBeachBarImgUrl = {
  readonly __typename?: 'UpdateBeachBarImgUrl';
  /** The image that is updated */
  readonly imgUrl: BeachBarImgUrl;
  /** Indicates if the image details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a #beach_bar's location details */
export type BeachBarLocation = {
  readonly __typename?: 'BeachBarLocation';
  readonly id: Scalars['ID'];
  /** The street address of the #beach_bar */
  readonly address: Scalars['String'];
  /** The zip code of the #beach_bar, for its street address */
  readonly zipCode: Maybe<Scalars['String']>;
  /** The latitude of the #beach_bar in the maps, provided by Mapbox */
  readonly latitude: Scalars['Float'];
  /** The longitude of the #beach_bar in the maps, provided by Mapbox */
  readonly longitude: Scalars['Float'];
  /** The 'point' value generated from latitude & longitude, provided by the PostGIS PostgreSQL extension */
  readonly whereIs: Maybe<ReadonlyArray<Scalars['Float']>>;
  /** The country the #beach_bar is located at */
  readonly country: Country;
  /** The city the #beach_bar is located at */
  readonly city: City;
  /** The region the #beach_bar is located at */
  readonly region: Maybe<Region>;
};

/** Info to be returned when location is added (assigned) to a #beach_bar */
export type AddBeachBarLocation = {
  readonly __typename?: 'AddBeachBarLocation';
  /** The location of the #beach_bar that is added */
  readonly location: BeachBarLocation;
  /** A boolean that indicates if the #beach_bar locations has been successfully being added */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when the details of #beach_bar location are updated */
export type UpdateBeachBarLocation = {
  readonly __typename?: 'UpdateBeachBarLocation';
  /** The #beach_bar location that is updated */
  readonly location: BeachBarLocation;
  /** A boolean that indicates if the #beach_bar location details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a coupon code interface for a #beach_bar */
export type CouponCodeInterface = {
  readonly id: Scalars['ID'];
  readonly refCode: Scalars['String'];
  readonly title: Scalars['String'];
  readonly discountPercentage: Scalars['Float'];
  readonly isActive: Scalars['Boolean'];
  readonly validUntil: Maybe<Scalars['DateTime']>;
  /** Represents how many times this coupon code can be used */
  readonly timesLimit: Scalars['Int'];
  /** Represents the times this coupon code has been used */
  readonly timesUsed: Scalars['Int'];
  /** The #beach_bar this coupon code applies to */
  readonly beachBar: Maybe<BeachBar>;
};

/** Represents an offer code interface for an offer campaign */
export type OfferCampaignCodeInterface = {
  readonly id: Scalars['ID'];
  readonly refCode: Scalars['String'];
  /** The total amount to make a discount from */
  readonly totalAmount: Scalars['Float'];
  /** Represents how many times this offer code has been used */
  readonly timesUsed: Scalars['Int'];
  /** The campaign the offer code is assigned to */
  readonly campaign: OfferCampaign;
  readonly timestamp: Scalars['DateTime'];
  readonly deletedAt: Maybe<Scalars['DateTime']>;
};

/** Represents a coupon code */
export type CouponCode = CouponCodeInterface & {
  readonly __typename?: 'CouponCode';
  readonly id: Scalars['ID'];
  readonly refCode: Scalars['String'];
  readonly title: Scalars['String'];
  readonly discountPercentage: Scalars['Float'];
  readonly isActive: Scalars['Boolean'];
  readonly validUntil: Maybe<Scalars['DateTime']>;
  /** Represents how many times this coupon code can be used */
  readonly timesLimit: Scalars['Int'];
  /** Represents the times this coupon code has been used */
  readonly timesUsed: Scalars['Int'];
  /** The #beach_bar this coupon code applies to */
  readonly beachBar: Maybe<BeachBar>;
};

/** Represents an offer campaign of a #beach_bar */
export type OfferCampaign = {
  readonly __typename?: 'OfferCampaign';
  readonly id: Scalars['ID'];
  readonly title: Scalars['String'];
  readonly discountPercentage: Scalars['Float'];
  readonly isActive: Scalars['Boolean'];
  readonly validUntil: Maybe<Scalars['DateTime']>;
  /** A list of products that are discounted via the campaign */
  readonly products: ReadonlyArray<Product>;
};

/** Represents an offer code for a campaign of a product */
export type OfferCampaignCode = OfferCampaignCodeInterface & {
  readonly __typename?: 'OfferCampaignCode';
  readonly id: Scalars['ID'];
  readonly refCode: Scalars['String'];
  /** The total amount to make a discount from */
  readonly totalAmount: Scalars['Float'];
  /** Represents how many times this offer code has been used */
  readonly timesUsed: Scalars['Int'];
  /** The campaign the offer code is assigned to */
  readonly campaign: OfferCampaign;
  readonly timestamp: Scalars['DateTime'];
  readonly deletedAt: Maybe<Scalars['DateTime']>;
};

export type VoucherCodeQueryResult = CouponCode | OfferCampaignCode | Error;

/** Info to be returned when a coupon code is added (issued) */
export type AddCouponCode = {
  readonly __typename?: 'AddCouponCode';
  /** The coupon code that is added */
  readonly couponCode: CouponCode;
  /** Indicates if the coupon code has been successfully added */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when a coupon code details are updated */
export type UpdateCouponCode = {
  readonly __typename?: 'UpdateCouponCode';
  /** The coupon code that is updated */
  readonly couponCode: CouponCode;
  /** Indicates if the coupon code has been successfully updated */
  readonly updated: Scalars['Boolean'];
  /** Indicates if the coupon code has been deleted */
  readonly deleted: Scalars['Boolean'];
};

/** Info to be returned when an offer campaign is added to a or some #beach_bar's product(s) */
export type AddOfferCampaign = {
  readonly __typename?: 'AddOfferCampaign';
  /** The offer campaign that is added */
  readonly offerCampaign: OfferCampaign;
  /** Indicates if the offer campaign has been successfully added */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when an offer campaign details are updated */
export type UpdateOfferCampaign = {
  readonly __typename?: 'UpdateOfferCampaign';
  /** The offer campaign that is updated */
  readonly offerCampaign: OfferCampaign;
  /** Indicates if the offer campaign details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Info to be returned when a new offer code, of an offer campaign, is added (issued) */
export type AddOfferCampaignCode = {
  readonly __typename?: 'AddOfferCampaignCode';
  /** The offer code that is added (issued) */
  readonly offerCode: OfferCampaignCode;
  /** Indicates if the offer code has been successfully added (issued) */
  readonly added: Scalars['Boolean'];
};

/** Represents a coupon code, with its referral code revealed */
export type CouponCodeReveal = CouponCodeInterface & {
  readonly __typename?: 'CouponCodeReveal';
  readonly id: Scalars['ID'];
  /** The referral code of the coupon code, to use and get a discount */
  readonly refCode: Scalars['String'];
  readonly title: Scalars['String'];
  readonly discountPercentage: Scalars['Float'];
  readonly isActive: Scalars['Boolean'];
  readonly validUntil: Maybe<Scalars['DateTime']>;
  /** Represents how many times this coupon code can be used */
  readonly timesLimit: Scalars['Int'];
  /** Represents the times this coupon code has been used */
  readonly timesUsed: Scalars['Int'];
  /** The #beach_bar this coupon code applies to */
  readonly beachBar: Maybe<BeachBar>;
};

/** Represents an offer campaign code, with its referral code revealed */
export type OfferCampaignCodeReveal = OfferCampaignCodeInterface & {
  readonly __typename?: 'OfferCampaignCodeReveal';
  readonly id: Scalars['ID'];
  /** The referral code of the offer campaign code, to use and get a discount */
  readonly refCode: Scalars['String'];
  /** The total amount to make a discount from */
  readonly totalAmount: Scalars['Float'];
  /** Represents how many times this offer code has been used */
  readonly timesUsed: Scalars['Int'];
  /** The campaign the offer code is assigned to */
  readonly campaign: OfferCampaign;
  readonly timestamp: Scalars['DateTime'];
  readonly deletedAt: Maybe<Scalars['DateTime']>;
};

/** Represents a the limit number, on how many times a product can be provided by a #beach_bar on a specific date */
export type ProductReservationLimit = {
  readonly __typename?: 'ProductReservationLimit';
  readonly id: Scalars['BigInt'];
  readonly limitNumber: Scalars['Int'];
  /** The date this limit is applicable for the product */
  readonly date: Scalars['Date'];
  /** The product this limit is assigned to */
  readonly product: Product;
  /** The hour that this limit is applicable for */
  readonly startTime: HourTime;
  /** The hour that this limit ends */
  readonly endTime: HourTime;
};

/** Info to be returned when a reservation limit is added to a #beach_bar's product */
export type AddProductReservationLimit = {
  readonly __typename?: 'AddProductReservationLimit';
  /** The reservation limit that is added */
  readonly reservationLimit: ReadonlyArray<ProductReservationLimit>;
  /** A boolean that indicates if the limit has been successfully added to the product */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when a reservation limit of a #beach_bar's product is updated */
export type UpdateProductReservationLimit = {
  readonly __typename?: 'UpdateProductReservationLimit';
  /** The reservation limit that is updated */
  readonly reservationLimit: ReadonlyArray<ProductReservationLimit>;
  /** A boolean that indicates if the limit details has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Info to be returned, when checking if a #beach_bar product is available */
export type AvailableProduct = {
  readonly __typename?: 'AvailableProduct';
  /** The hour, to check if available */
  readonly hourTime: HourTime;
  /** A boolean that indicates if the product is available in the hour time */
  readonly isAvailable: Scalars['Boolean'];
};

/** Represents a product of a #beach_bar */
export type Product = {
  readonly __typename?: 'Product';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly price: Scalars['Float'];
  readonly isActive: Scalars['Boolean'];
  readonly isIndividual: Scalars['Boolean'];
  readonly maxPeople: Scalars['Int'];
  readonly imgUrl: Maybe<Scalars['URL']>;
  /** The #beach_bar that sells the product */
  readonly beachBar: BeachBar;
  /** The category of the product */
  readonly category: ProductCategory;
  readonly updatedAt: Scalars['DateTime'];
  readonly deletedAt: Maybe<Scalars['DateTime']>;
};

/** Represents a product of a #beach_bar, and info about it's rest availability quantity */
export type ProductAvailability = {
  readonly __typename?: 'ProductAvailability';
  readonly product: Product;
  /** How many other's products of this type are available for purchase */
  readonly quantity: Scalars['Int'];
};

/** Info to be returned when a product is added to a #beach_bar */
export type AddProduct = {
  readonly __typename?: 'AddProduct';
  /** The product that is added */
  readonly product: Product;
  /** A boolean that indicates if the product has been successfully added to the #beach_bar */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when a product of a #beach_bar is updated */
export type UpdateProduct = {
  readonly __typename?: 'UpdateProduct';
  /** The product that is updated */
  readonly product: Product;
  /** A boolean that indicates if the product has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** The info to be returned when checking for a #beach_bar product's availability hour times */
export type ProductAvailabilityHour = {
  readonly __typename?: 'ProductAvailabilityHour';
  /** The hour time of a day */
  readonly hourTime: HourTime;
  readonly isAvailable: Scalars['Boolean'];
};

/** Represents a category of a #beach_bar's restaurant menu */
export type RestaurantMenuCategory = {
  readonly __typename?: 'RestaurantMenuCategory';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a #beach_bar's restaurant food item (product) in its menu catalog */
export type RestaurantFoodItem = {
  readonly __typename?: 'RestaurantFoodItem';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly price: Scalars['Float'];
  /** The URL value of the food item's picture */
  readonly imgUrl: Maybe<Scalars['URL']>;
  /** The menu category this food item is associated to */
  readonly menuCategory: RestaurantMenuCategory;
};

/** Info to be returned when a food item is added to a #beach_bar's restaurant */
export type AddRestaurantFoodItem = {
  readonly __typename?: 'AddRestaurantFoodItem';
  /** The food item being added & its info */
  readonly foodItem: RestaurantFoodItem;
  /** A boolean that indicates if the food item has been successfully being added to a restaurant */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when the food item of #beach_bar restaurant, is updated */
export type UpdateRestaurantFoodItem = {
  readonly __typename?: 'UpdateRestaurantFoodItem';
  /** The food item being updated */
  readonly foodItem: RestaurantFoodItem;
  /** A boolean that indicates if the food item has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a #beach_bar's restaurant */
export type BeachBarRestaurant = {
  readonly __typename?: 'BeachBarRestaurant';
  /** The ID value of the restaurant */
  readonly id: Scalars['ID'];
  /** The name of the restaurant */
  readonly name: Scalars['String'];
  /** A short description (info) about the restaurant */
  readonly description: Maybe<Scalars['String']>;
  /** A boolean that indicates if the restaurant is active. It can be changed by the primary owner of the #beach_bar */
  readonly isActive: Scalars['Boolean'];
  /** The #beach_bar this restaurant is owned by */
  readonly beachBar: BeachBar;
  /** A list of food items (products) in the menu of the restaurant */
  readonly foodItems: ReadonlyArray<RestaurantFoodItem>;
};

/** Info to be returned when a restaurant is added to a #beach_bar */
export type AddBeachBarRestaurant = {
  readonly __typename?: 'AddBeachBarRestaurant';
  /** The restaurant that is added & its info */
  readonly restaurant: BeachBarRestaurant;
  /** A boolean that indicates if the restaurant has been successfully being added to the #beach_bar */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when the details of #beach_bar restaurant, are updated */
export type UpdateBeachBarRestaurant = {
  readonly __typename?: 'UpdateBeachBarRestaurant';
  /** The restaurant that is updated */
  readonly restaurant: BeachBarRestaurant;
  /** A boolean that indicates if the restaurant details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a vote for a user's review */
export type ReviewVoteType = {
  readonly __typename?: 'ReviewVoteType';
  /** The ID value of the vote type */
  readonly id: Scalars['ID'];
  /** The type value of the vote */
  readonly value: Scalars['String'];
};

/** Represents a vote for a user's review */
export type ReviewVote = {
  readonly __typename?: 'ReviewVote';
  /** The ID value of the vote */
  readonly id: Scalars['ID'];
  /** The review of where the vote is added */
  readonly review: BeachBarReview;
  /** The user that added the vote */
  readonly user: User;
  /** The type of the vote */
  readonly type: ReviewVoteType;
  /** The last time the vote was updated, in the format of a timestamp */
  readonly updatedAt: Scalars['DateTime'];
  /** The timestamp recorded, when the vote was created */
  readonly timestamp: Scalars['DateTime'];
};

/** Represents an answer for a review of a #beach_bar, by the owner */
export type ReviewAnswer = {
  readonly __typename?: 'ReviewAnswer';
  /** The ID value of the particular review answer */
  readonly id: Scalars['ID'];
  /** The body (content) of the review answer, written by the reviewed #beach_bar's owner */
  readonly body: Scalars['String'];
  /** The review this answer is assigned to */
  readonly review: BeachBarReview;
  /** The last time user's account was updated, in the format of a timestamp */
  readonly updatedAt: Scalars['DateTime'];
  /** The timestamp recorded, when the user's account was created */
  readonly timestamp: Scalars['DateTime'];
};

/** Info to be returned when an answer is added to a customer's review */
export type AddReviewAnswer = {
  readonly __typename?: 'AddReviewAnswer';
  /** The answer that is added to the review */
  readonly answer: ReviewAnswer;
  /** A boolean that indicates if the answer has been successfully being added to the customer's review */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when the answer of a customer's review is updated */
export type UpdateReviewAnswer = {
  readonly __typename?: 'UpdateReviewAnswer';
  /** The review answer that is updated */
  readonly answer: ReviewAnswer;
  /** A boolean that indicates if the review answer has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a #beach_bar's review, by a customer */
export type BeachBarReview = {
  readonly __typename?: 'BeachBarReview';
  /** The ID value of the review */
  readonly id: Scalars['ID'];
  /** The user's rating, between 0 and 10 */
  readonly ratingValue: Scalars['Int'];
  /** A positive comment for the #beach_bar */
  readonly positiveComment: Maybe<Scalars['String']>;
  /** A negative comment for the #beach_bar */
  readonly negativeComment: Maybe<Scalars['String']>;
  /** A summary (description) of the user's overall review */
  readonly review: Maybe<Scalars['String']>;
  readonly beachBar: BeachBar;
  /** The votes of users for this review */
  readonly votes: ReadonlyArray<ReviewVote>;
  /** The answer of the #beach_bar to this review */
  readonly answer: Maybe<ReviewAnswer>;
  /** The customer that submitted the particular review for the #beach_bar */
  readonly customer: Customer;
  /** The type of visit for the user */
  readonly visitType: Maybe<ReviewVisitType>;
  /** The visited month of the customer visited the #beach_bar */
  readonly month: Maybe<MonthTime>;
  /** The relevant payment the user made, to be able to review a #beach_bar's products */
  readonly payment: Payment;
  readonly updatedAt: Scalars['DateTime'];
  readonly timestamp: Scalars['DateTime'];
};

/** Info to be returned when a review is added to a #beach_bar */
export type AddBeachBarReview = {
  readonly __typename?: 'AddBeachBarReview';
  /** The review that is added */
  readonly review: BeachBarReview;
  /** A boolean that indicates if the review has been successfully being added to the #beach_bar */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when the details of a customer's review, are updated */
export type UpdateBeachBarReview = {
  readonly __typename?: 'UpdateBeachBarReview';
  /** The review that is updated */
  readonly review: BeachBarReview;
  /** A boolean that indicates if the review has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a service (feature), which a #beach_bar can provide */
export type BeachBarService = {
  readonly __typename?: 'BeachBarService';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  /** Details about which icon to be used in the front-end */
  readonly icon: Icon;
};

/** Represents a #beach_bar's feature (service) & its details */
export type BeachBarFeature = {
  readonly __typename?: 'BeachBarFeature';
  /** The feature (service) the #beach_bar provides */
  readonly service: BeachBarService;
  /** The #beach_bar that provides the feature (service) */
  readonly beachBar: BeachBar;
  /** An integer that indicates the quantity of the service, a #beach_bar provides */
  readonly quantity: Scalars['Int'];
  /** A short description about the service */
  readonly description: Maybe<Scalars['String']>;
  readonly updatedAt: Scalars['DateTime'];
  readonly timestamp: Scalars['DateTime'];
};

/** Info to be returned when a feature is added (assigned) to a #beach_bar */
export type AddBeachBarFeature = {
  readonly __typename?: 'AddBeachBarFeature';
  /** The feature that will be added (assigned) to the #beach_bar */
  readonly feature: BeachBarFeature;
  /** A boolean that indicates if the feature has been successfully added (assigned) to the #beach_bar */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when the info of a feature of a #beach_bar, are updated */
export type UpdateBeachBarFeature = {
  readonly __typename?: 'UpdateBeachBarFeature';
  /** The feature that will be updated */
  readonly feature: BeachBarFeature;
  /** A boolean that indicates if the feature has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a #beach_bar */
export type BeachBar = {
  readonly __typename?: 'BeachBar';
  /** The ID value of the #beach_bar */
  readonly id: Scalars['ID'];
  /** The name of the #beach_bar */
  readonly name: Scalars['String'];
  /** The "slugified" name of the #beach_bar, in a URL friendly way */
  readonly slug: Scalars['String'];
  /** A description text about the #beach_bar */
  readonly description: Maybe<Scalars['String']>;
  /** The entry fee this #beach_bar has applied for guests */
  readonly entryFee: Maybe<Scalars['Float']>;
  /** The average rating of all the user reviews for this #beach_bar */
  readonly avgRating: Scalars['Float'];
  readonly thumbnailUrl: Scalars['URL'];
  /** A phone number to contact the #beach_bar directly */
  readonly contactPhoneNumber: Scalars['String'];
  /** A boolean that indicates if to NOT display the #beach_bar contact phone number */
  readonly hidePhoneNumber: Scalars['Boolean'];
  /** A boolean that indicates if the #beach_bar is active or not */
  readonly isActive: Scalars['Boolean'];
  /** A boolean that indicates if the #beach_bar is shown in the search results, even if it has no availability */
  readonly isAvailable: Scalars['Boolean'];
  /** The location of the #beach_bar */
  readonly location: BeachBarLocation;
  /** Get the location of the #beach_bar formatted */
  readonly formattedLocation: Scalars['String'];
  /** A list with all the payments of a #beach_bar */
  readonly payments: ReadonlyArray<Payment>;
  /** The category (type) of the #beach_bar */
  readonly category: BeachBarCategory;
  /** A list with all the #beach_bar's images (URL values) */
  readonly imgUrls: ReadonlyArray<BeachBarImgUrl>;
  /** A list with all the #beach_bar's products */
  readonly products: ReadonlyArray<Product>;
  /** A list of all the reviews of the #beach_bar */
  readonly reviews: ReadonlyArray<BeachBarReview>;
  /** A list of all the #beach_bar's features */
  readonly features: ReadonlyArray<BeachBarFeature>;
  /** A list of all the styles the #beach_bar is associated with */
  readonly styles: Maybe<ReadonlyArray<BeachBarStyle>>;
  /** A list of all the restaurants of a #beach_bar */
  readonly restaurants: Maybe<ReadonlyArray<BeachBarRestaurant>>;
  /** The default currency of the #beach_bar */
  readonly defaultCurrency: Currency;
  /** A list of all the owners of the #beach_bar */
  readonly owners: ReadonlyArray<BeachBarOwner>;
  /** The opening quarter time of the #beach_bar, in the time zone of its country */
  readonly openingTime: QuarterTime;
  /** The closing quarter time of the #beach_bar, in the time zone of its country */
  readonly closingTime: QuarterTime;
  /** The last time the #beach_bar was updated, in the format of a timestamp */
  readonly updatedAt: Scalars['DateTime'];
  /** The timestamp recorded, when the #beach_bar was created */
  readonly timestamp: Scalars['DateTime'];
};

export type BeachBarResult = BeachBar | Error;

/** Info to be returned when a #beach_bar is added (registered) to the platform */
export type AddBeachBar = {
  readonly __typename?: 'AddBeachBar';
  /** The #beach_bar that is added */
  readonly beachBar: BeachBar;
  /** A boolean that indicates if the #beach_bar has been successfully being registered */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when the details of #beach_bar are updated */
export type UpdateBeachBar = {
  readonly __typename?: 'UpdateBeachBar';
  /** The #beach_bar that is updated */
  readonly beachBar: BeachBar;
  /** A boolean that indicates if the #beach_bar details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Boolean values to show if the #beach_bar is available */
export type BeachBarAvailability = {
  readonly __typename?: 'BeachBarAvailability';
  /** A boolean that indicates if the #beach_bar has availability for the dates selected */
  readonly hasAvailability: Maybe<Scalars['Boolean']>;
  /** A boolean that indicates if the #beach_bar has availability for the people selected */
  readonly hasCapacity: Maybe<Scalars['Boolean']>;
};

/** Represents a shopping cart with its products */
export type CartProduct = {
  readonly __typename?: 'CartProduct';
  readonly id: Scalars['ID'];
  readonly quantity: Scalars['Int'];
  /** The date of purchase of the product */
  readonly date: Scalars['Date'];
  readonly timestamp: Scalars['DateTime'];
  /** The shopping cart the product is added to */
  readonly cart: Cart;
  /** The product that is added to the shopping cart */
  readonly product: Product;
  /** The hour of use of the product */
  readonly time: HourTime;
};

/** Info to be returned when a product is added to a shopping cart */
export type AddCartProduct = {
  readonly __typename?: 'AddCartProduct';
  /** The product that is added to the cart */
  readonly product: CartProduct;
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when a product of a shopping cart is updated */
export type UpdateCartProduct = {
  readonly __typename?: 'UpdateCartProduct';
  /** The product that is updated */
  readonly product: CartProduct;
  readonly updated: Scalars['Boolean'];
};

/** Represents a shopping cart */
export type Cart = Node & {
  readonly __typename?: 'Cart';
  readonly id: Scalars['ID'];
  readonly total: Scalars['Float'];
  /** The use that has created this shopping cart */
  readonly user: Maybe<User>;
  /** A list with all the cart products */
  readonly products: Maybe<ReadonlyArray<CartProduct>>;
};

/** Represents a customer's credit or debit card */
export type Card = {
  readonly __typename?: 'Card';
  readonly id: Scalars['ID'];
  readonly type: Scalars['String'];
  readonly expMonth: Scalars['Int'];
  readonly expYear: Scalars['Int'];
  readonly last4: Scalars['String'];
  readonly cardholderName: Scalars['String'];
  readonly isDefault: Scalars['Boolean'];
  readonly stripeId: Scalars['String'];
  /** The customer that owns this credit or debit card */
  readonly customer: Customer;
  /** The brand of the credit or debit card */
  readonly brand: Maybe<CardBrand>;
  /** The country of the customer's card */
  readonly country: Maybe<Country>;
};

/** Info to be returned when a card is added to a customer */
export type AddCard = {
  readonly __typename?: 'AddCard';
  /** The card that is added to a customer */
  readonly card: Card;
  /** A boolean that indicates if the card has been successfully added */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when a customer card details are updated */
export type UpdateCard = {
  readonly __typename?: 'UpdateCard';
  /** The card that is updated */
  readonly card: Card;
  /** A boolean that indicates if the card details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a customer */
export type Customer = {
  readonly __typename?: 'Customer';
  readonly id: Scalars['ID'];
  readonly email: Scalars['Email'];
  readonly phoneNumber: Maybe<Scalars['String']>;
  /** The user that is a customer too */
  readonly user: Maybe<User>;
  /** A list of all the customers cards */
  readonly cards: Maybe<ReadonlyArray<Card>>;
  /** The country of the customer */
  readonly country: Maybe<Country>;
};

/** Info to be returned when a customer is added (registered) */
export type AddCustomer = {
  readonly __typename?: 'AddCustomer';
  /** The customer that is added (registered) */
  readonly customer: Customer;
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when a customer details are updated */
export type UpdateCustomer = {
  readonly __typename?: 'UpdateCustomer';
  /** The customer that is updated */
  readonly customer: Customer;
  readonly updated: Scalars['Boolean'];
};

/** Represents the brand of a credit or debit card */
export type CardBrand = {
  readonly __typename?: 'CardBrand';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a city of a country */
export type City = {
  readonly __typename?: 'City';
  /** The ID of the city */
  readonly id: Scalars['ID'];
  /** The name of the city */
  readonly name: Scalars['String'];
  /** The country of the city */
  readonly country: Maybe<Country>;
};

/** Represents a currency */
export type Currency = {
  readonly __typename?: 'Currency';
  readonly id: Scalars['ID'];
  /** The name of the currency */
  readonly name: Scalars['String'];
  /** The ISO code of the currency internationally */
  readonly isoCode: Scalars['String'];
  /** The currency's symbol */
  readonly symbol: Scalars['String'];
  /** The currency's second (alternative) symbol */
  readonly secondSymbol: Maybe<Scalars['String']>;
};

/** Represents a country */
export type Country = {
  readonly __typename?: 'Country';
  /** The ID of the country */
  readonly id: Scalars['ID'];
  /** The name of the country */
  readonly name: Scalars['String'];
  /** The ISO 2 Alpha registered code of the country */
  readonly alpha2Code: Scalars['String'];
  /** The ISO 3 Alpha registered code of the country */
  readonly alpha3Code: Scalars['String'];
  /** The calling code of the country */
  readonly callingCode: Scalars['String'];
  /** A boolean that indicates if the country is part of European Union (EU) */
  readonly isEu: Scalars['Boolean'];
  /** The cities of the country */
  readonly cities: Maybe<ReadonlyArray<City>>;
  /** The currency of the country */
  readonly currency: Currency;
};

/** Represents the status of a payment */
export type PaymentStatus = {
  readonly __typename?: 'PaymentStatus';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a component of a product. For example a sunbed. */
export type ProductComponent = {
  readonly __typename?: 'ProductComponent';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  /** Details about which icon to be used in the front-end */
  readonly icon: Icon;
};

/** Represents a component of a product category, including the quantity that each category has. */
export type ProductCategoryComponent = {
  readonly __typename?: 'ProductCategoryComponent';
  readonly quantity: Scalars['Int'];
  readonly component: ProductComponent;
  readonly category: ProductCategory;
};

/** Represents a #beach_bar's product category */
export type ProductCategory = {
  readonly __typename?: 'ProductCategory';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly underscoredName: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  /** The components of a category's product */
  readonly components: ReadonlyArray<ProductCategoryComponent>;
};

/** Represents a review's visit type, by the user */
export type ReviewVisitType = {
  readonly __typename?: 'ReviewVisitType';
  readonly id: Scalars['ID'];
  /** The name of the particular visit type */
  readonly name: Scalars['String'];
};

/** Represents each hour of the day */
export type HourTime = {
  readonly __typename?: 'HourTime';
  readonly id: Scalars['ID'];
  readonly value: Scalars['String'];
  readonly utcValue: Scalars['Time'];
};

/** Represents each quarter of the day */
export type QuarterTime = {
  readonly __typename?: 'QuarterTime';
  readonly id: Scalars['ID'];
  readonly value: Scalars['String'];
  readonly utcValue: Scalars['Time'];
};

/** Represents each month of the year */
export type MonthTime = {
  readonly __typename?: 'MonthTime';
  readonly id: Scalars['ID'];
  readonly value: Scalars['String'];
  /** The days (count) of a month */
  readonly days: Scalars['Int'];
};

/** Represents a #beach_bar's category */
export type BeachBarCategory = {
  readonly __typename?: 'BeachBarCategory';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
};

/** Represents a SVG icon to be used in the front-end */
export type Icon = {
  readonly __typename?: 'Icon';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  /** A unique public ID for the icon, to be matched in the front-end */
  readonly publicId: Scalars['String'];
};

/** Represents a voting category */
export type VoteCategory = {
  readonly __typename?: 'VoteCategory';
  readonly id: Scalars['ID'];
  readonly title: Scalars['String'];
  readonly description: Scalars['String'];
  readonly refCode: Scalars['String'];
};

/** Represents the votes (voting result) of a voting category */
export type VoteTag = {
  readonly __typename?: 'VoteTag';
  readonly id: Scalars['ID'];
  readonly upvotes: Scalars['Int'];
  readonly downvotes: Scalars['Int'];
  readonly totalVotes: Maybe<Scalars['Int']>;
  /** The voting category these vote results are assigned to */
  readonly category: VoteCategory;
};

/** Mutation */
export type Mutation = {
  readonly __typename?: 'Mutation';
  /** Upload a single file */
  readonly uploadSingleFile: Maybe<File>;
  /** Sample mutation */
  readonly hello: Scalars['String'];
  /** Sign the S3 URL for an object */
  readonly signS3: S3Payload;
  /** Add an image (URL) to a #beach_bar */
  readonly addBeachBarImgUrl: AddBeachBarImgUrl;
  /** Update the details of a #beach_bar's image */
  readonly updateBeachBaImgUrl: UpdateBeachBarImgUrl;
  /** Delete an image (URL) from a #beach_bar */
  readonly deleteBeachBarImgUrl: Delete;
  /** Add (assign) a location to a #beach_bar */
  readonly addBeachBarLocation: AddBeachBarLocation;
  /** Update the location details of a #beach_bar */
  readonly updateBeachBarLocation: UpdateBeachBarLocation;
  readonly cacheBeachBars: Scalars['Boolean'];
  /** Add (register) a new #beach_bar to the platform */
  readonly addBeachBar: AddBeachBar;
  /** Update a #beach_bar details */
  readonly updateBeachBar: UpdateBeachBar;
  /** Delete (remove) a #beach_bar from the platform */
  readonly deleteBeachBar: Delete;
  /** Add a product to a #beach_bar */
  readonly addProduct: AddProduct;
  /** Update a #beach_bar's product info */
  readonly updateProduct: UpdateProduct;
  /** Delete (remove) a product from a #beach_bar */
  readonly deleteProduct: Delete;
  /** Restore a (soft) deleted #beach_bar product */
  readonly restoreBeachBarProduct: UpdateProduct;
  /** Add a coupon code */
  readonly addCouponCode: AddCouponCode;
  /** Update a coupon code */
  readonly updateCouponCode: UpdateCouponCode;
  readonly deleteCouponCode: Delete;
  /** Add an offer campaign to a #beach_bar */
  readonly addOfferCampaign: AddOfferCampaign;
  /** Update the details of an offer campaign of a #beach_bar */
  readonly updateOfferCampaign: UpdateOfferCampaign;
  /** Delete an offer campaign of a #beach_bar */
  readonly deleteOfferCampaign: Delete;
  /** Add (issue) a new offer code */
  readonly addOfferCampaignCode: AddOfferCampaignCode;
  /** Delete (invalidate) an offer code of an offer campaign */
  readonly deleteOfferCode: Delete;
  /** Add a reservation limit to a #beach_bar product */
  readonly addProductReservationLimit: AddProductReservationLimit;
  /** Update a #beach_bar's product reservation limit */
  readonly updateProductReservationLimit: UpdateProductReservationLimit;
  /** Delete a or some reservation limit(s) from a #beach_bar's product */
  readonly deleteProductReservationLimit: Delete;
  /** Add a food item to a #beach_bar restaurant */
  readonly addRestaurantFoodItem: AddRestaurantFoodItem;
  /** Update a #beach_bar's restaurant food item details */
  readonly updateRestaurantFoodItem: UpdateRestaurantFoodItem;
  /** Delete (remove) a food item from a #beach_bar's restaurant */
  readonly deleteRestaurantFoodItem: Delete;
  /** Add a restaurant of a #beach_bar */
  readonly addBeachBarRestaurant: AddBeachBarRestaurant;
  /** Update the restaurant details of a #beach_bar */
  readonly updateBeachBarRestaurant: UpdateBeachBarRestaurant;
  /** Delete (remove) a restaurant from a #beach_bar */
  readonly deleteBeachBarRestaurant: Delete;
  /** Upvote or downvote a customer's review on a #beach_bar */
  readonly updateReviewVote: UpdateBeachBarReview;
  /** Add a reply to a #beach_bar's review, by its owner */
  readonly addReviewAnswer: AddReviewAnswer;
  /** Update the body of a #beach_bar's review reply */
  readonly updateReviewAnswer: UpdateReviewAnswer;
  /** Delete (remove) a reply from a #beach_bar's review */
  readonly deleteReviewAnswer: Delete;
  /** Verify a user's payment to submit review */
  readonly verifyUserPaymentForReview: Scalars['Boolean'];
  /** Add a customer's review on a #beach_bar */
  readonly addReview: AddBeachBarReview;
  /** Update a customer's review on a #beach_bar */
  readonly updateReview: UpdateBeachBarReview;
  /** Delete a customer's review on a #beach_bar */
  readonly deleteReview: Delete;
  /** Add (assign) a feature to a #beach_bar */
  readonly addBeachBarFeature: AddBeachBarFeature;
  /** Update a feature of a #beach_bar */
  readonly updateBeachBarFeature: UpdateBeachBarFeature;
  /** Delete (remove) a feature (service) from a #beach_bar */
  readonly deleteBeachBarFeature: Delete;
  /** Delete a cart after a transaction. This mutation is also called if the user is not authenticated & closes the browser tab */
  readonly deleteCart: Delete;
  /** Add a product to a shopping cart */
  readonly addCartProduct: AddCartProduct;
  /** Update the quantity of a product in a shopping cart */
  readonly updateCartProduct: UpdateCartProduct;
  /** Delete (remove) a product from a shopping cart */
  readonly deleteCartProduct: DeleteResult;
  /** Add a payment method (credit / debit card) to a customer */
  readonly addCustomerPaymentMethod: AddCard;
  /** Update the details of customer's card */
  readonly updateCustomerPaymentMethod: UpdateCard;
  /** Delete (remove) a payment method (credit / debit card) from a customer */
  readonly deleteCustomerPaymentMethod: Delete;
  /** Update a customer's details */
  readonly updateCustomer: UpdateCustomer;
  /** Delete (remove) a customer */
  readonly deleteCustomer: Delete;
  /** Authorize a user with Google */
  readonly authorizeWithGoogle: OAuthAuthorization;
  /** Authorize a user with Facebook */
  readonly authorizeWithFacebook: OAuthAuthorization;
  /** Authorize a user with Instagram */
  readonly authorizeWithInstagram: OAuthAuthorization;
  /** Add (assign) another owner to a #beach_bar too. Only available for the primary owner of a #beach_bar */
  readonly addBeachBarOwner: AddBeachBarOwner;
  /** Update a #beach_bar's owner info */
  readonly updateBeachBarOwner: UpdateBeachBarOwner;
  /** Delete (remove) an owner from a #beach_bar */
  readonly deleteBeachBarOwner: DeleteResult;
  /** Make a payment using a customer's shopping cart */
  readonly checkout: Payment;
  /** Refund a payment */
  readonly refundPayment: Delete;
  /** Update a previous user's search */
  readonly updateSearch: UserSearch;
  /** Update a user's #beach_bar favourites list */
  readonly updateFavouriteBeachBar: UpdateUserFavoriteBar;
  /**
   * Remove a #beach_bar from a user's favorites list
   * @deprecated You should use the `updateUserFavoriteBar` mutation operation, which handles automatically the creation and removement of a user's #beach_bar
   */
  readonly deleteUserFavoriteBar: DeleteResult;
  /** Sign up a user */
  readonly signUp: User;
  /** Login a user */
  readonly login: UserLogin;
  /** Logout a user */
  readonly logout: Success;
  /** Sends a link to the user's email address to change its password */
  readonly sendForgotPasswordLink: Success;
  /** Change a user's password */
  readonly changeUserPassword: Success;
  /** Update a user's info */
  readonly updateUser: UserUpdate;
};


/** Mutation */
export type MutationUploadSingleFileArgs = {
  file: Scalars['Upload'];
};


/** Mutation */
export type MutationHelloArgs = {
  name: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationSignS3Args = {
  filename: Scalars['String'];
  filetype: Scalars['String'];
  s3Bucket: Scalars['String'];
};


/** Mutation */
export type MutationAddBeachBarImgUrlArgs = {
  beachBarId: Scalars['ID'];
  imgUrl: Scalars['URL'];
  description: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationUpdateBeachBaImgUrlArgs = {
  imgUrlId: Scalars['ID'];
  imgUrl: Maybe<Scalars['URL']>;
  description: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationDeleteBeachBarImgUrlArgs = {
  imgUrlId: Scalars['ID'];
};


/** Mutation */
export type MutationAddBeachBarLocationArgs = {
  beachBarId: Scalars['ID'];
  address: Scalars['String'];
  zipCode: Maybe<Scalars['String']>;
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  countryId: Scalars['ID'];
  city: Scalars['String'];
  region: Maybe<Scalars['ID']>;
};


/** Mutation */
export type MutationUpdateBeachBarLocationArgs = {
  locationId: Scalars['ID'];
  address: Maybe<Scalars['String']>;
  zipCode: Maybe<Scalars['String']>;
  latitude: Maybe<Scalars['String']>;
  longitude: Maybe<Scalars['String']>;
  countryId: Maybe<Scalars['ID']>;
  city: Maybe<Scalars['String']>;
  region: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationAddBeachBarArgs = {
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  thumbnailUrl: Maybe<Scalars['String']>;
  contactPhoneNumber: Scalars['String'];
  hidePhoneNumber?: Scalars['Boolean'];
  zeroCartTotal: Scalars['Boolean'];
  categoryId: Scalars['ID'];
  openingTimeId: Scalars['ID'];
  closingTimeId: Scalars['ID'];
  code: Scalars['String'];
  state: Scalars['String'];
};


/** Mutation */
export type MutationUpdateBeachBarArgs = {
  beachBarId: Scalars['ID'];
  name: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  thumbnailUrl: Maybe<Scalars['String']>;
  contactPhoneNumber: Maybe<Scalars['String']>;
  hidePhoneNumber: Maybe<Scalars['Boolean']>;
  zeroCartTotal: Maybe<Scalars['Boolean']>;
  isAvailable: Maybe<Scalars['Boolean']>;
  isActive: Maybe<Scalars['Boolean']>;
  categoryId: Maybe<Scalars['ID']>;
  openingTimeId: Maybe<Scalars['ID']>;
  closingTimeId: Maybe<Scalars['ID']>;
};


/** Mutation */
export type MutationDeleteBeachBarArgs = {
  beachBarId: Scalars['ID'];
};


/** Mutation */
export type MutationAddProductArgs = {
  beachBarId: Scalars['ID'];
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  categoryId: Scalars['ID'];
  price: Scalars['Float'];
  isActive?: Maybe<Scalars['Boolean']>;
  maxPeople: Scalars['Int'];
  imgUrl: Scalars['URL'];
};


/** Mutation */
export type MutationUpdateProductArgs = {
  productId: Scalars['ID'];
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  categoryId: Maybe<Scalars['ID']>;
  price: Maybe<Scalars['Float']>;
  isActive: Maybe<Scalars['Boolean']>;
  maxPeople: Scalars['Int'];
  imgUrl: Maybe<Scalars['URL']>;
};


/** Mutation */
export type MutationDeleteProductArgs = {
  productId: Scalars['ID'];
};


/** Mutation */
export type MutationRestoreBeachBarProductArgs = {
  productId: Scalars['ID'];
};


/** Mutation */
export type MutationAddCouponCodeArgs = {
  title: Scalars['String'];
  discountPercentage: Scalars['Float'];
  beachBarId: Maybe<Scalars['ID']>;
  validUntil: Scalars['DateTime'];
  isActive?: Scalars['Boolean'];
  timesLimit: Scalars['Int'];
};


/** Mutation */
export type MutationUpdateCouponCodeArgs = {
  couponCodeId: Scalars['ID'];
  title: Maybe<Scalars['String']>;
  discountPercentage: Maybe<Scalars['Float']>;
  validUntil: Maybe<Scalars['DateTime']>;
  isActive: Maybe<Scalars['Boolean']>;
  timesLimit: Maybe<Scalars['Int']>;
};


/** Mutation */
export type MutationDeleteCouponCodeArgs = {
  couponCodeId: Scalars['ID'];
};


/** Mutation */
export type MutationAddOfferCampaignArgs = {
  productIds: ReadonlyArray<Scalars['ID']>;
  title: Scalars['String'];
  discountPercentage: Scalars['Float'];
  validUntil: Scalars['DateTime'];
  isActive?: Scalars['Boolean'];
};


/** Mutation */
export type MutationUpdateOfferCampaignArgs = {
  offerCampaignId: Scalars['ID'];
  productIds: ReadonlyArray<Maybe<Scalars['ID']>>;
  title: Maybe<Scalars['String']>;
  discountPercentage: Maybe<Scalars['Float']>;
  validUntil: Maybe<Scalars['DateTime']>;
  isActive: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationDeleteOfferCampaignArgs = {
  offerCampaignId: Scalars['ID'];
};


/** Mutation */
export type MutationAddOfferCampaignCodeArgs = {
  offerCampaignId: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteOfferCodeArgs = {
  offerCodeId: Scalars['ID'];
};


/** Mutation */
export type MutationAddProductReservationLimitArgs = {
  productId: Scalars['ID'];
  limit: Scalars['Int'];
  dates: ReadonlyArray<Scalars['Date']>;
  startTimeId: Scalars['ID'];
  endTimeId: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateProductReservationLimitArgs = {
  reservationLimitIds: ReadonlyArray<Scalars['ID']>;
  limit: Maybe<Scalars['Int']>;
  startTimeId: Maybe<Scalars['ID']>;
  endTimeId: Maybe<Scalars['ID']>;
};


/** Mutation */
export type MutationDeleteProductReservationLimitArgs = {
  reservationLimitIds: ReadonlyArray<Scalars['ID']>;
};


/** Mutation */
export type MutationAddRestaurantFoodItemArgs = {
  restaurantId: Scalars['ID'];
  name: Scalars['String'];
  price: Scalars['Float'];
  menuCategoryId: Scalars['Int'];
  imgUrl: Maybe<Scalars['URL']>;
};


/** Mutation */
export type MutationUpdateRestaurantFoodItemArgs = {
  foodItemId: Scalars['ID'];
  name: Maybe<Scalars['String']>;
  price: Maybe<Scalars['Float']>;
  menuCategoryId: Maybe<Scalars['ID']>;
  imgUrl: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationDeleteRestaurantFoodItemArgs = {
  foodItemId: Scalars['ID'];
};


/** Mutation */
export type MutationAddBeachBarRestaurantArgs = {
  beachBarId: Scalars['ID'];
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationUpdateBeachBarRestaurantArgs = {
  restaurantId: Scalars['ID'];
  name: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  isActive: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationDeleteBeachBarRestaurantArgs = {
  restaurantId: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateReviewVoteArgs = {
  reviewId: Scalars['ID'];
  upvote: Maybe<Scalars['Boolean']>;
  downvote: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationAddReviewAnswerArgs = {
  reviewId: Scalars['ID'];
  body: Scalars['String'];
};


/** Mutation */
export type MutationUpdateReviewAnswerArgs = {
  answerId: Scalars['ID'];
  body: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationDeleteReviewAnswerArgs = {
  answerId: Scalars['ID'];
};


/** Mutation */
export type MutationVerifyUserPaymentForReviewArgs = {
  beachBarId: Scalars['ID'];
  refCode: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationAddReviewArgs = {
  beachBarId: Scalars['ID'];
  paymentRefCode: Maybe<Scalars['String']>;
  ratingValue: Scalars['Int'];
  visitTypeId: Maybe<Scalars['ID']>;
  monthTimeId: Maybe<Scalars['ID']>;
  positiveComment: Maybe<Scalars['String']>;
  negativeComment: Maybe<Scalars['String']>;
  review: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationUpdateReviewArgs = {
  reviewId: Scalars['ID'];
  ratingValue: Maybe<Scalars['Int']>;
  visitTypeId: Maybe<Scalars['ID']>;
  monthTimeId: Maybe<Scalars['ID']>;
  positiveComment: Maybe<Scalars['String']>;
  negativeComment: Maybe<Scalars['String']>;
  review: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationDeleteReviewArgs = {
  reviewId: Scalars['ID'];
};


/** Mutation */
export type MutationAddBeachBarFeatureArgs = {
  beachBarId: Scalars['ID'];
  featureId: Scalars['ID'];
  quantity?: Scalars['Int'];
  description: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationUpdateBeachBarFeatureArgs = {
  beachBarId: Scalars['ID'];
  featureId: Scalars['ID'];
  quantity: Maybe<Scalars['Int']>;
  description: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationDeleteBeachBarFeatureArgs = {
  beachBarId: Scalars['ID'];
  featureId: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteCartArgs = {
  cartId: Scalars['ID'];
};


/** Mutation */
export type MutationAddCartProductArgs = {
  cartId: Scalars['ID'];
  productId: Scalars['ID'];
  quantity?: Maybe<Scalars['Int']>;
  date: Scalars['Date'];
  timeId: Maybe<Scalars['ID']>;
};


/** Mutation */
export type MutationUpdateCartProductArgs = {
  id: Scalars['ID'];
  quantity: Maybe<Scalars['Int']>;
};


/** Mutation */
export type MutationDeleteCartProductArgs = {
  id: Scalars['ID'];
};


/** Mutation */
export type MutationAddCustomerPaymentMethodArgs = {
  source: Scalars['String'];
  customerId: Maybe<Scalars['ID']>;
  cardholderName: Scalars['String'];
  isDefault?: Maybe<Scalars['Boolean']>;
  savedForFuture?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationUpdateCustomerPaymentMethodArgs = {
  cardId: Scalars['ID'];
  cardholderName: Maybe<Scalars['String']>;
  expMonth: Maybe<Scalars['Int']>;
  expYear: Maybe<Scalars['Int']>;
  isDefault: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationDeleteCustomerPaymentMethodArgs = {
  cardId: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateCustomerArgs = {
  customerId: Scalars['ID'];
  phoneNumber: Maybe<Scalars['String']>;
  countryIsoCode: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationDeleteCustomerArgs = {
  customerId: Maybe<Scalars['ID']>;
};


/** Mutation */
export type MutationAuthorizeWithGoogleArgs = {
  code: Scalars['String'];
  state: Scalars['String'];
  loginDetails: Maybe<UserLoginDetails>;
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationAuthorizeWithFacebookArgs = {
  code: Scalars['String'];
  state: Scalars['String'];
  loginDetails: Maybe<UserLoginDetails>;
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationAuthorizeWithInstagramArgs = {
  email: Scalars['Email'];
  code: Scalars['String'];
  state: Scalars['String'];
  loginDetails: Maybe<UserLoginDetails>;
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationAddBeachBarOwnerArgs = {
  beachBarId: Scalars['ID'];
  userId: Maybe<Scalars['ID']>;
  isPrimary?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationUpdateBeachBarOwnerArgs = {
  beachBarId: Scalars['ID'];
  userId: Maybe<Scalars['ID']>;
  publicInfo: Maybe<Scalars['Boolean']>;
  isPrimary?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationDeleteBeachBarOwnerArgs = {
  beachBarId: Scalars['ID'];
  userId: Maybe<Scalars['ID']>;
};


/** Mutation */
export type MutationCheckoutArgs = {
  cartId: Scalars['ID'];
  cardId: Scalars['ID'];
  totalPeople?: Maybe<Scalars['Int']>;
  voucherCode: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationRefundPaymentArgs = {
  paymentId: Scalars['ID'];
};


/** Mutation */
export type MutationUpdateSearchArgs = {
  searchId: Scalars['ID'];
  filterIds: Maybe<ReadonlyArray<Scalars['String']>>;
};


/** Mutation */
export type MutationUpdateFavouriteBeachBarArgs = {
  slug: Scalars['ID'];
};


/** Mutation */
export type MutationDeleteUserFavoriteBarArgs = {
  beachBarId: Scalars['Int'];
};


/** Mutation */
export type MutationSignUpArgs = {
  userCredentials: UserCredentials;
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationLoginArgs = {
  userCredentials: UserCredentials;
  loginDetails: Maybe<UserLoginDetails>;
};


/** Mutation */
export type MutationSendForgotPasswordLinkArgs = {
  email: Scalars['Email'];
};


/** Mutation */
export type MutationChangeUserPasswordArgs = {
  email: Scalars['Email'];
  token: Scalars['String'];
  newPassword: Scalars['String'];
};


/** Mutation */
export type MutationUpdateUserArgs = {
  email: Maybe<Scalars['Email']>;
  firstName: Maybe<Scalars['String']>;
  lastName: Maybe<Scalars['String']>;
  imgUrl: Maybe<Scalars['URL']>;
  honorificTitle: Maybe<Scalars['String']>;
  birthday: Maybe<Scalars['String']>;
  countryId: Maybe<Scalars['ID']>;
  city: Maybe<Scalars['String']>;
  phoneNumber: Maybe<Scalars['String']>;
  telCountryId: Maybe<Scalars['ID']>;
  address: Maybe<Scalars['String']>;
  zipCode: Maybe<Scalars['String']>;
  trackHistory: Maybe<Scalars['Boolean']>;
};

/** User info to be returned on Google OAuth authorization */
export type OAuthAuthorization = {
  readonly __typename?: 'OAuthAuthorization';
  /** The JWT access token to be returned upon successful login */
  readonly accessToken: Scalars['String'];
  /** A boolean that indicates if the user has successfully signed up */
  readonly signedUp: Scalars['Boolean'];
  /** A boolean that indicates if the user has successfully logined */
  readonly logined: Scalars['Boolean'];
  /** The user being authorized */
  readonly user: User;
};

/** Represents a user that is an owner of a #beach_bar */
export type Owner = {
  readonly __typename?: 'Owner';
  readonly id: Scalars['ID'];
  /** The user that is the owner or one of the owners of the #beach_bar */
  readonly user: User;
};

/** Represents a #beach_bar's owner */
export type BeachBarOwner = {
  readonly __typename?: 'BeachBarOwner';
  /** A boolean that indicates if the owner is the user that also created the #beach_bar & can make modifications */
  readonly isPrimary: Scalars['Boolean'];
  /** A boolean that indicates if the owner info (contact details) are allowed to be presented to the public */
  readonly publicInfo: Scalars['Boolean'];
  /** The #beach_bar the user is assigned to as an owner, either as a primary one or not */
  readonly beachBar: BeachBar;
  /** The owner of the #beach_bar */
  readonly owner: Owner;
  /** The date and time the owner was added (assigned) to the #beach_bar */
  readonly timestamp: Scalars['DateTime'];
};

/** Info to be returned when an owner is added (assigned) to a #beach_bar */
export type AddBeachBarOwner = {
  readonly __typename?: 'AddBeachBarOwner';
  /** The owner being added & its info */
  readonly owner: Maybe<BeachBarOwner>;
  /** A boolean that indicates if the owner has been successfully being added (assigned) to a #beach_bar */
  readonly added: Maybe<Scalars['Boolean']>;
};

/** Info to be returned when the info of a #beach_bar owner, are updated */
export type UpdateBeachBarOwner = {
  readonly __typename?: 'UpdateBeachBarOwner';
  /** The owner being added & its info */
  readonly owner: BeachBarOwner;
  /** A boolean that indicates if the owner info have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a reserved product */
export type ReservedProduct = {
  readonly __typename?: 'ReservedProduct';
  readonly id: Scalars['BigInt'];
  readonly date: Scalars['Date'];
  /** A boolean that indicates if the product was refunded from the payment */
  readonly isRefunded: Scalars['Boolean'];
  /** The hour (time) that this product was reserved for */
  readonly time: HourTime;
  /** The product that is reserved */
  readonly product: Product;
  /** The payment that this product was reserved by */
  readonly payment: Payment;
};

/** Info to be returned when a product is marked (added) as a reserved one from a payment */
export type AddReservedProduct = {
  readonly __typename?: 'AddReservedProduct';
  /** The product that is marked as a reserved one */
  readonly reservedProduct: ReservedProduct;
  /** A boolean that indicates if the product has been successfully marked as a reserved one */
  readonly added: Scalars['Boolean'];
};

export type AddReservedProductResult = AddReservedProduct | Error;

/** Info to be returned when a reserved product details are updated */
export type UpdateReservedProduct = {
  readonly __typename?: 'UpdateReservedProduct';
  /** The reserved product that is updated */
  readonly reservedProduct: ReservedProduct;
  /** A boolean that indicates if the reserved product details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateReservedProductResult = UpdateReservedProduct | Error;

/** Represents the offer codes added to a payment */
export type PaymentOfferCode = {
  readonly __typename?: 'PaymentOfferCode';
  readonly id: Scalars['ID'];
  /** The payment that holds these offer codes */
  readonly payment: Payment;
  /** A coupon code added to the payment */
  readonly couponCode: Maybe<CouponCode>;
  /** A campaign offer code added to the payment */
  readonly offerCode: Maybe<OfferCampaignCode>;
};

/** Represents a payment */
export type Payment = {
  readonly __typename?: 'Payment';
  readonly id: Scalars['ID'];
  /** A unique identifier (referral code) of the payment */
  readonly refCode: Scalars['String'];
  /** Stripe's ID value of the payment */
  readonly stripeId: Scalars['String'];
  /** A boolean that indicates if the whole payment was refunded */
  readonly isRefunded: Scalars['Boolean'];
  /** The shopping cart this payment is associated to */
  readonly cart: Cart;
  /** The credit or debit card this payment is associated to */
  readonly card: Card;
  /** The status of the payment */
  readonly status: PaymentStatus;
  /** A coupon or an offer campaign code used, to apply a discount, at this payment */
  readonly voucherCode: Maybe<PaymentOfferCode>;
  /** A list with all the reserved products of the payment */
  readonly reservedProducts: Maybe<ReadonlyArray<ReservedProduct>>;
  /** The timestamp recorded, when the payment was created / paid */
  readonly timestamp: Scalars['DateTime'];
};

/** Info to be returned when a payment is created (made) */
export type AddPayment = {
  readonly __typename?: 'AddPayment';
  /** The payment that is created (made) */
  readonly payment: Payment;
  /** A boolean that indicates if the payments have been successfully created (made) */
  readonly added: Scalars['Boolean'];
};

export type AddPaymentResult = AddPayment | Error;

export type Visit = {
  readonly __typename?: 'Visit';
  readonly isUpcoming: Scalars['Boolean'];
  readonly isRefunded: Scalars['Boolean'];
  readonly time: HourTime;
  readonly date: Scalars['Date'];
  readonly payment: Payment;
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

/** Query */
export type Query = {
  readonly __typename?: 'Query';
  readonly hello: Scalars['String'];
  /** Get the product offer or coupon, based on its referral code */
  readonly getVoucherCode: VoucherCodeQueryResult;
  /** Get a list with all the offer campaigns of a #beach_bar */
  readonly getBeachBarOfferCampaigns: ReadonlyArray<OfferCampaign>;
  /** Get a coupon's code details & its referral code */
  readonly revealCouponCode: CouponCodeReveal;
  /** Get an offer's campaign code details + its referral code */
  readonly revealOfferCampaignCode: OfferCampaignCodeReveal;
  /** Get all products of a #beach_bar */
  readonly beachBarProducts: ReadonlyArray<Product>;
  /** Fetch a list with all the available hour times of a product */
  readonly getProductAvailabilityHours: ReadonlyArray<ProductAvailabilityHour>;
  readonly getProductAvailabilityQuantity: Scalars['Int'];
  /** Get a list with all the hours this product has reservation limits */
  readonly hasProductReservationLimit: ReadonlyArray<AvailableProduct>;
  /** Get the details of a #beach_bar */
  readonly beachBar: Maybe<BeachBar>;
  /** Get the images of a #beach_bar */
  readonly beachBarImgs: Maybe<ReadonlyArray<BeachBarImgUrl>>;
  /** Check a #beach_bar's availability */
  readonly checkBeachBarAvailability: BeachBarAvailability;
  /** Get a list with a #beach_bar's available products */
  readonly availableProducts: ReadonlyArray<ProductAvailability>;
  /** A list with all the available #beach_bars */
  readonly getAllBeachBars: ReadonlyArray<BeachBar>;
  /** A list with all the #beach_bars, related to a user or are top selections */
  readonly getPersonalizedBeachBars: ReadonlyArray<BeachBar>;
  /** A list with 6 #beach_bars, near to the user's location */
  readonly nearBeachBars: ReadonlyArray<BeachBar>;
  /** Get a list with all the months in a review, by the product purchase */
  readonly getPaymentProductsMonth: Maybe<ReadonlyArray<MonthTime>>;
  /** Get a list of all the reviews of an authenticated user */
  readonly userReviews: ReadonlyArray<BeachBarReview>;
  /** Get the details of a a review of an authenticated user */
  readonly review: BeachBarReview;
  readonly cartEntryFees: Scalars['Float'];
  readonly verifyZeroCartTotal: Scalars['Boolean'];
  /** Get the latest cart of an authenticated user or create one */
  readonly cart: Cart;
  /** Get a list with all the payments methods (credit / debit cards) of the current authenticated user */
  readonly customerPaymentMethods: ReadonlyArray<Card>;
  /** Get or create a customer, depending on current authenticated or not user */
  readonly customer: AddCustomer;
  /** Returns the URL where the #beach_bar (owner) will be redirected to authorize and register with Stripe, for its connect account */
  readonly getStripeConnectOAuthUrl: Maybe<Scalars['URL']>;
  /** Returns the URL where the user will be redirected to login with Google */
  readonly getGoogleOAuthUrl: Scalars['URL'];
  /** Returns the URL where the user will be redirected to login with Facebook */
  readonly getFacebookOAuthUrl: Scalars['URL'];
  /** Returns the URL where the user will be redirected to login with Instagram */
  readonly getInstagramOAuthUrl: Scalars['URL'];
  /** Get a list of payments for a specific / latest month of an authenticated user */
  readonly payments: ReadonlyArray<PaymentVisits>;
  /** Get the details of a specific payment / trip */
  readonly payment: Payment;
  /** Get the amount of refund of a specific payment / trip */
  readonly paymentRefundAmount: Scalars['Float'];
  /** Get a list with the months and years of the cart products in all the payments of an authenticated user */
  readonly paymentDates: ReadonlyArray<PaymentVisitsDates>;
  /** Returns a list of formatted search input values */
  readonly searchInputValues: ReadonlyArray<SearchInputValue>;
  /** Get a list with a user's latest searches */
  readonly userSearches: ReadonlyArray<UserSearch>;
  /** Search for available #beach_bars */
  readonly search: Search;
  /** Returns a list of user's recorded / saved history */
  readonly userHistory: ReadonlyArray<UserHistoryExtended>;
  /** Get a user's favourite #beach_bars list */
  readonly favouriteBeachBars: ReadonlyArray<UserFavoriteBar>;
  readonly accessToken: Scalars['String'];
  /** Returns current authenticated user */
  readonly me: Maybe<User>;
};


/** Query */
export type QueryGetVoucherCodeArgs = {
  refCode: Scalars['String'];
};


/** Query */
export type QueryGetBeachBarOfferCampaignsArgs = {
  beachBarId: Scalars['Int'];
};


/** Query */
export type QueryRevealCouponCodeArgs = {
  couponCodeId: Scalars['ID'];
};


/** Query */
export type QueryRevealOfferCampaignCodeArgs = {
  offerCampaignCodeId: Scalars['ID'];
};


/** Query */
export type QueryBeachBarProductsArgs = {
  beachBarId: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
};


/** Query */
export type QueryGetProductAvailabilityHoursArgs = {
  productId: Scalars['ID'];
  date: Scalars['Date'];
};


/** Query */
export type QueryGetProductAvailabilityQuantityArgs = {
  productId: Scalars['ID'];
  date: Scalars['Date'];
  timeId: Scalars['Int'];
};


/** Query */
export type QueryHasProductReservationLimitArgs = {
  productId: Scalars['ID'];
  date: Scalars['Date'];
};


/** Query */
export type QueryBeachBarArgs = {
  slug: Scalars['String'];
  userVisit?: Maybe<Scalars['Boolean']>;
};


/** Query */
export type QueryBeachBarImgsArgs = {
  slug: Scalars['String'];
};


/** Query */
export type QueryCheckBeachBarAvailabilityArgs = {
  beachBarId: Scalars['ID'];
  availability: SearchInput;
};


/** Query */
export type QueryAvailableProductsArgs = {
  beachBarId: Scalars['ID'];
  availability: SearchInput;
};


/** Query */
export type QueryNearBeachBarsArgs = {
  latitude: Scalars['String'];
  longitude: Scalars['String'];
};


/** Query */
export type QueryGetPaymentProductsMonthArgs = {
  beachBarId: Scalars['ID'];
  refCode: Maybe<Scalars['String']>;
};


/** Query */
export type QueryReviewArgs = {
  reviewId: Scalars['ID'];
};


/** Query */
export type QueryCartEntryFeesArgs = {
  cartId: Scalars['ID'];
  totalPeople: Scalars['Int'];
};


/** Query */
export type QueryVerifyZeroCartTotalArgs = {
  cartId: Scalars['ID'];
};


/** Query */
export type QueryCartArgs = {
  cartId: Maybe<Scalars['ID']>;
};


/** Query */
export type QueryCustomerArgs = {
  email: Maybe<Scalars['Email']>;
  phoneNumber: Maybe<Scalars['String']>;
  countryId: Maybe<Scalars['ID']>;
};


/** Query */
export type QueryPaymentsArgs = {
  monthId: Maybe<Scalars['ID']>;
  year: Maybe<Scalars['Int']>;
};


/** Query */
export type QueryPaymentArgs = {
  refCode: Scalars['String'];
};


/** Query */
export type QueryPaymentRefundAmountArgs = {
  refCode: Scalars['String'];
};


/** Query */
export type QueryUserSearchesArgs = {
  limit: Maybe<Scalars['Int']>;
};


/** Query */
export type QuerySearchArgs = {
  inputId: Maybe<Scalars['ID']>;
  inputValue: Maybe<Scalars['String']>;
  availability: Maybe<SearchInput>;
  searchId: Maybe<Scalars['ID']>;
  filterIds: Maybe<ReadonlyArray<Scalars['String']>>;
  sortId: Maybe<Scalars['ID']>;
};


/** Query */
export type QueryFavouriteBeachBarsArgs = {
  limit: Maybe<Scalars['Int']>;
};

/** Represents a user search */
export type UserSearch = {
  readonly __typename?: 'UserSearch';
  readonly id: Scalars['ID'];
  readonly searchDate: Scalars['Date'];
  readonly searchAdults: Scalars['Int'];
  readonly searchChildren: Maybe<Scalars['Int']>;
  /** The user that made the search */
  readonly user: Maybe<User>;
  /** The input value that the user searched for */
  readonly inputValue: SearchInputValue;
  /** A sort filter used by the user, in its search */
  readonly filters: ReadonlyArray<SearchFilter>;
  /** The input value that the user searched for */
  readonly sort: Maybe<SearchSort>;
  readonly updatedAt: Scalars['DateTime'];
  readonly timestamp: Scalars['DateTime'];
};

/** Represents a type of user's search sort filter */
export type SearchSort = {
  readonly __typename?: 'SearchSort';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents the info (results) to be returned on user search */
export type SearchResultType = {
  readonly __typename?: 'SearchResultType';
  /** The #beach_bar found in the search */
  readonly beachBar: BeachBar;
  readonly availability: BeachBarAvailability;
};

/** Represents the info to be returned when a user searches for (availability) at #beach_bars */
export type Search = {
  readonly __typename?: 'Search';
  /** The results of the user search */
  readonly results: ReadonlyArray<SearchResultType>;
  /** The details of the search, made by a user */
  readonly search: UserSearch;
};

/** The arguments (args) used at #beach_bar search or availability */
export type SearchInput = {
  /** The date to search availability at #beach_bars */
  readonly date: Scalars['Date'];
  /** The ID value of the hour time to search availability for */
  readonly timeId: Maybe<Scalars['ID']>;
  /** The number of adults to search availability at #beach_bars. Its value should be less or equal to 12 adults */
  readonly adults: Scalars['Int'];
  /** The number of children to search availability at #beach_bars. Its value should be less or equal to 8 children */
  readonly children: Maybe<Scalars['Int']>;
};

/** Represents a potential input value of a user's search */
export type SearchInputValue = {
  readonly __typename?: 'SearchInputValue';
  readonly id: Scalars['ID'];
  /** A unique identifier (ID) for public use */
  readonly publicId: Scalars['String'];
  /** The search input value formatted into a string */
  readonly formattedValue: Scalars['String'];
  /** The country of the input value */
  readonly country: Maybe<Country>;
  /** The city of the input value */
  readonly city: Maybe<City>;
  /** The region of the input value */
  readonly region: Maybe<Region>;
  /** The #beach_bar of the input value */
  readonly beachBar: Maybe<BeachBar>;
};

/** Represents a filter used by users when searching for (availability at) #beach_bars */
export type SearchFilter = {
  readonly __typename?: 'SearchFilter';
  readonly id: Scalars['ID'];
  /** A unique identifier (ID) for public use */
  readonly publicId: Scalars['String'];
  readonly name: Scalars['String'];
  /** A short description about the filter, what is its value, and when to use */
  readonly description: Maybe<Scalars['String']>;
};

/** The base of a GraphQL Node */
export type Node = {
  readonly id: Scalars['ID'];
};

/** Represents a user's uploaded file */
export type File = {
  readonly __typename?: 'File';
  /** A string representing the name of the uploaded file */
  readonly filename: Scalars['String'];
  /** A string representing the MIME type of the uploaded file, such as image/jpeg */
  readonly mimetype: Scalars['String'];
  /** A string representing the file encoding, such as 7bit */
  readonly encoding: Scalars['String'];
};

/** Info to be returned upon successful operation */
export type Success = {
  readonly __typename?: 'Success';
  /** A boolean that indicates if the operation was successful */
  readonly success: Scalars['Boolean'];
};

/** Info to be returned upon successful UPDATE operation */
export type Update = {
  /** A boolean that indicates if the information were updated */
  readonly updated: Scalars['Boolean'];
};

export type SuccessResult = Success | Error;

/** Info to be returned upon successful deletion */
export type Delete = {
  readonly __typename?: 'Delete';
  /** A boolean that indicates if the delete operation was successful */
  readonly deleted: Scalars['Boolean'];
};

export type DeleteResult = Delete | Error;

/** The timestamp of when something was created */
export type Timestamp = {
  readonly timestamp: Scalars['DateTime'];
};

/** Represents a user's account */
export type UserAccount = {
  readonly __typename?: 'UserAccount';
  /** The ID value of the user's account */
  readonly id: Scalars['ID'];
  /** The user's honorific title. Its value can be null or 'Mr', 'Mrs', 'Ms', 'Miss', 'Sr', 'Dr', 'Lady' */
  readonly honorificTitle: Maybe<Scalars['String']>;
  /** The URL value of user's account profile picture */
  readonly imgUrl: Maybe<Scalars['String']>;
  /** User's birthday date */
  readonly birthday: Maybe<Scalars['Date']>;
  /** User's age */
  readonly age: Maybe<Scalars['Int']>;
  /** The house of office street address of the user */
  readonly address: Maybe<Scalars['String']>;
  /** The zip code of the house or office street address of the user */
  readonly zipCode: Maybe<Scalars['String']>;
  /** The city of the user */
  readonly city: Maybe<Scalars['String']>;
  /** The phone number of the user */
  readonly phoneNumber: Maybe<Scalars['String']>;
  /** The user info of the particular account */
  readonly user: User;
  /** The country of the user */
  readonly country: Maybe<Country>;
  /** The country of the user's phone number */
  readonly telCountry: Maybe<Country>;
  /** Indicates if to track some of user's actions */
  readonly trackHistory: Scalars['Boolean'];
};

/** Represents the type of action a user made */
export type UserHistoryActivity = {
  readonly __typename?: 'UserHistoryActivity';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

/** Represents a user's recorded / saved action */
export type UserHistory = Timestamp & {
  readonly __typename?: 'UserHistory';
  readonly timestamp: Scalars['DateTime'];
  readonly id: Scalars['ID'];
  /** The action type of the user */
  readonly activity: UserHistoryActivity;
  /** The ID of what the user accessed */
  readonly objectId: Scalars['ID'];
  /** The user that made the recorded / saved action */
  readonly user: User;
};

/** Represents a user's action, with details about the objectId */
export type UserHistoryExtended = {
  readonly __typename?: 'UserHistoryExtended';
  /** The info of the recorded / saved action of the user */
  readonly userHistory: UserHistory;
  /** Details about the #beach_bar the user may have visited */
  readonly beachBar: Maybe<BeachBar>;
  /** Details about what the user searched */
  readonly search: Maybe<UserSearch>;
};

/** A user's favorite #beach_bar */
export type UserFavoriteBar = {
  readonly __typename?: 'UserFavoriteBar';
  /** The user object */
  readonly user: User;
  /** One of user's favorite #beach_bar */
  readonly beachBar: BeachBar;
};

/** Info to be returned when a user's #beach_bar favourite list is updated */
export type UpdateUserFavoriteBar = {
  readonly __typename?: 'UpdateUserFavoriteBar';
  /** The #beach_bar that is added / removed */
  readonly favouriteBar: UserFavoriteBar;
  /** A boolean that indicates if the user's favorites #beach_bar list is updated */
  readonly updated: Scalars['Boolean'];
};

/** Represents a user */
export type User = {
  readonly __typename?: 'User';
  /** User's ID value */
  readonly id: Scalars['ID'];
  /** User's email address */
  readonly email: Scalars['Email'];
  /** User's first (given) name */
  readonly firstName: Maybe<Scalars['String']>;
  /** User's last (family) name */
  readonly lastName: Maybe<Scalars['String']>;
  /** User's first and last name combines */
  readonly fullName: Maybe<Scalars['String']>;
  /** User's account info */
  readonly account: UserAccount;
  /** A user's review on a #beach_bar */
  readonly reviews: ReadonlyArray<BeachBarReview>;
  /** A list with all the user's favorite #beach_bars */
  readonly favoriteBars: ReadonlyArray<UserFavoriteBar>;
  /** A list of all the votes of the user */
  readonly reviewVotes: ReadonlyArray<ReviewVote>;
};

export type UserTypeResult = User | Error;

/** User info to be returned on login */
export type UserLogin = {
  readonly __typename?: 'UserLogin';
  /** The user (object) that logins */
  readonly user: User;
  /** The access token to authenticate & authorize the user */
  readonly accessToken: Scalars['String'];
};

/** Credentials of user to sign up / login */
export type UserCredentials = {
  /** Email of user to sign up */
  readonly email: Scalars['Email'];
  /** Password of user */
  readonly password: Scalars['String'];
};

/** User details in login. The user's IP address is passed via the context */
export type UserLoginDetails = {
  /** The city name from where user logins from */
  readonly city: Maybe<Scalars['String']>;
  /** The alpha 2 code of the country, from where the user logins */
  readonly countryAlpha2Code: Maybe<Scalars['String']>;
};

/** User details to be returned on update */
export type UserUpdate = Update & {
  readonly __typename?: 'UserUpdate';
  /** A boolean that indicates if the information were updated */
  readonly updated: Scalars['Boolean'];
  readonly user: User;
};

/** Represents a country's or city's region */
export type Region = {
  readonly __typename?: 'Region';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  /** The country the region is located at */
  readonly country: Country;
  /** The city the region is located at */
  readonly city: Maybe<City>;
};

/** The style of a #beach_bar */
export type BeachBarStyle = {
  readonly __typename?: 'BeachBarStyle';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

export type DetailsBeachBarFragment = (
  { readonly __typename?: 'BeachBar' }
  & Pick<BeachBar, 'id' | 'name' | 'slug' | 'thumbnailUrl' | 'description' | 'avgRating' | 'isAvailable' | 'formattedLocation' | 'contactPhoneNumber' | 'hidePhoneNumber'>
  & { readonly location: (
    { readonly __typename?: 'BeachBarLocation' }
    & Pick<BeachBarLocation, 'id' | 'address' | 'zipCode' | 'longitude' | 'latitude'>
    & { readonly country: (
      { readonly __typename?: 'Country' }
      & Pick<Country, 'id' | 'name' | 'callingCode'>
    ), readonly city: (
      { readonly __typename?: 'City' }
      & Pick<City, 'id' | 'name'>
    ), readonly region: Maybe<(
      { readonly __typename?: 'Region' }
      & Pick<Region, 'id' | 'name'>
    )> }
  ), readonly features: ReadonlyArray<(
    { readonly __typename?: 'BeachBarFeature' }
    & Pick<BeachBarFeature, 'quantity'>
    & { readonly service: (
      { readonly __typename?: 'BeachBarService' }
      & Pick<BeachBarService, 'id' | 'name'>
      & { readonly icon: (
        { readonly __typename?: 'Icon' }
        & Pick<Icon, 'id' | 'publicId'>
      ) }
    ) }
  )>, readonly styles: Maybe<ReadonlyArray<(
    { readonly __typename?: 'BeachBarStyle' }
    & Pick<BeachBarStyle, 'id' | 'name'>
  )>>, readonly restaurants: Maybe<ReadonlyArray<(
    { readonly __typename?: 'BeachBarRestaurant' }
    & Pick<BeachBarRestaurant, 'id'>
  )>> }
);

export type SearchBeachBarFragment = (
  { readonly __typename?: 'BeachBar' }
  & { readonly reviews: ReadonlyArray<(
    { readonly __typename?: 'BeachBarReview' }
    & Pick<BeachBarReview, 'id'>
  )>, readonly payments: ReadonlyArray<(
    { readonly __typename?: 'Payment' }
    & Pick<Payment, 'id'>
  )> }
  & DetailsBeachBarFragment
);

export type BasicCardFragment = (
  { readonly __typename?: 'Card' }
  & Pick<Card, 'id' | 'expMonth' | 'expYear' | 'last4' | 'cardholderName' | 'isDefault'>
  & { readonly brand: Maybe<(
    { readonly __typename?: 'CardBrand' }
    & Pick<CardBrand, 'id' | 'name'>
  )> }
);

export type BasicCartProductFragment = (
  { readonly __typename?: 'CartProduct' }
  & Pick<CartProduct, 'id' | 'quantity' | 'date' | 'timestamp'>
  & { readonly time: (
    { readonly __typename?: 'HourTime' }
    & Pick<HourTime, 'id' | 'value'>
  ), readonly product: (
    { readonly __typename?: 'Product' }
    & Pick<Product, 'id' | 'name' | 'price' | 'imgUrl'>
    & { readonly beachBar: (
      { readonly __typename?: 'BeachBar' }
      & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl' | 'formattedLocation'>
      & { readonly defaultCurrency: (
        { readonly __typename?: 'Currency' }
        & Pick<Currency, 'symbol'>
      ) }
    ) }
  ) }
);

export type CountryFragment = (
  { readonly __typename?: 'Country' }
  & Pick<Country, 'id' | 'name' | 'alpha2Code' | 'alpha3Code' | 'callingCode' | 'isEu'>
  & { readonly cities: Maybe<ReadonlyArray<(
    { readonly __typename?: 'City' }
    & Pick<City, 'id' | 'name'>
  )>>, readonly currency: (
    { readonly __typename?: 'Currency' }
    & Pick<Currency, 'id' | 'name' | 'isoCode' | 'symbol' | 'secondSymbol'>
  ) }
);

export type BeachBarProductFragment = (
  { readonly __typename?: 'Product' }
  & Pick<Product, 'id' | 'name' | 'description' | 'imgUrl' | 'price' | 'maxPeople'>
  & { readonly category: (
    { readonly __typename?: 'ProductCategory' }
    & Pick<ProductCategory, 'id'>
    & { readonly components: ReadonlyArray<(
      { readonly __typename?: 'ProductCategoryComponent' }
      & Pick<ProductCategoryComponent, 'quantity'>
      & { readonly component: (
        { readonly __typename?: 'ProductComponent' }
        & Pick<ProductComponent, 'id' | 'name'>
        & { readonly icon: (
          { readonly __typename?: 'Icon' }
          & Pick<Icon, 'id' | 'publicId'>
        ) }
      ) }
    )> }
  ) }
);

export type ReviewFragment = (
  { readonly __typename?: 'BeachBarReview' }
  & Pick<BeachBarReview, 'id' | 'ratingValue' | 'review' | 'positiveComment' | 'negativeComment' | 'updatedAt' | 'timestamp'>
  & { readonly votes: ReadonlyArray<(
    { readonly __typename?: 'ReviewVote' }
    & Pick<ReviewVote, 'id'>
    & { readonly user: (
      { readonly __typename?: 'User' }
      & Pick<User, 'id'>
    ), readonly type: (
      { readonly __typename?: 'ReviewVoteType' }
      & Pick<ReviewVoteType, 'id' | 'value'>
    ) }
  )>, readonly month: Maybe<(
    { readonly __typename?: 'MonthTime' }
    & Pick<MonthTime, 'id' | 'value'>
  )>, readonly visitType: Maybe<(
    { readonly __typename?: 'ReviewVisitType' }
    & Pick<ReviewVisitType, 'id' | 'name'>
  )>, readonly answer: Maybe<(
    { readonly __typename?: 'ReviewAnswer' }
    & Pick<ReviewAnswer, 'id' | 'body' | 'updatedAt'>
  )>, readonly customer: (
    { readonly __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { readonly user: Maybe<(
      { readonly __typename?: 'User' }
      & Pick<User, 'id' | 'fullName'>
      & { readonly account: (
        { readonly __typename?: 'UserAccount' }
        & Pick<UserAccount, 'id' | 'imgUrl'>
      ) }
    )> }
  ) }
);

export type SearchInputValueFragment = (
  { readonly __typename?: 'SearchInputValue' }
  & Pick<SearchInputValue, 'id' | 'publicId' | 'formattedValue'>
  & { readonly country: Maybe<(
    { readonly __typename?: 'Country' }
    & Pick<Country, 'id' | 'name' | 'alpha2Code'>
  )>, readonly city: Maybe<(
    { readonly __typename?: 'City' }
    & Pick<City, 'id' | 'name'>
    & { readonly country: Maybe<(
      { readonly __typename?: 'Country' }
      & Pick<Country, 'id' | 'alpha2Code'>
    )> }
  )>, readonly region: Maybe<(
    { readonly __typename?: 'Region' }
    & Pick<Region, 'id' | 'name'>
    & { readonly country: (
      { readonly __typename?: 'Country' }
      & Pick<Country, 'id' | 'alpha2Code'>
    ) }
  )>, readonly beachBar: Maybe<(
    { readonly __typename?: 'BeachBar' }
    & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl' | 'formattedLocation'>
    & { readonly location: (
      { readonly __typename?: 'BeachBarLocation' }
      & Pick<BeachBarLocation, 'longitude' | 'latitude'>
      & { readonly country: (
        { readonly __typename?: 'Country' }
        & Pick<Country, 'id' | 'name' | 'alpha2Code'>
      ), readonly city: (
        { readonly __typename?: 'City' }
        & Pick<City, 'id' | 'name'>
      ), readonly region: Maybe<(
        { readonly __typename?: 'Region' }
        & Pick<Region, 'id' | 'name'>
      )> }
    ) }
  )> }
);

export type AddCartProductMutationVariables = Exact<{
  cartId: Scalars['ID'];
  productId: Scalars['ID'];
  quantity: Maybe<Scalars['Int']>;
  date: Scalars['Date'];
  timeId: Maybe<Scalars['ID']>;
}>;


export type AddCartProductMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly addCartProduct: (
    { readonly __typename?: 'AddCartProduct' }
    & Pick<AddCartProduct, 'added'>
    & { readonly product: (
      { readonly __typename?: 'CartProduct' }
      & Pick<CartProduct, 'id' | 'quantity'>
      & { readonly product: (
        { readonly __typename?: 'Product' }
        & Pick<Product, 'id' | 'name'>
      ) }
    ) }
  ) }
);

export type AddCustomerPaymentMethodMutationVariables = Exact<{
  token: Scalars['String'];
  customerId: Scalars['ID'];
  cardholderName: Scalars['String'];
  isDefault?: Maybe<Scalars['Boolean']>;
  savedForFuture?: Maybe<Scalars['Boolean']>;
}>;


export type AddCustomerPaymentMethodMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly addCustomerPaymentMethod: (
    { readonly __typename?: 'AddCard' }
    & Pick<AddCard, 'added'>
    & { readonly card: (
      { readonly __typename?: 'Card' }
      & Pick<Card, 'id' | 'expMonth' | 'expYear' | 'last4' | 'cardholderName' | 'isDefault'>
      & { readonly brand: Maybe<(
        { readonly __typename?: 'CardBrand' }
        & Pick<CardBrand, 'id' | 'name'>
      )> }
    ) }
  ) }
);

export type AddReviewMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  paymentRefCode: Maybe<Scalars['String']>;
  ratingValue: Scalars['Int'];
  visitTypeId: Maybe<Scalars['ID']>;
  monthTimeId: Maybe<Scalars['ID']>;
  positiveComment: Maybe<Scalars['String']>;
  negativeComment: Maybe<Scalars['String']>;
  review: Maybe<Scalars['String']>;
}>;


export type AddReviewMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly addReview: (
    { readonly __typename?: 'AddBeachBarReview' }
    & Pick<AddBeachBarReview, 'added'>
    & { readonly review: (
      { readonly __typename?: 'BeachBarReview' }
      & Pick<BeachBarReview, 'id'>
    ) }
  ) }
);

export type ChangeUserPasswordMutationVariables = Exact<{
  email: Scalars['Email'];
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangeUserPasswordMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly changeUserPassword: (
    { readonly __typename?: 'Success' }
    & Pick<Success, 'success'>
  ) }
);

export type CheckoutMutationVariables = Exact<{
  cartId: Scalars['ID'];
  cardId: Scalars['ID'];
  totalPeople?: Maybe<Scalars['Int']>;
}>;


export type CheckoutMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly checkout: (
    { readonly __typename?: 'Payment' }
    & Pick<Payment, 'id' | 'refCode'>
  ) }
);

export type DeleteCartProductMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCartProductMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly deleteCartProduct: (
    { readonly __typename?: 'Delete' }
    & Pick<Delete, 'deleted'>
  ) | (
    { readonly __typename?: 'Error' }
    & { readonly error: Maybe<(
      { readonly __typename?: 'ErrorObject' }
      & Pick<ErrorObject, 'code' | 'message'>
    )> }
  ) }
);

export type DeleteCustomerPaymentMethodMutationVariables = Exact<{
  cardId: Scalars['ID'];
}>;


export type DeleteCustomerPaymentMethodMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly deleteCustomerPaymentMethod: (
    { readonly __typename?: 'Delete' }
    & Pick<Delete, 'deleted'>
  ) }
);

export type DeleteReviewMutationVariables = Exact<{
  reviewId: Scalars['ID'];
}>;


export type DeleteReviewMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly deleteReview: (
    { readonly __typename?: 'Delete' }
    & Pick<Delete, 'deleted'>
  ) }
);

export type HelloMutationVariables = Exact<{
  name: Maybe<Scalars['String']>;
}>;


export type HelloMutation = (
  { readonly __typename?: 'Mutation' }
  & Pick<Mutation, 'hello'>
);

export type LoginMutationVariables = Exact<{
  userCredentials: UserCredentials;
  loginDetails: Maybe<UserLoginDetails>;
}>;


export type LoginMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly login: (
    { readonly __typename?: 'UserLogin' }
    & Pick<UserLogin, 'accessToken'>
    & { readonly user: (
      { readonly __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ) }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly logout: (
    { readonly __typename?: 'Success' }
    & Pick<Success, 'success'>
  ) }
);

export type RefundPaymentMutationVariables = Exact<{
  paymentId: Scalars['ID'];
}>;


export type RefundPaymentMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly refundPayment: (
    { readonly __typename?: 'Delete' }
    & Pick<Delete, 'deleted'>
  ) }
);

export type SendForgotPasswordLinkMutationVariables = Exact<{
  email: Scalars['Email'];
}>;


export type SendForgotPasswordLinkMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly sendForgotPasswordLink: (
    { readonly __typename?: 'Success' }
    & Pick<Success, 'success'>
  ) }
);

export type SignS3MutationVariables = Exact<{
  filename: Scalars['String'];
  filetype: Scalars['String'];
  s3Bucket: Scalars['String'];
}>;


export type SignS3Mutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly signS3: (
    { readonly __typename?: 'S3Payload' }
    & Pick<S3Payload, 'signedRequest' | 'url'>
  ) }
);

export type SignUpMutationVariables = Exact<{
  userCredentials: UserCredentials;
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
}>;


export type SignUpMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly signUp: (
    { readonly __typename?: 'User' }
    & Pick<User, 'id'>
  ) }
);

export type UpdateCartProductMutationVariables = Exact<{
  id: Scalars['ID'];
  quantity: Maybe<Scalars['Int']>;
}>;


export type UpdateCartProductMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly updateCartProduct: (
    { readonly __typename?: 'UpdateCartProduct' }
    & Pick<UpdateCartProduct, 'updated'>
    & { readonly product: (
      { readonly __typename?: 'CartProduct' }
      & Pick<CartProduct, 'id' | 'quantity'>
    ) }
  ) }
);

export type UpdateCustomerPaymentMethodMutationVariables = Exact<{
  cardId: Scalars['ID'];
  expMonth: Maybe<Scalars['Int']>;
  expYear: Maybe<Scalars['Int']>;
  cardholderName: Maybe<Scalars['String']>;
  isDefault: Maybe<Scalars['Boolean']>;
}>;


export type UpdateCustomerPaymentMethodMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly updateCustomerPaymentMethod: (
    { readonly __typename?: 'UpdateCard' }
    & Pick<UpdateCard, 'updated'>
    & { readonly card: (
      { readonly __typename?: 'Card' }
      & Pick<Card, 'id' | 'expMonth' | 'expYear' | 'cardholderName' | 'isDefault' | 'last4'>
      & { readonly brand: Maybe<(
        { readonly __typename?: 'CardBrand' }
        & Pick<CardBrand, 'id' | 'name'>
      )> }
    ) }
  ) }
);

export type UpdateFavouriteBeachBarMutationVariables = Exact<{
  slug: Scalars['ID'];
}>;


export type UpdateFavouriteBeachBarMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly updateFavouriteBeachBar: (
    { readonly __typename?: 'UpdateUserFavoriteBar' }
    & Pick<UpdateUserFavoriteBar, 'updated'>
  ) }
);

export type UpdateReviewMutationVariables = Exact<{
  reviewId: Scalars['ID'];
  ratingValue: Maybe<Scalars['Int']>;
  visitTypeId: Maybe<Scalars['ID']>;
  monthTimeId: Maybe<Scalars['ID']>;
  positiveComment: Maybe<Scalars['String']>;
  negativeComment: Maybe<Scalars['String']>;
  review: Maybe<Scalars['String']>;
}>;


export type UpdateReviewMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly updateReview: (
    { readonly __typename?: 'UpdateBeachBarReview' }
    & Pick<UpdateBeachBarReview, 'updated'>
    & { readonly review: (
      { readonly __typename?: 'BeachBarReview' }
      & Pick<BeachBarReview, 'id' | 'ratingValue' | 'positiveComment' | 'negativeComment' | 'review' | 'updatedAt' | 'timestamp'>
      & { readonly votes: ReadonlyArray<(
        { readonly __typename?: 'ReviewVote' }
        & Pick<ReviewVote, 'id'>
        & { readonly user: (
          { readonly __typename?: 'User' }
          & Pick<User, 'id'>
        ), readonly type: (
          { readonly __typename?: 'ReviewVoteType' }
          & Pick<ReviewVoteType, 'id' | 'value'>
        ) }
      )>, readonly answer: Maybe<(
        { readonly __typename?: 'ReviewAnswer' }
        & Pick<ReviewAnswer, 'id' | 'body'>
      )>, readonly beachBar: (
        { readonly __typename?: 'BeachBar' }
        & Pick<BeachBar, 'id' | 'name' | 'formattedLocation'>
      ), readonly visitType: Maybe<(
        { readonly __typename?: 'ReviewVisitType' }
        & Pick<ReviewVisitType, 'id' | 'name'>
      )>, readonly month: Maybe<(
        { readonly __typename?: 'MonthTime' }
        & Pick<MonthTime, 'id' | 'value'>
      )> }
    ) }
  ) }
);

export type UpdateReviewVoteMutationVariables = Exact<{
  reviewId: Scalars['ID'];
  upvote: Maybe<Scalars['Boolean']>;
  downvote: Maybe<Scalars['Boolean']>;
}>;


export type UpdateReviewVoteMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly updateReviewVote: (
    { readonly __typename?: 'UpdateBeachBarReview' }
    & Pick<UpdateBeachBarReview, 'updated'>
    & { readonly review: (
      { readonly __typename?: 'BeachBarReview' }
      & Pick<BeachBarReview, 'id' | 'ratingValue'>
      & { readonly votes: ReadonlyArray<(
        { readonly __typename?: 'ReviewVote' }
        & Pick<ReviewVote, 'id'>
        & { readonly user: (
          { readonly __typename?: 'User' }
          & Pick<User, 'id'>
        ), readonly type: (
          { readonly __typename?: 'ReviewVoteType' }
          & Pick<ReviewVoteType, 'id' | 'value'>
        ) }
      )> }
    ) }
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  email: Maybe<Scalars['Email']>;
  firstName: Maybe<Scalars['String']>;
  lastName: Maybe<Scalars['String']>;
  imgUrl: Maybe<Scalars['URL']>;
  honorificTitle: Maybe<Scalars['String']>;
  birthday: Maybe<Scalars['String']>;
  countryId: Maybe<Scalars['ID']>;
  city: Maybe<Scalars['String']>;
  phoneNumber: Maybe<Scalars['String']>;
  telCountryId: Maybe<Scalars['ID']>;
  address: Maybe<Scalars['String']>;
  zipCode: Maybe<Scalars['String']>;
  trackHistory: Maybe<Scalars['Boolean']>;
}>;


export type UpdateUserMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly updateUser: (
    { readonly __typename?: 'UserUpdate' }
    & Pick<UserUpdate, 'updated'>
    & { readonly user: (
      { readonly __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>
      & { readonly account: (
        { readonly __typename?: 'UserAccount' }
        & Pick<UserAccount, 'id' | 'honorificTitle' | 'birthday' | 'age' | 'address' | 'zipCode' | 'trackHistory' | 'imgUrl' | 'city' | 'phoneNumber'>
        & { readonly telCountry: Maybe<(
          { readonly __typename?: 'Country' }
          & Pick<Country, 'id'>
        )>, readonly country: Maybe<(
          { readonly __typename?: 'Country' }
          & Pick<Country, 'id'>
        )> }
      ) }
    ) }
  ) }
);

export type VerifyUserPaymentForReviewMutationVariables = Exact<{
  beachBarId: Scalars['ID'];
  refCode: Maybe<Scalars['String']>;
}>;


export type VerifyUserPaymentForReviewMutation = (
  { readonly __typename?: 'Mutation' }
  & Pick<Mutation, 'verifyUserPaymentForReview'>
);

export type AuthorizeWithFacebookMutationVariables = Exact<{
  code: Scalars['String'];
  state: Scalars['String'];
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
  loginDetails: Maybe<UserLoginDetails>;
}>;


export type AuthorizeWithFacebookMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly authorizeWithFacebook: (
    { readonly __typename?: 'OAuthAuthorization' }
    & { readonly user: (
      { readonly __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ) }
  ) }
);

export type AuthorizeWithGoogleMutationVariables = Exact<{
  code: Scalars['String'];
  state: Scalars['String'];
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
  loginDetails: Maybe<UserLoginDetails>;
}>;


export type AuthorizeWithGoogleMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly authorizeWithGoogle: (
    { readonly __typename?: 'OAuthAuthorization' }
    & { readonly user: (
      { readonly __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ) }
  ) }
);

export type AuthorizeWithInstagramMutationVariables = Exact<{
  code: Scalars['String'];
  state: Scalars['String'];
  email: Scalars['Email'];
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
  loginDetails: Maybe<UserLoginDetails>;
}>;


export type AuthorizeWithInstagramMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly authorizeWithInstagram: (
    { readonly __typename?: 'OAuthAuthorization' }
    & { readonly user: (
      { readonly __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ) }
  ) }
);

export type AvailableProductsQueryVariables = Exact<{
  beachBarId: Scalars['ID'];
  availability: SearchInput;
}>;


export type AvailableProductsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly availableProducts: ReadonlyArray<(
    { readonly __typename?: 'ProductAvailability' }
    & Pick<ProductAvailability, 'quantity'>
    & { readonly product: (
      { readonly __typename?: 'Product' }
      & BeachBarProductFragment
    ) }
  )> }
);

export type BeachBarQueryVariables = Exact<{
  slug: Scalars['String'];
  userVisit: Maybe<Scalars['Boolean']>;
}>;


export type BeachBarQuery = (
  { readonly __typename?: 'Query' }
  & { readonly beachBar: Maybe<(
    { readonly __typename?: 'BeachBar' }
    & { readonly reviews: ReadonlyArray<(
      { readonly __typename?: 'BeachBarReview' }
      & { readonly payment: (
        { readonly __typename?: 'Payment' }
        & Pick<Payment, 'id' | 'timestamp'>
      ) }
      & ReviewFragment
    )>, readonly imgUrls: ReadonlyArray<(
      { readonly __typename?: 'BeachBarImgUrl' }
      & Pick<BeachBarImgUrl, 'id' | 'imgUrl' | 'description' | 'timestamp'>
    )>, readonly defaultCurrency: (
      { readonly __typename?: 'Currency' }
      & Pick<Currency, 'id' | 'symbol'>
    ), readonly products: ReadonlyArray<(
      { readonly __typename?: 'Product' }
      & BeachBarProductFragment
    )> }
    & DetailsBeachBarFragment
  )> }
);

export type BeachBarImgsQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type BeachBarImgsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly beachBarImgs: Maybe<ReadonlyArray<(
    { readonly __typename?: 'BeachBarImgUrl' }
    & Pick<BeachBarImgUrl, 'id' | 'imgUrl' | 'description' | 'timestamp'>
  )>> }
);

export type CartQueryVariables = Exact<{
  cartId: Maybe<Scalars['ID']>;
}>;


export type CartQuery = (
  { readonly __typename?: 'Query' }
  & { readonly cart: (
    { readonly __typename?: 'Cart' }
    & Pick<Cart, 'id' | 'total'>
    & { readonly products: Maybe<ReadonlyArray<(
      { readonly __typename?: 'CartProduct' }
      & BasicCartProductFragment
    )>> }
  ) }
);

export type CartEntryFeesQueryVariables = Exact<{
  cartId: Scalars['ID'];
  totalPeople: Scalars['Int'];
}>;


export type CartEntryFeesQuery = (
  { readonly __typename?: 'Query' }
  & Pick<Query, 'cartEntryFees'>
);

export type CustomerQueryVariables = Exact<{
  email: Maybe<Scalars['Email']>;
  phoneNumber: Maybe<Scalars['String']>;
  countryId: Maybe<Scalars['ID']>;
}>;


export type CustomerQuery = (
  { readonly __typename?: 'Query' }
  & { readonly customer: (
    { readonly __typename?: 'AddCustomer' }
    & { readonly customer: (
      { readonly __typename?: 'Customer' }
      & Pick<Customer, 'id' | 'email'>
      & { readonly user: Maybe<(
        { readonly __typename?: 'User' }
        & Pick<User, 'id' | 'email'>
      )>, readonly cards: Maybe<ReadonlyArray<(
        { readonly __typename?: 'Card' }
        & BasicCardFragment
      )>> }
    ) }
  ) }
);

export type CustomerPaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomerPaymentMethodsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly customerPaymentMethods: ReadonlyArray<(
    { readonly __typename?: 'Card' }
    & BasicCardFragment
  )> }
);

export type FavouriteBeachBarsQueryVariables = Exact<{
  limit: Maybe<Scalars['Int']>;
}>;


export type FavouriteBeachBarsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly favouriteBeachBars: ReadonlyArray<(
    { readonly __typename?: 'UserFavoriteBar' }
    & { readonly beachBar: (
      { readonly __typename?: 'BeachBar' }
      & Pick<BeachBar, 'id' | 'name' | 'slug' | 'thumbnailUrl' | 'formattedLocation'>
    ) }
  )> }
);

export type GetUserFavouriteBeachBarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserFavouriteBeachBarsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly favouriteBeachBars: ReadonlyArray<(
    { readonly __typename?: 'UserFavoriteBar' }
    & { readonly beachBar: (
      { readonly __typename?: 'BeachBar' }
      & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl'>
      & { readonly location: (
        { readonly __typename?: 'BeachBarLocation' }
        & { readonly city: (
          { readonly __typename?: 'City' }
          & Pick<City, 'name'>
        ) }
      ) }
    ) }
  )> }
);

export type GetPersonalizedBeachBarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPersonalizedBeachBarsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly getPersonalizedBeachBars: ReadonlyArray<(
    { readonly __typename?: 'BeachBar' }
    & Pick<BeachBar, 'id' | 'name' | 'slug' | 'thumbnailUrl' | 'formattedLocation'>
    & { readonly location: (
      { readonly __typename?: 'BeachBarLocation' }
      & Pick<BeachBarLocation, 'latitude' | 'longitude'>
      & { readonly city: (
        { readonly __typename?: 'City' }
        & Pick<City, 'name'>
      ), readonly region: Maybe<(
        { readonly __typename?: 'Region' }
        & Pick<Region, 'name'>
      )> }
    ) }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { readonly __typename?: 'Query' }
  & { readonly me: Maybe<(
    { readonly __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'fullName'>
    & { readonly account: (
      { readonly __typename?: 'UserAccount' }
      & Pick<UserAccount, 'id' | 'honorificTitle' | 'birthday' | 'age' | 'address' | 'zipCode' | 'imgUrl' | 'city' | 'trackHistory' | 'phoneNumber'>
      & { readonly telCountry: Maybe<(
        { readonly __typename?: 'Country' }
        & Pick<Country, 'id' | 'name'>
      )>, readonly country: Maybe<(
        { readonly __typename?: 'Country' }
        & Pick<Country, 'id' | 'name'>
        & { readonly currency: (
          { readonly __typename?: 'Currency' }
          & Pick<Currency, 'id' | 'symbol'>
        ) }
      )> }
    ), readonly reviewVotes: ReadonlyArray<(
      { readonly __typename?: 'ReviewVote' }
      & Pick<ReviewVote, 'id'>
      & { readonly type: (
        { readonly __typename?: 'ReviewVoteType' }
        & Pick<ReviewVoteType, 'id' | 'value'>
      ), readonly review: (
        { readonly __typename?: 'BeachBarReview' }
        & Pick<BeachBarReview, 'id'>
      ) }
    )>, readonly favoriteBars: ReadonlyArray<(
      { readonly __typename?: 'UserFavoriteBar' }
      & { readonly beachBar: (
        { readonly __typename?: 'BeachBar' }
        & Pick<BeachBar, 'id' | 'name' | 'slug' | 'thumbnailUrl' | 'formattedLocation'>
      ) }
    )> }
  )> }
);

export type NearBeachBarsQueryVariables = Exact<{
  latitude: Scalars['String'];
  longitude: Scalars['String'];
}>;


export type NearBeachBarsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly nearBeachBars: ReadonlyArray<(
    { readonly __typename?: 'BeachBar' }
    & Pick<BeachBar, 'id' | 'name' | 'slug' | 'thumbnailUrl'>
    & { readonly location: (
      { readonly __typename?: 'BeachBarLocation' }
      & Pick<BeachBarLocation, 'latitude' | 'longitude'>
    ) }
  )> }
);

export type PaymentQueryVariables = Exact<{
  refCode: Scalars['String'];
}>;


export type PaymentQuery = (
  { readonly __typename?: 'Query' }
  & { readonly payment: (
    { readonly __typename?: 'Payment' }
    & Pick<Payment, 'id' | 'refCode' | 'isRefunded' | 'timestamp'>
    & { readonly cart: (
      { readonly __typename?: 'Cart' }
      & Pick<Cart, 'id' | 'total'>
      & { readonly products: Maybe<ReadonlyArray<(
        { readonly __typename?: 'CartProduct' }
        & BasicCartProductFragment
      )>> }
    ), readonly card: (
      { readonly __typename?: 'Card' }
      & Pick<Card, 'id' | 'last4'>
      & { readonly brand: Maybe<(
        { readonly __typename?: 'CardBrand' }
        & Pick<CardBrand, 'id' | 'name'>
      )>, readonly country: Maybe<(
        { readonly __typename?: 'Country' }
        & Pick<Country, 'id'>
        & { readonly currency: (
          { readonly __typename?: 'Currency' }
          & Pick<Currency, 'id' | 'symbol'>
        ) }
      )>, readonly customer: (
        { readonly __typename?: 'Customer' }
        & Pick<Customer, 'id' | 'email' | 'phoneNumber'>
        & { readonly country: Maybe<(
          { readonly __typename?: 'Country' }
          & Pick<Country, 'id' | 'callingCode'>
        )> }
      ) }
    ), readonly status: (
      { readonly __typename?: 'PaymentStatus' }
      & Pick<PaymentStatus, 'id' | 'name'>
    ), readonly voucherCode: Maybe<(
      { readonly __typename?: 'PaymentOfferCode' }
      & Pick<PaymentOfferCode, 'id'>
      & { readonly couponCode: Maybe<(
        { readonly __typename?: 'CouponCode' }
        & Pick<CouponCode, 'id' | 'refCode' | 'discountPercentage'>
      )>, readonly offerCode: Maybe<(
        { readonly __typename?: 'OfferCampaignCode' }
        & Pick<OfferCampaignCode, 'id' | 'refCode' | 'totalAmount' | 'timesUsed'>
        & { readonly campaign: (
          { readonly __typename?: 'OfferCampaign' }
          & Pick<OfferCampaign, 'id'>
        ) }
      )> }
    )> }
  ) }
);

export type PaymentRefundAmountQueryVariables = Exact<{
  refCode: Scalars['String'];
}>;


export type PaymentRefundAmountQuery = (
  { readonly __typename?: 'Query' }
  & Pick<Query, 'paymentRefundAmount'>
);

export type PaymentsQueryVariables = Exact<{
  monthId: Maybe<Scalars['ID']>;
  year: Maybe<Scalars['Int']>;
}>;


export type PaymentsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly payments: ReadonlyArray<(
    { readonly __typename?: 'PaymentVisits' }
    & { readonly beachBar: (
      { readonly __typename?: 'BeachBar' }
      & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl'>
      & { readonly location: (
        { readonly __typename?: 'BeachBarLocation' }
        & { readonly city: (
          { readonly __typename?: 'City' }
          & Pick<City, 'name'>
        ), readonly region: Maybe<(
          { readonly __typename?: 'Region' }
          & Pick<Region, 'name'>
        )> }
      ) }
    ), readonly visits: ReadonlyArray<(
      { readonly __typename?: 'Visit' }
      & Pick<Visit, 'isUpcoming' | 'isRefunded' | 'date'>
      & { readonly time: (
        { readonly __typename?: 'HourTime' }
        & Pick<HourTime, 'id' | 'value'>
      ), readonly payment: (
        { readonly __typename?: 'Payment' }
        & Pick<Payment, 'id' | 'refCode'>
      ) }
    )> }
  )> }
);

export type PaymentDatesQueryVariables = Exact<{ [key: string]: never; }>;


export type PaymentDatesQuery = (
  { readonly __typename?: 'Query' }
  & { readonly paymentDates: ReadonlyArray<(
    { readonly __typename?: 'PaymentVisitsDates' }
    & Pick<PaymentVisitsDates, 'year'>
    & { readonly month: (
      { readonly __typename?: 'MonthTime' }
      & Pick<MonthTime, 'id' | 'value'>
    ) }
  )> }
);

export type ReviewQueryVariables = Exact<{
  reviewId: Scalars['ID'];
}>;


export type ReviewQuery = (
  { readonly __typename?: 'Query' }
  & { readonly review: (
    { readonly __typename?: 'BeachBarReview' }
    & { readonly beachBar: (
      { readonly __typename?: 'BeachBar' }
      & Pick<BeachBar, 'id' | 'name' | 'formattedLocation'>
    ) }
    & ReviewFragment
  ) }
);

export type SearchQueryVariables = Exact<{
  inputId: Maybe<Scalars['ID']>;
  inputValue: Maybe<Scalars['String']>;
  availability: Maybe<SearchInput>;
  searchId: Maybe<Scalars['ID']>;
  filterIds: Maybe<ReadonlyArray<Scalars['String']> | Scalars['String']>;
  sortId: Maybe<Scalars['ID']>;
}>;


export type SearchQuery = (
  { readonly __typename?: 'Query' }
  & { readonly search: (
    { readonly __typename?: 'Search' }
    & { readonly results: ReadonlyArray<(
      { readonly __typename?: 'SearchResultType' }
      & { readonly beachBar: (
        { readonly __typename?: 'BeachBar' }
        & SearchBeachBarFragment
      ), readonly availability: (
        { readonly __typename?: 'BeachBarAvailability' }
        & Pick<BeachBarAvailability, 'hasAvailability' | 'hasCapacity'>
      ) }
    )>, readonly search: (
      { readonly __typename?: 'UserSearch' }
      & Pick<UserSearch, 'id'>
      & { readonly filters: ReadonlyArray<(
        { readonly __typename?: 'SearchFilter' }
        & Pick<SearchFilter, 'id' | 'publicId'>
      )>, readonly sort: Maybe<(
        { readonly __typename?: 'SearchSort' }
        & Pick<SearchSort, 'id' | 'name'>
      )>, readonly inputValue: (
        { readonly __typename?: 'SearchInputValue' }
        & SearchInputValueFragment
      ) }
    ) }
  ) }
);

export type SearchInputValuesQueryVariables = Exact<{ [key: string]: never; }>;


export type SearchInputValuesQuery = (
  { readonly __typename?: 'Query' }
  & { readonly searchInputValues: ReadonlyArray<(
    { readonly __typename?: 'SearchInputValue' }
    & SearchInputValueFragment
  )> }
);

export type UserHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type UserHistoryQuery = (
  { readonly __typename?: 'Query' }
  & { readonly userHistory: ReadonlyArray<(
    { readonly __typename?: 'UserHistoryExtended' }
    & { readonly userHistory: (
      { readonly __typename?: 'UserHistory' }
      & Pick<UserHistory, 'id' | 'objectId' | 'timestamp'>
      & { readonly activity: (
        { readonly __typename?: 'UserHistoryActivity' }
        & Pick<UserHistoryActivity, 'id' | 'name'>
      ) }
    ), readonly beachBar: Maybe<(
      { readonly __typename?: 'BeachBar' }
      & Pick<BeachBar, 'id' | 'name' | 'formattedLocation'>
    )>, readonly search: Maybe<(
      { readonly __typename?: 'UserSearch' }
      & Pick<UserSearch, 'id' | 'searchDate' | 'searchAdults' | 'searchChildren'>
      & { readonly inputValue: (
        { readonly __typename?: 'SearchInputValue' }
        & Pick<SearchInputValue, 'formattedValue'>
      ) }
    )> }
  )> }
);

export type UserReviewsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserReviewsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly userReviews: ReadonlyArray<(
    { readonly __typename?: 'BeachBarReview' }
    & Pick<BeachBarReview, 'id' | 'ratingValue' | 'positiveComment' | 'negativeComment' | 'review' | 'updatedAt' | 'timestamp'>
    & { readonly votes: ReadonlyArray<(
      { readonly __typename?: 'ReviewVote' }
      & Pick<ReviewVote, 'id'>
      & { readonly user: (
        { readonly __typename?: 'User' }
        & Pick<User, 'id'>
      ), readonly type: (
        { readonly __typename?: 'ReviewVoteType' }
        & Pick<ReviewVoteType, 'id' | 'value'>
      ) }
    )>, readonly answer: Maybe<(
      { readonly __typename?: 'ReviewAnswer' }
      & Pick<ReviewAnswer, 'id' | 'body'>
    )>, readonly beachBar: (
      { readonly __typename?: 'BeachBar' }
      & Pick<BeachBar, 'id' | 'name'>
    ), readonly visitType: Maybe<(
      { readonly __typename?: 'ReviewVisitType' }
      & Pick<ReviewVisitType, 'id' | 'name'>
    )>, readonly month: Maybe<(
      { readonly __typename?: 'MonthTime' }
      & Pick<MonthTime, 'id' | 'value'>
    )> }
  )> }
);

export type UserSearchesQueryVariables = Exact<{
  limit: Maybe<Scalars['Int']>;
}>;


export type UserSearchesQuery = (
  { readonly __typename?: 'Query' }
  & { readonly userSearches: ReadonlyArray<(
    { readonly __typename?: 'UserSearch' }
    & Pick<UserSearch, 'id' | 'searchDate' | 'searchAdults' | 'searchChildren'>
    & { readonly inputValue: (
      { readonly __typename?: 'SearchInputValue' }
      & Pick<SearchInputValue, 'id'>
      & { readonly city: Maybe<(
        { readonly __typename?: 'City' }
        & Pick<City, 'id' | 'name'>
      )>, readonly region: Maybe<(
        { readonly __typename?: 'Region' }
        & Pick<Region, 'id' | 'name'>
      )>, readonly beachBar: Maybe<(
        { readonly __typename?: 'BeachBar' }
        & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl'>
      )> }
    ) }
  )> }
);

export type GetFacebookOAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFacebookOAuthUrlQuery = (
  { readonly __typename?: 'Query' }
  & Pick<Query, 'getFacebookOAuthUrl'>
);

export type GetGoogleOAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGoogleOAuthUrlQuery = (
  { readonly __typename?: 'Query' }
  & Pick<Query, 'getGoogleOAuthUrl'>
);

export type GetInstagramOAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInstagramOAuthUrlQuery = (
  { readonly __typename?: 'Query' }
  & Pick<Query, 'getInstagramOAuthUrl'>
);

export type IndexPageQueryVariables = Exact<{ [key: string]: never; }>;


export type IndexPageQuery = (
  { readonly __typename?: 'Query' }
  & { readonly getPersonalizedBeachBars: ReadonlyArray<(
    { readonly __typename?: 'BeachBar' }
    & Pick<BeachBar, 'name' | 'thumbnailUrl'>
    & { readonly location: (
      { readonly __typename?: 'BeachBarLocation' }
      & { readonly city: (
        { readonly __typename?: 'City' }
        & Pick<City, 'name'>
      ), readonly region: Maybe<(
        { readonly __typename?: 'Region' }
        & Pick<Region, 'name'>
      )> }
    ) }
  )>, readonly favouriteBeachBars: ReadonlyArray<(
    { readonly __typename?: 'UserFavoriteBar' }
    & { readonly beachBar: (
      { readonly __typename?: 'BeachBar' }
      & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl'>
      & { readonly location: (
        { readonly __typename?: 'BeachBarLocation' }
        & { readonly city: (
          { readonly __typename?: 'City' }
          & Pick<City, 'name'>
        ) }
      ) }
    ) }
  )> }
);

export type GetAllBeachBarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBeachBarsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly getAllBeachBars: ReadonlyArray<(
    { readonly __typename?: 'BeachBar' }
    & SearchBeachBarFragment
  )> }
);

export const DetailsBeachBarFragmentDoc = gql`
    fragment DetailsBeachBar on BeachBar {
  id
  name
  slug
  thumbnailUrl
  description
  avgRating
  isAvailable
  formattedLocation
  contactPhoneNumber
  hidePhoneNumber
  location {
    id
    address
    zipCode
    longitude
    latitude
    country {
      id
      name
      callingCode
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
    `;
export const SearchBeachBarFragmentDoc = gql`
    fragment SearchBeachBar on BeachBar {
  ...DetailsBeachBar
  reviews {
    id
  }
  payments {
    id
  }
}
    ${DetailsBeachBarFragmentDoc}`;
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
export const BasicCartProductFragmentDoc = gql`
    fragment BasicCartProduct on CartProduct {
  id
  quantity
  date
  timestamp
  time {
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
      formattedLocation
      defaultCurrency {
        symbol
      }
    }
  }
}
    `;
export const CountryFragmentDoc = gql`
    fragment Country on Country {
  id
  name
  alpha2Code
  alpha3Code
  callingCode
  isEu
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
    `;
export const BeachBarProductFragmentDoc = gql`
    fragment BeachBarProduct on Product {
  id
  name
  description
  imgUrl
  price
  maxPeople
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
export const ReviewFragmentDoc = gql`
    fragment Review on BeachBarReview {
  id
  ratingValue
  review
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
  answer {
    id
    body
    updatedAt
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
export const SearchInputValueFragmentDoc = gql`
    fragment SearchInputValue on SearchInputValue {
  id
  publicId
  formattedValue
  country {
    id
    name
    alpha2Code
  }
  city {
    id
    name
    country {
      id
      alpha2Code
    }
  }
  region {
    id
    name
    country {
      id
      alpha2Code
    }
  }
  beachBar {
    id
    name
    thumbnailUrl
    formattedLocation
    location {
      longitude
      latitude
      country {
        id
        name
        alpha2Code
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
    `;
export const AddCartProductDocument = gql`
    mutation AddCartProduct($cartId: ID!, $productId: ID!, $quantity: Int, $date: Date!, $timeId: ID) {
  addCartProduct(
    cartId: $cartId
    productId: $productId
    quantity: $quantity
    date: $date
    timeId: $timeId
  ) {
    product {
      id
      quantity
      product {
        id
        name
      }
    }
    added
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
 *      timeId: // value for 'timeId'
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
    card {
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
    added
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
export const AddReviewDocument = gql`
    mutation AddReview($beachBarId: ID!, $paymentRefCode: String, $ratingValue: Int!, $visitTypeId: ID, $monthTimeId: ID, $positiveComment: String, $negativeComment: String, $review: String) {
  addReview(
    beachBarId: $beachBarId
    paymentRefCode: $paymentRefCode
    ratingValue: $ratingValue
    visitTypeId: $visitTypeId
    monthTimeId: $monthTimeId
    positiveComment: $positiveComment
    negativeComment: $negativeComment
    review: $review
  ) {
    review {
      id
    }
    added
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
 *      monthTimeId: // value for 'monthTimeId'
 *      positiveComment: // value for 'positiveComment'
 *      negativeComment: // value for 'negativeComment'
 *      review: // value for 'review'
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
export const ChangeUserPasswordDocument = gql`
    mutation ChangeUserPassword($email: Email!, $token: String!, $newPassword: String!) {
  changeUserPassword(email: $email, token: $token, newPassword: $newPassword) {
    success
  }
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
    mutation Checkout($cartId: ID!, $cardId: ID!, $totalPeople: Int = 1) {
  checkout(cartId: $cartId, cardId: $cardId, totalPeople: $totalPeople) {
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
 *      totalPeople: // value for 'totalPeople'
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
export const DeleteCartProductDocument = gql`
    mutation DeleteCartProduct($id: ID!) {
  deleteCartProduct(id: $id) {
    ... on Delete {
      deleted
    }
    ... on Error {
      error {
        code
        message
      }
    }
  }
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
  deleteCustomerPaymentMethod(cardId: $cardId) {
    deleted
  }
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
export const DeleteReviewDocument = gql`
    mutation DeleteReview($reviewId: ID!) {
  deleteReview(reviewId: $reviewId) {
    deleted
  }
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
 *      reviewId: // value for 'reviewId'
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
    mutation Login($userCredentials: UserCredentials!, $loginDetails: UserLoginDetails) {
  login(userCredentials: $userCredentials, loginDetails: $loginDetails) {
    user {
      id
      email
    }
    accessToken
  }
}
    `;
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
  logout {
    success
  }
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
    mutation RefundPayment($paymentId: ID!) {
  refundPayment(paymentId: $paymentId) {
    deleted
  }
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
 *      paymentId: // value for 'paymentId'
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
  sendForgotPasswordLink(email: $email) {
    success
  }
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
export const UpdateCartProductDocument = gql`
    mutation UpdateCartProduct($id: ID!, $quantity: Int) {
  updateCartProduct(id: $id, quantity: $quantity) {
    updated
    product {
      id
      quantity
    }
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
    card {
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
    updated
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
    updated
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
export const UpdateReviewDocument = gql`
    mutation UpdateReview($reviewId: ID!, $ratingValue: Int, $visitTypeId: ID, $monthTimeId: ID, $positiveComment: String, $negativeComment: String, $review: String) {
  updateReview(
    reviewId: $reviewId
    ratingValue: $ratingValue
    visitTypeId: $visitTypeId
    monthTimeId: $monthTimeId
    positiveComment: $positiveComment
    negativeComment: $negativeComment
    review: $review
  ) {
    review {
      id
      ratingValue
      positiveComment
      negativeComment
      review
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
      answer {
        id
        body
      }
      beachBar {
        id
        name
        formattedLocation
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
    updated
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
 *      reviewId: // value for 'reviewId'
 *      ratingValue: // value for 'ratingValue'
 *      visitTypeId: // value for 'visitTypeId'
 *      monthTimeId: // value for 'monthTimeId'
 *      positiveComment: // value for 'positiveComment'
 *      negativeComment: // value for 'negativeComment'
 *      review: // value for 'review'
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
    review {
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
    updated
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
    updated
    user {
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
          id
        }
        country {
          id
        }
      }
    }
  }
}
    `;
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
export const AvailableProductsDocument = gql`
    query AvailableProducts($beachBarId: ID!, $availability: SearchInput!) {
  availableProducts(beachBarId: $beachBarId, availability: $availability) {
    product {
      ...BeachBarProduct
    }
    quantity
  }
}
    ${BeachBarProductFragmentDoc}`;

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
    query BeachBar($slug: String!, $userVisit: Boolean) {
  beachBar(slug: $slug, userVisit: $userVisit) {
    ...DetailsBeachBar
    reviews {
      ...Review
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
    defaultCurrency {
      id
      symbol
    }
    products {
      ...BeachBarProduct
    }
  }
}
    ${DetailsBeachBarFragmentDoc}
${ReviewFragmentDoc}
${BeachBarProductFragmentDoc}`;

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
 *      userVisit: // value for 'userVisit'
 *   },
 * });
 */
export function useBeachBarQuery(baseOptions: Apollo.QueryHookOptions<BeachBarQuery, BeachBarQueryVariables>) {
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
export const BeachBarImgsDocument = gql`
    query BeachBarImgs($slug: String!) {
  beachBarImgs(slug: $slug) {
    id
    imgUrl
    description
    timestamp
  }
}
    `;

/**
 * __useBeachBarImgsQuery__
 *
 * To run a query within a React component, call `useBeachBarImgsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBeachBarImgsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBeachBarImgsQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useBeachBarImgsQuery(baseOptions: Apollo.QueryHookOptions<BeachBarImgsQuery, BeachBarImgsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BeachBarImgsQuery, BeachBarImgsQueryVariables>(BeachBarImgsDocument, options);
      }
export function useBeachBarImgsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BeachBarImgsQuery, BeachBarImgsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BeachBarImgsQuery, BeachBarImgsQueryVariables>(BeachBarImgsDocument, options);
        }
export type BeachBarImgsQueryHookResult = ReturnType<typeof useBeachBarImgsQuery>;
export type BeachBarImgsLazyQueryHookResult = ReturnType<typeof useBeachBarImgsLazyQuery>;
export type BeachBarImgsQueryResult = Apollo.QueryResult<BeachBarImgsQuery, BeachBarImgsQueryVariables>;
export const CartDocument = gql`
    query Cart($cartId: ID) {
  cart(cartId: $cartId) {
    id
    total
    products {
      ...BasicCartProduct
    }
  }
}
    ${BasicCartProductFragmentDoc}`;

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
    query CartEntryFees($cartId: ID!, $totalPeople: Int!) {
  cartEntryFees(cartId: $cartId, totalPeople: $totalPeople)
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
 *      totalPeople: // value for 'totalPeople'
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
export const CustomerDocument = gql`
    query Customer($email: Email, $phoneNumber: String, $countryId: ID) {
  customer(email: $email, phoneNumber: $phoneNumber, countryId: $countryId) {
    customer {
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
export const FavouriteBeachBarsDocument = gql`
    query FavouriteBeachBars($limit: Int) {
  favouriteBeachBars(limit: $limit) {
    beachBar {
      id
      name
      slug
      thumbnailUrl
      formattedLocation
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
export const GetPersonalizedBeachBarsDocument = gql`
    query GetPersonalizedBeachBars {
  getPersonalizedBeachBars {
    id
    name
    slug
    thumbnailUrl
    formattedLocation
    location {
      latitude
      longitude
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
        id
        name
      }
      country {
        id
        name
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
        formattedLocation
      }
    }
  }
}
    `;

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
    query NearBeachBars($latitude: String!, $longitude: String!) {
  nearBeachBars(latitude: $latitude, longitude: $longitude) {
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
    query Payment($refCode: String!) {
  payment(refCode: $refCode) {
    id
    refCode
    isRefunded
    timestamp
    cart {
      id
      total
      products {
        ...BasicCartProduct
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
          id
          callingCode
        }
      }
    }
    status {
      id
      name
    }
    voucherCode {
      id
      couponCode {
        id
        refCode
        discountPercentage
      }
      offerCode {
        id
        refCode
        totalAmount
        timesUsed
        campaign {
          id
        }
      }
    }
  }
}
    ${BasicCartProductFragmentDoc}`;

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
    query PaymentRefundAmount($refCode: String!) {
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
      time {
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
export const PaymentDatesDocument = gql`
    query PaymentDates {
  paymentDates {
    month {
      id
      value
    }
    year
  }
}
    `;

/**
 * __usePaymentDatesQuery__
 *
 * To run a query within a React component, call `usePaymentDatesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentDatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentDatesQuery({
 *   variables: {
 *   },
 * });
 */
export function usePaymentDatesQuery(baseOptions?: Apollo.QueryHookOptions<PaymentDatesQuery, PaymentDatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaymentDatesQuery, PaymentDatesQueryVariables>(PaymentDatesDocument, options);
      }
export function usePaymentDatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaymentDatesQuery, PaymentDatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaymentDatesQuery, PaymentDatesQueryVariables>(PaymentDatesDocument, options);
        }
export type PaymentDatesQueryHookResult = ReturnType<typeof usePaymentDatesQuery>;
export type PaymentDatesLazyQueryHookResult = ReturnType<typeof usePaymentDatesLazyQuery>;
export type PaymentDatesQueryResult = Apollo.QueryResult<PaymentDatesQuery, PaymentDatesQueryVariables>;
export const ReviewDocument = gql`
    query Review($reviewId: ID!) {
  review(reviewId: $reviewId) {
    ...Review
    beachBar {
      id
      name
      formattedLocation
    }
  }
}
    ${ReviewFragmentDoc}`;

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
export const SearchDocument = gql`
    query Search($inputId: ID, $inputValue: String, $availability: SearchInput, $searchId: ID, $filterIds: [String!], $sortId: ID) {
  search(
    inputId: $inputId
    inputValue: $inputValue
    availability: $availability
    searchId: $searchId
    filterIds: $filterIds
    sortId: $sortId
  ) {
    results {
      beachBar {
        ...SearchBeachBar
      }
      availability {
        hasAvailability
        hasCapacity
      }
    }
    search {
      id
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
 *      inputValue: // value for 'inputValue'
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
      formattedLocation
    }
    search {
      id
      searchDate
      searchAdults
      searchChildren
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
export const UserReviewsDocument = gql`
    query UserReviews {
  userReviews {
    id
    ratingValue
    positiveComment
    negativeComment
    review
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
    answer {
      id
      body
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

/**
 * __useUserReviewsQuery__
 *
 * To run a query within a React component, call `useUserReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserReviewsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserReviewsQuery(baseOptions?: Apollo.QueryHookOptions<UserReviewsQuery, UserReviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserReviewsQuery, UserReviewsQueryVariables>(UserReviewsDocument, options);
      }
export function useUserReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserReviewsQuery, UserReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserReviewsQuery, UserReviewsQueryVariables>(UserReviewsDocument, options);
        }
export type UserReviewsQueryHookResult = ReturnType<typeof useUserReviewsQuery>;
export type UserReviewsLazyQueryHookResult = ReturnType<typeof useUserReviewsLazyQuery>;
export type UserReviewsQueryResult = Apollo.QueryResult<UserReviewsQuery, UserReviewsQueryVariables>;
export const UserSearchesDocument = gql`
    query UserSearches($limit: Int) {
  userSearches(limit: $limit) {
    id
    searchDate
    searchAdults
    searchChildren
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
    ...SearchBeachBar
  }
}
    ${SearchBeachBarFragmentDoc}`;

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