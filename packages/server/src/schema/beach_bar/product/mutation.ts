import { errors, MyContext } from "@beach_bar/common";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { BeachBar } from "entity/BeachBar";
import { Product } from "entity/Product";
import { ProductCategory } from "entity/ProductCategory";
import { ProductPriceHistory } from "entity/ProductPriceHistory";
import { arg, booleanArg, extendType, floatArg, intArg, nullable, stringArg } from "nexus";
import { DeleteType } from "typings/.index";
import { AddProductType, UpdateProductType } from "typings/beach_bar/product";
import { checkMinimumProductPrice } from "utils/beach_bar/checkMinimumProductPrice";
import { checkScopes } from "utils/checkScopes";
import { DeleteResult } from "../../types";
import { AddProductResult, UpdateProductResult } from "./types";

export const ProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProduct", {
      type: AddProductResult,
      description: "Add a product to a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar to add the product to" }),
        name: stringArg({ description: "The name of the product" }),
        description: nullable(stringArg({ description: "A short description of the product" })),
        categoryId: intArg({ description: "The ID value of the category of the product" }),
        price: floatArg({ description: "The price of the product" }),
        isActive: nullable(
          booleanArg({
            description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
            default: false,
          })
        ),
        maxPeople: intArg({ description: "How many people can use this specific product" }),
        imgUrl: arg({
          type: UrlScalar,
          description: "An image for the #beach_bar's product",
        }),
      },
      resolve: async (
        _,
        { beachBarId, name, description, categoryId, price, isActive, maxPeople, imgUrl },
        { payload }: MyContext
      ): Promise<AddProductType> => {
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
          relations: ["entryFees", "owners", "owners.owner"],
        });
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        const owner = beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload.sub).trim());
        if (!owner) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
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
          imgUrl: imgUrl.toString(),
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
      args: {
        productId: intArg({ description: "The ID value of the product" }),
        name: stringArg({ description: "The name of the product" }),
        description: nullable(stringArg({ description: "A short description of the product" })),
        categoryId: nullable(intArg({ description: "The ID value of the category of the product" })),
        price: nullable(floatArg({ description: "The price of the product" })),
        isActive: nullable(
          booleanArg({
            description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
          })
        ),
        maxPeople: intArg({
          description: "How many people can use this specific product",
        }),
        imgUrl: nullable(arg({
          type: UrlScalar,
          description: "An image for the #beach_bar's product",
        })),
      },
      resolve: async (
        _,
        { productId, name, description, categoryId, price, isActive, maxPeople, imgUrl },
        { payload }: MyContext
      ): Promise<UpdateProductType> => {
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
          relations: [
            "beachBar",
            "beachBar.entryFees",
            "beachBar.owners",
            "beachBar.owners.owner",
            "currency",
            "category",
            "category.productComponents",
          ],
        });
        if (!product) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist" } };
        }

        const owner = product.beachBar.owners.find(
          beachBarOwner => String(beachBarOwner.owner.userId).trim() === String(payload.sub).trim()
        );
        if (!owner) {
          return { error: { code: errors.CONFLICT, message: errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
        }

        try {
          const updatedProduct = await product.update({
            name,
            description,
            price,
            categoryId,
            isActive,
            maxPeople,
            imgUrl,
            owner: owner.owner,
            payload,
          });

          return {
            product: updatedProduct,
            updated: true,
          };
        } catch (err) {
          if (err.message === errors.SOMETHING_WENT_WRONG) {
            return { error: { message: errors.SOMETHING_WENT_WRONG } };
          }
          return { error: { message: `Something went wrong: ${err.message}` } };
        }
      },
    });
    t.field("deleteProduct", {
      type: DeleteResult,
      description: "Delete (remove) a product from a #beach_bar",
      args: {
        productId: intArg({ description: "The ID value of the product" }),
      },
      resolve: async (_, { productId }, { payload }: MyContext): Promise<DeleteType> => {
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
      args: {
        productId: intArg({ description: "The ID value of the product" }),
      },
      resolve: async (_, { productId }, { payload }: MyContext): Promise<UpdateProductType> => {
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
