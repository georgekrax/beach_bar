import { DateScalar, MyContext } from "@beach_bar/common";
import { arg, booleanArg, extendType, intArg } from "@nexus/schema";
import dayjs from "dayjs";
import { Product } from "../../../entity/Product";
import { checkScopes } from "../../../utils/checkScopes";
import { ProductAvailabilityHourReturnType } from "./returnTypes";
import { ProductAvailabilityHourType, ProductType } from "./types";

export const ProductCrudQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getBeachBarProducts", {
      type: ProductType,
      description: "Get all products of a #beach_bar",
      nullable: true,
      args: {
        beachBarId: intArg({ required: true, description: "The ID values of the #beach_bar, to get its products" }),
        isActive: booleanArg({
          required: false,
          description: "A boolean that indicates to retrieve only active products",
          default: true,
        }),
        isDeleted: booleanArg({
          required: false,
          description: "A boolean that indicates to retrieve deleted products too. Its default value is set to false",
          default: false,
        }),
      },
      resolve: async (_, { beachBarId, isActive, isDeleted }, { payload }: MyContext): Promise<Product[] | null> => {
        if (!beachBarId || beachBarId <= 0) {
          return null;
        }
        if (payload && checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
          const products = await Product.find({
            where: {
              beachBarId,
              isActive,
            },
            relations: ["beachBar", "category", "category.productComponents", "currency"],
            withDeleted: isDeleted,
          });
          if (!products) {
            return null;
          }
          return products;
        }
        const products = await Product.find({
          where: { beachBarId, isActive: true },
          relations: ["beachBar", "category", "category.productComponents", "currency"],
        });
        if (!products) {
          return null;
        }
        return null;
      },
    });
    t.list.field("getProductAvailabilityHours", {
      type: ProductAvailabilityHourType,
      description: "Retrieve (get) a list with all the available hour times of a product",
      nullable: true,
      args: {
        productId: intArg({
          required: true,
          description: "The ID value of the #beach_bar product",
        }),
        date: arg({
          type: DateScalar,
          required: true,
          description: "The date to search availability for",
        }),
      },
      resolve: async (_, { productId, date }): Promise<ProductAvailabilityHourReturnType[] | null> => {
        if (!productId || productId <= 0 || !date || date.add(1, "day") <= dayjs()) {
          return null;
        }

        const product = await Product.findOne({
          where: { id: productId },
          relations: ["beachBar", "beachBar.openingTime", "beachBar.closingTime"],
        });
        if (!product) {
          return null;
        }

        const res = await product.getHoursAvailability(date);
        if (!res) {
          return null;
        }

        return res;
      },
    });
    t.int("getProductAvailabilityQuantity", {
      nullable: true,
      args: {
        productId: intArg({
          required: true,
          description: "The ID value of the #beach_bar product",
        }),
        date: arg({
          type: DateScalar,
          required: true,
          description: "The date to search availability for",
        }),
        timeId: intArg({
          required: true,
          description: "The ID value of the hour time to search availability for",
        }),
      },
      resolve: async (_, { productId, date, timeId }): Promise<number | null> => {
        if (!productId || productId <= 0 || !date || date.add(1, "day") <= dayjs() || !timeId || timeId <= 0) {
          return null;
        }

        const product = await Product.findOne({
          where: { id: productId },
          relations: ["beachBar", "beachBar.openingTime", "beachBar.closingTime"],
        });
        if (!product) {
          return null;
        }

        const res = await product.getQuantityAvailability(date, timeId);
        if (res === null) {
          return null;
        }
        return res;
      },
    });
  },
});
