import { DateTimeScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { ProductCategoryType } from "../../details/product/types";
import { HourTimeType } from "../../details/time/types";
import { BeachBarType } from "../types";

export const ProductType = objectType({
  name: "Product",
  description: "Represents a product of a #beach_bar",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("name", { nullable: false });
    t.string("description", { nullable: true });
    t.float("price", { nullable: false });
    t.boolean("isActive", { nullable: false });
    t.boolean("isIndividual", { nullable: false });
    t.int("maxPeople", { nullable: false });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar that provides the product",
      nullable: false,
      resolve: o => o.beachBar,
    });
    t.field("category", {
      type: ProductCategoryType,
      description: "The category of the product",
      nullable: false,
      resolve: o => o.category,
    });
    t.field("updatedAt", { type: DateTimeScalar, nullable: false });
    t.field("deletedAt", { type: DateTimeScalar, nullable: true });
  },
});

export const AddProductType = objectType({
  name: "AddProduct",
  description: "Info to be returned when a product is added to a #beach_bar",
  definition(t) {
    t.field("product", {
      type: ProductType,
      description: "The product that is added",
      nullable: false,
      resolve: o => o.product,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the product has been successfully added to the #beach_bar",
    });
  },
});

export const AddProductResult = unionType({
  name: "AddProductResult",
  definition(t) {
    t.members("AddProduct", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddProduct";
      }
    });
  },
});

export const UpdateProductType = objectType({
  name: "UpdateProduct",
  description: "Info to be returned when a product of a #beach_bar is updated",
  definition(t) {
    t.field("product", {
      type: ProductType,
      description: "The product that is updated",
      nullable: false,
      resolve: o => o.product,
    });
    t.boolean("updated", { nullable: false, description: "A boolean that indicates if the product has been successfully updated" });
  },
});

export const UpdateProductResult = unionType({
  name: "UpdateProductResult",
  definition(t) {
    t.members("UpdateProduct", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateProduct";
      }
    });
  },
});

export const ProductAvailabilityHourType = objectType({
  name: "ProductAvailabilityHour",
  description: "The info to be returned when checking for a #beach_bar product's availability hour times",
  definition(t) {
    t.field("hourTime", {
      type: HourTimeType,
      description: "The hour time of a day",
      nullable: false,
      resolve: o => o.hourTime,
    });
    t.boolean("isAvailable", { nullable: false });
  },
});
