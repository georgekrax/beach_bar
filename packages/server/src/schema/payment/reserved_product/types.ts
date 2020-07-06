import { BigIntScalar, DateScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { ProductType } from "../../beach_bar/product/types";
import { HourTimeType } from "../../details/time/types";
import { PaymentType } from "../types";

export const ReservedProductType = objectType({
  name: "ReservedProduct",
  description: "Represents a reserved product",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.field("date", { type: DateScalar, nullable: false });
    t.boolean("isRefunded", { nullable: false, description: "A boolean that indicates if the product was refunded from the payment" });
    t.field("time", {
      type: HourTimeType,
      description: "The hour (time) that this product was reserved for",
      nullable: false,
      resolve: o => o.time,
    });
    t.field("product", {
      type: ProductType,
      description: "The product that is reserved",
      nullable: false,
      resolve: o => o.product,
    });
    t.field("payment", {
      type: PaymentType,
      description: "The payment that this product was reserved by",
      nullable: false,
      resolve: o => o.payment,
    });
  },
});

export const AddReservedProductType = objectType({
  name: "AddReservedProduct",
  description: "Info to be returned when a product is marked (added) as a reserved one from a payment",
  definition(t) {
    t.field("reservedProduct", {
      type: ReservedProductType,
      description: "The product that is marked as a reserved one",
      nullable: false,
      resolve: o => o.reservedProduct,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the product has been successfully marked as a reserved one",
    });
  },
});

export const AddReservedProductResult = unionType({
  name: "AddReservedProductResult",
  definition(t) {
    t.members("AddReservedProduct", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddReservedProduct";
      }
    });
  },
});

export const UpdateReservedProductType = objectType({
  name: "UpdateReservedProduct",
  description: "Info to be returned when a reserved product details are updated",
  definition(t) {
    t.field("reservedProduct", {
      type: ReservedProductType,
      description: "The reserved product that is updated",
      nullable: false,
      resolve: o => o.reservedProduct,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the reserved product details have been successfully updated",
    });
  },
});

export const UpdateReservedProductResult = unionType({
  name: "UpdateReservedProductResult",
  definition(t) {
    t.members("UpdateReservedProduct", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateReservedProduct";
      }
    });
  },
});