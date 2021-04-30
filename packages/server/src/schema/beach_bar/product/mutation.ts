import { errors, MyContext } from "@beach_bar/common";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError, UserInputError } from "apollo-server-errors";
import { BeachBar } from "entity/BeachBar";
import { Product } from "entity/Product";
import { ProductCategory } from "entity/ProductCategory";
import { ProductPriceHistory } from "entity/ProductPriceHistory";
import { arg, booleanArg, extendType, floatArg, idArg, intArg, nullable, stringArg } from "nexus";
import { TDelete } from "typings/.index";
import { TAddProduct, TUpdateProduct } from "typings/beach_bar/product";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { checkMinimumProductPrice } from "utils/beach_bar/checkMinimumProductPrice";
import { DeleteGraphQlType } from "../../types";
import { AddProductType, UpdateProductType } from "./types";

export const ProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProduct", {
      type: AddProductType,
      description: "Add a product to a #beach_bar",
      args: {
        beachBarId: idArg(),
        name: stringArg({ description: "The name of the product" }),
        description: nullable(stringArg({ description: "A short description of the product" })),
        categoryId: idArg({ description: "The ID value of the category of the product" }),
        price: floatArg({ description: "The price of the product" }),
        isActive: nullable(
          booleanArg({
            description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
            default: false,
          })
        ),
        maxPeople: intArg({ description: "How many people can use this specific product" }),
        imgUrl: arg({ type: UrlScalar, description: "An image for the #beach_bar's product" }),
      },
      resolve: async (
        _,
        { beachBarId, name, description, categoryId, price, isActive, maxPeople, imgUrl },
        { payload }: MyContext
      ): Promise<TAddProduct> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add this product to a #beach_bar", ["beach_bar@crud:product"]);

        if (!beachBarId || beachBarId.trim().length === 0) throw new UserInputError("Please provide a valid #beach_bar ID");
        if (!name || name.trim().length === 0) throw new UserInputError("Please provide a valid name");
        if (!categoryId || categoryId.trim().length === 0) throw new UserInputError("Please provide a valid product category ID");
        if (price === null || price === undefined || price < 0) throw new UserInputError("Please provide a valid price");
        if (maxPeople === null || maxPeople === undefined || maxPeople <= 0)
          throw new UserInputError("Please provide a valid number for maximum people, that can use the product simultaneously");

        const beachBar = await BeachBar.findOne({ where: { id: beachBarId }, relations: ["owners", "owners.owner"] });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const owner = beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload!.sub).trim());
        if (!owner) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_OWNER, errors.NOT_FOUND);
        if (!owner.isPrimary) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER, errors.UNAUTHORIZED_CODE);

        const productCategory = await ProductCategory.findOne({ where: { id: categoryId }, relations: ["components"] });
        if (!productCategory) throw new ApolloError("Please provide a valid product category", errors.NOT_FOUND);

        try {
          await checkMinimumProductPrice(price, productCategory, beachBar.defaultCurrencyId);
        } catch (err) {
          throw new ApolloError(err.message);
        }

        const newProduct = Product.create({
          name,
          beachBar,
          category: productCategory,
          isIndividual: productCategory.components.length === 1 ? true : false,
          price,
          description,
          maxPeople,
          isActive,
          imgUrl: imgUrl.toString(),
        });

        try {
          await newProduct.save();
          // await newProduct.createProductComponents(false);

          await ProductPriceHistory.create({ product: newProduct, owner: owner.owner, newPrice: newProduct.price }).save();
          await beachBar.updateRedis();
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "product_name_beach_bar_id_key"') {
            const product = await Product.findOne({
              where: { beachBar, name },
              relations: ["beachBar", "category", "category.components", "currency"],
            });
            if (product && product.deletedAt) {
              product.deletedAt = undefined;
              await product.save();
              return { product, added: true };
            } else throw new ApolloError(`A product with the name of '${name}' already exists`, errors.CONFLICT);
          } else {
            throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
          }
        }

        return { product: newProduct, added: true };
      },
    });
    t.field("updateProduct", {
      type: UpdateProductType,
      description: "Update a #beach_bar's product info",
      args: {
        productId: idArg(),
        name: stringArg({ description: "The name of the product" }),
        description: nullable(stringArg({ description: "A short description of the product" })),
        categoryId: nullable(idArg({ description: "The ID value of the category of the product" })),
        price: nullable(floatArg({ description: "The price of the product" })),
        isActive: nullable(
          booleanArg({
            description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
          })
        ),
        maxPeople: intArg({ description: "How many people can use this specific product" }),
        imgUrl: nullable(
          arg({
            type: UrlScalar,
            description: "An image for the #beach_bar's product",
          })
        ),
      },
      resolve: async (
        _,
        { productId, name, description, categoryId, price, isActive, maxPeople, imgUrl },
        { payload }: MyContext
      ): Promise<TUpdateProduct> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update this product of a #beach_bar", [
          "beach_bar@crud:product",
          "beach_bar@update:product",
        ]);

        if (!productId || productId.trim().length === 0) throw new UserInputError("Please provide a valid product ID");

        const product = await Product.findOne({
          where: { id: productId },
          relations: [
            "beachBar",
            // "beachBar.entryFees",
            "beachBar.owners",
            "beachBar.owners.owner",
            "currency",
            "category",
            "category.components",
          ],
        });
        if (!product) throw new ApolloError("Specified product does not exist", errors.NOT_FOUND);

        const owner = product.beachBar.owners.find(
          beachBarOwner => String(beachBarOwner.owner.userId).trim() === String(payload!.sub).trim()
        );
        if (!owner) throw new ApolloError(errors.YOU_ARE_NOT_BEACH_BAR_OWNER, errors.NOT_FOUND);

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

          return { product: updatedProduct, updated: true };
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }
      },
    });
    t.field("deleteProduct", {
      type: DeleteGraphQlType,
      description: "Delete (remove) a product from a #beach_bar",
      args: { productId: idArg() },
      resolve: async (_, { productId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete (remove) a product from a #beach_bar", [
          "beach_bar@crud:product",
        ]);

        if (!productId || productId.trim().length === 0) throw new UserInputError("Please provide a valid product ID");

        const product = await Product.findOne({ where: { id: productId }, relations: ["beachBar", "offerCampaigns"] });
        if (!product) throw new ApolloError("Specified product does not exist", errors.NOT_FOUND);

        try {
          await product.softRemove();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.messsage);
        }

        return { deleted: true };
      },
    });
  },
});

export const ProductRestoreMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("restoreBeachBarProduct", {
      type: UpdateProductType,
      description: "Restore a (soft) deleted #beach_bar product",
      args: { productId: idArg() },
      resolve: async (_, { productId }, { payload }: MyContext): Promise<TUpdateProduct> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to restore a deleted product of a #beach_bar", [
          "beach_bar@crud:product",
        ]);

        if (!productId || productId.trim().length === 0) throw new UserInputError("Please provide a valid product ID");

        const product = await Product.findOne({
          where: { id: productId },
          relations: ["beachBar", "category", "components"],
        });
        if (!product) throw new ApolloError("Specified product does not exist", errors.NOT_FOUND);

        try {
          product.deletedAt = undefined;
          await product.save();
          await product.beachBar.updateRedis();
        } catch (err) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG + ": " + err.message);
        }

        return { product, updated: true };
      },
    });
  },
});
