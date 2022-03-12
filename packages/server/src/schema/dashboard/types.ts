import { inputObjectType, interfaceType, objectType } from "nexus";
import { FoodType } from "../beach_bar/food/types";
import { ProductType } from "../beach_bar/product/types";
import { CustomerType } from "../customer/types";
import { CountryType } from "../details/countryTypes";
import { PaymentType } from "../payment/types";

const DashboardDateValueType = objectType({
  name: "DashboardDateValue",
  // description: "Estimated revenue from payments including platform and Stripe processing fees",
  definition(t) {
    t.float("value");
    t.dateTime("date");
  },
});

const DashboardBalanceType = objectType({
  name: "DashboardBalance",
  description: "Revenue and number of successful payments of a #beach_bar",
  definition(t) {
    t.float("revenue");
    t.list.field("grossVolume", { type: DashboardDateValueType, description: "Today's gross volume of each operating hour" });
    t.list.field("successfulPayments", { type: PaymentType });
  },
});

const DashboardCapacityType = objectType({
  name: "DashboardCapacity",
  description: "Capacity percentage of customers and number of products booked",
  definition(t) {
    t.float("percentage");
    t.int("totalMaxPeopleCapacity");
    t.int("totalHourCustomers");
    t.int("reservedProducts");
    t.int("availableProducts");
  },
});

const DashboardNewCustomersType = objectType({
  name: "DashboardNewCustomers",
  description: "The new customers of a #beach_bar on a specific date",
  definition(t) {
    t.date("date");
    t.list.field("customers", { type: CustomerType });
  },
});

export const DashboardHomePageType = objectType({
  name: "DashboardHomePage",
  description: "Data (of the day) fetched for a #beach_bar's dashboard homepage",
  definition(t) {
    t.field("balance", { type: DashboardBalanceType });
    t.field("capacity", { type: DashboardCapacityType });
    t.list.field("totalCustomers", { type: DashboardDateValueType });
    t.list.field("grossVolume", { type: DashboardDateValueType });
    t.list.field("avgSpendPerPerson", { type: DashboardDateValueType });
    t.list.field("newCustomers", { type: DashboardNewCustomersType });
    t.list.field("avgRating", { type: DashboardDateValueType });
  },
});

const DashboardBillingMostCommonProductsType = objectType({
  name: "DashboardBillingMostCommonProducts",
  definition(t) {
    t.int("timesBooked");
    t.field("product", { type: ProductType });
  },
});

const DashboardBillingMostCommonFoodsType = objectType({
  name: "DashboardBillingMostCommonFoods",
  definition(t) {
    t.int("timesPurchased");
    t.field("food", { type: FoodType });
  },
});

const DashboardBillingFieldType = interfaceType({
  name: "DashboardBillingField",
  resolveType: () => ({} as any),
  definition(t) {
    t.list.field("revenue", { type: DashboardDateValueType });
  },
});

const DashboardBillingProductsType = objectType({
  name: "DashboardBillingProducts",
  description: "Products revenue, difference from the yesterday, average products per payment",
  definition(t) {
    t.implements(DashboardBillingFieldType);
    t.list.field("mostCommon", { type: DashboardBillingMostCommonProductsType });
  },
});

const DashboardBillingFoodsType = objectType({
  name: "DashboardBillingFoods",
  description: "Foods revenue, difference from the yesterday, average foods per payment",
  definition(t) {
    t.implements(DashboardBillingFieldType);
    t.list.field("mostCommon", { type: DashboardBillingMostCommonFoodsType });
  },
});

const DashboardBillingRefundedPaymentsType = objectType({
  name: "DashboardBillingRefundedPayments",
  // description: "Capacity percentage of customers and number of products booked",
  definition(t) {
    t.date("date");
    t.list.field("payments", { type: PaymentType });
  },
});

const DashboardBillingCustomerCountriesType = objectType({
  name: "DashboardBillingCustomerCountries",
  // description: "Capacity percentage of customers and number of products booked",
  definition(t) {
    t.int("value");
    t.field("country", { type: CountryType });
  },
});

export const DashboardBillingType = objectType({
  name: "DashboardBilling",
  description: "Data fetched for the dashboard billing page",
  definition(t) {
    t.field("products", { type: DashboardBillingProductsType });
    t.field("foods", { type: DashboardBillingFoodsType });
    t.list.field("refundedPayments", { type: DashboardBillingRefundedPaymentsType });
    t.list.field("customersCountries", { type: DashboardBillingCustomerCountriesType });
    t.list.field("avgProducts", { type: DashboardDateValueType, description: "Average product booked per payment" });
    t.list.field("avgFoods", { type: DashboardDateValueType, description: "Average foods purchased per payment" });
  },
});

export const DashboardDatesArgType = inputObjectType({
  name: "DashboardDatesArg",
  description: "The arguments to fetch data for a specific time period",
  definition(t) {
    t.nullable.dateTime("start");
    t.nullable.dateTime("end");
  },
});

// Bookings
const DashboardMostActiveType = objectType({
  name: "DashboardMostActive",
  // description: "Capacity percentage of customers and number of products booked",
  definition(t) {
    t.int("hour");
    t.string("weekDay");
  },
});

const DashboardMaxCapacityType = objectType({
  name: "DashboardMaxCapacity",
  // description: "Capacity percentage of customers and number of products booked",
  definition(t) {
    t.date("date");
    t.int("limitPeople");
    t.int("availableProducts");
  },
});

const DashboardCapacityPercentageType = objectType({
  name: "DashboardCapacityPercentage",
  // description: "Capacity percentage of customers and number of products booked",
  definition(t) {
    t.date("date");
    t.float("percentage");
  },
});

const DashboardBookingsCapacityType = objectType({
  name: "DashboardBookingsCapacity",
  description: "Capacity percentage of customers and number of products booked",
  definition(t) {
    t.list.field("totalCustomers", { type: DashboardDateValueType });
    t.list.field("totalHourCustomers", { type: DashboardDateValueType });
    t.list.field("maxCapacity", { type: DashboardMaxCapacityType });
    t.list.field("arr", { type: DashboardCapacityPercentageType });
  },
});

export const DashboardBookingsType = objectType({
  name: "DashboardBookings",
  description: "Data fetched for the dashboard bookings page",
  definition(t) {
    t.list.field("bookings", { type: PaymentType });
    t.field("capacity", { type: DashboardBookingsCapacityType });
    t.field("mostActive", { type: DashboardMostActiveType });
  },
});
