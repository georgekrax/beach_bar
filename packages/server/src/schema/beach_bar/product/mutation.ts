import { checkScopes, isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { isOwner, IsOwnerInclude } from "@/utils/beachBar";
import { updateRedis } from "@/utils/db";
import { errors, TABLES } from "@beach_bar/common";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-errors";
import { arg, booleanArg, extendType, floatArg, idArg, intArg, nullable, stringArg } from "nexus";
import { ProductType } from "./types";

export const ProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProduct", {
      type: ProductType,
      description: "Add a product to a #beach_bar",
      args: {
        beachBarId: idArg(),
        name: stringArg({ description: "The name of the product" }),
        description: nullable(stringArg({ description: "A short description of the product" })),
        categoryId: idArg({ description: "The ID value of the category of the product" }),
        price: floatArg({ description: "The price of the product" }),
        maxPeople: intArg({ description: "How many people can use this specific product" }),
        minFoodSpending: nullable(
          floatArg({
            description: "The minimum amount of money spent to food for the user(s) of this purchased product",
          })
        ),
        isActive: nullable(
          booleanArg({
            description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
            default: false,
          })
        ),
        imgUrl: nullable(arg({ type: UrlScalar.name, description: "An image for the #beach_bar's product" })),
      },
      resolve: async (_, { beachBarId, name, categoryId, imgUrl, isActive = false, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add this product to a #beach_bar", ["beach_bar@crud:product"]);

        if (beachBarId.toString().trim().length === 0) throw new UserInputError("Please provide a valid beachBarId.");
        if (name.trim().length === 0) throw new UserInputError("Please provide a valid name.");
        if (categoryId.toString().trim().length === 0) throw new UserInputError("Please provide a valid categoryId.");
        if (args.price < 0) throw new UserInputError("Please provide a valid price.");
        if (args.maxPeople <= 0) {
          throw new UserInputError("Please provide a valid number for maximum people, that can use the product.");
        }

        const beachBar = await prisma.beachBar.findUnique({ where: { id: +beachBarId }, include: IsOwnerInclude });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const owner = isOwner(beachBar, { userId: payload!.sub, mustBePrimary: true });

        const category = TABLES.PRODUCT_CATEGORY.find(({ id }) => id.toString() === categoryId.toString());
        if (!category) throw new ApolloError("Please provide a valid product category", errors.NOT_FOUND);

        // try { await checkMinimumProductPrice(price, productCategory, beachBar.defaultCurrencyId); }
        // catch (err) { throw new ApolloError(err.message); }

        try {
          const newProduct = await prisma.product.create({
            data: {
              ...args,
              name,
              isActive: isActive || false,
              imgUrl: imgUrl?.toString(),
              isIndividual: category.components.length === 1,
              beachBarId: beachBar.id,
              categoryId: category.id,
            },
          });
          // await newProduct.createProductComponents(false);

          await prisma.productPriceHistory.create({
            data: { newPrice: newProduct.price, productId: newProduct.id, ownerId: owner.id },
          });
          await updateRedis({ model: "BeachBar", id: beachBar.id });
          return newProduct;
        } catch (err) {
          if (err.message.includes("product_name_beach_bar_id_key")) {
            const product = await prisma.product.findFirst({ where: { name, beachBarId: beachBar.id } });
            if (product && product.deletedAt) {
              return await prisma.product.update({ where: { id: product.id }, data: { deletedAt: null } });
            } else throw new ApolloError(`A product with the name of '${name}' already exists`, errors.CONFLICT);
          } else {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
          }
        }
      },
    });
    t.field("updateProduct", {
      type: ProductType,
      description: "Update a #beach_bar's product info",
      args: {
        productId: idArg(),
        name: nullable(stringArg({ description: "The name of the product" })),
        description: nullable(stringArg({ description: "A short description of the product" })),
        categoryId: nullable(idArg({ description: "The ID value of the category of the product" })),
        price: nullable(floatArg({ description: "The price of the product" })),
        maxPeople: nullable(intArg({ description: "How many people can use this specific product" })),
        minFoodSpending: nullable(
          floatArg({ description: "The minimum amount of money spent to food for the user(s) of this purchased product" })
        ),
        isActive: nullable(
          booleanArg({ description: "A boolean that indicates if the product is active & can be purchased by a user or a customer" })
        ),
        imgUrl: nullable(arg({ type: UrlScalar.name, description: "An image for the #beach_bar's product" })),
      },
      resolve: async (_, { productId, name, price, isActive, maxPeople, imgUrl, categoryId, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update this product of a #beach_bar", [
          "beach_bar@crud:product",
          "beach_bar@update:product",
        ]);

        if (productId.toString().trim().length === 0) throw new UserInputError("Please provide a valid productId");

        const product = await prisma.product.findUnique({
          where: { id: +productId },
          include: { beachBar: { include: IsOwnerInclude } },
        });
        if (!product) throw new ApolloError("Specified product does not exist", errors.NOT_FOUND);

        const owner = isOwner(product.beachBar, { userId: payload!.sub });

        try {
          let newPrice: typeof price = undefined;
          let newCategoryId: number | undefined = undefined;
          if (price && checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
            // try { await checkMinimumProductPrice(price, this.category, this.beachBar.defaultCurrencyId);
            // } catch (err) { throw new Error(err.message) }
            newPrice = price;
            await prisma.productPriceHistory.create({ data: { newPrice, productId: product.id, ownerId: owner.id } });
          }
          if (categoryId && categoryId.toString() !== product.categoryId.toString() && +(categoryId || 0) <= 0) {
            const category = TABLES.PRODUCT_CATEGORY.find(({ id }) => id.toString() === categoryId.toString());
            if (category) {
              newCategoryId = category.id;
              // await this.createProductComponents(true);
            } else throw new Error("Please provide a valid product category");
          }
          const updatedProduct = await prisma.product.update({
            where: { id: product.id },
            data: {
              ...args,
              name: name || undefined,
              isActive: isActive || undefined,
              maxPeople: maxPeople || undefined,
              imgUrl: imgUrl?.toString(),
              categoryId: newCategoryId ? +newCategoryId : undefined,
            },
          });
          await updateRedis({ model: "BeachBar", id: product.beachBarId });
          return updatedProduct;
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.boolean("deleteProduct", {
      description: "Delete (remove) a product from a #beach_bar",
      args: { productId: idArg() },
      resolve: async (_, { productId }, { prisma, payload }): Promise<boolean> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete (remove) a product from a #beach_bar", [
          "beach_bar@crud:product",
        ]);

        if (productId.toString().trim().length === 0) throw new UserInputError("Please provide a valid productId");

        const product = await prisma.product.findUnique({ where: { id: +productId } });
        if (!product) throw new ApolloError("Specified product does not exist", errors.NOT_FOUND);

        try {
          // TODO: Fix
          // await product.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.messsage);
        }

        return true;
      },
    });
  },
});

export const ProductRestoreMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("restoreBeachBarProduct", {
      type: ProductType,
      description: "Restore a (soft) deleted #beach_bar product",
      args: { productId: idArg() },
      resolve: async (_, { productId }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to restore a deleted product of a #beach_bar", [
          "beach_bar@crud:product",
        ]);

        if (productId.toString().trim().length === 0) throw new UserInputError("Please provide a valid productId");

        try {
          const updatedProduct = await prisma.product.update({
            where: { id: +productId },
            data: { deletedAt: null },
          });
          await updateRedis({ model: "BeachBar", id: updatedProduct.beachBarId });
          return updatedProduct;
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
  },
});
