import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  URL: any;
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

/** Represents an entry fee for a #beach_bar */
export type BeachBarEntryFee = {
  readonly __typename?: 'BeachBarEntryFee';
  readonly id: Scalars['ID'];
  readonly fee: Scalars['Float'];
  /** The date this entry fee is applicable for */
  readonly date: Scalars['Date'];
  /** The #beach_bar this fee is added (assigned) to */
  readonly beachBar: BeachBar;
};

/** Info to be returned when an entry fee is added to a #beach_bar */
export type AddBeachBarEntryFee = {
  readonly __typename?: 'AddBeachBarEntryFee';
  /** The fees that are being added & its details */
  readonly fees: ReadonlyArray<BeachBarEntryFee>;
  /** A boolean that indicates if the fees have been successfully being added to a #beach_bar */
  readonly added: Scalars['Boolean'];
};

export type AddBeachBarEntryFeeResult = AddBeachBarEntryFee | Error;

/** Info to be returned when the details of #beach_bar entry fee, are updated */
export type UpdateBeachBarEntryFee = {
  readonly __typename?: 'UpdateBeachBarEntryFee';
  /** The fees being updated */
  readonly fees: ReadonlyArray<BeachBarEntryFee>;
  /** A boolean that indicates if the fee details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateBeachBarEntryFeeResult = UpdateBeachBarEntryFee | Error;

/** Represents a #beach_bar's image (URL value) */
export type BeachBarImgUrl = {
  readonly __typename?: 'BeachBarImgUrl';
  readonly id: Scalars['ID'];
  readonly imgUrl: Scalars['URL'];
  /** A short description about what the image represents. The characters of the description should not exceed the number 175 */
  readonly description: Maybe<Scalars['String']>;
  readonly beachBar: BeachBar;
};

/** Info to be returned when an image (URL) is added to a #beach_bar */
export type AddBeachBarImgUrl = {
  readonly __typename?: 'AddBeachBarImgUrl';
  /** The image that is added */
  readonly imgUrl: BeachBarImgUrl;
  /** Indicates if the image (URL) has been successfully been added to the #beach_bar */
  readonly added: Scalars['Boolean'];
};

export type AddBeachBarImgUrlResult = AddBeachBarImgUrl | Error;

/** Info to be returned when the details of #beach_bar's image, are updated */
export type UpdateBeachBarImgUrl = {
  readonly __typename?: 'UpdateBeachBarImgUrl';
  /** The image that is updated */
  readonly imgUrl: BeachBarImgUrl;
  /** Indicates if the image details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateBeachBarImgUrlResult = UpdateBeachBarImgUrl | Error;

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

export type AddCouponCodeResult = AddCouponCode | Error;

/** Info to be returned when a coupon code details are updated */
export type UpdateCouponCode = {
  readonly __typename?: 'UpdateCouponCode';
  /** The coupon code that is updated */
  readonly couponCode: CouponCode;
  /** Indicates if the coupon code has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateCouponCodeResult = UpdateCouponCode | Delete | Error;

/** Info to be returned when an offer campaign is added to a or some #beach_bar's product(s) */
export type AddOfferCampaign = {
  readonly __typename?: 'AddOfferCampaign';
  /** The offer campaign that is added */
  readonly offerCampaign: OfferCampaign;
  /** Indicates if the offer campaign has been successfully added */
  readonly added: Scalars['Boolean'];
};

export type AddOfferCampaignResult = AddOfferCampaign | Error;

/** Info to be returned when an offer campaign details are updated */
export type UpdateOfferCampaign = {
  readonly __typename?: 'UpdateOfferCampaign';
  /** The offer campaign that is updated */
  readonly offerCampaign: OfferCampaign;
  /** Indicates if the offer campaign details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateOfferCampaignResult = UpdateOfferCampaign | Error;

/** Info to be returned when a new offer code, of an offer campaign, is added (issued) */
export type AddOfferCampaignCode = {
  readonly __typename?: 'AddOfferCampaignCode';
  /** The offer code that is added (issued) */
  readonly offerCode: OfferCampaignCode;
  /** Indicates if the offer code has been successfully added (issued) */
  readonly added: Scalars['Boolean'];
};

export type AddOfferCampaignCodeResult = AddOfferCampaignCode | Error;

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

export type CouponCodeRevealResult = CouponCodeReveal | Error;

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

export type OfferCampaignCodeRevealResult = OfferCampaignCodeReveal | Error;

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

export type AddProductReservationLimitResult = AddProductReservationLimit | Error;

/** Info to be returned when a reservation limit of a #beach_bar's product is updated */
export type UpdateProductReservationLimit = {
  readonly __typename?: 'UpdateProductReservationLimit';
  /** The reservation limit that is updated */
  readonly reservationLimit: ReadonlyArray<ProductReservationLimit>;
  /** A boolean that indicates if the limit details has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateProductReservationLimitResult = UpdateProductReservationLimit | Error;

/** Info to be returned, when checking if a #beach_bar product is available */
export type AvailableProduct = {
  readonly __typename?: 'AvailableProduct';
  /** The hour (time), to check if available */
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
  /** The #beach_bar that provides the product */
  readonly beachBar: BeachBar;
  /** The category of the product */
  readonly category: ProductCategory;
  readonly updatedAt: Scalars['DateTime'];
  readonly deletedAt: Maybe<Scalars['DateTime']>;
};

/** Info to be returned when a product is added to a #beach_bar */
export type AddProduct = {
  readonly __typename?: 'AddProduct';
  /** The product that is added */
  readonly product: Product;
  /** A boolean that indicates if the product has been successfully added to the #beach_bar */
  readonly added: Scalars['Boolean'];
};

export type AddProductResult = AddProduct | Error;

/** Info to be returned when a product of a #beach_bar is updated */
export type UpdateProduct = {
  readonly __typename?: 'UpdateProduct';
  /** The product that is updated */
  readonly product: Product;
  /** A boolean that indicates if the product has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateProductResult = UpdateProduct | Error;

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
  /** The ID value of the menu category */
  readonly id: Scalars['ID'];
  /** The name of the menu category */
  readonly name: Scalars['String'];
};

/** Represents a #beach_bar's restaurant food item (product) in its menu catalog */
export type RestaurantFoodItem = {
  readonly __typename?: 'RestaurantFoodItem';
  /** The ID value of the food item */
  readonly id: Scalars['BigInt'];
  /** The name of the food item */
  readonly name: Scalars['String'];
  /** The price of the food item, in decimal format with precision of five (5) & scale of two (2) */
  readonly price: Scalars['Float'];
  /** The URL value of the food item's picture */
  readonly imgUrl: Maybe<Scalars['String']>;
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

export type AddRestaurantFoodItemResult = AddRestaurantFoodItem | Error;

/** Info to be returned when the food item of #beach_bar restaurant, is updated */
export type UpdateRestaurantFoodItem = {
  readonly __typename?: 'UpdateRestaurantFoodItem';
  /** The food item being updated */
  readonly foodItem: RestaurantFoodItem;
  /** A boolean that indicates if the food item has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateRestaurantFoodItemResult = UpdateRestaurantFoodItem | Error;

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
  readonly foodItems: Maybe<ReadonlyArray<RestaurantFoodItem>>;
};

/** Info to be returned when a restaurant is added to a #beach_bar */
export type AddBeachBarRestaurant = {
  readonly __typename?: 'AddBeachBarRestaurant';
  /** The restaurant that is added & its info */
  readonly restaurant: BeachBarRestaurant;
  /** A boolean that indicates if the restaurant has been successfully being added to the #beach_bar */
  readonly added: Scalars['Boolean'];
};

export type AddBeachBarRestaurantResult = AddBeachBarRestaurant | Error;

/** Info to be returned when the details of #beach_bar restaurant, are updated */
export type UpdateBeachBarRestaurant = {
  readonly __typename?: 'UpdateBeachBarRestaurant';
  /** The restaurant that is updated */
  readonly restaurant: BeachBarRestaurant;
  /** A boolean that indicates if the restaurant details have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateBeachBarRestaurantResult = UpdateBeachBarRestaurant | Error;

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

export type AddReviewAnswerResult = AddReviewAnswer | Error;

/** Info to be returned when the answer of a customer's review is updated */
export type UpdateReviewAnswer = {
  readonly __typename?: 'UpdateReviewAnswer';
  /** The review answer that is updated */
  readonly answer: ReviewAnswer;
  /** A boolean that indicates if the review answer has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateReviewAnswerResult = UpdateReviewAnswer | Error;

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
  /** The #beach_bar of the review */
  readonly beachBar: BeachBar;
  /** The votes os users for this review */
  readonly votes: ReadonlyArray<ReviewVote>;
  /** The answer of the #beach_bar to this review */
  readonly answer: Maybe<ReviewAnswer>;
  /** The customer that submitted the particular review for the #beach_bar */
  readonly customer: Customer;
  /** The type of visit for the user */
  readonly visitType: Maybe<ReviewVisitType>;
  /** The visited month of the customer visited the #beach_bar */
  readonly month: Maybe<MonthTime>;
  /** The last time user's account was updated, in the format of a timestamp */
  readonly updatedAt: Scalars['DateTime'];
  /** The timestamp recorded, when the user's account was created */
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
  /** The ID value of the feature */
  readonly id: Scalars['ID'];
  /** The name of the feature */
  readonly name: Scalars['String'];
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

export type AddBeachBarFeatureResult = AddBeachBarFeature | Error;

/** Info to be returned when the info of a feature of a #beach_bar, are updated */
export type UpdateBeachBarFeature = {
  readonly __typename?: 'UpdateBeachBarFeature';
  /** The feature that will be updated */
  readonly feature: BeachBarFeature;
  /** A boolean that indicates if the feature has been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateBeachBarFeatureResult = UpdateBeachBarFeature | Error;

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
  /** The average rating of all the user reviews for this #beach_bar */
  readonly avgRating: Scalars['Float'];
  readonly thumbnailUrl: Maybe<Scalars['URL']>;
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
  /** Get the location of the #beach_bar in a formatted string */
  readonly formattedLocation: Scalars['String'];
  /** A list with all the payments of a #beach_bar */
  readonly payments: ReadonlyArray<Payment>;
  /** The category (type) of the #beach_bar */
  readonly category: BeachBarCategory;
  /** A list with all the #beach_bar's images (URL values) */
  readonly imgUrls: Maybe<ReadonlyArray<BeachBarImgUrl>>;
  /** A list of all the reviews of the #beach_bar */
  readonly reviews: Maybe<ReadonlyArray<BeachBarReview>>;
  /** A list of all the #beach_bar's features */
  readonly features: ReadonlyArray<Maybe<BeachBarFeature>>;
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
  /** A boolean that indicates if the product has been successfully added to the cart */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when a product of a shopping cart is updated */
export type UpdateCartProduct = {
  readonly __typename?: 'UpdateCartProduct';
  /** The product that is updated */
  readonly product: CartProduct;
  /** A boolean that indicates if the product has been successfully updated */
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
  /** A boolean that indicates if the customer has been successfully added (registered) */
  readonly added: Scalars['Boolean'];
};

/** Info to be returned when a customer details are updated */
export type UpdateCustomer = {
  readonly __typename?: 'UpdateCustomer';
  /** The customer that is updated */
  readonly customer: Customer;
  /** A boolean that indicates if the customer details have been successfully updated */
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
  readonly status: Scalars['String'];
};

/** Represents a component of a #beach_bar product. For example a sunbed. */
export type ProductComponent = {
  readonly __typename?: 'ProductComponent';
  readonly id: Scalars['ID'];
  readonly title: Scalars['String'];
  readonly description: Scalars['String'];
  readonly iconUrl: Scalars['URL'];
};

/** Represents a #beach_bar product & its components */
export type BundleProductComponent = {
  readonly __typename?: 'BundleProductComponent';
  /** The product of the #beach_bar */
  readonly product: Product;
  /** The component of the product */
  readonly component: ProductComponent;
  readonly quantity: Scalars['Int'];
};

/** Represents a #beach_bar's product category */
export type ProductCategory = {
  readonly __typename?: 'ProductCategory';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly underscoredName: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  /** The component of a product */
  readonly productComponents: ReadonlyArray<ProductComponent>;
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
  /** Add an entry fee(s) to a #beach_bar */
  readonly addBeachBarEntryFee: AddBeachBarEntryFeeResult;
  /** Update an or many entry fee(s) of a #beach_bar */
  readonly updateBeachBarEntryFee: UpdateBeachBarEntryFeeResult;
  /** Delete (remove) an or some entry fees from a #beach_bar */
  readonly deleteBeachBarEntryFee: DeleteResult;
  /** Add an image (URL) to a #beach_bar */
  readonly addBeachBarImgUrl: AddBeachBarImgUrlResult;
  /** Update the details of a #beach_bar's image */
  readonly updateBeachBaImgUrl: UpdateBeachBarImgUrlResult;
  /** Delete an image (URL) from a #beach_bar */
  readonly deleteBeachBarImgUrl: DeleteResult;
  /** Add (assign) a location to a #beach_bar */
  readonly addBeachBarLocation: AddBeachBarLocation;
  /** Update the location details of a #beach_bar */
  readonly updateBeachBarLocation: UpdateBeachBarLocation;
  /** Add (register) a new #beach_bar to the platform */
  readonly addBeachBar: AddBeachBar;
  /** Update a #beach_bar details */
  readonly updateBeachBar: UpdateBeachBar;
  /** Delete (remove) a #beach_bar from the platform */
  readonly deleteBeachBar: DeleteResult;
  /** Add a product to a #beach_bar */
  readonly addProduct: AddProductResult;
  /** Update a #beach_bar's product info */
  readonly updateProduct: UpdateProductResult;
  /** Delete (remove) a product from a #beach_bar */
  readonly deleteProduct: DeleteResult;
  /** Restore a (soft) deleted #beach_bar product */
  readonly restoreBeachBarProduct: UpdateProductResult;
  /** Add a coupon code */
  readonly addCouponCode: AddCouponCodeResult;
  /** Update a coupon code */
  readonly updateCouponCode: UpdateCouponCodeResult;
  readonly deleteCouponCode: DeleteResult;
  /** Add an offer campaign to a #beach_bar */
  readonly addOfferCampaign: AddOfferCampaignResult;
  /** Update the details of an offer campaign of a #beach_bar */
  readonly updateOfferCampaign: UpdateOfferCampaignResult;
  /** Delete an offer campaign of a #beach_bar */
  readonly deleteOfferCampaign: DeleteResult;
  /** Add (issue) a new offer code */
  readonly addOfferCampaignCode: AddOfferCampaignCodeResult;
  /** Delete (invalidate) an offer code of an offer campaign */
  readonly deleteOfferCode: DeleteResult;
  /** Add a reservation limit to a #beach_bar product */
  readonly addProductReservationLimit: AddProductReservationLimitResult;
  /** Update a #beach_bar's product reservation limit */
  readonly updateProductReservationLimit: UpdateProductReservationLimitResult;
  /** Delete a or some reservation limit(s) from a #beach_bar's product */
  readonly deleteProductReservationLimit: DeleteResult;
  /** Add a food item to a #beach_bar restaurant */
  readonly addRestaurantFoodItem: AddRestaurantFoodItemResult;
  /** Update a #beach_bar's restaurant food item details */
  readonly updateRestaurantFoodItem: UpdateRestaurantFoodItemResult;
  /** Delete (remove) a food item from a #beach_bar's restaurant */
  readonly deleteRestaurantFoodItem: DeleteResult;
  /** Add a restaurant of a #beach_bar */
  readonly addBeachBarRestaurant: AddBeachBarRestaurantResult;
  /** Update the restaurant details of a #beach_bar */
  readonly updateBeachBarRestaurant: UpdateBeachBarRestaurantResult;
  /** Delete (remove) a restaurant from a #beach_bar */
  readonly deleteBeachBarRestaurant: DeleteResult;
  /** Upvote or downvote a customer's review on a #beach_bar */
  readonly updateReviewVote: UpdateBeachBarReview;
  /** Add a reply to a #beach_bar's review, by its owner */
  readonly addReviewAnswer: AddReviewAnswerResult;
  /** Update the body of a #beach_bar's review reply */
  readonly updateReviewAnswer: UpdateReviewAnswerResult;
  /** Delete (remove) a reply from a #beach_bar's review */
  readonly deleteReviewAnswer: DeleteResult;
  /** Add a customer's review on a #beach_bar */
  readonly addReview: AddBeachBarReview;
  /** Update a customer's review on a #beach_bar */
  readonly updateReview: UpdateBeachBarReview;
  /** Delete a customer's review on a #beach_bar */
  readonly deleteReview: Delete;
  /** Add (assign) a feature to a #beach_bar */
  readonly addBeachBarFeature: AddBeachBarFeatureResult;
  /** Update a feature of a #beach_bar */
  readonly updateBeachBarFeature: UpdateBeachBarFeatureResult;
  /** Delete (remove) a feature (service) from a #beach_bar */
  readonly deleteBeachBarFeature: DeleteResult;
  /** Delete a cart after a transaction. This mutation is also called if the user is not authenticated & closes the browser tab */
  readonly deleteCart: DeleteResult;
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
  readonly addBeachBarOwner: AddBeachBarOwnerResult;
  /** Update a #beach_bar's owner info */
  readonly updateBeachBarOwner: UpdateBeachBarOwnerResult;
  /** Delete (remove) an owner from a #beach_bar */
  readonly deleteBeachBarOwner: DeleteResult;
  /** Create (make) a payment for a customer's shopping cart */
  readonly checkout: AddPaymentResult;
  /** Refund a payment */
  readonly refundPayment: Delete;
  /** Update a previous user's search */
  readonly updateSearch: Maybe<UserSearch>;
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
export type MutationAddBeachBarEntryFeeArgs = {
  beachBarId: Scalars['Int'];
  fee: Scalars['Float'];
  dates: ReadonlyArray<Scalars['Date']>;
};


/** Mutation */
export type MutationUpdateBeachBarEntryFeeArgs = {
  entryFeeIds: ReadonlyArray<Scalars['ID']>;
  fee: Maybe<Scalars['Float']>;
};


/** Mutation */
export type MutationDeleteBeachBarEntryFeeArgs = {
  entryFeeIds: ReadonlyArray<Scalars['ID']>;
};


/** Mutation */
export type MutationAddBeachBarImgUrlArgs = {
  beachBarId: Scalars['Int'];
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
  beachBarId: Scalars['Int'];
};


/** Mutation */
export type MutationAddProductArgs = {
  beachBarId: Scalars['Int'];
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  categoryId: Scalars['Int'];
  price: Scalars['Float'];
  isActive?: Maybe<Scalars['Boolean']>;
  maxPeople: Scalars['Int'];
  imgUrl: Scalars['URL'];
};


/** Mutation */
export type MutationUpdateProductArgs = {
  productId: Scalars['Int'];
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  categoryId: Maybe<Scalars['Int']>;
  price: Maybe<Scalars['Float']>;
  isActive: Maybe<Scalars['Boolean']>;
  maxPeople: Scalars['Int'];
  imgUrl: Maybe<Scalars['URL']>;
};


/** Mutation */
export type MutationDeleteProductArgs = {
  productId: Scalars['Int'];
};


/** Mutation */
export type MutationRestoreBeachBarProductArgs = {
  productId: Scalars['Int'];
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
  productIds: ReadonlyArray<Scalars['Int']>;
  title: Scalars['String'];
  discountPercentage: Scalars['Float'];
  validUntil: Scalars['DateTime'];
  isActive?: Scalars['Boolean'];
};


/** Mutation */
export type MutationUpdateOfferCampaignArgs = {
  offerCampaignId: Scalars['ID'];
  productIds: ReadonlyArray<Maybe<Scalars['Int']>>;
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
  productId: Scalars['Int'];
  limit: Scalars['Int'];
  dates: ReadonlyArray<Scalars['Date']>;
  startTimeId: Scalars['Int'];
  endTimeId: Scalars['Int'];
};


/** Mutation */
export type MutationUpdateProductReservationLimitArgs = {
  reservationLimitIds: ReadonlyArray<Scalars['BigInt']>;
  limit: Maybe<Scalars['Int']>;
  startTimeId: Maybe<Scalars['Int']>;
  endTimeId: Maybe<Scalars['Int']>;
};


/** Mutation */
export type MutationDeleteProductReservationLimitArgs = {
  reservationLimitIds: ReadonlyArray<Scalars['BigInt']>;
};


/** Mutation */
export type MutationAddRestaurantFoodItemArgs = {
  restaurantId: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
  menuCategoryId: Scalars['Int'];
  imgUrl: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationUpdateRestaurantFoodItemArgs = {
  foodItemId: Scalars['BigInt'];
  name: Maybe<Scalars['String']>;
  price: Maybe<Scalars['Float']>;
  menuCategoryId: Maybe<Scalars['Int']>;
  imgUrl: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationDeleteRestaurantFoodItemArgs = {
  foodItemId: Scalars['BigInt'];
};


/** Mutation */
export type MutationAddBeachBarRestaurantArgs = {
  beachBarId: Scalars['Int'];
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationUpdateBeachBarRestaurantArgs = {
  restaurantId: Scalars['Int'];
  name: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  isActive: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationDeleteBeachBarRestaurantArgs = {
  restaurantId: Scalars['Int'];
};


/** Mutation */
export type MutationUpdateReviewVoteArgs = {
  reviewId: Scalars['ID'];
  upvote: Maybe<Scalars['Boolean']>;
  downvote: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationAddReviewAnswerArgs = {
  reviewId: Scalars['BigInt'];
  body: Scalars['String'];
};


/** Mutation */
export type MutationUpdateReviewAnswerArgs = {
  answerId: Scalars['BigInt'];
  body: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationDeleteReviewAnswerArgs = {
  answerId: Scalars['BigInt'];
};


/** Mutation */
export type MutationAddReviewArgs = {
  beachBarId: Scalars['Int'];
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
  beachBarId: Scalars['Int'];
  featureId: Scalars['Int'];
  quantity?: Scalars['Int'];
  description: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationUpdateBeachBarFeatureArgs = {
  beachBarId: Scalars['Int'];
  featureId: Scalars['Int'];
  quantity: Maybe<Scalars['Int']>;
  description: Maybe<Scalars['String']>;
};


/** Mutation */
export type MutationDeleteBeachBarFeatureArgs = {
  beachBarId: Scalars['Int'];
  featureId: Scalars['Int'];
};


/** Mutation */
export type MutationDeleteCartArgs = {
  cartId: Scalars['ID'];
};


/** Mutation */
export type MutationAddCartProductArgs = {
  cartId: Scalars['ID'];
  productId: Scalars['Int'];
  quantity?: Maybe<Scalars['Int']>;
  timeId: Scalars['Int'];
  date: Maybe<Scalars['Date']>;
};


/** Mutation */
export type MutationUpdateCartProductArgs = {
  cartId: Scalars['ID'];
  productId: Scalars['Int'];
  quantity: Maybe<Scalars['Int']>;
};


/** Mutation */
export type MutationDeleteCartProductArgs = {
  cartId: Scalars['ID'];
  productId: Scalars['Int'];
};


/** Mutation */
export type MutationAddCustomerPaymentMethodArgs = {
  source: Scalars['String'];
  customerId: Maybe<Scalars['ID']>;
  cardholderName: Scalars['String'];
  isDefault?: Maybe<Scalars['Boolean']>;
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
  beachBarId: Scalars['Int'];
  userId: Maybe<Scalars['Int']>;
  isPrimary?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationUpdateBeachBarOwnerArgs = {
  beachBarId: Scalars['Int'];
  userId: Maybe<Scalars['Int']>;
  publicInfo: Maybe<Scalars['Boolean']>;
  isPrimary?: Maybe<Scalars['Boolean']>;
};


/** Mutation */
export type MutationDeleteBeachBarOwnerArgs = {
  beachBarId: Scalars['Int'];
  userId: Maybe<Scalars['Int']>;
};


/** Mutation */
export type MutationCheckoutArgs = {
  cartId: Scalars['ID'];
  cardId: Scalars['ID'];
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
  beachBarId: Scalars['ID'];
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

export type AddBeachBarOwnerResult = AddBeachBarOwner | Error;

/** Info to be returned when the info of a #beach_bar owner, are updated */
export type UpdateBeachBarOwner = {
  readonly __typename?: 'UpdateBeachBarOwner';
  /** The owner being added & its info */
  readonly owner: BeachBarOwner;
  /** A boolean that indicates if the owner info have been successfully updated */
  readonly updated: Scalars['Boolean'];
};

export type UpdateBeachBarOwnerResult = UpdateBeachBarOwner | Error;

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
  /** Get a list with all entry fees of a #beach_bar */
  readonly getAllBeachBarEntryFees: ReadonlyArray<BeachBarEntryFee>;
  /** Get a list with all the images (URL values) of a #beach_bar */
  readonly getBeachBarImgUrl: Maybe<ReadonlyArray<BeachBarImgUrl>>;
  /** Get the product offer or coupon, based on its referral code */
  readonly getVoucherCode: Maybe<VoucherCodeQueryResult>;
  /** Get a list with all the offer campaigns of a #beach_bar */
  readonly getBeachBarOfferCampaigns: Maybe<ReadonlyArray<OfferCampaign>>;
  /** Get a coupon's code details & its referral code */
  readonly revealCouponCode: CouponCodeRevealResult;
  /** Get an offer's campaign code details + its referral code */
  readonly revealOfferCampaignCode: OfferCampaignCodeRevealResult;
  /** Get all products of a #beach_bar */
  readonly getBeachBarProducts: Maybe<ReadonlyArray<Product>>;
  /** Retrieve (get) a list with all the available hour times of a product */
  readonly getProductAvailabilityHours: Maybe<ReadonlyArray<ProductAvailabilityHour>>;
  readonly getProductAvailabilityQuantity: Maybe<Scalars['Int']>;
  /** Get a list with all the hours this product has reservation limits */
  readonly hasProductReservationLimit: ReadonlyArray<AvailableProduct>;
  /** Get the detail info of a #beach_bar */
  readonly getBeachBar: Maybe<BeachBar>;
  /** Check a #beach_bar's availability */
  readonly checkBeachBarAvailability: Maybe<BeachBarAvailability>;
  /** A list with all the available #beach_bars */
  readonly getAllBeachBars: ReadonlyArray<BeachBar>;
  /** A list with all the #beach_bars, related to a user or are top selections */
  readonly getPersonalizedBeachBars: ReadonlyArray<BeachBar>;
  /** Verify a user's payment to submit review */
  readonly verifyUserPaymentReview: Scalars['Boolean'];
  /** Get a list with all the months in a review, by the product purchase */
  readonly getPaymentProductsMonth: Maybe<ReadonlyArray<MonthTime>>;
  /** Get a list of all the reviews of an authenticated user */
  readonly userReviews: ReadonlyArray<BeachBarReview>;
  /** Get the details of a a review of an authenticated user */
  readonly review: BeachBarReview;
  readonly getCartEntryFees: Maybe<Scalars['Float']>;
  readonly verifyZeroCartTotal: Maybe<Scalars['Boolean']>;
  /** Get the latest cart of an authenticated user or create one */
  readonly getCart: Maybe<Cart>;
  /** Get a list with all the payments methods (credit / debit cards) of the current authenticated user */
  readonly getCustomerPaymentMethods: Maybe<ReadonlyArray<Card>>;
  /** Get or create a customer, depending on current authenticated or not user */
  readonly getOrCreateCustomer: AddCustomer;
  /** Returns the URL where the #beach_bar (owner) will be redirected to authorize and register with Stripe, for its connect account */
  readonly getStripeConnectOAuthUrl: Maybe<Scalars['URL']>;
  /** Returns the URL where the user will be redirected to login with Google */
  readonly getGoogleOAuthUrl: Scalars['URL'];
  /** Returns the URL where the user will be redirected to login with Facebook */
  readonly getFacebookOAuthUrl: Scalars['URL'];
  /** Returns the URL where the user will be redirected to login with Instagram */
  readonly getInstagramOAuthUrl: Scalars['URL'];
  /** Get a list of payments for a specific / latest month of an authenticated user */
  readonly getPayments: Maybe<ReadonlyArray<PaymentVisits>>;
  /** Get the details of a specific payment / trip */
  readonly payment: Payment;
  /** Get the amount of refuned of a specific payment / trip */
  readonly paymentRefundAmount: Scalars['Float'];
  /** Get a list with the months and years of the cart products in all the payments of an authenticated user */
  readonly getPaymentsDates: ReadonlyArray<PaymentVisitsDates>;
  /** Returns a list of formatted search input values */
  readonly searchInputValues: ReadonlyArray<FormattedSearchInputValue>;
  /** Get a list with a user's latest searches */
  readonly getLatestUserSearches: ReadonlyArray<UserSearch>;
  /** Search for available #beach_bars */
  readonly search: Maybe<Search>;
  /** Returns a list of user's recorded / saved history */
  readonly userHistory: ReadonlyArray<UserHistoryExtended>;
  /** Get a user's favourite #beach_bars list */
  readonly favouriteBeachBars: ReadonlyArray<UserFavoriteBar>;
  /** Returns current authenticated user */
  readonly me: Maybe<User>;
};


/** Query */
export type QueryGetAllBeachBarEntryFeesArgs = {
  beachBarId: Scalars['Int'];
  moreThanOrEqualToToday?: Maybe<Scalars['Boolean']>;
};


/** Query */
export type QueryGetBeachBarImgUrlArgs = {
  beachBarId: Scalars['Int'];
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
export type QueryGetBeachBarProductsArgs = {
  beachBarId: Scalars['Int'];
  isActive?: Maybe<Scalars['Boolean']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
};


/** Query */
export type QueryGetProductAvailabilityHoursArgs = {
  productId: Scalars['Int'];
  date: Scalars['Date'];
};


/** Query */
export type QueryGetProductAvailabilityQuantityArgs = {
  productId: Scalars['Int'];
  date: Scalars['Date'];
  timeId: Scalars['Int'];
};


/** Query */
export type QueryHasProductReservationLimitArgs = {
  productId: Scalars['Int'];
  date: Maybe<Scalars['Date']>;
};


/** Query */
export type QueryGetBeachBarArgs = {
  beachBarId: Scalars['Int'];
  userVisit?: Maybe<Scalars['Boolean']>;
};


/** Query */
export type QueryCheckBeachBarAvailabilityArgs = {
  beachBarId: Scalars['Int'];
  availability: Maybe<SearchInput>;
};


/** Query */
export type QueryVerifyUserPaymentReviewArgs = {
  beachBarId: Scalars['Int'];
  refCode: Maybe<Scalars['String']>;
};


/** Query */
export type QueryGetPaymentProductsMonthArgs = {
  beachBarId: Scalars['Int'];
  refCode: Maybe<Scalars['String']>;
};


/** Query */
export type QueryReviewArgs = {
  reviewId: Scalars['ID'];
};


/** Query */
export type QueryGetCartEntryFeesArgs = {
  cartId: Maybe<Scalars['ID']>;
};


/** Query */
export type QueryVerifyZeroCartTotalArgs = {
  cartId: Scalars['ID'];
};


/** Query */
export type QueryGetCartArgs = {
  cartId: Maybe<Scalars['ID']>;
};


/** Query */
export type QueryGetOrCreateCustomerArgs = {
  email: Maybe<Scalars['Email']>;
  phoneNumber: Maybe<Scalars['String']>;
  countryAlpha2Code: Maybe<Scalars['String']>;
};


/** Query */
export type QueryGetPaymentsArgs = {
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
  /** The input value that the user searched for */
  readonly sort: Maybe<SearchSort>;
  /** A sort filter used by the user, in its search */
  readonly filters: Maybe<ReadonlyArray<SearchSort>>;
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

/** Represents a formatted search input value */
export type FormattedSearchInputValue = {
  readonly __typename?: 'FormattedSearchInputValue';
  /** The search input value */
  readonly inputValue: SearchInputValue;
  /** The URL value of the #beach_bar thumbnail image to show, at search "dropdown results" */
  readonly beachBarThumbnailUrl: Maybe<Scalars['URL']>;
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
  /** User's account info */
  readonly account: UserAccount;
  /** A user's review on a #beach_bar */
  readonly reviews: Maybe<ReadonlyArray<BeachBarReview>>;
  /** A list with all the user's favorite #beach_bars */
  readonly favoriteBars: Maybe<ReadonlyArray<UserFavoriteBar>>;
  /** A list of all the votes of the user */
  readonly reviewVotes: Maybe<ReadonlyArray<ReviewVote>>;
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

export type AddCustomerPaymentMethodMutationVariables = Exact<{
  token: Scalars['String'];
  customerId: Scalars['ID'];
  cardholderName: Scalars['String'];
  isDefault?: Maybe<Scalars['Boolean']>;
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

export type DeleteCartProductMutationVariables = Exact<{
  cartId: Scalars['ID'];
  productId: Scalars['Int'];
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
  cartId: Scalars['ID'];
  productId: Scalars['Int'];
  quantity: Maybe<Scalars['Int']>;
}>;


export type UpdateCartProductMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly updateCartProduct: (
    { readonly __typename?: 'UpdateCartProduct' }
    & Pick<UpdateCartProduct, 'updated'>
    & { readonly product: (
      { readonly __typename?: 'CartProduct' }
      & Pick<CartProduct, 'quantity'>
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
  beachBarId: Scalars['ID'];
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

export type FavouriteBeachBarsQueryVariables = Exact<{ [key: string]: never; }>;


export type FavouriteBeachBarsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly favouriteBeachBars: ReadonlyArray<(
    { readonly __typename?: 'UserFavoriteBar' }
    & { readonly beachBar: (
      { readonly __typename?: 'BeachBar' }
      & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl' | 'formattedLocation'>
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

export type GetCartQueryVariables = Exact<{
  cartId: Maybe<Scalars['ID']>;
}>;


export type GetCartQuery = (
  { readonly __typename?: 'Query' }
  & { readonly getCart: Maybe<(
    { readonly __typename?: 'Cart' }
    & Pick<Cart, 'id' | 'total'>
    & { readonly products: Maybe<ReadonlyArray<(
      { readonly __typename?: 'CartProduct' }
      & Pick<CartProduct, 'quantity' | 'date' | 'timestamp'>
      & { readonly time: (
        { readonly __typename?: 'HourTime' }
        & Pick<HourTime, 'id' | 'value'>
      ), readonly product: (
        { readonly __typename?: 'Product' }
        & Pick<Product, 'id' | 'name' | 'price' | 'imgUrl'>
        & { readonly beachBar: (
          { readonly __typename?: 'BeachBar' }
          & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl'>
          & { readonly defaultCurrency: (
            { readonly __typename?: 'Currency' }
            & Pick<Currency, 'symbol'>
          ) }
        ) }
      ) }
    )>> }
  )> }
);

export type GetCustomerPaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerPaymentMethodsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly getCustomerPaymentMethods: Maybe<ReadonlyArray<(
    { readonly __typename?: 'Card' }
    & Pick<Card, 'id' | 'expMonth' | 'expYear' | 'last4' | 'cardholderName' | 'isDefault'>
    & { readonly brand: Maybe<(
      { readonly __typename?: 'CardBrand' }
      & Pick<CardBrand, 'id' | 'name'>
    )> }
  )>> }
);

export type GetLatestUserSearchesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLatestUserSearchesQuery = (
  { readonly __typename?: 'Query' }
  & { readonly getLatestUserSearches: ReadonlyArray<(
    { readonly __typename?: 'UserSearch' }
    & Pick<UserSearch, 'id' | 'searchDate' | 'searchAdults' | 'searchChildren'>
    & { readonly inputValue: (
      { readonly __typename?: 'SearchInputValue' }
      & { readonly city: Maybe<(
        { readonly __typename?: 'City' }
        & Pick<City, 'name'>
      )>, readonly region: Maybe<(
        { readonly __typename?: 'Region' }
        & Pick<Region, 'name'>
      )>, readonly beachBar: Maybe<(
        { readonly __typename?: 'BeachBar' }
        & Pick<BeachBar, 'name' | 'thumbnailUrl'>
      )> }
    ) }
  )> }
);

export type GetOrCreateCustomerQueryVariables = Exact<{
  email: Maybe<Scalars['Email']>;
  phoneNumber: Maybe<Scalars['String']>;
  countryAlpha2Code: Maybe<Scalars['String']>;
}>;


export type GetOrCreateCustomerQuery = (
  { readonly __typename?: 'Query' }
  & { readonly getOrCreateCustomer: (
    { readonly __typename?: 'AddCustomer' }
    & Pick<AddCustomer, 'added'>
    & { readonly customer: (
      { readonly __typename?: 'Customer' }
      & Pick<Customer, 'id'>
      & { readonly user: Maybe<(
        { readonly __typename?: 'User' }
        & Pick<User, 'id'>
      )> }
    ) }
  ) }
);

export type GetPaymentsQueryVariables = Exact<{
  monthId: Maybe<Scalars['ID']>;
  year: Maybe<Scalars['Int']>;
}>;


export type GetPaymentsQuery = (
  { readonly __typename?: 'Query' }
  & { readonly getPayments: Maybe<ReadonlyArray<(
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
  )>> }
);

export type GetPaymentsDatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentsDatesQuery = (
  { readonly __typename?: 'Query' }
  & { readonly getPaymentsDates: ReadonlyArray<(
    { readonly __typename?: 'PaymentVisitsDates' }
    & Pick<PaymentVisitsDates, 'year'>
    & { readonly month: (
      { readonly __typename?: 'MonthTime' }
      & Pick<MonthTime, 'id' | 'value'>
    ) }
  )> }
);

export type GetPersonalizedBeachBarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPersonalizedBeachBarsQuery = (
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
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { readonly __typename?: 'Query' }
  & { readonly me: Maybe<(
    { readonly __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>
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
    ), readonly reviewVotes: Maybe<ReadonlyArray<(
      { readonly __typename?: 'ReviewVote' }
      & Pick<ReviewVote, 'id'>
      & { readonly type: (
        { readonly __typename?: 'ReviewVoteType' }
        & Pick<ReviewVoteType, 'id' | 'value'>
      ), readonly review: (
        { readonly __typename?: 'BeachBarReview' }
        & Pick<BeachBarReview, 'id'>
      ) }
    )>> }
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
        & Pick<CartProduct, 'quantity' | 'date'>
        & { readonly time: (
          { readonly __typename?: 'HourTime' }
          & Pick<HourTime, 'id' | 'value'>
        ), readonly product: (
          { readonly __typename?: 'Product' }
          & Pick<Product, 'id' | 'name' | 'price' | 'imgUrl'>
          & { readonly beachBar: (
            { readonly __typename?: 'BeachBar' }
            & Pick<BeachBar, 'id' | 'name' | 'formattedLocation'>
            & { readonly defaultCurrency: (
              { readonly __typename?: 'Currency' }
              & Pick<Currency, 'symbol'>
            ) }
          ) }
        ) }
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
      & Pick<PaymentStatus, 'id' | 'status'>
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

export type ReviewQueryVariables = Exact<{
  reviewId: Scalars['ID'];
}>;


export type ReviewQuery = (
  { readonly __typename?: 'Query' }
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
  & { readonly search: Maybe<(
    { readonly __typename?: 'Search' }
    & { readonly results: ReadonlyArray<(
      { readonly __typename?: 'SearchResultType' }
      & { readonly beachBar: (
        { readonly __typename?: 'BeachBar' }
        & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl'>
      ), readonly availability: (
        { readonly __typename?: 'BeachBarAvailability' }
        & Pick<BeachBarAvailability, 'hasAvailability' | 'hasCapacity'>
      ) }
    )> }
  )> }
);

export type SearchInputValuesQueryVariables = Exact<{ [key: string]: never; }>;


export type SearchInputValuesQuery = (
  { readonly __typename?: 'Query' }
  & { readonly searchInputValues: ReadonlyArray<(
    { readonly __typename?: 'FormattedSearchInputValue' }
    & { readonly inputValue: (
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
    ) }
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
    & Pick<BeachBar, 'id' | 'name' | 'thumbnailUrl' | 'description' | 'avgRating'>
    & { readonly payments: ReadonlyArray<(
      { readonly __typename?: 'Payment' }
      & Pick<Payment, 'id'>
    )>, readonly location: (
      { readonly __typename?: 'BeachBarLocation' }
      & Pick<BeachBarLocation, 'longitude' | 'latitude'>
    ) }
  )> }
);

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
export const AddCustomerPaymentMethodDocument = gql`
    mutation AddCustomerPaymentMethod($token: String!, $customerId: ID!, $cardholderName: String!, $isDefault: Boolean = false) {
  addCustomerPaymentMethod(
    source: $token
    customerId: $customerId
    cardholderName: $cardholderName
    isDefault: $isDefault
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
 *   },
 * });
 */
export function useAddCustomerPaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<AddCustomerPaymentMethodMutation, AddCustomerPaymentMethodMutationVariables>) {
        return Apollo.useMutation<AddCustomerPaymentMethodMutation, AddCustomerPaymentMethodMutationVariables>(AddCustomerPaymentMethodDocument, baseOptions);
      }
export type AddCustomerPaymentMethodMutationHookResult = ReturnType<typeof useAddCustomerPaymentMethodMutation>;
export type AddCustomerPaymentMethodMutationResult = Apollo.MutationResult<AddCustomerPaymentMethodMutation>;
export type AddCustomerPaymentMethodMutationOptions = Apollo.BaseMutationOptions<AddCustomerPaymentMethodMutation, AddCustomerPaymentMethodMutationVariables>;
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
        return Apollo.useMutation<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>(ChangeUserPasswordDocument, baseOptions);
      }
export type ChangeUserPasswordMutationHookResult = ReturnType<typeof useChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationResult = Apollo.MutationResult<ChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationOptions = Apollo.BaseMutationOptions<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;
export const DeleteCartProductDocument = gql`
    mutation DeleteCartProduct($cartId: ID!, $productId: Int!) {
  deleteCartProduct(cartId: $cartId, productId: $productId) {
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
 *      cartId: // value for 'cartId'
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useDeleteCartProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCartProductMutation, DeleteCartProductMutationVariables>) {
        return Apollo.useMutation<DeleteCartProductMutation, DeleteCartProductMutationVariables>(DeleteCartProductDocument, baseOptions);
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
        return Apollo.useMutation<DeleteCustomerPaymentMethodMutation, DeleteCustomerPaymentMethodMutationVariables>(DeleteCustomerPaymentMethodDocument, baseOptions);
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
        return Apollo.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, baseOptions);
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
        return Apollo.useMutation<HelloMutation, HelloMutationVariables>(HelloDocument, baseOptions);
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
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
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
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
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
        return Apollo.useMutation<RefundPaymentMutation, RefundPaymentMutationVariables>(RefundPaymentDocument, baseOptions);
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
        return Apollo.useMutation<SendForgotPasswordLinkMutation, SendForgotPasswordLinkMutationVariables>(SendForgotPasswordLinkDocument, baseOptions);
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
        return Apollo.useMutation<SignS3Mutation, SignS3MutationVariables>(SignS3Document, baseOptions);
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
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, baseOptions);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const UpdateCartProductDocument = gql`
    mutation UpdateCartProduct($cartId: ID!, $productId: Int!, $quantity: Int) {
  updateCartProduct(cartId: $cartId, productId: $productId, quantity: $quantity) {
    updated
    product {
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
 *      cartId: // value for 'cartId'
 *      productId: // value for 'productId'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useUpdateCartProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCartProductMutation, UpdateCartProductMutationVariables>) {
        return Apollo.useMutation<UpdateCartProductMutation, UpdateCartProductMutationVariables>(UpdateCartProductDocument, baseOptions);
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
        return Apollo.useMutation<UpdateCustomerPaymentMethodMutation, UpdateCustomerPaymentMethodMutationVariables>(UpdateCustomerPaymentMethodDocument, baseOptions);
      }
export type UpdateCustomerPaymentMethodMutationHookResult = ReturnType<typeof useUpdateCustomerPaymentMethodMutation>;
export type UpdateCustomerPaymentMethodMutationResult = Apollo.MutationResult<UpdateCustomerPaymentMethodMutation>;
export type UpdateCustomerPaymentMethodMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerPaymentMethodMutation, UpdateCustomerPaymentMethodMutationVariables>;
export const UpdateFavouriteBeachBarDocument = gql`
    mutation UpdateFavouriteBeachBar($beachBarId: ID!) {
  updateFavouriteBeachBar(beachBarId: $beachBarId) {
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
 *      beachBarId: // value for 'beachBarId'
 *   },
 * });
 */
export function useUpdateFavouriteBeachBarMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFavouriteBeachBarMutation, UpdateFavouriteBeachBarMutationVariables>) {
        return Apollo.useMutation<UpdateFavouriteBeachBarMutation, UpdateFavouriteBeachBarMutationVariables>(UpdateFavouriteBeachBarDocument, baseOptions);
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
        return Apollo.useMutation<UpdateReviewMutation, UpdateReviewMutationVariables>(UpdateReviewDocument, baseOptions);
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
        return Apollo.useMutation<UpdateReviewVoteMutation, UpdateReviewVoteMutationVariables>(UpdateReviewVoteDocument, baseOptions);
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
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
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
        return Apollo.useMutation<AuthorizeWithFacebookMutation, AuthorizeWithFacebookMutationVariables>(AuthorizeWithFacebookDocument, baseOptions);
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
        return Apollo.useMutation<AuthorizeWithGoogleMutation, AuthorizeWithGoogleMutationVariables>(AuthorizeWithGoogleDocument, baseOptions);
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
        return Apollo.useMutation<AuthorizeWithInstagramMutation, AuthorizeWithInstagramMutationVariables>(AuthorizeWithInstagramDocument, baseOptions);
      }
export type AuthorizeWithInstagramMutationHookResult = ReturnType<typeof useAuthorizeWithInstagramMutation>;
export type AuthorizeWithInstagramMutationResult = Apollo.MutationResult<AuthorizeWithInstagramMutation>;
export type AuthorizeWithInstagramMutationOptions = Apollo.BaseMutationOptions<AuthorizeWithInstagramMutation, AuthorizeWithInstagramMutationVariables>;
export const FavouriteBeachBarsDocument = gql`
    query FavouriteBeachBars {
  favouriteBeachBars {
    beachBar {
      id
      name
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
 *   },
 * });
 */
export function useFavouriteBeachBarsQuery(baseOptions?: Apollo.QueryHookOptions<FavouriteBeachBarsQuery, FavouriteBeachBarsQueryVariables>) {
        return Apollo.useQuery<FavouriteBeachBarsQuery, FavouriteBeachBarsQueryVariables>(FavouriteBeachBarsDocument, baseOptions);
      }
export function useFavouriteBeachBarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FavouriteBeachBarsQuery, FavouriteBeachBarsQueryVariables>) {
          return Apollo.useLazyQuery<FavouriteBeachBarsQuery, FavouriteBeachBarsQueryVariables>(FavouriteBeachBarsDocument, baseOptions);
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
        return Apollo.useQuery<GetUserFavouriteBeachBarsQuery, GetUserFavouriteBeachBarsQueryVariables>(GetUserFavouriteBeachBarsDocument, baseOptions);
      }
export function useGetUserFavouriteBeachBarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserFavouriteBeachBarsQuery, GetUserFavouriteBeachBarsQueryVariables>) {
          return Apollo.useLazyQuery<GetUserFavouriteBeachBarsQuery, GetUserFavouriteBeachBarsQueryVariables>(GetUserFavouriteBeachBarsDocument, baseOptions);
        }
export type GetUserFavouriteBeachBarsQueryHookResult = ReturnType<typeof useGetUserFavouriteBeachBarsQuery>;
export type GetUserFavouriteBeachBarsLazyQueryHookResult = ReturnType<typeof useGetUserFavouriteBeachBarsLazyQuery>;
export type GetUserFavouriteBeachBarsQueryResult = Apollo.QueryResult<GetUserFavouriteBeachBarsQuery, GetUserFavouriteBeachBarsQueryVariables>;
export const GetCartDocument = gql`
    query GetCart($cartId: ID) {
  getCart(cartId: $cartId) {
    id
    total
    products {
      quantity
      date
      time {
        id
        value
      }
      timestamp
      product {
        id
        name
        price
        imgUrl
        beachBar {
          id
          name
          thumbnailUrl
          defaultCurrency {
            symbol
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetCartQuery__
 *
 * To run a query within a React component, call `useGetCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCartQuery({
 *   variables: {
 *      cartId: // value for 'cartId'
 *   },
 * });
 */
export function useGetCartQuery(baseOptions?: Apollo.QueryHookOptions<GetCartQuery, GetCartQueryVariables>) {
        return Apollo.useQuery<GetCartQuery, GetCartQueryVariables>(GetCartDocument, baseOptions);
      }
export function useGetCartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCartQuery, GetCartQueryVariables>) {
          return Apollo.useLazyQuery<GetCartQuery, GetCartQueryVariables>(GetCartDocument, baseOptions);
        }
export type GetCartQueryHookResult = ReturnType<typeof useGetCartQuery>;
export type GetCartLazyQueryHookResult = ReturnType<typeof useGetCartLazyQuery>;
export type GetCartQueryResult = Apollo.QueryResult<GetCartQuery, GetCartQueryVariables>;
export const GetCustomerPaymentMethodsDocument = gql`
    query GetCustomerPaymentMethods {
  getCustomerPaymentMethods {
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

/**
 * __useGetCustomerPaymentMethodsQuery__
 *
 * To run a query within a React component, call `useGetCustomerPaymentMethodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerPaymentMethodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerPaymentMethodsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCustomerPaymentMethodsQuery(baseOptions?: Apollo.QueryHookOptions<GetCustomerPaymentMethodsQuery, GetCustomerPaymentMethodsQueryVariables>) {
        return Apollo.useQuery<GetCustomerPaymentMethodsQuery, GetCustomerPaymentMethodsQueryVariables>(GetCustomerPaymentMethodsDocument, baseOptions);
      }
export function useGetCustomerPaymentMethodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerPaymentMethodsQuery, GetCustomerPaymentMethodsQueryVariables>) {
          return Apollo.useLazyQuery<GetCustomerPaymentMethodsQuery, GetCustomerPaymentMethodsQueryVariables>(GetCustomerPaymentMethodsDocument, baseOptions);
        }
export type GetCustomerPaymentMethodsQueryHookResult = ReturnType<typeof useGetCustomerPaymentMethodsQuery>;
export type GetCustomerPaymentMethodsLazyQueryHookResult = ReturnType<typeof useGetCustomerPaymentMethodsLazyQuery>;
export type GetCustomerPaymentMethodsQueryResult = Apollo.QueryResult<GetCustomerPaymentMethodsQuery, GetCustomerPaymentMethodsQueryVariables>;
export const GetLatestUserSearchesDocument = gql`
    query GetLatestUserSearches {
  getLatestUserSearches {
    id
    searchDate
    searchAdults
    searchChildren
    inputValue {
      city {
        name
      }
      region {
        name
      }
      beachBar {
        name
        thumbnailUrl
      }
    }
  }
}
    `;

/**
 * __useGetLatestUserSearchesQuery__
 *
 * To run a query within a React component, call `useGetLatestUserSearchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestUserSearchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestUserSearchesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLatestUserSearchesQuery(baseOptions?: Apollo.QueryHookOptions<GetLatestUserSearchesQuery, GetLatestUserSearchesQueryVariables>) {
        return Apollo.useQuery<GetLatestUserSearchesQuery, GetLatestUserSearchesQueryVariables>(GetLatestUserSearchesDocument, baseOptions);
      }
export function useGetLatestUserSearchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestUserSearchesQuery, GetLatestUserSearchesQueryVariables>) {
          return Apollo.useLazyQuery<GetLatestUserSearchesQuery, GetLatestUserSearchesQueryVariables>(GetLatestUserSearchesDocument, baseOptions);
        }
export type GetLatestUserSearchesQueryHookResult = ReturnType<typeof useGetLatestUserSearchesQuery>;
export type GetLatestUserSearchesLazyQueryHookResult = ReturnType<typeof useGetLatestUserSearchesLazyQuery>;
export type GetLatestUserSearchesQueryResult = Apollo.QueryResult<GetLatestUserSearchesQuery, GetLatestUserSearchesQueryVariables>;
export const GetOrCreateCustomerDocument = gql`
    query GetOrCreateCustomer($email: Email, $phoneNumber: String, $countryAlpha2Code: String) {
  getOrCreateCustomer(
    email: $email
    phoneNumber: $phoneNumber
    countryAlpha2Code: $countryAlpha2Code
  ) {
    customer {
      id
      user {
        id
      }
    }
    added
  }
}
    `;

/**
 * __useGetOrCreateCustomerQuery__
 *
 * To run a query within a React component, call `useGetOrCreateCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrCreateCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrCreateCustomerQuery({
 *   variables: {
 *      email: // value for 'email'
 *      phoneNumber: // value for 'phoneNumber'
 *      countryAlpha2Code: // value for 'countryAlpha2Code'
 *   },
 * });
 */
export function useGetOrCreateCustomerQuery(baseOptions?: Apollo.QueryHookOptions<GetOrCreateCustomerQuery, GetOrCreateCustomerQueryVariables>) {
        return Apollo.useQuery<GetOrCreateCustomerQuery, GetOrCreateCustomerQueryVariables>(GetOrCreateCustomerDocument, baseOptions);
      }
export function useGetOrCreateCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrCreateCustomerQuery, GetOrCreateCustomerQueryVariables>) {
          return Apollo.useLazyQuery<GetOrCreateCustomerQuery, GetOrCreateCustomerQueryVariables>(GetOrCreateCustomerDocument, baseOptions);
        }
export type GetOrCreateCustomerQueryHookResult = ReturnType<typeof useGetOrCreateCustomerQuery>;
export type GetOrCreateCustomerLazyQueryHookResult = ReturnType<typeof useGetOrCreateCustomerLazyQuery>;
export type GetOrCreateCustomerQueryResult = Apollo.QueryResult<GetOrCreateCustomerQuery, GetOrCreateCustomerQueryVariables>;
export const GetPaymentsDocument = gql`
    query GetPayments($monthId: ID, $year: Int) {
  getPayments(monthId: $monthId, year: $year) {
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
 * __useGetPaymentsQuery__
 *
 * To run a query within a React component, call `useGetPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentsQuery({
 *   variables: {
 *      monthId: // value for 'monthId'
 *      year: // value for 'year'
 *   },
 * });
 */
export function useGetPaymentsQuery(baseOptions?: Apollo.QueryHookOptions<GetPaymentsQuery, GetPaymentsQueryVariables>) {
        return Apollo.useQuery<GetPaymentsQuery, GetPaymentsQueryVariables>(GetPaymentsDocument, baseOptions);
      }
export function useGetPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentsQuery, GetPaymentsQueryVariables>) {
          return Apollo.useLazyQuery<GetPaymentsQuery, GetPaymentsQueryVariables>(GetPaymentsDocument, baseOptions);
        }
export type GetPaymentsQueryHookResult = ReturnType<typeof useGetPaymentsQuery>;
export type GetPaymentsLazyQueryHookResult = ReturnType<typeof useGetPaymentsLazyQuery>;
export type GetPaymentsQueryResult = Apollo.QueryResult<GetPaymentsQuery, GetPaymentsQueryVariables>;
export const GetPaymentsDatesDocument = gql`
    query GetPaymentsDates {
  getPaymentsDates {
    month {
      id
      value
    }
    year
  }
}
    `;

/**
 * __useGetPaymentsDatesQuery__
 *
 * To run a query within a React component, call `useGetPaymentsDatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentsDatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentsDatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPaymentsDatesQuery(baseOptions?: Apollo.QueryHookOptions<GetPaymentsDatesQuery, GetPaymentsDatesQueryVariables>) {
        return Apollo.useQuery<GetPaymentsDatesQuery, GetPaymentsDatesQueryVariables>(GetPaymentsDatesDocument, baseOptions);
      }
export function useGetPaymentsDatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentsDatesQuery, GetPaymentsDatesQueryVariables>) {
          return Apollo.useLazyQuery<GetPaymentsDatesQuery, GetPaymentsDatesQueryVariables>(GetPaymentsDatesDocument, baseOptions);
        }
export type GetPaymentsDatesQueryHookResult = ReturnType<typeof useGetPaymentsDatesQuery>;
export type GetPaymentsDatesLazyQueryHookResult = ReturnType<typeof useGetPaymentsDatesLazyQuery>;
export type GetPaymentsDatesQueryResult = Apollo.QueryResult<GetPaymentsDatesQuery, GetPaymentsDatesQueryVariables>;
export const GetPersonalizedBeachBarsDocument = gql`
    query GetPersonalizedBeachBars {
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
        return Apollo.useQuery<GetPersonalizedBeachBarsQuery, GetPersonalizedBeachBarsQueryVariables>(GetPersonalizedBeachBarsDocument, baseOptions);
      }
export function useGetPersonalizedBeachBarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPersonalizedBeachBarsQuery, GetPersonalizedBeachBarsQueryVariables>) {
          return Apollo.useLazyQuery<GetPersonalizedBeachBarsQuery, GetPersonalizedBeachBarsQueryVariables>(GetPersonalizedBeachBarsDocument, baseOptions);
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
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
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
        quantity
        date
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
            formattedLocation
            defaultCurrency {
              symbol
            }
          }
        }
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
      status
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
    `;

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
        return Apollo.useQuery<PaymentQuery, PaymentQueryVariables>(PaymentDocument, baseOptions);
      }
export function usePaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaymentQuery, PaymentQueryVariables>) {
          return Apollo.useLazyQuery<PaymentQuery, PaymentQueryVariables>(PaymentDocument, baseOptions);
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
        return Apollo.useQuery<PaymentRefundAmountQuery, PaymentRefundAmountQueryVariables>(PaymentRefundAmountDocument, baseOptions);
      }
export function usePaymentRefundAmountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaymentRefundAmountQuery, PaymentRefundAmountQueryVariables>) {
          return Apollo.useLazyQuery<PaymentRefundAmountQuery, PaymentRefundAmountQueryVariables>(PaymentRefundAmountDocument, baseOptions);
        }
export type PaymentRefundAmountQueryHookResult = ReturnType<typeof usePaymentRefundAmountQuery>;
export type PaymentRefundAmountLazyQueryHookResult = ReturnType<typeof usePaymentRefundAmountLazyQuery>;
export type PaymentRefundAmountQueryResult = Apollo.QueryResult<PaymentRefundAmountQuery, PaymentRefundAmountQueryVariables>;
export const ReviewDocument = gql`
    query Review($reviewId: ID!) {
  review(reviewId: $reviewId) {
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
}
    `;

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
        return Apollo.useQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, baseOptions);
      }
export function useReviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewQuery, ReviewQueryVariables>) {
          return Apollo.useLazyQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, baseOptions);
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
        id
        name
        thumbnailUrl
      }
      availability {
        hasAvailability
        hasCapacity
      }
    }
  }
}
    `;

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
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const SearchInputValuesDocument = gql`
    query SearchInputValues {
  searchInputValues {
    inputValue {
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
  }
}
    `;

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
        return Apollo.useQuery<SearchInputValuesQuery, SearchInputValuesQueryVariables>(SearchInputValuesDocument, baseOptions);
      }
export function useSearchInputValuesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchInputValuesQuery, SearchInputValuesQueryVariables>) {
          return Apollo.useLazyQuery<SearchInputValuesQuery, SearchInputValuesQueryVariables>(SearchInputValuesDocument, baseOptions);
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
        return Apollo.useQuery<UserHistoryQuery, UserHistoryQueryVariables>(UserHistoryDocument, baseOptions);
      }
export function useUserHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserHistoryQuery, UserHistoryQueryVariables>) {
          return Apollo.useLazyQuery<UserHistoryQuery, UserHistoryQueryVariables>(UserHistoryDocument, baseOptions);
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
        return Apollo.useQuery<UserReviewsQuery, UserReviewsQueryVariables>(UserReviewsDocument, baseOptions);
      }
export function useUserReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserReviewsQuery, UserReviewsQueryVariables>) {
          return Apollo.useLazyQuery<UserReviewsQuery, UserReviewsQueryVariables>(UserReviewsDocument, baseOptions);
        }
export type UserReviewsQueryHookResult = ReturnType<typeof useUserReviewsQuery>;
export type UserReviewsLazyQueryHookResult = ReturnType<typeof useUserReviewsLazyQuery>;
export type UserReviewsQueryResult = Apollo.QueryResult<UserReviewsQuery, UserReviewsQueryVariables>;
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
        return Apollo.useQuery<GetFacebookOAuthUrlQuery, GetFacebookOAuthUrlQueryVariables>(GetFacebookOAuthUrlDocument, baseOptions);
      }
export function useGetFacebookOAuthUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFacebookOAuthUrlQuery, GetFacebookOAuthUrlQueryVariables>) {
          return Apollo.useLazyQuery<GetFacebookOAuthUrlQuery, GetFacebookOAuthUrlQueryVariables>(GetFacebookOAuthUrlDocument, baseOptions);
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
        return Apollo.useQuery<GetGoogleOAuthUrlQuery, GetGoogleOAuthUrlQueryVariables>(GetGoogleOAuthUrlDocument, baseOptions);
      }
export function useGetGoogleOAuthUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoogleOAuthUrlQuery, GetGoogleOAuthUrlQueryVariables>) {
          return Apollo.useLazyQuery<GetGoogleOAuthUrlQuery, GetGoogleOAuthUrlQueryVariables>(GetGoogleOAuthUrlDocument, baseOptions);
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
        return Apollo.useQuery<GetInstagramOAuthUrlQuery, GetInstagramOAuthUrlQueryVariables>(GetInstagramOAuthUrlDocument, baseOptions);
      }
export function useGetInstagramOAuthUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstagramOAuthUrlQuery, GetInstagramOAuthUrlQueryVariables>) {
          return Apollo.useLazyQuery<GetInstagramOAuthUrlQuery, GetInstagramOAuthUrlQueryVariables>(GetInstagramOAuthUrlDocument, baseOptions);
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
        return Apollo.useQuery<IndexPageQuery, IndexPageQueryVariables>(IndexPageDocument, baseOptions);
      }
export function useIndexPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IndexPageQuery, IndexPageQueryVariables>) {
          return Apollo.useLazyQuery<IndexPageQuery, IndexPageQueryVariables>(IndexPageDocument, baseOptions);
        }
export type IndexPageQueryHookResult = ReturnType<typeof useIndexPageQuery>;
export type IndexPageLazyQueryHookResult = ReturnType<typeof useIndexPageLazyQuery>;
export type IndexPageQueryResult = Apollo.QueryResult<IndexPageQuery, IndexPageQueryVariables>;
export const GetAllBeachBarsDocument = gql`
    query GetAllBeachBars {
  getAllBeachBars {
    id
    name
    thumbnailUrl
    description
    avgRating
    payments {
      id
    }
    location {
      longitude
      latitude
    }
  }
}
    `;

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
        return Apollo.useQuery<GetAllBeachBarsQuery, GetAllBeachBarsQueryVariables>(GetAllBeachBarsDocument, baseOptions);
      }
export function useGetAllBeachBarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBeachBarsQuery, GetAllBeachBarsQueryVariables>) {
          return Apollo.useLazyQuery<GetAllBeachBarsQuery, GetAllBeachBarsQueryVariables>(GetAllBeachBarsDocument, baseOptions);
        }
export type GetAllBeachBarsQueryHookResult = ReturnType<typeof useGetAllBeachBarsQuery>;
export type GetAllBeachBarsLazyQueryHookResult = ReturnType<typeof useGetAllBeachBarsLazyQuery>;
export type GetAllBeachBarsQueryResult = Apollo.QueryResult<GetAllBeachBarsQuery, GetAllBeachBarsQueryVariables>;