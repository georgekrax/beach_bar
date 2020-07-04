import { BigIntScalar, DateScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { HourTimeType } from "../../../details/hourTimeTypes";
import { ProductType } from "../types";

export const ProductReservationLimitType = objectType({
  name: "ProductReservationLimit",
  description: "Represents a the limit number, on how many times a product can be provided by a #beach_bar on a specific date",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.int("limitNumber", { nullable: false });
    t.field("date", { type: DateScalar, nullable: false, description: "The date this limit is applicable for the product" });
    t.field("product", {
      type: ProductType,
      description: "The product this limit is assigned to",
      nullable: false,
      resolve: o => o.product,
    });
    t.field("startTime", {
      type: HourTimeType,
      description: "The hour that this limit is applicable for",
      nullable: false,
      resolve: o => o.startTime,
    });
    t.field("endTime", {
      type: HourTimeType,
      description: "The hour that this limit ends",
      nullable: false,
      resolve: o => o.endTime,
    });
  },
});

export const AddProductReservationLimitType = objectType({
  name: "AddProductReservationLimit",
  description: "Info to be returned when a reservation limit is added to a #beach_bar's product",
  definition(t) {
    t.list.field("reservationLimit", {
      type: ProductReservationLimitType,
      description: "The reservation limit that is added",
      nullable: false,
      resolve: o => o.reservationLimit,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the limit has been successfully added to the product",
    });
  },
});

export const AddProductReservationLimitResult = unionType({
  name: "AddProductReservationLimitResult",
  definition(t) {
    t.members("AddProductReservationLimit", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddProductReservationLimit";
      }
    });
  },
});

export const UpdateProductReservationLimitType = objectType({
  name: "UpdateProductReservationLimit",
  description: "Info to be returned when a reservation limit of a #beach_bar's product is updated",
  definition(t) {
    t.list.field("reservationLimit", {
      type: ProductReservationLimitType,
      description: "The reservation limit that is updated",
      nullable: false,
      resolve: o => o.reservationLimit,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the limit details has been successfully updated",
    });
  },
});

export const UpdateProductReservationLimitResult = unionType({
  name: "UpdateProductReservationLimitResult",
  definition(t) {
    t.members("UpdateProductReservationLimit", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateProductReservationLimit";
      }
    });
  },
});

export const AvailableProductType = objectType({
  name: "AvailableProduct",
  description: "Info to be returned, when checking if a #beach_bar product is available",
  definition(t) {
    t.field("hourTime", {
      type: HourTimeType,
      description: "The hour (time), to check if available",
      nullable: false,
      resolve: o => o.hourTime,
    });
    t.boolean("isAvailable", {
      nullable: false,
      description: "A boolean that indicates if the product is available in the hour time",
    });
  },
});
