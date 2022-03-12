import { getReservationLimit, GetReservationLimitInclude } from "@/utils/product";
import { errors, TABLES } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { arg, extendType, FieldType, idArg } from "nexus";
import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { AvailableProductType } from "./types";

export const ProductQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("hasProductReservationLimit", {
      type: AvailableProductType,
      description: "Get a list with all the hours this product has reservation limits",
      args: {
        productId: idArg(),
        date: arg({ type: DateScalar.name, description: "The date to purchase the product. Its default value its the current date" }),
      },
      resolve: async (_, { productId, date }, { prisma }) => {
        const product = await prisma.product.findUnique({ where: { id: +productId }, include: GetReservationLimitInclude });
        if (!product) throw new ApolloError("Product was not found", errors.NOT_FOUND);

        const hourTimes = TABLES.HOUR_TIME;
        const returnResult: FieldType<"Query", "hasProductReservationLimit"> = [];
        for (let i = 0; i < hourTimes.length; i++) {
          const timeId = +hourTimes[i].id?.toString();
          const isAvailable = getReservationLimit(product, { date, startTimeId: timeId, endTimeId: timeId });
          // * the opposite because we return isAvailable
          returnResult.push({ hourTime: hourTimes[i] as any, isAvailable: isAvailable ? false : true });
        }

        return returnResult;
      },
    });
  },
});
