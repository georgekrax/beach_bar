import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type AccountKeySpecifier = ('address' | 'age' | 'birthday' | 'city' | 'country' | 'honorificTitle' | 'id' | 'imgUrl' | 'phoneNumber' | 'telCountry' | 'trackHistory' | 'user' | 'zipCode' | AccountKeySpecifier)[];
export type AccountFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	age?: FieldPolicy<any> | FieldReadFunction<any>,
	birthday?: FieldPolicy<any> | FieldReadFunction<any>,
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	honorificTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	phoneNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	telCountry?: FieldPolicy<any> | FieldReadFunction<any>,
	trackHistory?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	zipCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddPaymentKeySpecifier = ('added' | 'payment' | AddPaymentKeySpecifier)[];
export type AddPaymentFieldPolicy = {
	added?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddReservedProductKeySpecifier = ('added' | 'reservedProduct' | AddReservedProductKeySpecifier)[];
export type AddReservedProductFieldPolicy = {
	added?: FieldPolicy<any> | FieldReadFunction<any>,
	reservedProduct?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AvailableProductKeySpecifier = ('hourTime' | 'isAvailable' | AvailableProductKeySpecifier)[];
export type AvailableProductFieldPolicy = {
	hourTime?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailable?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarKeySpecifier = ('avgRating' | 'category' | 'closingTime' | 'contactPhoneNumber' | 'currency' | 'description' | 'displayRegardlessCapacity' | 'entryFee' | 'features' | 'foods' | 'hasCompletedSignUp' | 'hidePhoneNumber' | 'id' | 'imgUrls' | 'isActive' | 'location' | 'name' | 'openingTime' | 'owners' | 'payments' | 'products' | 'restaurants' | 'reviews' | 'slug' | 'styles' | 'thumbnailUrl' | 'timestamp' | 'updatedAt' | 'zeroCartTotal' | BeachBarKeySpecifier)[];
export type BeachBarFieldPolicy = {
	avgRating?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	closingTime?: FieldPolicy<any> | FieldReadFunction<any>,
	contactPhoneNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	displayRegardlessCapacity?: FieldPolicy<any> | FieldReadFunction<any>,
	entryFee?: FieldPolicy<any> | FieldReadFunction<any>,
	features?: FieldPolicy<any> | FieldReadFunction<any>,
	foods?: FieldPolicy<any> | FieldReadFunction<any>,
	hasCompletedSignUp?: FieldPolicy<any> | FieldReadFunction<any>,
	hidePhoneNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrls?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	location?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	openingTime?: FieldPolicy<any> | FieldReadFunction<any>,
	owners?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurants?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	styles?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnailUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	zeroCartTotal?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarCategoryKeySpecifier = ('description' | 'id' | 'name' | BeachBarCategoryKeySpecifier)[];
export type BeachBarCategoryFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarFeatureKeySpecifier = ('beachBar' | 'description' | 'id' | 'quantity' | 'service' | 'timestamp' | 'updatedAt' | BeachBarFeatureKeySpecifier)[];
export type BeachBarFeatureFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	service?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarImgUrlKeySpecifier = ('beachBar' | 'description' | 'id' | 'imgUrl' | 'timestamp' | 'updatedAt' | BeachBarImgUrlKeySpecifier)[];
export type BeachBarImgUrlFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarLocationKeySpecifier = ('address' | 'city' | 'country' | 'formattedLocation' | 'id' | 'latitude' | 'longitude' | 'region' | 'whereIs' | 'zipCode' | BeachBarLocationKeySpecifier)[];
export type BeachBarLocationFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	formattedLocation?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	latitude?: FieldPolicy<any> | FieldReadFunction<any>,
	longitude?: FieldPolicy<any> | FieldReadFunction<any>,
	region?: FieldPolicy<any> | FieldReadFunction<any>,
	whereIs?: FieldPolicy<any> | FieldReadFunction<any>,
	zipCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarOwnerKeySpecifier = ('beachBar' | 'id' | 'isPrimary' | 'owner' | 'publicInfo' | 'timestamp' | BeachBarOwnerKeySpecifier)[];
export type BeachBarOwnerFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isPrimary?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	publicInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarRestaurantKeySpecifier = ('beachBar' | 'description' | 'foodItems' | 'id' | 'isActive' | 'name' | BeachBarRestaurantKeySpecifier)[];
export type BeachBarRestaurantFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	foodItems?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarReviewKeySpecifier = ('answer' | 'beachBar' | 'body' | 'customer' | 'id' | 'month' | 'negativeComment' | 'payment' | 'positiveComment' | 'ratingValue' | 'timestamp' | 'updatedAt' | 'visitType' | 'votes' | BeachBarReviewKeySpecifier)[];
export type BeachBarReviewFieldPolicy = {
	answer?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	body?: FieldPolicy<any> | FieldReadFunction<any>,
	customer?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	month?: FieldPolicy<any> | FieldReadFunction<any>,
	negativeComment?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	positiveComment?: FieldPolicy<any> | FieldReadFunction<any>,
	ratingValue?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	visitType?: FieldPolicy<any> | FieldReadFunction<any>,
	votes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarServiceKeySpecifier = ('icon' | 'id' | 'name' | BeachBarServiceKeySpecifier)[];
export type BeachBarServiceFieldPolicy = {
	icon?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BeachBarStyleKeySpecifier = ('id' | 'name' | BeachBarStyleKeySpecifier)[];
export type BeachBarStyleFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CardKeySpecifier = ('brand' | 'cardholderName' | 'country' | 'customer' | 'expMonth' | 'expYear' | 'id' | 'isDefault' | 'last4' | 'stripeId' | 'type' | CardKeySpecifier)[];
export type CardFieldPolicy = {
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	cardholderName?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	customer?: FieldPolicy<any> | FieldReadFunction<any>,
	expMonth?: FieldPolicy<any> | FieldReadFunction<any>,
	expYear?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	last4?: FieldPolicy<any> | FieldReadFunction<any>,
	stripeId?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CardBrandKeySpecifier = ('id' | 'name' | CardBrandKeySpecifier)[];
export type CardBrandFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CartKeySpecifier = ('foods' | 'foodsTotal' | 'id' | 'notes' | 'products' | 'productstotal' | 'total' | 'user' | CartKeySpecifier)[];
export type CartFieldPolicy = {
	foods?: FieldPolicy<any> | FieldReadFunction<any>,
	foodsTotal?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	notes?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	productstotal?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CartFoodKeySpecifier = ('cart' | 'date' | 'deletedAt' | 'food' | 'id' | 'quantity' | 'timestamp' | 'total' | 'updatedAt' | CartFoodKeySpecifier)[];
export type CartFoodFieldPolicy = {
	cart?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	deletedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	food?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CartNoteKeySpecifier = ('beachBar' | 'body' | 'cart' | 'id' | 'timestamp' | CartNoteKeySpecifier)[];
export type CartNoteFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	body?: FieldPolicy<any> | FieldReadFunction<any>,
	cart?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CartProductKeySpecifier = ('cart' | 'date' | 'endTime' | 'id' | 'people' | 'product' | 'quantity' | 'startTime' | 'timestamp' | 'total' | CartProductKeySpecifier)[];
export type CartProductFieldPolicy = {
	cart?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	endTime?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	people?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	startTime?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CitiesAndRegionsKeySpecifier = ('cities' | 'regions' | CitiesAndRegionsKeySpecifier)[];
export type CitiesAndRegionsFieldPolicy = {
	cities?: FieldPolicy<any> | FieldReadFunction<any>,
	regions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CityKeySpecifier = ('country' | 'id' | 'name' | CityKeySpecifier)[];
export type CityFieldPolicy = {
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CountryKeySpecifier = ('alpha2Code' | 'alpha3Code' | 'callingCode' | 'cities' | 'currency' | 'id' | 'isEu' | 'name' | CountryKeySpecifier)[];
export type CountryFieldPolicy = {
	alpha2Code?: FieldPolicy<any> | FieldReadFunction<any>,
	alpha3Code?: FieldPolicy<any> | FieldReadFunction<any>,
	callingCode?: FieldPolicy<any> | FieldReadFunction<any>,
	cities?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isEu?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CurrencyKeySpecifier = ('id' | 'isoCode' | 'name' | 'secondSymbol' | 'symbol' | CurrencyKeySpecifier)[];
export type CurrencyFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isoCode?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	secondSymbol?: FieldPolicy<any> | FieldReadFunction<any>,
	symbol?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerKeySpecifier = ('cards' | 'country' | 'email' | 'id' | 'phoneNumber' | 'user' | CustomerKeySpecifier)[];
export type CustomerFieldPolicy = {
	cards?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	phoneNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBalanceKeySpecifier = ('grossVolume' | 'revenue' | 'successfulPayments' | DashboardBalanceKeySpecifier)[];
export type DashboardBalanceFieldPolicy = {
	grossVolume?: FieldPolicy<any> | FieldReadFunction<any>,
	revenue?: FieldPolicy<any> | FieldReadFunction<any>,
	successfulPayments?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBillingKeySpecifier = ('avgFoods' | 'avgProducts' | 'customersCountries' | 'foods' | 'products' | 'refundedPayments' | DashboardBillingKeySpecifier)[];
export type DashboardBillingFieldPolicy = {
	avgFoods?: FieldPolicy<any> | FieldReadFunction<any>,
	avgProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	customersCountries?: FieldPolicy<any> | FieldReadFunction<any>,
	foods?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	refundedPayments?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBillingCustomerCountriesKeySpecifier = ('country' | 'value' | DashboardBillingCustomerCountriesKeySpecifier)[];
export type DashboardBillingCustomerCountriesFieldPolicy = {
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBillingFieldKeySpecifier = ('revenue' | DashboardBillingFieldKeySpecifier)[];
export type DashboardBillingFieldFieldPolicy = {
	revenue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBillingFoodsKeySpecifier = ('mostCommon' | 'revenue' | DashboardBillingFoodsKeySpecifier)[];
export type DashboardBillingFoodsFieldPolicy = {
	mostCommon?: FieldPolicy<any> | FieldReadFunction<any>,
	revenue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBillingMostCommonFoodsKeySpecifier = ('food' | 'timesPurchased' | DashboardBillingMostCommonFoodsKeySpecifier)[];
export type DashboardBillingMostCommonFoodsFieldPolicy = {
	food?: FieldPolicy<any> | FieldReadFunction<any>,
	timesPurchased?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBillingMostCommonProductsKeySpecifier = ('product' | 'timesBooked' | DashboardBillingMostCommonProductsKeySpecifier)[];
export type DashboardBillingMostCommonProductsFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	timesBooked?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBillingProductsKeySpecifier = ('mostCommon' | 'revenue' | DashboardBillingProductsKeySpecifier)[];
export type DashboardBillingProductsFieldPolicy = {
	mostCommon?: FieldPolicy<any> | FieldReadFunction<any>,
	revenue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBillingRefundedPaymentsKeySpecifier = ('date' | 'payments' | DashboardBillingRefundedPaymentsKeySpecifier)[];
export type DashboardBillingRefundedPaymentsFieldPolicy = {
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBookingsKeySpecifier = ('bookings' | 'capacity' | 'mostActive' | DashboardBookingsKeySpecifier)[];
export type DashboardBookingsFieldPolicy = {
	bookings?: FieldPolicy<any> | FieldReadFunction<any>,
	capacity?: FieldPolicy<any> | FieldReadFunction<any>,
	mostActive?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardBookingsCapacityKeySpecifier = ('arr' | 'maxCapacity' | 'totalCustomers' | 'totalHourCustomers' | DashboardBookingsCapacityKeySpecifier)[];
export type DashboardBookingsCapacityFieldPolicy = {
	arr?: FieldPolicy<any> | FieldReadFunction<any>,
	maxCapacity?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCustomers?: FieldPolicy<any> | FieldReadFunction<any>,
	totalHourCustomers?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardCapacityKeySpecifier = ('availableProducts' | 'percentage' | 'reservedProducts' | 'totalHourCustomers' | 'totalMaxPeopleCapacity' | DashboardCapacityKeySpecifier)[];
export type DashboardCapacityFieldPolicy = {
	availableProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	percentage?: FieldPolicy<any> | FieldReadFunction<any>,
	reservedProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	totalHourCustomers?: FieldPolicy<any> | FieldReadFunction<any>,
	totalMaxPeopleCapacity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardCapacityPercentageKeySpecifier = ('date' | 'percentage' | DashboardCapacityPercentageKeySpecifier)[];
export type DashboardCapacityPercentageFieldPolicy = {
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	percentage?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardDateValueKeySpecifier = ('date' | 'value' | DashboardDateValueKeySpecifier)[];
export type DashboardDateValueFieldPolicy = {
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardHomePageKeySpecifier = ('avgRating' | 'avgSpendPerPerson' | 'balance' | 'capacity' | 'grossVolume' | 'newCustomers' | 'totalCustomers' | DashboardHomePageKeySpecifier)[];
export type DashboardHomePageFieldPolicy = {
	avgRating?: FieldPolicy<any> | FieldReadFunction<any>,
	avgSpendPerPerson?: FieldPolicy<any> | FieldReadFunction<any>,
	balance?: FieldPolicy<any> | FieldReadFunction<any>,
	capacity?: FieldPolicy<any> | FieldReadFunction<any>,
	grossVolume?: FieldPolicy<any> | FieldReadFunction<any>,
	newCustomers?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCustomers?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardMaxCapacityKeySpecifier = ('availableProducts' | 'date' | 'limitPeople' | DashboardMaxCapacityKeySpecifier)[];
export type DashboardMaxCapacityFieldPolicy = {
	availableProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	limitPeople?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardMostActiveKeySpecifier = ('hour' | 'weekDay' | DashboardMostActiveKeySpecifier)[];
export type DashboardMostActiveFieldPolicy = {
	hour?: FieldPolicy<any> | FieldReadFunction<any>,
	weekDay?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DashboardNewCustomersKeySpecifier = ('customers' | 'date' | DashboardNewCustomersKeySpecifier)[];
export type DashboardNewCustomersFieldPolicy = {
	customers?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ErrorKeySpecifier = ('error' | ErrorKeySpecifier)[];
export type ErrorFieldPolicy = {
	error?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ErrorObjectKeySpecifier = ('code' | 'message' | ErrorObjectKeySpecifier)[];
export type ErrorObjectFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileKeySpecifier = ('encoding' | 'filename' | 'mimetype' | FileKeySpecifier)[];
export type FileFieldPolicy = {
	encoding?: FieldPolicy<any> | FieldReadFunction<any>,
	filename?: FieldPolicy<any> | FieldReadFunction<any>,
	mimetype?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FoodKeySpecifier = ('beachBar' | 'category' | 'deletedAt' | 'id' | 'ingredients' | 'maxQuantity' | 'name' | 'price' | 'timestamp' | 'updatedAt' | FoodKeySpecifier)[];
export type FoodFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	deletedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	ingredients?: FieldPolicy<any> | FieldReadFunction<any>,
	maxQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FoodCategoryKeySpecifier = ('icon' | 'id' | 'name' | FoodCategoryKeySpecifier)[];
export type FoodCategoryFieldPolicy = {
	icon?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HourTimeKeySpecifier = ('id' | 'utcValue' | 'value' | HourTimeKeySpecifier)[];
export type HourTimeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	utcValue?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type IconKeySpecifier = ('id' | 'name' | 'publicId' | IconKeySpecifier)[];
export type IconFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	publicId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LoginAuthorizeKeySpecifier = ('accessToken' | 'isNewUser' | 'refreshToken' | 'scope' | 'user' | LoginAuthorizeKeySpecifier)[];
export type LoginAuthorizeFieldPolicy = {
	accessToken?: FieldPolicy<any> | FieldReadFunction<any>,
	isNewUser?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	scope?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MonthTimeKeySpecifier = ('days' | 'id' | 'value' | MonthTimeKeySpecifier)[];
export type MonthTimeFieldPolicy = {
	days?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('addBeachBar' | 'addBeachBarFeature' | 'addBeachBarImgUrl' | 'addBeachBarLocation' | 'addBeachBarOwner' | 'addBeachBarRestaurant' | 'addBeachBarStyles' | 'addCartFood' | 'addCartNote' | 'addCartProduct' | 'addCustomerPaymentMethod' | 'addFood' | 'addProduct' | 'addProductReservationLimit' | 'addRestaurantFoodItem' | 'addReview' | 'authorize' | 'authorizeWithFacebook' | 'authorizeWithGoogle' | 'authorizeWithInstagram' | 'cacheBeachBars' | 'changeUserPassword' | 'checkout' | 'completeBeachBarSignUp' | 'deleteBeachBar' | 'deleteBeachBarFeature' | 'deleteBeachBarImgUrl' | 'deleteBeachBarOwner' | 'deleteBeachBarRestaurant' | 'deleteBeachBarStyles' | 'deleteCart' | 'deleteCartFood' | 'deleteCartProduct' | 'deleteCustomer' | 'deleteCustomerPaymentMethod' | 'deleteFood' | 'deleteProduct' | 'deleteProductReservationLimit' | 'deleteRestaurantFoodItem' | 'deleteReview' | 'deleteUserFavoriteBar' | 'hello' | 'login' | 'logout' | 'refundPayment' | 'restoreBeachBarProduct' | 'sendForgotPasswordLink' | 'signS3' | 'signUp' | 'updateBeachBaImgUrl' | 'updateBeachBar' | 'updateBeachBarFeature' | 'updateBeachBarLocation' | 'updateBeachBarOwner' | 'updateBeachBarRestaurant' | 'updateCartFood' | 'updateCartNote' | 'updateCartProduct' | 'updateCustomer' | 'updateCustomerPaymentMethod' | 'updateFavouriteBeachBar' | 'updateFood' | 'updateProduct' | 'updateProductReservationLimit' | 'updateRestaurantFoodItem' | 'updateReview' | 'updateReviewVote' | 'updateSearch' | 'updateUser' | 'uploadSingleFile' | 'verifyUserPaymentForReview' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	addBeachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarFeature?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarImgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarLocation?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarOwner?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	addBeachBarStyles?: FieldPolicy<any> | FieldReadFunction<any>,
	addCartFood?: FieldPolicy<any> | FieldReadFunction<any>,
	addCartNote?: FieldPolicy<any> | FieldReadFunction<any>,
	addCartProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	addCustomerPaymentMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	addFood?: FieldPolicy<any> | FieldReadFunction<any>,
	addProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	addProductReservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	addRestaurantFoodItem?: FieldPolicy<any> | FieldReadFunction<any>,
	addReview?: FieldPolicy<any> | FieldReadFunction<any>,
	authorize?: FieldPolicy<any> | FieldReadFunction<any>,
	authorizeWithFacebook?: FieldPolicy<any> | FieldReadFunction<any>,
	authorizeWithGoogle?: FieldPolicy<any> | FieldReadFunction<any>,
	authorizeWithInstagram?: FieldPolicy<any> | FieldReadFunction<any>,
	cacheBeachBars?: FieldPolicy<any> | FieldReadFunction<any>,
	changeUserPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	completeBeachBarSignUp?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarFeature?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarImgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarOwner?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteBeachBarStyles?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCart?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCartFood?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCartProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCustomerPaymentMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteFood?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProductReservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteRestaurantFoodItem?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteReview?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUserFavoriteBar?: FieldPolicy<any> | FieldReadFunction<any>,
	hello?: FieldPolicy<any> | FieldReadFunction<any>,
	login?: FieldPolicy<any> | FieldReadFunction<any>,
	logout?: FieldPolicy<any> | FieldReadFunction<any>,
	refundPayment?: FieldPolicy<any> | FieldReadFunction<any>,
	restoreBeachBarProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	sendForgotPasswordLink?: FieldPolicy<any> | FieldReadFunction<any>,
	signS3?: FieldPolicy<any> | FieldReadFunction<any>,
	signUp?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBaImgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBarFeature?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBarLocation?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBarOwner?: FieldPolicy<any> | FieldReadFunction<any>,
	updateBeachBarRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCartFood?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCartNote?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCartProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCustomerPaymentMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	updateFavouriteBeachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	updateFood?: FieldPolicy<any> | FieldReadFunction<any>,
	updateProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	updateProductReservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	updateRestaurantFoodItem?: FieldPolicy<any> | FieldReadFunction<any>,
	updateReview?: FieldPolicy<any> | FieldReadFunction<any>,
	updateReviewVote?: FieldPolicy<any> | FieldReadFunction<any>,
	updateSearch?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUser?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadSingleFile?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyUserPaymentForReview?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OwnerKeySpecifier = ('id' | 'user' | OwnerKeySpecifier)[];
export type OwnerFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentKeySpecifier = ('appFee' | 'card' | 'cart' | 'deletedAt' | 'id' | 'isRefunded' | 'refCode' | 'reservedProducts' | 'status' | 'stripeId' | 'stripeProccessingFee' | 'timestamp' | 'total' | PaymentKeySpecifier)[];
export type PaymentFieldPolicy = {
	appFee?: FieldPolicy<any> | FieldReadFunction<any>,
	card?: FieldPolicy<any> | FieldReadFunction<any>,
	cart?: FieldPolicy<any> | FieldReadFunction<any>,
	deletedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefunded?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>,
	reservedProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	stripeId?: FieldPolicy<any> | FieldReadFunction<any>,
	stripeProccessingFee?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentStatusKeySpecifier = ('id' | 'name' | PaymentStatusKeySpecifier)[];
export type PaymentStatusFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
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
export type ProductKeySpecifier = ('beachBar' | 'category' | 'deletedAt' | 'description' | 'id' | 'imgUrl' | 'isActive' | 'isIndividual' | 'maxPeople' | 'minFoodSpending' | 'name' | 'price' | 'reservationLimits' | 'updatedAt' | ProductKeySpecifier)[];
export type ProductFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	deletedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	isIndividual?: FieldPolicy<any> | FieldReadFunction<any>,
	maxPeople?: FieldPolicy<any> | FieldReadFunction<any>,
	minFoodSpending?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	reservationLimits?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAvailabilityKeySpecifier = ('product' | 'quantity' | ProductAvailabilityKeySpecifier)[];
export type ProductAvailabilityFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAvailabilityHourKeySpecifier = ('hourTime' | 'isAvailable' | ProductAvailabilityHourKeySpecifier)[];
export type ProductAvailabilityHourFieldPolicy = {
	hourTime?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailable?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCategoryKeySpecifier = ('components' | 'description' | 'id' | 'name' | 'underscoredName' | ProductCategoryKeySpecifier)[];
export type ProductCategoryFieldPolicy = {
	components?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	underscoredName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCategoryComponentKeySpecifier = ('category' | 'component' | 'quantity' | ProductCategoryComponentKeySpecifier)[];
export type ProductCategoryComponentFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	component?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductComponentKeySpecifier = ('icon' | 'id' | 'name' | ProductComponentKeySpecifier)[];
export type ProductComponentFieldPolicy = {
	icon?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductRecommendedKeySpecifier = ('product' | 'quantity' | ProductRecommendedKeySpecifier)[];
export type ProductRecommendedFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductReservationLimitKeySpecifier = ('endTime' | 'from' | 'id' | 'limitNumber' | 'product' | 'startTime' | 'to' | ProductReservationLimitKeySpecifier)[];
export type ProductReservationLimitFieldPolicy = {
	endTime?: FieldPolicy<any> | FieldReadFunction<any>,
	from?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	limitNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	startTime?: FieldPolicy<any> | FieldReadFunction<any>,
	to?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QuarterTimeKeySpecifier = ('id' | 'utcValue' | 'value' | QuarterTimeKeySpecifier)[];
export type QuarterTimeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	utcValue?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('accessToken' | 'account' | 'accountLink' | 'availableHours' | 'availableProducts' | 'beachBar' | 'beachBarImgs' | 'cart' | 'cartEntryFees' | 'citiesAndRegions' | 'customer' | 'customerPaymentMethods' | 'dashboardBilling' | 'dashboardBookings' | 'dashboardHomePage' | 'favouriteBeachBars' | 'food' | 'foods' | 'getAllBeachBars' | 'getFacebookOAuthUrl' | 'getGoogleOAuthUrl' | 'getInstagramOAuthUrl' | 'getPersonalizedBeachBars' | 'getProductAvailabilityHours' | 'getProductAvailabilityQuantity' | 'getStripeLoginLink' | 'hasProductReservationLimit' | 'hello' | 'hey' | 'me' | 'nearBeachBars' | 'payment' | 'paymentRefundAmount' | 'payments' | 'product' | 'products' | 'review' | 'reviews' | 'search' | 'searchInputValues' | 'stripeConnectUrl' | 'userHistory' | 'userSearches' | 'verifyZeroCartTotal' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	accessToken?: FieldPolicy<any> | FieldReadFunction<any>,
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	accountLink?: FieldPolicy<any> | FieldReadFunction<any>,
	availableHours?: FieldPolicy<any> | FieldReadFunction<any>,
	availableProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	beachBarImgs?: FieldPolicy<any> | FieldReadFunction<any>,
	cart?: FieldPolicy<any> | FieldReadFunction<any>,
	cartEntryFees?: FieldPolicy<any> | FieldReadFunction<any>,
	citiesAndRegions?: FieldPolicy<any> | FieldReadFunction<any>,
	customer?: FieldPolicy<any> | FieldReadFunction<any>,
	customerPaymentMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	dashboardBilling?: FieldPolicy<any> | FieldReadFunction<any>,
	dashboardBookings?: FieldPolicy<any> | FieldReadFunction<any>,
	dashboardHomePage?: FieldPolicy<any> | FieldReadFunction<any>,
	favouriteBeachBars?: FieldPolicy<any> | FieldReadFunction<any>,
	food?: FieldPolicy<any> | FieldReadFunction<any>,
	foods?: FieldPolicy<any> | FieldReadFunction<any>,
	getAllBeachBars?: FieldPolicy<any> | FieldReadFunction<any>,
	getFacebookOAuthUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	getGoogleOAuthUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	getInstagramOAuthUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	getPersonalizedBeachBars?: FieldPolicy<any> | FieldReadFunction<any>,
	getProductAvailabilityHours?: FieldPolicy<any> | FieldReadFunction<any>,
	getProductAvailabilityQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	getStripeLoginLink?: FieldPolicy<any> | FieldReadFunction<any>,
	hasProductReservationLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	hello?: FieldPolicy<any> | FieldReadFunction<any>,
	hey?: FieldPolicy<any> | FieldReadFunction<any>,
	me?: FieldPolicy<any> | FieldReadFunction<any>,
	nearBeachBars?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentRefundAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews?: FieldPolicy<any> | FieldReadFunction<any>,
	search?: FieldPolicy<any> | FieldReadFunction<any>,
	searchInputValues?: FieldPolicy<any> | FieldReadFunction<any>,
	stripeConnectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	userHistory?: FieldPolicy<any> | FieldReadFunction<any>,
	userSearches?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyZeroCartTotal?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RegionKeySpecifier = ('city' | 'country' | 'id' | 'name' | RegionKeySpecifier)[];
export type RegionFieldPolicy = {
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReservedProductKeySpecifier = ('date' | 'endTime' | 'id' | 'isRefunded' | 'payment' | 'product' | 'startTime' | ReservedProductKeySpecifier)[];
export type ReservedProductFieldPolicy = {
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	endTime?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefunded?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	startTime?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RestaurantFoodItemKeySpecifier = ('id' | 'imgUrl' | 'menuCategory' | 'name' | 'price' | RestaurantFoodItemKeySpecifier)[];
export type RestaurantFoodItemFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	imgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	menuCategory?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RestaurantMenuCategoryKeySpecifier = ('id' | 'name' | RestaurantMenuCategoryKeySpecifier)[];
export type RestaurantMenuCategoryFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReviewVisitTypeKeySpecifier = ('id' | 'name' | ReviewVisitTypeKeySpecifier)[];
export type ReviewVisitTypeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReviewVoteKeySpecifier = ('id' | 'review' | 'timestamp' | 'type' | 'updatedAt' | 'user' | ReviewVoteKeySpecifier)[];
export type ReviewVoteFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReviewVoteTypeKeySpecifier = ('id' | 'value' | ReviewVoteTypeKeySpecifier)[];
export type ReviewVoteTypeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type S3PayloadKeySpecifier = ('signedRequest' | 'url' | S3PayloadKeySpecifier)[];
export type S3PayloadFieldPolicy = {
	signedRequest?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchKeySpecifier = ('results' | 'search' | SearchKeySpecifier)[];
export type SearchFieldPolicy = {
	results?: FieldPolicy<any> | FieldReadFunction<any>,
	search?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchFilterKeySpecifier = ('description' | 'id' | 'name' | 'publicId' | SearchFilterKeySpecifier)[];
export type SearchFilterFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	publicId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchInputValueKeySpecifier = ('beachBar' | 'city' | 'country' | 'formattedValue' | 'id' | 'publicId' | 'region' | SearchInputValueKeySpecifier)[];
export type SearchInputValueFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	formattedValue?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	publicId?: FieldPolicy<any> | FieldReadFunction<any>,
	region?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchResultTypeKeySpecifier = ('beachBar' | 'hasCapacity' | 'recommendedProducts' | 'totalPrice' | SearchResultTypeKeySpecifier)[];
export type SearchResultTypeFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	hasCapacity?: FieldPolicy<any> | FieldReadFunction<any>,
	recommendedProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SearchSortKeySpecifier = ('id' | 'name' | SearchSortKeySpecifier)[];
export type SearchSortFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateReservedProductKeySpecifier = ('reservedProduct' | 'updated' | UpdateReservedProductKeySpecifier)[];
export type UpdateReservedProductFieldPolicy = {
	reservedProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	updated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('account' | 'email' | 'favoriteBars' | 'firstName' | 'fullName' | 'id' | 'lastName' | 'reviewVotes' | 'reviews' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	favoriteBars?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	fullName?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	reviewVotes?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserFavoriteBarKeySpecifier = ('beachBar' | 'id' | 'user' | UserFavoriteBarKeySpecifier)[];
export type UserFavoriteBarFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserHistoryKeySpecifier = ('activity' | 'id' | 'objectId' | 'timestamp' | 'user' | UserHistoryKeySpecifier)[];
export type UserHistoryFieldPolicy = {
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	objectId?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserHistoryActivityKeySpecifier = ('id' | 'name' | UserHistoryActivityKeySpecifier)[];
export type UserHistoryActivityFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserHistoryExtendedKeySpecifier = ('beachBar' | 'search' | 'userHistory' | UserHistoryExtendedKeySpecifier)[];
export type UserHistoryExtendedFieldPolicy = {
	beachBar?: FieldPolicy<any> | FieldReadFunction<any>,
	search?: FieldPolicy<any> | FieldReadFunction<any>,
	userHistory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserSearchKeySpecifier = ('adults' | 'children' | 'date' | 'filters' | 'id' | 'inputValue' | 'sort' | 'timestamp' | 'updatedAt' | 'user' | UserSearchKeySpecifier)[];
export type UserSearchFieldPolicy = {
	adults?: FieldPolicy<any> | FieldReadFunction<any>,
	children?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	filters?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inputValue?: FieldPolicy<any> | FieldReadFunction<any>,
	sort?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VisitKeySpecifier = ('date' | 'endTime' | 'isRefunded' | 'isUpcoming' | 'payment' | 'startTime' | VisitKeySpecifier)[];
export type VisitFieldPolicy = {
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	endTime?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefunded?: FieldPolicy<any> | FieldReadFunction<any>,
	isUpcoming?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	startTime?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoteCategoryKeySpecifier = ('description' | 'id' | 'refCode' | 'title' | VoteCategoryKeySpecifier)[];
export type VoteCategoryFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	refCode?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoteTagKeySpecifier = ('category' | 'downvotes' | 'id' | 'totalVotes' | 'upvotes' | VoteTagKeySpecifier)[];
export type VoteTagFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	downvotes?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	totalVotes?: FieldPolicy<any> | FieldReadFunction<any>,
	upvotes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Account?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountKeySpecifier | (() => undefined | AccountKeySpecifier),
		fields?: AccountFieldPolicy,
	},
	AddPayment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddPaymentKeySpecifier | (() => undefined | AddPaymentKeySpecifier),
		fields?: AddPaymentFieldPolicy,
	},
	AddReservedProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddReservedProductKeySpecifier | (() => undefined | AddReservedProductKeySpecifier),
		fields?: AddReservedProductFieldPolicy,
	},
	AvailableProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AvailableProductKeySpecifier | (() => undefined | AvailableProductKeySpecifier),
		fields?: AvailableProductFieldPolicy,
	},
	BeachBar?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarKeySpecifier | (() => undefined | BeachBarKeySpecifier),
		fields?: BeachBarFieldPolicy,
	},
	BeachBarCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarCategoryKeySpecifier | (() => undefined | BeachBarCategoryKeySpecifier),
		fields?: BeachBarCategoryFieldPolicy,
	},
	BeachBarFeature?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarFeatureKeySpecifier | (() => undefined | BeachBarFeatureKeySpecifier),
		fields?: BeachBarFeatureFieldPolicy,
	},
	BeachBarImgUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarImgUrlKeySpecifier | (() => undefined | BeachBarImgUrlKeySpecifier),
		fields?: BeachBarImgUrlFieldPolicy,
	},
	BeachBarLocation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarLocationKeySpecifier | (() => undefined | BeachBarLocationKeySpecifier),
		fields?: BeachBarLocationFieldPolicy,
	},
	BeachBarOwner?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarOwnerKeySpecifier | (() => undefined | BeachBarOwnerKeySpecifier),
		fields?: BeachBarOwnerFieldPolicy,
	},
	BeachBarRestaurant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarRestaurantKeySpecifier | (() => undefined | BeachBarRestaurantKeySpecifier),
		fields?: BeachBarRestaurantFieldPolicy,
	},
	BeachBarReview?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarReviewKeySpecifier | (() => undefined | BeachBarReviewKeySpecifier),
		fields?: BeachBarReviewFieldPolicy,
	},
	BeachBarService?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarServiceKeySpecifier | (() => undefined | BeachBarServiceKeySpecifier),
		fields?: BeachBarServiceFieldPolicy,
	},
	BeachBarStyle?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BeachBarStyleKeySpecifier | (() => undefined | BeachBarStyleKeySpecifier),
		fields?: BeachBarStyleFieldPolicy,
	},
	Card?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CardKeySpecifier | (() => undefined | CardKeySpecifier),
		fields?: CardFieldPolicy,
	},
	CardBrand?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CardBrandKeySpecifier | (() => undefined | CardBrandKeySpecifier),
		fields?: CardBrandFieldPolicy,
	},
	Cart?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CartKeySpecifier | (() => undefined | CartKeySpecifier),
		fields?: CartFieldPolicy,
	},
	CartFood?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CartFoodKeySpecifier | (() => undefined | CartFoodKeySpecifier),
		fields?: CartFoodFieldPolicy,
	},
	CartNote?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CartNoteKeySpecifier | (() => undefined | CartNoteKeySpecifier),
		fields?: CartNoteFieldPolicy,
	},
	CartProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CartProductKeySpecifier | (() => undefined | CartProductKeySpecifier),
		fields?: CartProductFieldPolicy,
	},
	CitiesAndRegions?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CitiesAndRegionsKeySpecifier | (() => undefined | CitiesAndRegionsKeySpecifier),
		fields?: CitiesAndRegionsFieldPolicy,
	},
	City?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CityKeySpecifier | (() => undefined | CityKeySpecifier),
		fields?: CityFieldPolicy,
	},
	Country?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CountryKeySpecifier | (() => undefined | CountryKeySpecifier),
		fields?: CountryFieldPolicy,
	},
	Currency?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CurrencyKeySpecifier | (() => undefined | CurrencyKeySpecifier),
		fields?: CurrencyFieldPolicy,
	},
	Customer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerKeySpecifier | (() => undefined | CustomerKeySpecifier),
		fields?: CustomerFieldPolicy,
	},
	DashboardBalance?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBalanceKeySpecifier | (() => undefined | DashboardBalanceKeySpecifier),
		fields?: DashboardBalanceFieldPolicy,
	},
	DashboardBilling?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBillingKeySpecifier | (() => undefined | DashboardBillingKeySpecifier),
		fields?: DashboardBillingFieldPolicy,
	},
	DashboardBillingCustomerCountries?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBillingCustomerCountriesKeySpecifier | (() => undefined | DashboardBillingCustomerCountriesKeySpecifier),
		fields?: DashboardBillingCustomerCountriesFieldPolicy,
	},
	DashboardBillingField?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBillingFieldKeySpecifier | (() => undefined | DashboardBillingFieldKeySpecifier),
		fields?: DashboardBillingFieldFieldPolicy,
	},
	DashboardBillingFoods?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBillingFoodsKeySpecifier | (() => undefined | DashboardBillingFoodsKeySpecifier),
		fields?: DashboardBillingFoodsFieldPolicy,
	},
	DashboardBillingMostCommonFoods?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBillingMostCommonFoodsKeySpecifier | (() => undefined | DashboardBillingMostCommonFoodsKeySpecifier),
		fields?: DashboardBillingMostCommonFoodsFieldPolicy,
	},
	DashboardBillingMostCommonProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBillingMostCommonProductsKeySpecifier | (() => undefined | DashboardBillingMostCommonProductsKeySpecifier),
		fields?: DashboardBillingMostCommonProductsFieldPolicy,
	},
	DashboardBillingProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBillingProductsKeySpecifier | (() => undefined | DashboardBillingProductsKeySpecifier),
		fields?: DashboardBillingProductsFieldPolicy,
	},
	DashboardBillingRefundedPayments?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBillingRefundedPaymentsKeySpecifier | (() => undefined | DashboardBillingRefundedPaymentsKeySpecifier),
		fields?: DashboardBillingRefundedPaymentsFieldPolicy,
	},
	DashboardBookings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBookingsKeySpecifier | (() => undefined | DashboardBookingsKeySpecifier),
		fields?: DashboardBookingsFieldPolicy,
	},
	DashboardBookingsCapacity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardBookingsCapacityKeySpecifier | (() => undefined | DashboardBookingsCapacityKeySpecifier),
		fields?: DashboardBookingsCapacityFieldPolicy,
	},
	DashboardCapacity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardCapacityKeySpecifier | (() => undefined | DashboardCapacityKeySpecifier),
		fields?: DashboardCapacityFieldPolicy,
	},
	DashboardCapacityPercentage?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardCapacityPercentageKeySpecifier | (() => undefined | DashboardCapacityPercentageKeySpecifier),
		fields?: DashboardCapacityPercentageFieldPolicy,
	},
	DashboardDateValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardDateValueKeySpecifier | (() => undefined | DashboardDateValueKeySpecifier),
		fields?: DashboardDateValueFieldPolicy,
	},
	DashboardHomePage?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardHomePageKeySpecifier | (() => undefined | DashboardHomePageKeySpecifier),
		fields?: DashboardHomePageFieldPolicy,
	},
	DashboardMaxCapacity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardMaxCapacityKeySpecifier | (() => undefined | DashboardMaxCapacityKeySpecifier),
		fields?: DashboardMaxCapacityFieldPolicy,
	},
	DashboardMostActive?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardMostActiveKeySpecifier | (() => undefined | DashboardMostActiveKeySpecifier),
		fields?: DashboardMostActiveFieldPolicy,
	},
	DashboardNewCustomers?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DashboardNewCustomersKeySpecifier | (() => undefined | DashboardNewCustomersKeySpecifier),
		fields?: DashboardNewCustomersFieldPolicy,
	},
	Error?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ErrorKeySpecifier | (() => undefined | ErrorKeySpecifier),
		fields?: ErrorFieldPolicy,
	},
	ErrorObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ErrorObjectKeySpecifier | (() => undefined | ErrorObjectKeySpecifier),
		fields?: ErrorObjectFieldPolicy,
	},
	File?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FileKeySpecifier | (() => undefined | FileKeySpecifier),
		fields?: FileFieldPolicy,
	},
	Food?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FoodKeySpecifier | (() => undefined | FoodKeySpecifier),
		fields?: FoodFieldPolicy,
	},
	FoodCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FoodCategoryKeySpecifier | (() => undefined | FoodCategoryKeySpecifier),
		fields?: FoodCategoryFieldPolicy,
	},
	HourTime?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HourTimeKeySpecifier | (() => undefined | HourTimeKeySpecifier),
		fields?: HourTimeFieldPolicy,
	},
	Icon?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | IconKeySpecifier | (() => undefined | IconKeySpecifier),
		fields?: IconFieldPolicy,
	},
	LoginAuthorize?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LoginAuthorizeKeySpecifier | (() => undefined | LoginAuthorizeKeySpecifier),
		fields?: LoginAuthorizeFieldPolicy,
	},
	MonthTime?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MonthTimeKeySpecifier | (() => undefined | MonthTimeKeySpecifier),
		fields?: MonthTimeFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	Owner?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OwnerKeySpecifier | (() => undefined | OwnerKeySpecifier),
		fields?: OwnerFieldPolicy,
	},
	Payment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentKeySpecifier | (() => undefined | PaymentKeySpecifier),
		fields?: PaymentFieldPolicy,
	},
	PaymentStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentStatusKeySpecifier | (() => undefined | PaymentStatusKeySpecifier),
		fields?: PaymentStatusFieldPolicy,
	},
	PaymentVisits?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentVisitsKeySpecifier | (() => undefined | PaymentVisitsKeySpecifier),
		fields?: PaymentVisitsFieldPolicy,
	},
	PaymentVisitsDates?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentVisitsDatesKeySpecifier | (() => undefined | PaymentVisitsDatesKeySpecifier),
		fields?: PaymentVisitsDatesFieldPolicy,
	},
	Product?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductKeySpecifier | (() => undefined | ProductKeySpecifier),
		fields?: ProductFieldPolicy,
	},
	ProductAvailability?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductAvailabilityKeySpecifier | (() => undefined | ProductAvailabilityKeySpecifier),
		fields?: ProductAvailabilityFieldPolicy,
	},
	ProductAvailabilityHour?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductAvailabilityHourKeySpecifier | (() => undefined | ProductAvailabilityHourKeySpecifier),
		fields?: ProductAvailabilityHourFieldPolicy,
	},
	ProductCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCategoryKeySpecifier | (() => undefined | ProductCategoryKeySpecifier),
		fields?: ProductCategoryFieldPolicy,
	},
	ProductCategoryComponent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCategoryComponentKeySpecifier | (() => undefined | ProductCategoryComponentKeySpecifier),
		fields?: ProductCategoryComponentFieldPolicy,
	},
	ProductComponent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductComponentKeySpecifier | (() => undefined | ProductComponentKeySpecifier),
		fields?: ProductComponentFieldPolicy,
	},
	ProductRecommended?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductRecommendedKeySpecifier | (() => undefined | ProductRecommendedKeySpecifier),
		fields?: ProductRecommendedFieldPolicy,
	},
	ProductReservationLimit?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductReservationLimitKeySpecifier | (() => undefined | ProductReservationLimitKeySpecifier),
		fields?: ProductReservationLimitFieldPolicy,
	},
	QuarterTime?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QuarterTimeKeySpecifier | (() => undefined | QuarterTimeKeySpecifier),
		fields?: QuarterTimeFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Region?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RegionKeySpecifier | (() => undefined | RegionKeySpecifier),
		fields?: RegionFieldPolicy,
	},
	ReservedProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReservedProductKeySpecifier | (() => undefined | ReservedProductKeySpecifier),
		fields?: ReservedProductFieldPolicy,
	},
	RestaurantFoodItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RestaurantFoodItemKeySpecifier | (() => undefined | RestaurantFoodItemKeySpecifier),
		fields?: RestaurantFoodItemFieldPolicy,
	},
	RestaurantMenuCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RestaurantMenuCategoryKeySpecifier | (() => undefined | RestaurantMenuCategoryKeySpecifier),
		fields?: RestaurantMenuCategoryFieldPolicy,
	},
	ReviewVisitType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReviewVisitTypeKeySpecifier | (() => undefined | ReviewVisitTypeKeySpecifier),
		fields?: ReviewVisitTypeFieldPolicy,
	},
	ReviewVote?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReviewVoteKeySpecifier | (() => undefined | ReviewVoteKeySpecifier),
		fields?: ReviewVoteFieldPolicy,
	},
	ReviewVoteType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReviewVoteTypeKeySpecifier | (() => undefined | ReviewVoteTypeKeySpecifier),
		fields?: ReviewVoteTypeFieldPolicy,
	},
	S3Payload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | S3PayloadKeySpecifier | (() => undefined | S3PayloadKeySpecifier),
		fields?: S3PayloadFieldPolicy,
	},
	Search?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchKeySpecifier | (() => undefined | SearchKeySpecifier),
		fields?: SearchFieldPolicy,
	},
	SearchFilter?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchFilterKeySpecifier | (() => undefined | SearchFilterKeySpecifier),
		fields?: SearchFilterFieldPolicy,
	},
	SearchInputValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchInputValueKeySpecifier | (() => undefined | SearchInputValueKeySpecifier),
		fields?: SearchInputValueFieldPolicy,
	},
	SearchResultType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchResultTypeKeySpecifier | (() => undefined | SearchResultTypeKeySpecifier),
		fields?: SearchResultTypeFieldPolicy,
	},
	SearchSort?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SearchSortKeySpecifier | (() => undefined | SearchSortKeySpecifier),
		fields?: SearchSortFieldPolicy,
	},
	UpdateReservedProduct?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateReservedProductKeySpecifier | (() => undefined | UpdateReservedProductKeySpecifier),
		fields?: UpdateReservedProductFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserFavoriteBar?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserFavoriteBarKeySpecifier | (() => undefined | UserFavoriteBarKeySpecifier),
		fields?: UserFavoriteBarFieldPolicy,
	},
	UserHistory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserHistoryKeySpecifier | (() => undefined | UserHistoryKeySpecifier),
		fields?: UserHistoryFieldPolicy,
	},
	UserHistoryActivity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserHistoryActivityKeySpecifier | (() => undefined | UserHistoryActivityKeySpecifier),
		fields?: UserHistoryActivityFieldPolicy,
	},
	UserHistoryExtended?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserHistoryExtendedKeySpecifier | (() => undefined | UserHistoryExtendedKeySpecifier),
		fields?: UserHistoryExtendedFieldPolicy,
	},
	UserSearch?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserSearchKeySpecifier | (() => undefined | UserSearchKeySpecifier),
		fields?: UserSearchFieldPolicy,
	},
	Visit?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VisitKeySpecifier | (() => undefined | VisitKeySpecifier),
		fields?: VisitFieldPolicy,
	},
	VoteCategory?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoteCategoryKeySpecifier | (() => undefined | VoteCategoryKeySpecifier),
		fields?: VoteCategoryFieldPolicy,
	},
	VoteTag?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoteTagKeySpecifier | (() => undefined | VoteTagKeySpecifier),
		fields?: VoteTagFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;