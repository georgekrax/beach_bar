import { objectType, unionType } from "@nexus/schema";
import { CurrencyType } from "../../details/countryTypes";
import { ProductCategoryType } from "../../details/product/types";
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
    t.field("currency", {
      type: CurrencyType,
      description: "The currency the product's price is assigned",
      nullable: false,
      resolve: o => o.currency,
    });
    t.datetime("updatedAt", { nullable: false });
    t.datetime("deletedAt", { nullable: true });
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
      description: "A boolean that indicates if the product has been succefully added to the #beach_bar",
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
    t.boolean("updated", { nullable: false, description: "A boolean that indicates if the product has been succefully updated" });
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