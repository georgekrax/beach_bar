import { objectType } from "@nexus/schema";
import { ProductType } from "../../beach_bar/product/types";

export const ProductComponentType = objectType({
  name: "ProductComponent",
  description: "Represents a component of a #beach_bar product. For example a sunbed.",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("title", { nullable: false });
    t.string("description", { nullable: false });
    t.url("description", { nullable: false });
  },
});

export const BundleProductComponentType = objectType({
  name: "BundleProductComponent",
  description: "Represents a #beach_bar product & its components",
  definition(t) {
    t.field("product", {
      type: ProductType,
      description: "The product of the #beach_bar",
      nullable: false,
      resolve: o => o.product,
    });
    t.field("component", {
      type: ProductComponentType,
      description: "The component of the product",
      nullable: false,
      resolve: o => o.component,
    });
    t.int("quantity", { nullable: false });
  },
});

export const ProductCategoryType = objectType({
  name: "ProductCategory",
  description: "Represents a #beach_bar's product category",
  definition(t) {
    t.int("int", { nullable: false });
    t.string("name", { nullable: false });
    t.string("underscoredName", { nullable: false });
    t.string("description", { nullable: true });
    t.list.field("productComponents", {
      type: ProductComponentType,
      description: "The component of a product",
      nullable: false,
      resolve: o => o.productComponents,
    });
  },
});
