import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { ProductCategory, ProductCategoryComponent, ProductComponent } from "nexus-prisma";

export const ProductComponentType = objectType({
  name: ProductComponent.$name,
  description: "Represents a component of a product. For example a sunbed.",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.field("icon", { type: IconType, description: "Details about which icon to be used in the front-end" });
    t.field(ProductComponent.id);
    t.field(ProductComponent.name);
    t.field(resolve(ProductComponent.icon));
  },
});

export const ProductCategoryComponentType = objectType({
  name: ProductCategoryComponent.$name,
  description: "Represents a component of a product category, including the quantity that each category has.",
  definition(t) {
    // t.int("quantity");
    // t.field("component", { type: ProductComponentType });
    // t.field("category", { type: ProductCategoryType });
    t.field(ProductCategoryComponent.quantity);
    t.field(resolve(ProductCategoryComponent.component));
    t.field(resolve(ProductCategoryComponent.category));
  },
});

// export const BundleProductComponentType = objectType({
//   name: "BundleProductComponent",
//   description: "Represents a #beach_bar product & its components",
//   definition(t) {
//     t.field("product", {
//       type: ProductType,
//       description: "The product of the #beach_bar",
//       resolve: o => o.product,
//     });
//     t.field("component", {
//       type: ProductComponentType,
//       description: "The component of the product",
//       resolve: o => o.component,
//     });
//     t.int("quantity");
//   },
// });

export const ProductCategoryType = objectType({
  name: ProductCategory.$name,
  description: "Represents a #beach_bar's product category",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.string("underscoredName");
    // t.nullable.string("description");
    // t.list.field("components", { type: ProductCategoryComponentType, description: "The components of a category's product" });
    t.field(ProductCategory.id);
    t.field(ProductCategory.name);
    t.field(ProductCategory.underscoredName);
    t.field(ProductCategory.description);
    t.field(resolve(ProductCategory.components));
  },
});
