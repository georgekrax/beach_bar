import { errors, MyContext } from "@beach_bar/common";
import { booleanArg, extendType, floatArg, intArg, stringArg } from "@nexus/schema";
import { BeachBar } from "../../../entity/BeachBar";
import { BeachBarOwner } from "../../../entity/BeachBarOwner";
import { Product } from "../../../entity/Product";
import { ProductCategory } from "../../../entity/ProductCategory";
import { ProductPriceHistory } from "../../../entity/ProductPriceHistory";
import { checkMinimumProductPrice } from "../../../utils/beach_bar/checkMinimumProductPrice";
import { checkScopes } from "../../../utils/checkScopes";
import { DeleteType, ErrorType } from "../../returnTypes";
import { DeleteResult } from "../../types";
import { AddProductType, UpdateProductType } from "./returnTypes";
import { AddProductResult, UpdateProductResult } from "./types";

export const ProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProduct", {
      type: AddProductResult,
      description: "Add a product to a #beach_bar",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar to add the product to",
        }),
        name: stringArg({
          required: true,
          description: "The name of the product",
        }),
        description: stringArg({
          required: false,
          description: "A short description of the product",
        }),
        categoryId: intArg({ required: true, description: "The ID value of the category of the product" }),
        price: floatArg({ required: true, description: "The price of the product" }),
        isActive: booleanArg({
          required: false,
          description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
          default: false,
        }),
        maxPeople: intArg({
          required: true,
          description: "How many people can use this specific product",
        }),
      },
      resolve: async (
        _,
        { beachBarId, name, description, categoryId, price, isActive, maxPeople },
        { payload }: MyContext,
      ): Promise<AddProductType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add this product to a #beach_bar",
            },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!name || name.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
        }
        if (!categoryId || categoryId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product category" } };
        }
        if (price === null || price === undefined || price < 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid price" } };
        }
        if (maxPeople === null || maxPeople === undefined || maxPeople <= 0) {
          return {
            error: {
              code: errors.INVALID_ARGUMENTS,
              message: "Please provide a valid number for maximum people, that can use the product simultaneously",
            },
          };
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["entryFees"],
        });
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        const owners = await BeachBarOwner.find({ where: { beachBar }, relations: ["owner", "owner.user"] });
        if (!owners) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }
        const owner = owners.find(beachBarOwner => beachBarOwner.owner.user.id === payload.sub);
        if (!owner) {
          return { error: { code: errors.UNAUTHORIZED_CODE, message: errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
        }
        if (!owner.isPrimary) {
          return { error: { code: errors.UNAUTHORIZED_CODE, message: errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER } };
        }

        const productCategory = await ProductCategory.findOne({ where: { id: categoryId }, relations: ["productComponents"] });
        if (!productCategory) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provided a valid product category" } };
        }

        try {
          await checkMinimumProductPrice(price, productCategory, beachBar, beachBar.defaultCurrencyId);
        } catch (err) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: err.message } };
        }

        const newProduct = Product.create({
          name,
          beachBar,
          category: productCategory,
          isIndividual: productCategory.productComponents.length === 1 ? true : false,
          price,
          description,
          maxPeople,
          isActive,
        });

        try {
          await newProduct.save();
          await newProduct.createProductComponents(false);

          await ProductPriceHistory.create({ product: newProduct, owner: owner.owner, newPrice: newProduct.price }).save();
          await beachBar.updateRedis();
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "product_name_beach_bar_id_key"') {
            const product = await Product.findOne({
              where: { beachBar, name },
              relations: ["beachBar", "category", "category.productComponents", "currency"],
            });
            if (product && product.deletedAt) {
              product.deletedAt = undefined;
              await product.save();
              return {
                product,
                added: true,
              };
            } else {
              return { error: { code: errors.CONFLICT, message: `A product with the name of '${name}' already exists` } };
            }
          } else {
            return { error: { message: `Something went wrong: ${err.message}` } };
          }
        }

        return {
          product: newProduct,
          added: true,
        };
      },
    });
    t.field("updateProduct", {
      type: UpdateProductResult,
      description: "Update a #beach_bar's product info",
      nullable: false,
      args: {
        productId: intArg({
          required: true,
          description: "The ID value of the product",
        }),
        name: stringArg({
          required: true,
          description: "The name of the product",
        }),
        description: stringArg({
          required: false,
          description: "A short description of the product",
        }),
        categoryId: intArg({ required: false, description: "The ID value of the category of the product" }),
        price: floatArg({ required: false, description: "The price of the product" }),
        isActive: booleanArg({
          required: false,
          description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
        }),
        maxPeople: intArg({
          required: true,
          description: "How many people can use this specific product",
        }),
      },
      resolve: async (
        _,
        { productId, name, description, categoryId, price, isActive, maxPeople },
        { payload }: MyContext,
      ): Promise<UpdateProductType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:product", "beach_bar@update:product"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update this product of a #beach_bar",
            },
          };
        }

        if (!productId || productId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
        }

        const product = await Product.findOne({
          where: { id: productId },
          relations: ["beachBar", "beachBar.entryFees", "currency", "category", "category.productComponents"],
        });
        if (!product) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist" } };
        }

        const owners = await BeachBarOwner.find({ where: { beachBarId: product.beachBarId }, relations: ["owner", "owner.user"] });
        if (!owners) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }
        const owner = owners.find(beachBarOwner => beachBarOwner.owner.user.id === payload.sub);
        if (!owner) {
          return { error: { code: errors.UNAUTHORIZED_CODE, message: errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
        }
        if (!owner.isPrimary && !payload.scope.includes("beach_bar@update:product")) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update this product of this #beach_bar" },
          };
        }

        try {
          if (
            (price !== null || price !== undefined) &&
            price >= 0 &&
            checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])
          ) {
            try {
              await checkMinimumProductPrice(price, product.category, product.beachBar, product.beachBar.defaultCurrencyId);
            } catch (err) {
              throw new Error(err.message);
            }
            product.price = price;
            await ProductPriceHistory.create({ product, owner: owner.owner, newPrice: price }).save();
          }
          if (categoryId && categoryId !== product.categoryId && categoryId <= 0) {
            const category = await ProductCategory.findOne({ where: { id: categoryId }, relations: ["productComponents"] });
            if (category) {
              product.category = category;
              await product.createProductComponents(true);
            } else {
              return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product category" } };
            }
          }
          if (isActive !== null && isActive !== undefined) {
            product.isActive = isActive;
          }
          if (name && name !== product.name) {
            product.name = name;
          }
          if (description && description !== product.description) {
            product.description = description;
          }
          if (maxPeople && maxPeople !== product.maxPeople && maxPeople > 0) {
            product.maxPeople = maxPeople;
          }
          await product.save();
          await product.beachBar.updateRedis();
        } catch (err) {
          if (err.message === errors.SOMETHING_WENT_WRONG) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          product,
          updated: true,
        };
      },
    });
    t.field("deleteProduct", {
      type: DeleteResult,
      description: "Delete (remove) a product from a #beach_bar",
      nullable: false,
      args: {
        productId: intArg({
          required: true,
          description: "The ID value of the product",
        }),
      },
      resolve: async (_, { productId }, { payload }: MyContext): Promise<DeleteType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.includes("beach_bar@crud:product")) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to delete (remove) a product from a #beach_bar",
            },
          };
        }

        if (!productId || productId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
        }

        const product = await Product.findOne({ where: { id: productId }, relations: ["beachBar", "offerCampaigns"] });
        if (!product) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist" } };
        }

        try {
          await product.softRemove();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});

export const ProductRestoreMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("restoreBeachBarProduct", {
      type: UpdateProductResult,
      description: "Restore a (soft) deleted #beach_bar product",
      nullable: false,
      args: {
        productId: intArg({
          required: true,
          description: "The ID value of the product",
        }),
      },
      resolve: async (_, { productId }, { payload }: MyContext): Promise<UpdateProductType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.includes("beach_bar@crud:product")) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to restore a deleted product of a #beach_bar",
            },
          };
        }

        if (!productId || productId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
        }

        const product = await Product.findOne({
          where: { id: productId },
          relations: ["beachBar", "category", "components"],
        });
        if (!product) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist" } };
        }

        try {
          product.deletedAt = undefined;
          await product.save();
          await product.beachBar.updateRedis();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          product,
          updated: true,
        };
      },
    });
  },
});
