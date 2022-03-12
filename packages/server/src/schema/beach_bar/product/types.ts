import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { Product } from "nexus-prisma";
import { HourTimeType } from "../../details/time/types";

export const ProductType = objectType({
  name: Product.$name,
  description: "Represents a product of a #beach_bar",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.nullable.string("description");
    // t.float("price");
    // t.nullable.float("minFoodSpending", {
    //   description: "The minimum amount of money spent to food for the user(s) of this purchased product",
    // });
    // t.boolean("isActive");
    // t.boolean("isIndividual");
    // t.int("maxPeople");
    // t.nullable.field("imgUrl", { type: UrlScalar });
    // t.field("beachBar", { type: BeachBarType, description: "The #beach_bar that sells the product" });
    // t.field("category", { type: ProductCategoryType, description: "The category of the product" });
    // t.field("updatedAt", { type: DateTime.name });
    // t.nullable.field("deletedAt", { type: DateTime.name });
    // t.list.field("reservationLimits", { type: ProductReservationLimitType });
    t.field(Product.id);
    t.field(Product.name);
    t.field(Product.description);
    t.field(Product.price.name, { ...Product.price, type: "Float"  });
    t.nullable.field(Product.minFoodSpending.name, { ...Product.minFoodSpending, type: "Float" });
    t.field(Product.isActive);
    t.field(Product.isIndividual);
    t.field(Product.maxPeople);
    t.field(Product.imgUrl);
    t.field(resolve(Product.beachBar));
    t.field(resolve(Product.category));
    t.field(resolve(Product.reservationLimits));
    t.field(Product.updatedAt);
    t.field(Product.deletedAt);
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

export const ProductAvailabilityHourType = objectType({
  name: "ProductAvailabilityHour",
  description: "The info to be returned when checking for a #beach_bar product's availability hour times",
  definition(t) {
    t.field("hourTime", { type: HourTimeType, description: "The hour time of a day" });
    t.boolean("isAvailable");
  },
});

// export const AddProductType = objectType({
//   name: "AddProduct",
//   description: "Info to be returned when a product is added to a #beach_bar",
//   definition(t) {
//     t.field("product", { type: ProductType, description: "The product that is added" });
//     t.boolean("added", { description: "A boolean that indicates if the product has been successfully added to the #beach_bar" });
//   },
// });

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

// export const UpdateProductType = objectType({
//   name: "UpdateProduct",
//   description: "Info to be returned when a product of a #beach_bar is updated",
//   definition(t) {
//     t.field("product", { type: ProductType, description: "The product that is updated" });
//     t.boolean("updated", { description: "A boolean that indicates if the product has been successfully updated" });
//   },
// });

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
