import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type ErrorKeySpecifier = ('error' | ErrorKeySpecifier)[];
export type ErrorFieldPolicy = {
	error?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ErrorObjectKeySpecifier = ('code' | 'message' | ErrorObjectKeySpecifier)[];
export type ErrorObjectFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type S3PayloadKeySpecifier = ('signedRequest' | 'url' | S3PayloadKeySpecifier)[];
export type S3PayloadFieldPolicy = {
	signedRequest?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarEntryFeeKeySpecifier = ('id' | 'fee' | 'date' | 'beachBar' | BeachBarEntryFeeKeySpecifier)[];
export type BeachBarEntryFeeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	fee?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddBeachBarEntryFeeKeySpecifier = ('fees' | 'added' | AddBeachBarEntryFeeKeySpecifier)[];
export type AddBeachBarEntryFeeFieldPolicy = {
	fees?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateBeachBarEntryFeeKeySpecifier = ('fees' | 'updated' | UpdateBeachBarEntryFeeKeySpecifier)[];
export type UpdateBeachBarEntryFeeFieldPolicy = {
	fees?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarImgUrlKeySpecifier = ('id' | 'imgUrl' | 'description' | 'beachBar' | BeachBarImgUrlKeySpecifier)[];
export type BeachBarImgUrlFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddBeachBarImgUrlKeySpecifier = ('imgUrl' | 'added' | AddBeachBarImgUrlKeySpecifier)[];
export type AddBeachBarImgUrlFieldPolicy = {
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateBeachBarImgUrlKeySpecifier = ('imgUrl' | 'updated' | UpdateBeachBarImgUrlKeySpecifier)[];
export type UpdateBeachBarImgUrlFieldPolicy = {
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarLocationKeySpecifier = ('id' | 'address' | 'zipCode' | 'latitude' | 'longitude' | 'whereIs' | 'country' | 'city' | 'region' | BeachBarLocationKeySpecifier)[];
export type BeachBarLocationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	zipCode?: FieldPolicy<any> | FieldReadFunction<any>,
	latitude?: FieldPolicy<any> | FieldReadFunction<any>,
	longitude?: FieldPolicy<any> | FieldReadFunction<any>,
	whereIs?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	region?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddBeachBarLocationKeySpecifier = ('location' | 'added' | AddBeachBarLocationKeySpecifier)[];
export type AddBeachBarLocationFieldPolicy = {
	location?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateBeachBarLocationKeySpecifier = ('location' | 'updated' | UpdateBeachBarLocationKeySpecifier)[];
export type UpdateBeachBarLocationFieldPolicy = {
	location?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CouponCodeInterfaceKeySpecifier = ('id' | 'refCode' | 'title' | 'discountPercentage' | 'isActive' | 'validUntil' | 'timesLimit' | 'timesUsed' | 'beachBar' | CouponCodeInterfaceKeySpecifier)[];
export type CouponCodeInterfaceFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	discountPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	validUntil?: FieldPolicy<any> | FieldReadFunction<any>,
	timesLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	timesUsed?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OfferCampaignCodeInterfaceKeySpecifier = ('id' | 'refCode' | 'totalAmount' | 'timesUsed' | 'campaign' | 'timestamp' | 'deletedAt' | OfferCampaignCodeInterfaceKeySpecifier)[];
export type OfferCampaignCodeInterfaceFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>,
	totalAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	timesUsed?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	deletedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CouponCodeKeySpecifier = ('id' | 'refCode' | 'title' | 'discountPercentage' | 'isActive' | 'validUntil' | 'timesLimit' | 'timesUsed' | 'beachBar' | CouponCodeKeySpecifier)[];
export type CouponCodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	discountPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	validUntil?: FieldPolicy<any> | FieldReadFunction<any>,
	timesLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	timesUsed?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OfferCampaignKeySpecifier = ('id' | 'title' | 'discountPercentage' | 'isActive' | 'validUntil' | 'products' | OfferCampaignKeySpecifier)[];
export type OfferCampaignFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	discountPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	validUntil?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OfferCampaignCodeKeySpecifier = ('id' | 'refCode' | 'totalAmount' | 'timesUsed' | 'campaign' | 'timestamp' | 'deletedAt' | OfferCampaignCodeKeySpecifier)[];
export type OfferCampaignCodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>,
	totalAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	timesUsed?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	deletedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddCouponCodeKeySpecifier = ('couponCode' | 'added' | AddCouponCodeKeySpecifier)[];
export type AddCouponCodeFieldPolicy = {
	couponCode?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateCouponCodeKeySpecifier = ('couponCode' | 'updated' | UpdateCouponCodeKeySpecifier)[];
export type UpdateCouponCodeFieldPolicy = {
	couponCode?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddOfferCampaignKeySpecifier = ('offerCampaign' | 'added' | AddOfferCampaignKeySpecifier)[];
export type AddOfferCampaignFieldPolicy = {
	offerCampaign?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateOfferCampaignKeySpecifier = ('offerCampaign' | 'updated' | UpdateOfferCampaignKeySpecifier)[];
export type UpdateOfferCampaignFieldPolicy = {
	offerCampaign?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddOfferCampaignCodeKeySpecifier = ('offerCode' | 'added' | AddOfferCampaignCodeKeySpecifier)[];
export type AddOfferCampaignCodeFieldPolicy = {
	offerCode?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CouponCodeRevealKeySpecifier = ('id' | 'refCode' | 'title' | 'discountPercentage' | 'isActive' | 'validUntil' | 'timesLimit' | 'timesUsed' | 'beachBar' | CouponCodeRevealKeySpecifier)[];
export type CouponCodeRevealFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	discountPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	validUntil?: FieldPolicy<any> | FieldReadFunction<any>,
	timesLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	timesUsed?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OfferCampaignCodeRevealKeySpecifier = ('id' | 'refCode' | 'totalAmount' | 'timesUsed' | 'campaign' | 'timestamp' | 'deletedAt' | OfferCampaignCodeRevealKeySpecifier)[];
export type OfferCampaignCodeRevealFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>,
	totalAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	timesUsed?: FieldPolicy<any> | FieldReadFunction<any>,
	campaign?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	deletedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductReservationLimitKeySpecifier = ('id' | 'limitNumber' | 'date' | 'product' | 'startTime' | 'endTime' | ProductReservationLimitKeySpecifier)[];
export type ProductReservationLimitFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	limitNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	startTime?: FieldPolicy<any> | FieldReadFunction<any>,
	endTime?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddProductReservationLimitKeySpecifier = ('reservationLimit' | 'added' | AddProductReservationLimitKeySpecifier)[];
export type AddProductReservationLimitFieldPolicy = {
	reservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateProductReservationLimitKeySpecifier = ('reservationLimit' | 'updated' | UpdateProductReservationLimitKeySpecifier)[];
export type UpdateProductReservationLimitFieldPolicy = {
	reservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AvailableProductKeySpecifier = ('hourTime' | 'isAvailable' | AvailableProductKeySpecifier)[];
export type AvailableProductFieldPolicy = {
	hourTime?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailable?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductKeySpecifier = ('id' | 'name' | 'description' | 'price' | 'isActive' | 'isIndividual' | 'maxPeople' | 'imgUrl' | 'beachBar' | 'category' | 'updatedAt' | 'deletedAt' | ProductKeySpecifier)[];
export type ProductFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	isIndividual?: FieldPolicy<any> | FieldReadFunction<any>,
	maxPeople?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	deletedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddProductKeySpecifier = ('product' | 'added' | AddProductKeySpecifier)[];
export type AddProductFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateProductKeySpecifier = ('product' | 'updated' | UpdateProductKeySpecifier)[];
export type UpdateProductFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAvailabilityHourKeySpecifier = ('hourTime' | 'isAvailable' | ProductAvailabilityHourKeySpecifier)[];
export type ProductAvailabilityHourFieldPolicy = {
	hourTime?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailable?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RestaurantMenuCategoryKeySpecifier = ('id' | 'name' | RestaurantMenuCategoryKeySpecifier)[];
export type RestaurantMenuCategoryFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RestaurantFoodItemKeySpecifier = ('id' | 'name' | 'price' | 'imgUrl' | 'menuCategory' | RestaurantFoodItemKeySpecifier)[];
export type RestaurantFoodItemFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	menuCategory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddRestaurantFoodItemKeySpecifier = ('foodItem' | 'added' | AddRestaurantFoodItemKeySpecifier)[];
export type AddRestaurantFoodItemFieldPolicy = {
	foodItem?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateRestaurantFoodItemKeySpecifier = ('foodItem' | 'updated' | UpdateRestaurantFoodItemKeySpecifier)[];
export type UpdateRestaurantFoodItemFieldPolicy = {
	foodItem?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarRestaurantKeySpecifier = ('id' | 'name' | 'description' | 'isActive' | 'beachBar' | 'foodItems' | BeachBarRestaurantKeySpecifier)[];
export type BeachBarRestaurantFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	foodItems?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddBeachBarRestaurantKeySpecifier = ('restaurant' | 'added' | AddBeachBarRestaurantKeySpecifier)[];
export type AddBeachBarRestaurantFieldPolicy = {
	restaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateBeachBarRestaurantKeySpecifier = ('restaurant' | 'updated' | UpdateBeachBarRestaurantKeySpecifier)[];
export type UpdateBeachBarRestaurantFieldPolicy = {
	restaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReviewVoteTypeKeySpecifier = ('id' | 'value' | ReviewVoteTypeKeySpecifier)[];
export type ReviewVoteTypeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReviewVoteKeySpecifier = ('id' | 'review' | 'user' | 'type' | 'updatedAt' | 'timestamp' | ReviewVoteKeySpecifier)[];
export type ReviewVoteFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReviewAnswerKeySpecifier = ('id' | 'body' | 'review' | 'updatedAt' | 'timestamp' | ReviewAnswerKeySpecifier)[];
export type ReviewAnswerFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	body?: FieldPolicy<any> | FieldReadFunction<any>,
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddReviewAnswerKeySpecifier = ('answer' | 'added' | AddReviewAnswerKeySpecifier)[];
export type AddReviewAnswerFieldPolicy = {
	answer?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateReviewAnswerKeySpecifier = ('answer' | 'updated' | UpdateReviewAnswerKeySpecifier)[];
export type UpdateReviewAnswerFieldPolicy = {
	answer?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarReviewKeySpecifier = ('id' | 'ratingValue' | 'positiveComment' | 'negativeComment' | 'review' | 'beachBar' | 'votes' | 'answer' | 'customer' | 'visitType' | 'month' | 'updatedAt' | 'timestamp' | BeachBarReviewKeySpecifier)[];
export type BeachBarReviewFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	ratingValue?: FieldPolicy<any> | FieldReadFunction<any>,
	positiveComment?: FieldPolicy<any> | FieldReadFunction<any>,
	negativeComment?: FieldPolicy<any> | FieldReadFunction<any>,
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	votes?: FieldPolicy<any> | FieldReadFunction<any>,
	answer?: FieldPolicy<any> | FieldReadFunction<any>,
	customer?: FieldPolicy<any> | FieldReadFunction<any>,
	visitType?: FieldPolicy<any> | FieldReadFunction<any>,
	month?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddBeachBarReviewKeySpecifier = ('review' | 'added' | AddBeachBarReviewKeySpecifier)[];
export type AddBeachBarReviewFieldPolicy = {
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateBeachBarReviewKeySpecifier = ('review' | 'updated' | UpdateBeachBarReviewKeySpecifier)[];
export type UpdateBeachBarReviewFieldPolicy = {
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarServiceKeySpecifier = ('id' | 'name' | BeachBarServiceKeySpecifier)[];
export type BeachBarServiceFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarFeatureKeySpecifier = ('service' | 'beachBar' | 'quantity' | 'description' | 'updatedAt' | 'timestamp' | BeachBarFeatureKeySpecifier)[];
export type BeachBarFeatureFieldPolicy = {
	service?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddBeachBarFeatureKeySpecifier = ('feature' | 'added' | AddBeachBarFeatureKeySpecifier)[];
export type AddBeachBarFeatureFieldPolicy = {
	feature?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateBeachBarFeatureKeySpecifier = ('feature' | 'updated' | UpdateBeachBarFeatureKeySpecifier)[];
export type UpdateBeachBarFeatureFieldPolicy = {
	feature?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarKeySpecifier = ('id' | 'name' | 'slug' | 'description' | 'avgRating' | 'thumbnailUrl' | 'contactPhoneNumber' | 'hidePhoneNumber' | 'isActive' | 'isAvailable' | 'location' | 'formattedLocation' | 'payments' | 'category' | 'imgUrls' | 'reviews' | 'features' | 'styles' | 'restaurants' | 'defaultCurrency' | 'owners' | 'openingTime' | 'closingTime' | 'updatedAt' | 'timestamp' | BeachBarKeySpecifier)[];
export type BeachBarFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	avgRating?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnailUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	contactPhoneNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	hidePhoneNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailable?: FieldPolicy<any> | FieldReadFunction<any>,
	location?: FieldPolicy<any> | FieldReadFunction<any>,
	formattedLocation?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrls?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews?: FieldPolicy<any> | FieldReadFunction<any>,
	features?: FieldPolicy<any> | FieldReadFunction<any>,
	styles?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurants?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	owners?: FieldPolicy<any> | FieldReadFunction<any>,
	openingTime?: FieldPolicy<any> | FieldReadFunction<any>,
	closingTime?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddBeachBarKeySpecifier = ('beachBar' | 'added' | AddBeachBarKeySpecifier)[];
export type AddBeachBarFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateBeachBarKeySpecifier = ('beachBar' | 'updated' | UpdateBeachBarKeySpecifier)[];
export type UpdateBeachBarFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarAvailabilityKeySpecifier = ('hasAvailability' | 'hasCapacity' | BeachBarAvailabilityKeySpecifier)[];
export type BeachBarAvailabilityFieldPolicy = {
	hasAvailability?: FieldPolicy<any> | FieldReadFunction<any>,
	hasCapacity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CartProductKeySpecifier = ('quantity' | 'date' | 'timestamp' | 'cart' | 'product' | 'time' | CartProductKeySpecifier)[];
export type CartProductFieldPolicy = {
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	cart?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddCartProductKeySpecifier = ('product' | 'added' | AddCartProductKeySpecifier)[];
export type AddCartProductFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateCartProductKeySpecifier = ('product' | 'updated' | UpdateCartProductKeySpecifier)[];
export type UpdateCartProductFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CartKeySpecifier = ('id' | 'total' | 'user' | 'products' | CartKeySpecifier)[];
export type CartFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CardKeySpecifier = ('id' | 'type' | 'expMonth' | 'expYear' | 'last4' | 'cardholderName' | 'isDefault' | 'stripeId' | 'customer' | 'brand' | 'country' | CardKeySpecifier)[];
export type CardFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	expMonth?: FieldPolicy<any> | FieldReadFunction<any>,
	expYear?: FieldPolicy<any> | FieldReadFunction<any>,
	last4?: FieldPolicy<any> | FieldReadFunction<any>,
	cardholderName?: FieldPolicy<any> | FieldReadFunction<any>,
	isDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	stripeId?: FieldPolicy<any> | FieldReadFunction<any>,
	customer?: FieldPolicy<any> | FieldReadFunction<any>,
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddCardKeySpecifier = ('card' | 'added' | AddCardKeySpecifier)[];
export type AddCardFieldPolicy = {
	card?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateCardKeySpecifier = ('card' | 'updated' | UpdateCardKeySpecifier)[];
export type UpdateCardFieldPolicy = {
	card?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerKeySpecifier = ('id' | 'email' | 'phoneNumber' | 'user' | 'cards' | 'country' | CustomerKeySpecifier)[];
export type CustomerFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	phoneNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	cards?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddCustomerKeySpecifier = ('customer' | 'added' | AddCustomerKeySpecifier)[];
export type AddCustomerFieldPolicy = {
	customer?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateCustomerKeySpecifier = ('customer' | 'updated' | UpdateCustomerKeySpecifier)[];
export type UpdateCustomerFieldPolicy = {
	customer?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CardBrandKeySpecifier = ('id' | 'name' | CardBrandKeySpecifier)[];
export type CardBrandFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CityKeySpecifier = ('id' | 'name' | 'country' | CityKeySpecifier)[];
export type CityFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CurrencyKeySpecifier = ('id' | 'name' | 'isoCode' | 'symbol' | 'secondSymbol' | CurrencyKeySpecifier)[];
export type CurrencyFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	isoCode?: FieldPolicy<any> | FieldReadFunction<any>,
	symbol?: FieldPolicy<any> | FieldReadFunction<any>,
	secondSymbol?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CountryKeySpecifier = ('id' | 'name' | 'alpha2Code' | 'alpha3Code' | 'callingCode' | 'isEu' | 'cities' | 'currency' | CountryKeySpecifier)[];
export type CountryFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	alpha2Code?: FieldPolicy<any> | FieldReadFunction<any>,
	alpha3Code?: FieldPolicy<any> | FieldReadFunction<any>,
	callingCode?: FieldPolicy<any> | FieldReadFunction<any>,
	isEu?: FieldPolicy<any> | FieldReadFunction<any>,
	cities?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentStatusKeySpecifier = ('id' | 'status' | PaymentStatusKeySpecifier)[];
export type PaymentStatusFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductComponentKeySpecifier = ('id' | 'title' | 'description' | 'iconUrl' | ProductComponentKeySpecifier)[];
export type ProductComponentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	iconUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BundleProductComponentKeySpecifier = ('product' | 'component' | 'quantity' | BundleProductComponentKeySpecifier)[];
export type BundleProductComponentFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	component?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCategoryKeySpecifier = ('id' | 'name' | 'underscoredName' | 'description' | 'productComponents' | ProductCategoryKeySpecifier)[];
export type ProductCategoryFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	underscoredName?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	productComponents?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReviewVisitTypeKeySpecifier = ('id' | 'name' | ReviewVisitTypeKeySpecifier)[];
export type ReviewVisitTypeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HourTimeKeySpecifier = ('id' | 'value' | 'utcValue' | HourTimeKeySpecifier)[];
export type HourTimeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	utcValue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuarterTimeKeySpecifier = ('id' | 'value' | 'utcValue' | QuarterTimeKeySpecifier)[];
export type QuarterTimeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	utcValue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MonthTimeKeySpecifier = ('id' | 'value' | 'days' | MonthTimeKeySpecifier)[];
export type MonthTimeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	days?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarCategoryKeySpecifier = ('id' | 'name' | 'description' | BeachBarCategoryKeySpecifier)[];
export type BeachBarCategoryFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoteCategoryKeySpecifier = ('id' | 'title' | 'description' | 'refCode' | VoteCategoryKeySpecifier)[];
export type VoteCategoryFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoteTagKeySpecifier = ('id' | 'upvotes' | 'downvotes' | 'totalVotes' | 'category' | VoteTagKeySpecifier)[];
export type VoteTagFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	upvotes?: FieldPolicy<any> | FieldReadFunction<any>,
	downvotes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalVotes?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('uploadSingleFile' | 'hello' | 'signS3' | 'addBeachBarEntryFee' | 'updateBeachBarEntryFee' | 'deleteBeachBarEntryFee' | 'addBeachBarImgUrl' | 'updateBeachBaImgUrl' | 'deleteBeachBarImgUrl' | 'addBeachBarLocation' | 'updateBeachBarLocation' | 'addBeachBar' | 'updateBeachBar' | 'deleteBeachBar' | 'addProduct' | 'updateProduct' | 'deleteProduct' | 'restoreBeachBarProduct' | 'addCouponCode' | 'updateCouponCode' | 'deleteCouponCode' | 'addOfferCampaign' | 'updateOfferCampaign' | 'deleteOfferCampaign' | 'addOfferCampaignCode' | 'deleteOfferCode' | 'addProductReservationLimit' | 'updateProductReservationLimit' | 'deleteProductReservationLimit' | 'addRestaurantFoodItem' | 'updateRestaurantFoodItem' | 'deleteRestaurantFoodItem' | 'addBeachBarRestaurant' | 'updateBeachBarRestaurant' | 'deleteBeachBarRestaurant' | 'updateReviewVote' | 'addReviewAnswer' | 'updateReviewAnswer' | 'deleteReviewAnswer' | 'addReview' | 'updateReview' | 'deleteReview' | 'addBeachBarFeature' | 'updateBeachBarFeature' | 'deleteBeachBarFeature' | 'deleteCart' | 'addCartProduct' | 'updateCartProduct' | 'deleteCartProduct' | 'addCustomerPaymentMethod' | 'updateCustomerPaymentMethod' | 'deleteCustomerPaymentMethod' | 'updateCustomer' | 'deleteCustomer' | 'authorizeWithGoogle' | 'authorizeWithFacebook' | 'authorizeWithInstagram' | 'addBeachBarOwner' | 'updateBeachBarOwner' | 'deleteBeachBarOwner' | 'checkout' | 'refundPayment' | 'updateSearch' | 'updateFavouriteBeachBar' | 'deleteUserFavoriteBar' | 'signUp' | 'login' | 'logout' | 'sendForgotPasswordLink' | 'changeUserPassword' | 'updateUser' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	uploadSingleFile?: FieldPolicy<any> | FieldReadFunction<any>,
	hello?: FieldPolicy<any> | FieldReadFunction<any>,
	signS3?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarEntryFee?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBarEntryFee?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarEntryFee?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarImgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBaImgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarImgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarLocation?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBarLocation?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	addProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	updateProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	restoreBeachBarProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	addCouponCode?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCouponCode?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCouponCode?: FieldPolicy<any> | FieldReadFunction<any>,
	addOfferCampaign?: FieldPolicy<any> | FieldReadFunction<any>,
	updateOfferCampaign?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteOfferCampaign?: FieldPolicy<any> | FieldReadFunction<any>,
	addOfferCampaignCode?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteOfferCode?: FieldPolicy<any> | FieldReadFunction<any>,
	addProductReservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	updateProductReservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProductReservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	addRestaurantFoodItem?: FieldPolicy<any> | FieldReadFunction<any>,
	updateRestaurantFoodItem?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteRestaurantFoodItem?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBarRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	updateReviewVote?: FieldPolicy<any> | FieldReadFunction<any>,
	addReviewAnswer?: FieldPolicy<any> | FieldReadFunction<any>,
	updateReviewAnswer?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteReviewAnswer?: FieldPolicy<any> | FieldReadFunction<any>,
	addReview?: FieldPolicy<any> | FieldReadFunction<any>,
	updateReview?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteReview?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarFeature?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBarFeature?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarFeature?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCart?: FieldPolicy<any> | FieldReadFunction<any>,
	addCartProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCartProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCartProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	addCustomerPaymentMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCustomerPaymentMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCustomerPaymentMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	authorizeWithGoogle?: FieldPolicy<any> | FieldReadFunction<any>,
	authorizeWithFacebook?: FieldPolicy<any> | FieldReadFunction<any>,
	authorizeWithInstagram?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarOwner?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBarOwner?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarOwner?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	refundPayment?: FieldPolicy<any> | FieldReadFunction<any>,
	updateSearch?: FieldPolicy<any> | FieldReadFunction<any>,
	updateFavouriteBeachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUserFavoriteBar?: FieldPolicy<any> | FieldReadFunction<any>,
	signUp?: FieldPolicy<any> | FieldReadFunction<any>,
	login?: FieldPolicy<any> | FieldReadFunction<any>,
	logout?: FieldPolicy<any> | FieldReadFunction<any>,
	sendForgotPasswordLink?: FieldPolicy<any> | FieldReadFunction<any>,
	changeUserPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUser?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OAuthAuthorizationKeySpecifier = ('accessToken' | 'signedUp' | 'logined' | 'user' | OAuthAuthorizationKeySpecifier)[];
export type OAuthAuthorizationFieldPolicy = {
	accessToken?: FieldPolicy<any> | FieldReadFunction<any>,
	signedUp?: FieldPolicy<any> | FieldReadFunction<any>,
	logined?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OwnerKeySpecifier = ('id' | 'user' | OwnerKeySpecifier)[];
export type OwnerFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarOwnerKeySpecifier = ('isPrimary' | 'publicInfo' | 'beachBar' | 'owner' | 'timestamp' | BeachBarOwnerKeySpecifier)[];
export type BeachBarOwnerFieldPolicy = {
	isPrimary?: FieldPolicy<any> | FieldReadFunction<any>,
	publicInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddBeachBarOwnerKeySpecifier = ('owner' | 'added' | AddBeachBarOwnerKeySpecifier)[];
export type AddBeachBarOwnerFieldPolicy = {
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateBeachBarOwnerKeySpecifier = ('owner' | 'updated' | UpdateBeachBarOwnerKeySpecifier)[];
export type UpdateBeachBarOwnerFieldPolicy = {
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReservedProductKeySpecifier = ('id' | 'date' | 'isRefunded' | 'time' | 'product' | 'payment' | ReservedProductKeySpecifier)[];
export type ReservedProductFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefunded?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddReservedProductKeySpecifier = ('reservedProduct' | 'added' | AddReservedProductKeySpecifier)[];
export type AddReservedProductFieldPolicy = {
	reservedProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateReservedProductKeySpecifier = ('reservedProduct' | 'updated' | UpdateReservedProductKeySpecifier)[];
export type UpdateReservedProductFieldPolicy = {
	reservedProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentKeySpecifier = ('id' | 'refCode' | 'stripeId' | 'isRefunded' | 'cart' | 'card' | 'status' | 'voucherCode' | 'reservedProducts' | 'timestamp' | PaymentKeySpecifier)[];
export type PaymentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>,
	stripeId?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefunded?: FieldPolicy<any> | FieldReadFunction<any>,
	cart?: FieldPolicy<any> | FieldReadFunction<any>,
	card?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCode?: FieldPolicy<any> | FieldReadFunction<any>,
	reservedProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddPaymentKeySpecifier = ('payment' | 'added' | AddPaymentKeySpecifier)[];
export type AddPaymentFieldPolicy = {
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	added?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VisitKeySpecifier = ('isUpcoming' | 'isRefunded' | 'time' | 'date' | 'payment' | VisitKeySpecifier)[];
export type VisitFieldPolicy = {
	isUpcoming?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefunded?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentVisitsKeySpecifier = ('beachBar' | 'visits' | PaymentVisitsKeySpecifier)[];
export type PaymentVisitsFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	visits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentVisitsDatesKeySpecifier = ('month' | 'year' | PaymentVisitsDatesKeySpecifier)[];
export type PaymentVisitsDatesFieldPolicy = {
	month?: FieldPolicy<any> | FieldReadFunction<any>,
	year?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('hello' | 'getAllBeachBarEntryFees' | 'getBeachBarImgUrl' | 'getVoucherCode' | 'getBeachBarOfferCampaigns' | 'revealCouponCode' | 'revealOfferCampaignCode' | 'getBeachBarProducts' | 'getProductAvailabilityHours' | 'getProductAvailabilityQuantity' | 'hasProductReservationLimit' | 'getBeachBar' | 'checkBeachBarAvailability' | 'getAllBeachBars' | 'getPersonalizedBeachBars' | 'verifyUserPaymentReview' | 'getPaymentProductsMonth' | 'userReviews' | 'review' | 'getCartEntryFees' | 'verifyZeroCartTotal' | 'getCart' | 'getCustomerPaymentMethods' | 'getOrCreateCustomer' | 'getStripeConnectOAuthUrl' | 'getGoogleOAuthUrl' | 'getFacebookOAuthUrl' | 'getInstagramOAuthUrl' | 'getPayments' | 'payment' | 'paymentRefundAmount' | 'getPaymentsDates' | 'searchInputValues' | 'getLatestUserSearches' | 'search' | 'userHistory' | 'favouriteBeachBars' | 'me' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	hello?: FieldPolicy<any> | FieldReadFunction<any>,
	getAllBeachBarEntryFees?: FieldPolicy<any> | FieldReadFunction<any>,
	getBeachBarImgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	getVoucherCode?: FieldPolicy<any> | FieldReadFunction<any>,
	getBeachBarOfferCampaigns?: FieldPolicy<any> | FieldReadFunction<any>,
	revealCouponCode?: FieldPolicy<any> | FieldReadFunction<any>,
	revealOfferCampaignCode?: FieldPolicy<any> | FieldReadFunction<any>,
	getBeachBarProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	getProductAvailabilityHours?: FieldPolicy<any> | FieldReadFunction<any>,
	getProductAvailabilityQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	hasProductReservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	getBeachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	checkBeachBarAvailability?: FieldPolicy<any> | FieldReadFunction<any>,
	getAllBeachBars?: FieldPolicy<any> | FieldReadFunction<any>,
	getPersonalizedBeachBars?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyUserPaymentReview?: FieldPolicy<any> | FieldReadFunction<any>,
	getPaymentProductsMonth?: FieldPolicy<any> | FieldReadFunction<any>,
	userReviews?: FieldPolicy<any> | FieldReadFunction<any>,
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	getCartEntryFees?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyZeroCartTotal?: FieldPolicy<any> | FieldReadFunction<any>,
	getCart?: FieldPolicy<any> | FieldReadFunction<any>,
	getCustomerPaymentMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	getOrCreateCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	getStripeConnectOAuthUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	getGoogleOAuthUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	getFacebookOAuthUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	getInstagramOAuthUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	getPayments?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentRefundAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	getPaymentsDates?: FieldPolicy<any> | FieldReadFunction<any>,
	searchInputValues?: FieldPolicy<any> | FieldReadFunction<any>,
	getLatestUserSearches?: FieldPolicy<any> | FieldReadFunction<any>,
	search?: FieldPolicy<any> | FieldReadFunction<any>,
	userHistory?: FieldPolicy<any> | FieldReadFunction<any>,
	favouriteBeachBars?: FieldPolicy<any> | FieldReadFunction<any>,
	me?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserSearchKeySpecifier = ('id' | 'searchDate' | 'searchAdults' | 'searchChildren' | 'user' | 'inputValue' | 'sort' | 'filters' | 'updatedAt' | 'timestamp' | UserSearchKeySpecifier)[];
export type UserSearchFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	searchDate?: FieldPolicy<any> | FieldReadFunction<any>,
	searchAdults?: FieldPolicy<any> | FieldReadFunction<any>,
	searchChildren?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	inputValue?: FieldPolicy<any> | FieldReadFunction<any>,
	sort?: FieldPolicy<any> | FieldReadFunction<any>,
	filters?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchSortKeySpecifier = ('id' | 'name' | SearchSortKeySpecifier)[];
export type SearchSortFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchResultTypeKeySpecifier = ('beachBar' | 'availability' | SearchResultTypeKeySpecifier)[];
export type SearchResultTypeFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	availability?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchKeySpecifier = ('results' | 'search' | SearchKeySpecifier)[];
export type SearchFieldPolicy = {
	results?: FieldPolicy<any> | FieldReadFunction<any>,
	search?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchInputValueKeySpecifier = ('id' | 'publicId' | 'formattedValue' | 'country' | 'city' | 'region' | 'beachBar' | SearchInputValueKeySpecifier)[];
export type SearchInputValueFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	publicId?: FieldPolicy<any> | FieldReadFunction<any>,
	formattedValue?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	region?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchFilterKeySpecifier = ('id' | 'publicId' | 'name' | 'description' | SearchFilterKeySpecifier)[];
export type SearchFilterFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	publicId?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FormattedSearchInputValueKeySpecifier = ('inputValue' | 'beachBarThumbnailUrl' | FormattedSearchInputValueKeySpecifier)[];
export type FormattedSearchInputValueFieldPolicy = {
	inputValue?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBarThumbnailUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NodeKeySpecifier = ('id' | NodeKeySpecifier)[];
export type NodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileKeySpecifier = ('filename' | 'mimetype' | 'encoding' | FileKeySpecifier)[];
export type FileFieldPolicy = {
	filename?: FieldPolicy<any> | FieldReadFunction<any>,
	mimetype?: FieldPolicy<any> | FieldReadFunction<any>,
	encoding?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SuccessKeySpecifier = ('success' | SuccessKeySpecifier)[];
export type SuccessFieldPolicy = {
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateKeySpecifier = ('updated' | UpdateKeySpecifier)[];
export type UpdateFieldPolicy = {
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeleteKeySpecifier = ('deleted' | DeleteKeySpecifier)[];
export type DeleteFieldPolicy = {
	deleted?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TimestampKeySpecifier = ('timestamp' | TimestampKeySpecifier)[];
export type TimestampFieldPolicy = {
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserAccountKeySpecifier = ('id' | 'honorificTitle' | 'imgUrl' | 'birthday' | 'age' | 'address' | 'zipCode' | 'city' | 'phoneNumber' | 'user' | 'country' | 'telCountry' | 'trackHistory' | UserAccountKeySpecifier)[];
export type UserAccountFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	honorificTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	birthday?: FieldPolicy<any> | FieldReadFunction<any>,
	age?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	zipCode?: FieldPolicy<any> | FieldReadFunction<any>,
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	phoneNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	telCountry?: FieldPolicy<any> | FieldReadFunction<any>,
	trackHistory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserHistoryActivityKeySpecifier = ('id' | 'name' | UserHistoryActivityKeySpecifier)[];
export type UserHistoryActivityFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserHistoryKeySpecifier = ('timestamp' | 'id' | 'activity' | 'objectId' | 'user' | UserHistoryKeySpecifier)[];
export type UserHistoryFieldPolicy = {
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	objectId?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserHistoryExtendedKeySpecifier = ('userHistory' | 'beachBar' | 'search' | UserHistoryExtendedKeySpecifier)[];
export type UserHistoryExtendedFieldPolicy = {
	userHistory?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	search?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserFavoriteBarKeySpecifier = ('user' | 'beachBar' | UserFavoriteBarKeySpecifier)[];
export type UserFavoriteBarFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateUserFavoriteBarKeySpecifier = ('favouriteBar' | 'updated' | UpdateUserFavoriteBarKeySpecifier)[];
export type UpdateUserFavoriteBarFieldPolicy = {
	favouriteBar?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('id' | 'email' | 'firstName' | 'lastName' | 'account' | 'reviews' | 'favoriteBars' | 'reviewVotes' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews?: FieldPolicy<any> | FieldReadFunction<any>,
	favoriteBars?: FieldPolicy<any> | FieldReadFunction<any>,
	reviewVotes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserLoginKeySpecifier = ('user' | 'accessToken' | UserLoginKeySpecifier)[];
export type UserLoginFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accessToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserUpdateKeySpecifier = ('updated' | 'user' | UserUpdateKeySpecifier)[];
export type UserUpdateFieldPolicy = {
	updated?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RegionKeySpecifier = ('id' | 'name' | 'country' | 'city' | RegionKeySpecifier)[];
export type RegionFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	city?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarStyleKeySpecifier = ('id' | 'name' | BeachBarStyleKeySpecifier)[];
export type BeachBarStyleFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentOfferCodeKeySpecifier = ('id' | 'payment' | 'couponCode' | 'offerCode' | PaymentOfferCodeKeySpecifier)[];
export type PaymentOfferCodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	couponCode?: FieldPolicy<any> | FieldReadFunction<any>,
	offerCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	Error?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ErrorKeySpecifier | (() => undefined | ErrorKeySpecifier),
		fields?: ErrorFieldPolicy,
	},
	ErrorObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ErrorObjectKeySpecifier | (() => undefined | ErrorObjectKeySpecifier),
		fields?: ErrorObjectFieldPolicy,
	},
	S3Payload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | S3PayloadKeySpecifier | (() => undefined | S3PayloadKeySpecifier),
		fields?: S3PayloadFieldPolicy,
	},
	BeachBarEntryFee?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarEntryFeeKeySpecifier | (() => undefined | BeachBarEntryFeeKeySpecifier),
		fields?: BeachBarEntryFeeFieldPolicy,
	},
	AddBeachBarEntryFee?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddBeachBarEntryFeeKeySpecifier | (() => undefined | AddBeachBarEntryFeeKeySpecifier),
		fields?: AddBeachBarEntryFeeFieldPolicy,
	},
	UpdateBeachBarEntryFee?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateBeachBarEntryFeeKeySpecifier | (() => undefined | UpdateBeachBarEntryFeeKeySpecifier),
		fields?: UpdateBeachBarEntryFeeFieldPolicy,
	},
	BeachBarImgUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarImgUrlKeySpecifier | (() => undefined | BeachBarImgUrlKeySpecifier),
		fields?: BeachBarImgUrlFieldPolicy,
	},
	AddBeachBarImgUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddBeachBarImgUrlKeySpecifier | (() => undefined | AddBeachBarImgUrlKeySpecifier),
		fields?: AddBeachBarImgUrlFieldPolicy,
	},
	UpdateBeachBarImgUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateBeachBarImgUrlKeySpecifier | (() => undefined | UpdateBeachBarImgUrlKeySpecifier),
		fields?: UpdateBeachBarImgUrlFieldPolicy,
	},
	BeachBarLocation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarLocationKeySpecifier | (() => undefined | BeachBarLocationKeySpecifier),
		fields?: BeachBarLocationFieldPolicy,
	},
	AddBeachBarLocation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddBeachBarLocationKeySpecifier | (() => undefined | AddBeachBarLocationKeySpecifier),
		fields?: AddBeachBarLocationFieldPolicy,
	},
	UpdateBeachBarLocation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateBeachBarLocationKeySpecifier | (() => undefined | UpdateBeachBarLocationKeySpecifier),
		fields?: UpdateBeachBarLocationFieldPolicy,
	},
	CouponCodeInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CouponCodeInterfaceKeySpecifier | (() => undefined | CouponCodeInterfaceKeySpecifier),
		fields?: CouponCodeInterfaceFieldPolicy,
	},
	OfferCampaignCodeInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OfferCampaignCodeInterfaceKeySpecifier | (() => undefined | OfferCampaignCodeInterfaceKeySpecifier),
		fields?: OfferCampaignCodeInterfaceFieldPolicy,
	},
	CouponCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CouponCodeKeySpecifier | (() => undefined | CouponCodeKeySpecifier),
		fields?: CouponCodeFieldPolicy,
	},
	OfferCampaign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OfferCampaignKeySpecifier | (() => undefined | OfferCampaignKeySpecifier),
		fields?: OfferCampaignFieldPolicy,
	},
	OfferCampaignCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OfferCampaignCodeKeySpecifier | (() => undefined | OfferCampaignCodeKeySpecifier),
		fields?: OfferCampaignCodeFieldPolicy,
	},
	AddCouponCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddCouponCodeKeySpecifier | (() => undefined | AddCouponCodeKeySpecifier),
		fields?: AddCouponCodeFieldPolicy,
	},
	UpdateCouponCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateCouponCodeKeySpecifier | (() => undefined | UpdateCouponCodeKeySpecifier),
		fields?: UpdateCouponCodeFieldPolicy,
	},
	AddOfferCampaign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddOfferCampaignKeySpecifier | (() => undefined | AddOfferCampaignKeySpecifier),
		fields?: AddOfferCampaignFieldPolicy,
	},
	UpdateOfferCampaign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateOfferCampaignKeySpecifier | (() => undefined | UpdateOfferCampaignKeySpecifier),
		fields?: UpdateOfferCampaignFieldPolicy,
	},
	AddOfferCampaignCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddOfferCampaignCodeKeySpecifier | (() => undefined | AddOfferCampaignCodeKeySpecifier),
		fields?: AddOfferCampaignCodeFieldPolicy,
	},
	CouponCodeReveal?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CouponCodeRevealKeySpecifier | (() => undefined | CouponCodeRevealKeySpecifier),
		fields?: CouponCodeRevealFieldPolicy,
	},
	OfferCampaignCodeReveal?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OfferCampaignCodeRevealKeySpecifier | (() => undefined | OfferCampaignCodeRevealKeySpecifier),
		fields?: OfferCampaignCodeRevealFieldPolicy,
	},
	ProductReservationLimit?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductReservationLimitKeySpecifier | (() => undefined | ProductReservationLimitKeySpecifier),
		fields?: ProductReservationLimitFieldPolicy,
	},
	AddProductReservationLimit?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddProductReservationLimitKeySpecifier | (() => undefined | AddProductReservationLimitKeySpecifier),
		fields?: AddProductReservationLimitFieldPolicy,
	},
	UpdateProductReservationLimit?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateProductReservationLimitKeySpecifier | (() => undefined | UpdateProductReservationLimitKeySpecifier),
		fields?: UpdateProductReservationLimitFieldPolicy,
	},
	AvailableProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AvailableProductKeySpecifier | (() => undefined | AvailableProductKeySpecifier),
		fields?: AvailableProductFieldPolicy,
	},
	Product?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductKeySpecifier | (() => undefined | ProductKeySpecifier),
		fields?: ProductFieldPolicy,
	},
	AddProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddProductKeySpecifier | (() => undefined | AddProductKeySpecifier),
		fields?: AddProductFieldPolicy,
	},
	UpdateProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateProductKeySpecifier | (() => undefined | UpdateProductKeySpecifier),
		fields?: UpdateProductFieldPolicy,
	},
	ProductAvailabilityHour?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductAvailabilityHourKeySpecifier | (() => undefined | ProductAvailabilityHourKeySpecifier),
		fields?: ProductAvailabilityHourFieldPolicy,
	},
	RestaurantMenuCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RestaurantMenuCategoryKeySpecifier | (() => undefined | RestaurantMenuCategoryKeySpecifier),
		fields?: RestaurantMenuCategoryFieldPolicy,
	},
	RestaurantFoodItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RestaurantFoodItemKeySpecifier | (() => undefined | RestaurantFoodItemKeySpecifier),
		fields?: RestaurantFoodItemFieldPolicy,
	},
	AddRestaurantFoodItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddRestaurantFoodItemKeySpecifier | (() => undefined | AddRestaurantFoodItemKeySpecifier),
		fields?: AddRestaurantFoodItemFieldPolicy,
	},
	UpdateRestaurantFoodItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateRestaurantFoodItemKeySpecifier | (() => undefined | UpdateRestaurantFoodItemKeySpecifier),
		fields?: UpdateRestaurantFoodItemFieldPolicy,
	},
	BeachBarRestaurant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarRestaurantKeySpecifier | (() => undefined | BeachBarRestaurantKeySpecifier),
		fields?: BeachBarRestaurantFieldPolicy,
	},
	AddBeachBarRestaurant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddBeachBarRestaurantKeySpecifier | (() => undefined | AddBeachBarRestaurantKeySpecifier),
		fields?: AddBeachBarRestaurantFieldPolicy,
	},
	UpdateBeachBarRestaurant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateBeachBarRestaurantKeySpecifier | (() => undefined | UpdateBeachBarRestaurantKeySpecifier),
		fields?: UpdateBeachBarRestaurantFieldPolicy,
	},
	ReviewVoteType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReviewVoteTypeKeySpecifier | (() => undefined | ReviewVoteTypeKeySpecifier),
		fields?: ReviewVoteTypeFieldPolicy,
	},
	ReviewVote?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReviewVoteKeySpecifier | (() => undefined | ReviewVoteKeySpecifier),
		fields?: ReviewVoteFieldPolicy,
	},
	ReviewAnswer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReviewAnswerKeySpecifier | (() => undefined | ReviewAnswerKeySpecifier),
		fields?: ReviewAnswerFieldPolicy,
	},
	AddReviewAnswer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddReviewAnswerKeySpecifier | (() => undefined | AddReviewAnswerKeySpecifier),
		fields?: AddReviewAnswerFieldPolicy,
	},
	UpdateReviewAnswer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateReviewAnswerKeySpecifier | (() => undefined | UpdateReviewAnswerKeySpecifier),
		fields?: UpdateReviewAnswerFieldPolicy,
	},
	BeachBarReview?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarReviewKeySpecifier | (() => undefined | BeachBarReviewKeySpecifier),
		fields?: BeachBarReviewFieldPolicy,
	},
	AddBeachBarReview?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddBeachBarReviewKeySpecifier | (() => undefined | AddBeachBarReviewKeySpecifier),
		fields?: AddBeachBarReviewFieldPolicy,
	},
	UpdateBeachBarReview?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateBeachBarReviewKeySpecifier | (() => undefined | UpdateBeachBarReviewKeySpecifier),
		fields?: UpdateBeachBarReviewFieldPolicy,
	},
	BeachBarService?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarServiceKeySpecifier | (() => undefined | BeachBarServiceKeySpecifier),
		fields?: BeachBarServiceFieldPolicy,
	},
	BeachBarFeature?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarFeatureKeySpecifier | (() => undefined | BeachBarFeatureKeySpecifier),
		fields?: BeachBarFeatureFieldPolicy,
	},
	AddBeachBarFeature?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddBeachBarFeatureKeySpecifier | (() => undefined | AddBeachBarFeatureKeySpecifier),
		fields?: AddBeachBarFeatureFieldPolicy,
	},
	UpdateBeachBarFeature?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateBeachBarFeatureKeySpecifier | (() => undefined | UpdateBeachBarFeatureKeySpecifier),
		fields?: UpdateBeachBarFeatureFieldPolicy,
	},
	BeachBar?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarKeySpecifier | (() => undefined | BeachBarKeySpecifier),
		fields?: BeachBarFieldPolicy,
	},
	AddBeachBar?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddBeachBarKeySpecifier | (() => undefined | AddBeachBarKeySpecifier),
		fields?: AddBeachBarFieldPolicy,
	},
	UpdateBeachBar?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateBeachBarKeySpecifier | (() => undefined | UpdateBeachBarKeySpecifier),
		fields?: UpdateBeachBarFieldPolicy,
	},
	BeachBarAvailability?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarAvailabilityKeySpecifier | (() => undefined | BeachBarAvailabilityKeySpecifier),
		fields?: BeachBarAvailabilityFieldPolicy,
	},
	CartProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CartProductKeySpecifier | (() => undefined | CartProductKeySpecifier),
		fields?: CartProductFieldPolicy,
	},
	AddCartProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddCartProductKeySpecifier | (() => undefined | AddCartProductKeySpecifier),
		fields?: AddCartProductFieldPolicy,
	},
	UpdateCartProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateCartProductKeySpecifier | (() => undefined | UpdateCartProductKeySpecifier),
		fields?: UpdateCartProductFieldPolicy,
	},
	Cart?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CartKeySpecifier | (() => undefined | CartKeySpecifier),
		fields?: CartFieldPolicy,
	},
	Card?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CardKeySpecifier | (() => undefined | CardKeySpecifier),
		fields?: CardFieldPolicy,
	},
	AddCard?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddCardKeySpecifier | (() => undefined | AddCardKeySpecifier),
		fields?: AddCardFieldPolicy,
	},
	UpdateCard?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateCardKeySpecifier | (() => undefined | UpdateCardKeySpecifier),
		fields?: UpdateCardFieldPolicy,
	},
	Customer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerKeySpecifier | (() => undefined | CustomerKeySpecifier),
		fields?: CustomerFieldPolicy,
	},
	AddCustomer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddCustomerKeySpecifier | (() => undefined | AddCustomerKeySpecifier),
		fields?: AddCustomerFieldPolicy,
	},
	UpdateCustomer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateCustomerKeySpecifier | (() => undefined | UpdateCustomerKeySpecifier),
		fields?: UpdateCustomerFieldPolicy,
	},
	CardBrand?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CardBrandKeySpecifier | (() => undefined | CardBrandKeySpecifier),
		fields?: CardBrandFieldPolicy,
	},
	City?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CityKeySpecifier | (() => undefined | CityKeySpecifier),
		fields?: CityFieldPolicy,
	},
	Currency?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CurrencyKeySpecifier | (() => undefined | CurrencyKeySpecifier),
		fields?: CurrencyFieldPolicy,
	},
	Country?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CountryKeySpecifier | (() => undefined | CountryKeySpecifier),
		fields?: CountryFieldPolicy,
	},
	PaymentStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentStatusKeySpecifier | (() => undefined | PaymentStatusKeySpecifier),
		fields?: PaymentStatusFieldPolicy,
	},
	ProductComponent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductComponentKeySpecifier | (() => undefined | ProductComponentKeySpecifier),
		fields?: ProductComponentFieldPolicy,
	},
	BundleProductComponent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BundleProductComponentKeySpecifier | (() => undefined | BundleProductComponentKeySpecifier),
		fields?: BundleProductComponentFieldPolicy,
	},
	ProductCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCategoryKeySpecifier | (() => undefined | ProductCategoryKeySpecifier),
		fields?: ProductCategoryFieldPolicy,
	},
	ReviewVisitType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReviewVisitTypeKeySpecifier | (() => undefined | ReviewVisitTypeKeySpecifier),
		fields?: ReviewVisitTypeFieldPolicy,
	},
	HourTime?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HourTimeKeySpecifier | (() => undefined | HourTimeKeySpecifier),
		fields?: HourTimeFieldPolicy,
	},
	QuarterTime?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuarterTimeKeySpecifier | (() => undefined | QuarterTimeKeySpecifier),
		fields?: QuarterTimeFieldPolicy,
	},
	MonthTime?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MonthTimeKeySpecifier | (() => undefined | MonthTimeKeySpecifier),
		fields?: MonthTimeFieldPolicy,
	},
	BeachBarCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarCategoryKeySpecifier | (() => undefined | BeachBarCategoryKeySpecifier),
		fields?: BeachBarCategoryFieldPolicy,
	},
	VoteCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoteCategoryKeySpecifier | (() => undefined | VoteCategoryKeySpecifier),
		fields?: VoteCategoryFieldPolicy,
	},
	VoteTag?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoteTagKeySpecifier | (() => undefined | VoteTagKeySpecifier),
		fields?: VoteTagFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	OAuthAuthorization?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OAuthAuthorizationKeySpecifier | (() => undefined | OAuthAuthorizationKeySpecifier),
		fields?: OAuthAuthorizationFieldPolicy,
	},
	Owner?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OwnerKeySpecifier | (() => undefined | OwnerKeySpecifier),
		fields?: OwnerFieldPolicy,
	},
	BeachBarOwner?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarOwnerKeySpecifier | (() => undefined | BeachBarOwnerKeySpecifier),
		fields?: BeachBarOwnerFieldPolicy,
	},
	AddBeachBarOwner?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddBeachBarOwnerKeySpecifier | (() => undefined | AddBeachBarOwnerKeySpecifier),
		fields?: AddBeachBarOwnerFieldPolicy,
	},
	UpdateBeachBarOwner?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateBeachBarOwnerKeySpecifier | (() => undefined | UpdateBeachBarOwnerKeySpecifier),
		fields?: UpdateBeachBarOwnerFieldPolicy,
	},
	ReservedProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReservedProductKeySpecifier | (() => undefined | ReservedProductKeySpecifier),
		fields?: ReservedProductFieldPolicy,
	},
	AddReservedProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddReservedProductKeySpecifier | (() => undefined | AddReservedProductKeySpecifier),
		fields?: AddReservedProductFieldPolicy,
	},
	UpdateReservedProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateReservedProductKeySpecifier | (() => undefined | UpdateReservedProductKeySpecifier),
		fields?: UpdateReservedProductFieldPolicy,
	},
	Payment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentKeySpecifier | (() => undefined | PaymentKeySpecifier),
		fields?: PaymentFieldPolicy,
	},
	AddPayment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddPaymentKeySpecifier | (() => undefined | AddPaymentKeySpecifier),
		fields?: AddPaymentFieldPolicy,
	},
	Visit?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VisitKeySpecifier | (() => undefined | VisitKeySpecifier),
		fields?: VisitFieldPolicy,
	},
	PaymentVisits?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentVisitsKeySpecifier | (() => undefined | PaymentVisitsKeySpecifier),
		fields?: PaymentVisitsFieldPolicy,
	},
	PaymentVisitsDates?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentVisitsDatesKeySpecifier | (() => undefined | PaymentVisitsDatesKeySpecifier),
		fields?: PaymentVisitsDatesFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	UserSearch?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserSearchKeySpecifier | (() => undefined | UserSearchKeySpecifier),
		fields?: UserSearchFieldPolicy,
	},
	SearchSort?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchSortKeySpecifier | (() => undefined | SearchSortKeySpecifier),
		fields?: SearchSortFieldPolicy,
	},
	SearchResultType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchResultTypeKeySpecifier | (() => undefined | SearchResultTypeKeySpecifier),
		fields?: SearchResultTypeFieldPolicy,
	},
	Search?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchKeySpecifier | (() => undefined | SearchKeySpecifier),
		fields?: SearchFieldPolicy,
	},
	SearchInputValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchInputValueKeySpecifier | (() => undefined | SearchInputValueKeySpecifier),
		fields?: SearchInputValueFieldPolicy,
	},
	SearchFilter?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchFilterKeySpecifier | (() => undefined | SearchFilterKeySpecifier),
		fields?: SearchFilterFieldPolicy,
	},
	FormattedSearchInputValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FormattedSearchInputValueKeySpecifier | (() => undefined | FormattedSearchInputValueKeySpecifier),
		fields?: FormattedSearchInputValueFieldPolicy,
	},
	Node?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NodeKeySpecifier | (() => undefined | NodeKeySpecifier),
		fields?: NodeFieldPolicy,
	},
	File?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FileKeySpecifier | (() => undefined | FileKeySpecifier),
		fields?: FileFieldPolicy,
	},
	Success?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SuccessKeySpecifier | (() => undefined | SuccessKeySpecifier),
		fields?: SuccessFieldPolicy,
	},
	Update?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateKeySpecifier | (() => undefined | UpdateKeySpecifier),
		fields?: UpdateFieldPolicy,
	},
	Delete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeleteKeySpecifier | (() => undefined | DeleteKeySpecifier),
		fields?: DeleteFieldPolicy,
	},
	Timestamp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TimestampKeySpecifier | (() => undefined | TimestampKeySpecifier),
		fields?: TimestampFieldPolicy,
	},
	UserAccount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserAccountKeySpecifier | (() => undefined | UserAccountKeySpecifier),
		fields?: UserAccountFieldPolicy,
	},
	UserHistoryActivity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserHistoryActivityKeySpecifier | (() => undefined | UserHistoryActivityKeySpecifier),
		fields?: UserHistoryActivityFieldPolicy,
	},
	UserHistory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserHistoryKeySpecifier | (() => undefined | UserHistoryKeySpecifier),
		fields?: UserHistoryFieldPolicy,
	},
	UserHistoryExtended?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserHistoryExtendedKeySpecifier | (() => undefined | UserHistoryExtendedKeySpecifier),
		fields?: UserHistoryExtendedFieldPolicy,
	},
	UserFavoriteBar?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserFavoriteBarKeySpecifier | (() => undefined | UserFavoriteBarKeySpecifier),
		fields?: UserFavoriteBarFieldPolicy,
	},
	UpdateUserFavoriteBar?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateUserFavoriteBarKeySpecifier | (() => undefined | UpdateUserFavoriteBarKeySpecifier),
		fields?: UpdateUserFavoriteBarFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserLogin?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserLoginKeySpecifier | (() => undefined | UserLoginKeySpecifier),
		fields?: UserLoginFieldPolicy,
	},
	UserUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserUpdateKeySpecifier | (() => undefined | UserUpdateKeySpecifier),
		fields?: UserUpdateFieldPolicy,
	},
	Region?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RegionKeySpecifier | (() => undefined | RegionKeySpecifier),
		fields?: RegionFieldPolicy,
	},
	BeachBarStyle?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarStyleKeySpecifier | (() => undefined | BeachBarStyleKeySpecifier),
		fields?: BeachBarStyleFieldPolicy,
	},
	PaymentOfferCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentOfferCodeKeySpecifier | (() => undefined | PaymentOfferCodeKeySpecifier),
		fields?: PaymentOfferCodeFieldPolicy,
	}
};