import { resolve } from "@/utils/data";
import { objectType, unionType } from "nexus";
import { ReservedProduct } from "nexus-prisma";

export const ReservedProductType = objectType({
  name: ReservedProduct.$name,
  description: "Represents a reserved product",
  definition(t) {
    // t.field("id", { type: BigInt });
    // t.field("date", { type: DateScalar });
    // t.boolean("isRefunded", { description: "A boolean that indicates if the product was refunded from the payment" });
    // t.field("time", { type: HourTimeType, description: "The hour (time) that this product was reserved for" }); // @deprecated
    // t.field("product", { type: ProductType, description: "The product that is reserved" });
    // t.field("payment", { type: PaymentType, description: "The payment that this product was reserved by" });
    t.field(ReservedProduct.id);
    t.field(ReservedProduct.date);
    t.field(ReservedProduct.isRefunded);
    t.field(resolve(ReservedProduct.product));
    t.field(resolve(ReservedProduct.payment));
    t.field(resolve(ReservedProduct.startTime));
    t.field(resolve(ReservedProduct.endTime));
  },
});

export const AddReservedProductType = objectType({
  name: "AddReservedProduct",
  description: "Info to be returned when a product is marked (added) as a reserved one from a payment",
  definition(t) {
    t.field("reservedProduct", { type: ReservedProductType, description: "The product that is marked as a reserved one" });
    t.boolean("added", {
      description: "A boolean that indicates if the product has been successfully marked as a reserved one",
    });
  },
});

export const AddReservedProductResult = unionType({
  name: "AddReservedProductResult",
  definition(t) {
    t.members("AddReservedProduct", "Error");
  },
  resolveType: item => (item["error"] ? "Error" : "AddReservedProduct"),
});

export const UpdateReservedProductType = objectType({
  name: "UpdateReservedProduct",
  description: "Info to be returned when a reserved product details are updated",
  definition(t) {
    t.field("reservedProduct", { type: ReservedProductType, description: "The reserved product that is updated" });
    t.boolean("updated", {
      description: "A boolean that indicates if the reserved product details have been successfully updated",
    });
  },
});

export const UpdateReservedProductResult = unionType({
  name: "UpdateReservedProductResult",
  definition(t) {
    t.members("UpdateReservedProduct", "Error");
  },
  resolveType: item => (item["error"] ? "Error" : "UpdateReservedProduct"),
});
