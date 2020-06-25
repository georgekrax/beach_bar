import { booleanArg, extendType, intArg } from "@nexus/schema";
import { IsNull, Raw } from "typeorm";
import { MyContext } from "../../../common/myContext";
import { Product } from "../../../entity/Product";
import { checkScopes } from "../../../utils/checkScopes";
import { ProductType } from "./types";

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
          description: "A boolean that indicates to retrieve deleted products too",
          default: false,
        }),
      },
      resolve: async (_, { beachBarId, isActive, isDeleted }, { payload }: MyContext): Promise<Product[] | null> => {
        if (!beachBarId || beachBarId.toString().trim().length === 0) {
          return null;
        }
        if (payload && checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
          const products = await Product.find({
            where: {
              beachBarId,
              isActive,
              deletedAt: isDeleted ? Raw(alias => `${alias} IS NOT NULL`) : IsNull(),
            },
            relations: ["beachBar", "category", "category.productComponents", "currency"],
          });
          if (!products) {
            return null;
          }
          return products;
        }
        const products = await Product.find({
          where: { beachBarId, isActive: true, deletedAt: IsNull() },
          relations: ["beachBar", "category", "category.productComponents", "currency"],
        });
        if (!products) {
          return null;
        }
        return null;
      },
    });
  },
});
