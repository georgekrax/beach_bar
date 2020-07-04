import { DateScalar } from "@beach_bar/common";
import { arg, extendType, intArg } from "@nexus/schema";
import { HourTime } from "../../../../entity/HourTime";
import { Product } from "../../../../entity/Product";
import { AvailableProductReturnType } from "./returnTypes";
import { AvailableProductType } from "./types";

export const ProductQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("availableProductHours", {
      type: AvailableProductType,
      description: "Get a list with all the hours this product is available",
      nullable: false,
      args: {
        productId: intArg({
          required: true,
          description: "The ID value of the product, to search if available",
        }),
        timeId: intArg({
          required: false,
          description: "The ID value of the specific hour time, to check if available",
        }),
        date: arg({
          type: DateScalar,
          required: false,
          description: "The date to purchase the product. Its default value its the current date",
        }),
      },
      resolve: async (_, { productId, timeId, date }): Promise<AvailableProductReturnType | null> => {
        if (!productId || productId <= 0) {
          return null;
        }
        if (timeId && timeId <= 0) {
          return null;
        }
        if (date && date.toString().trim().length === 0) {
          return null;
        }

        const product = await Product.findOne(productId);
        if (!product) {
          return null;
        }

        if (timeId) {
          const hourTime = await HourTime.findOne(timeId);
          if (!hourTime) {
            return null;
          }

          const isAvailable = await product.checkIfAvailable(hourTime.id, date);
          if (isAvailable !== undefined && isAvailable !== null) {
            return [{ hourTime, isAvailable }];
          }
          return null;
        } else {
          const hourTimes = await HourTime.find();
          if (!hourTimes) {
            return null;
          }

          const returnResult: AvailableProductReturnType = [];
          for (let i = 0; i < hourTimes.length; i++) {
            const isAvailable = await product.checkIfAvailable(hourTimes[i].id, date);
            if (isAvailable !== undefined && isAvailable !== null) {
              returnResult.push({ hourTime: hourTimes[i], isAvailable });
            }
          }

          return returnResult;
        }
      },
    });
    t.list.field("hasProductReservationLimit", {
      type: AvailableProductType,
      description: "Get a list with all the hours this product has reservation limits",
      nullable: false,
      args: {
        productId: intArg({
          required: true,
          description: "The ID value of the product, to search if available",
        }),
        date: arg({
          type: DateScalar,
          required: false,
          description: "The date to purchase the product. Its default value its the current date",
        }),
      },
      resolve: async (_, { productId, date }): Promise<AvailableProductReturnType | null> => {
        if (!productId || productId <= 0) {
          return null;
        }
        if (date && date.toString().trim().length === 0) {
          return null;
        }

        const product = await Product.findOne(productId);
        if (!product) {
          return null;
        }

        const hourTimes = await HourTime.find();
        if (!hourTimes) {
          return null;
        }

        const returnResult: AvailableProductReturnType = [];
        for (let i = 0; i < hourTimes.length; i++) {
          const isAvailable = await product.getReservationLimit(hourTimes[i].id, date);
          // * the opposite because we return isAvailable
          returnResult.push({ hourTime: hourTimes[i], isAvailable: isAvailable ? false : true });
        }

        return returnResult;
      },
    });
  },
});
