import { errors, MyContext } from "@beach_bar/common";
import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-errors";
import dayjs from "dayjs";
import { Product } from "entity/Product";
import { arg, booleanArg, extendType, idArg, intArg, nullable } from "nexus";
import { ProductAvailabilityHourReturnType } from "typings/beach_bar/product";
import { checkScopes } from "utils/checkScopes";
import { ProductAvailabilityHourType, ProductType } from "./types";

export const ProductCrudQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("beachBarProducts", {
      type: ProductType,
      description: "Get all products of a #beach_bar",
      args: {
        beachBarId: idArg(),
        isActive: nullable(
          booleanArg({
            description: "A boolean that indicates to retrieve only active products",
            default: true,
          })
        ),
        isDeleted: nullable(
          booleanArg({
            description: "A boolean that indicates to retrieve deleted products too. Its default value is set to false",
            default: false,
          })
        ),
      },
      resolve: async (_, { beachBarId, isActive, isDeleted }, { payload }: MyContext): Promise<Product[]> => {
        if (!beachBarId || beachBarId.trim().length === 0) return [];
        if (payload && checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
          const products = await Product.find({
            where: {
              beachBarId,
              isActive,
            },
            relations: ["beachBar", "category", "category.components"],
            withDeleted: isDeleted,
          });
          return products;
        }
        const products = await Product.find({
          where: { beachBarId, isActive: true },
          relations: ["beachBar", "category", "category.components"],
        });
        return products;
      },
    });
    t.list.field("getProductAvailabilityHours", {
      type: ProductAvailabilityHourType,
      description: "Fetch a list with all the available hour times of a product",
      args: {
        productId: idArg(),
        date: arg({ type: DateScalar, description: "The date to search availability for" }),
      },
      resolve: async (_, { productId, date }): Promise<ProductAvailabilityHourReturnType[] | null> => {
        if (!productId || productId.trim().length === 0 || !date || date.add(1, "day") <= dayjs())
          throw new UserInputError("Please provide valid arguments");

        const product = await Product.findOne({
          where: { id: productId },
          relations: ["beachBar", "beachBar.openingTime", "beachBar.closingTime"],
        });
        if (!product) throw new ApolloError("Specified product does not exist", errors.NOT_FOUND);

        const res = await product.getHoursAvailability(date);
        return res;
      },
    });
    t.int("getProductAvailabilityQuantity", {
      args: {
        productId: idArg(),
        date: arg({ type: DateScalar, description: "The date to search availability for" }),
        timeId: intArg({ description: "The ID value of the hour time to search availability for" }),
      },
      resolve: async (_, { productId, date, timeId }): Promise<number> => {
        if (!productId || productId.trim().length === 0 || !date || date.add(1, "day") <= dayjs() || !timeId || timeId <= 0) throw new UserInputError("Please provide valid arguments");

        const product = await Product.findOne({
          where: { id: productId },
          relations: ["beachBar", "beachBar.openingTime", "beachBar.closingTime"],
        });
        if (!product) throw new ApolloError("Specified product does not exist");

        const res = await product.getQuantityAvailability(date, timeId);
        return res;
      },
    });
  },
});
