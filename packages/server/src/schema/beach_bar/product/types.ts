import { DateTimeScalar, UrlScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { ProductCategoryType } from "../../details/product/types";
import { HourTimeType } from "../../details/time/types";
import { BeachBarType } from "../types";

export const ProductType = objectType({
  name: "Product",
  description: "Represents a product of a #beach_bar",
  definition(t) {
    t.id("id");
    t.string("name");
    t.nullable.string("description");
    t.float("price");
    t.boolean("isActive");
    t.boolean("isIndividual");
    t.int("maxPeople");
    t.nullable.field("imgUrl", { type: UrlScalar });
    t.field("beachBar", { type: BeachBarType, description: "The #beach_bar that sells the product" });
    t.field("category", { type: ProductCategoryType, description: "The category of the product" });
    t.field("updatedAt", { type: DateTimeScalar });
    t.nullable.field("deletedAt", { type: DateTimeScalar });
  },
});

export const ProductAvailabilityType = objectType({
  name: "ProductAvailability",
  description: "Represents a product of a #beach_bar, and info about it's rest availability quantity",
  definition(t) {
    t.field("product", { type: ProductType });
    t.int("quantity", { description: "How many other's products of this type are available for purchase" });
  },
});

export const ProductRecommendedType = objectType({
  name: "ProductRecommended",
  description: "Represents a recommended product of a #beach_bar, depending on a user's search",
  definition(t) {
    t.field("product", { type: ProductType });
    t.int("quantity", { description: "How many other's products of this type to purchase" });
  },
});

export const AddProductType = objectType({
  name: "AddProduct",
  description: "Info to be returned when a product is added to a #beach_bar",
  definition(t) {
    t.field("product", { type: ProductType, description: "The product that is added" });
    t.boolean("added", { description: "A boolean that indicates if the product has been successfully added to the #beach_bar" });
  },
});

// export const AddProductResult = unionType({
//   name: "AddProductResult",
//   definition(t) {
//     t.members("AddProduct", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "AddProduct";
//     }
//   },
// });

export const UpdateProductType = objectType({
  name: "UpdateProduct",
  description: "Info to be returned when a product of a #beach_bar is updated",
  definition(t) {
    t.field("product", { type: ProductType, description: "The product that is updated" });
    t.boolean("updated", { description: "A boolean that indicates if the product has been successfully updated" });
  },
});

// export const UpdateProductResult = unionType({
//   name: "UpdateProductResult",
//   definition(t) {
//     t.members("UpdateProduct", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "UpdateProduct";
//     }
//   },
// });

export const ProductAvailabilityHourType = objectType({
  name: "ProductAvailabilityHour",
  description: "The info to be returned when checking for a #beach_bar product's availability hour times",
  definition(t) {
    t.field("hourTime", { type: HourTimeType, description: "The hour time of a day" });
    t.boolean("isAvailable");
  },
});
