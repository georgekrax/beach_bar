import { errors } from "@beach_bar/common";
import { DateScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError } from "apollo-server-express";
import { Product } from "entity/Product";
import { HourTime } from "entity/Time";
import { arg, extendType, idArg } from "nexus";
import { AvailableProductReturnType } from "typings/beach_bar/product/reservationLimit";
import { AvailableProductType } from "./types";

export const ProductQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("hasProductReservationLimit", {
      type: AvailableProductType,
      description: "Get a list with all the hours this product has reservation limits",
      args: {
        productId: idArg(),
        date: arg({ type: DateScalar, description: "The date to purchase the product. Its default value its the current date" }),
      },
      resolve: async (_, { productId, date }): Promise<AvailableProductReturnType> => {
        const product = await Product.findOne(productId);
        if (!product) throw new ApolloError("Product was not found", errors.NOT_FOUND);

        const hourTimes = await HourTime.find();
        if (!hourTimes || hourTimes.length === 0) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);

        const returnResult: AvailableProductReturnType = [];
        for (let i = 0; i < hourTimes.length; i++) {
          const isAvailable = product.getReservationLimit(date, hourTimes[i].id?.toString());
          // * the opposite because we return isAvailable
          returnResult.push({ hourTime: hourTimes[i], isAvailable: isAvailable ? false : true });
        }

        return returnResult;
      },
    });
  },
});
