import {
  getHoursAvailability,
  GetHoursAvailabilityInclude,
  getQuantityAvailability,
  GetQuantityAvailabilityInclude,
} from "@/utils/product";
import { errors } from "@beach_bar/common";
import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-errors";
import dayjs from "dayjs";
import { arg, extendType, idArg, intArg } from "nexus";
import { ProductAvailabilityHourType, ProductType } from "./types";

export const ProductCrudQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("product", {
      type: ProductType,
      description: "Get a #beach_bar's product information",
      args: { id: idArg() },
      resolve: async (_, { id }, { prisma }) => {
        if (id.toString().trim().length === 0) return null;
        return await prisma.product.findUnique({ where: { id: +id } });
      },
    });
    t.list.field("products", {
      type: ProductType,
      description: "Get all products of a #beach_bar",
      args: {
        beachBarId: idArg(),
        // isActive: nullable(
        //   booleanArg({
        //     description: "A boolean that indicates to retrieve only active products",
        //     default: true,
        //   })
        // ),
        // isDeleted: nullable(
        //   booleanArg({
        //     description: "A boolean that indicates to retrieve deleted products too. Its default value is set to false",
        //     default: false,
        //   })
        // ),
      },
      // resolve: async (_, { beachBarId, isActive, isDeleted }, { payload }: MyContext): Promise<Product[]> => {
      resolve: async (_, { beachBarId }, { prisma }) => {
        if (beachBarId.toString().trim().length === 0) return [];
        // if (payload && checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
        //   const products = await Product.find({
        //     // where: { beachBarId, isActive: isActive || true },
        //     where: { beachBarId },
        //     relations: relationsArr,
        //     // withDeleted: isDeleted,
        //   });
        //   return products;
        // }
        return await prisma.product.findMany({ where: { beachBarId: +beachBarId } });
      },
    });
    t.list.field("getProductAvailabilityHours", {
      type: ProductAvailabilityHourType,
      description: "Fetch a list with all the available hour times of a product",
      args: {
        productId: idArg(),
        date: arg({ type: DateScalar.name, description: "The date to search availability for" }),
      },
      resolve: async (_, { productId, date }, { prisma }) => {
        if (productId.toString().trim().length === 0 || dayjs(date).add(1, "day") <= dayjs()) {
          throw new UserInputError("Please provide valid arguments");
        }

        const product = await prisma.product.findUnique({ where: { id: +productId }, include: GetHoursAvailabilityInclude });
        if (!product) throw new ApolloError("Specified product does not exist", errors.NOT_FOUND);

        return await getHoursAvailability(product, date);
      },
    });
    t.int("getProductAvailabilityQuantity", {
      args: {
        productId: idArg(),
        date: arg({ type: DateScalar.name, description: "The date to search availability for" }),
        startTimeId: intArg({ description: "The ID value of the starting hour time to search availability for" }),
        endTimeId: intArg({ description: "The ID value of the ending hour time to search availability for" }),
      },
      resolve: async (_, { productId, ...args }, { prisma }) => {
        if (
          productId.toString().trim().length === 0 ||
          dayjs(args.date).add(1, "day") <= dayjs() ||
          args.startTimeId <= 0 ||
          args.endTimeId <= 0
        ) {
          throw new UserInputError("Please provide valid arguments");
        }

        const product = await prisma.product.findUnique({ where: { id: +productId }, include: GetQuantityAvailabilityInclude });
        if (!product) throw new ApolloError("Specified product does not exist");

        return getQuantityAvailability(product, args);
      },
    });
  },
});
