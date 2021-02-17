import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { ProductType } from "../../beach_bar/product/types";

export const ProductComponentType = objectType({
  name: "ProductComponent",
  description: "Represents a component of a #beach_bar product. For example a sunbed.",
  definition(t) {
    t.id("id");
    t.string("title");
    t.string("description");
    t.field("iconUrl", { type: UrlScalar });
  },
});

export const BundleProductComponentType = objectType({
  name: "BundleProductComponent",
  description: "Represents a #beach_bar product & its components",
  definition(t) {
    t.field("product", {
      type: ProductType,
      description: "The product of the #beach_bar",
      resolve: o => o.product,
    });
    t.field("component", {
      type: ProductComponentType,
      description: "The component of the product",
      resolve: o => o.component,
    });
    t.int("quantity");
  },
});

export const ProductCategoryType = objectType({
  name: "ProductCategory",
  description: "Represents a #beach_bar's product category",
  definition(t) {
    t.id("id");
    t.string("name");
    t.string("underscoredName");
    t.nullable.string("description");
    t.list.field("productComponents", {
      type: ProductComponentType,
      description: "The component of a product",
      resolve: o => o.productComponents,
    });
  },
});
