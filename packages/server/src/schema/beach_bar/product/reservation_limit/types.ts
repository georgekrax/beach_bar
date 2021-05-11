import { BigIntScalar, DateScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { HourTimeType } from "../../../details/time/types";
import { ProductType } from "../types";

export const ProductReservationLimitType = objectType({
  name: "ProductReservationLimit",
  description: "Represents a the limit number, on how many times a product can be provided by a #beach_bar on a specific date",
  definition(t) {
    t.field("id", { type: BigIntScalar });
    t.int("limitNumber");
    t.field("date", { type: DateScalar, description: "The date this limit is applicable for the product" });
    t.field("product", { type: ProductType, description: "The product this limit is assigned to" });
    t.field("startTime", { type: HourTimeType, description: "The hour that this limit is applicable for" });
    t.field("endTime", { type: HourTimeType, description: "The hour that this limit ends" });
  },
});

export const AddProductReservationLimitType = objectType({
  name: "AddProductReservationLimit",
  description: "Info to be returned when a reservation limit is added to a #beach_bar's product",
  definition(t) {
    t.list.field("reservationLimit", { type: ProductReservationLimitType, description: "The reservation limit that is added" });
    t.boolean("added", { description: "A boolean that indicates if the limit has been successfully added to the product" });
  },
});

// export const AddProductReservationLimitResult = unionType({
//   name: "AddProductReservationLimitResult",
//   definition(t) {
//     t.members("AddProductReservationLimit", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "AddProductReservationLimit";
//   },
// });

export const UpdateProductReservationLimitType = objectType({
  name: "UpdateProductReservationLimit",
  description: "Info to be returned when a reservation limit of a #beach_bar's product is updated",
  definition(t) {
    t.list.field("reservationLimit", { type: ProductReservationLimitType, description: "The reservation limit that is updated" });
    t.boolean("updated", { description: "A boolean that indicates if the limit details has been successfully updated" });
  },
});

// export const UpdateProductReservationLimitResult = unionType({
//   name: "UpdateProductReservationLimitResult",
//   definition(t) {
//     t.members("UpdateProductReservationLimit", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "UpdateProductReservationLimit";
//   },
// });

export const AvailableProductType = objectType({
  name: "AvailableProduct",
  description: "Info to be returned, when checking if a #beach_bar product is available",
  definition(t) {
    t.field("hourTime", { type: HourTimeType, description: "The hour, to check if available" });
    t.boolean("isAvailable", { description: "A boolean that indicates if the product is available in the hour time" });
  },
});
