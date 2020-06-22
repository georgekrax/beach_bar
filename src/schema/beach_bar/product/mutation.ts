import { booleanArg, extendType, floatArg, intArg, stringArg } from "@nexus/schema";
import { getConnection } from "typeorm";
import { MyContext } from "../../../common/myContext";
import errors from "../../../constants/errors";
import { BeachBar } from "../../../entity/BeachBar";
import { BeachBarOwner } from "../../../entity/BeachBarOwner";
import { BundleProductComponent } from "../../../entity/BundleProductComponent";
import { Currency } from "../../../entity/Currency";
import { Product } from "../../../entity/Product";
import { ProductCategory } from "../../../entity/ProductCategory";
import { checkScopes } from "../../../utils/checkScopes";
import { ErrorType } from "../../returnTypes";
import { AddProductType, UpdateProductType } from "./returnTypes";
import { AddProductResult, UpdateProductResult } from "./types";

export const ProductCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarProduct", {
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
        categoryId: intArg({ required: true, description: "The ID value of the category of the product" }),
        price: floatArg({ required: true, description: "The price of the product" }),
        currencyId: intArg({ required: false, description: "The ID value of the currency of the product's price", default: 1 }),
        isActive: booleanArg({
          required: false,
          description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
          default: false,
        }),
      },
      resolve: async (
        _,
        { beachBarId, name, categoryId, price, currencyId, isActive },
        { payload }: MyContext,
      ): Promise<AddProductType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to add this product to the #beach_bar",
            },
          };
        }

        if (!beachBarId || beachBarId.toString().trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!name || name.trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
        }
        if (!categoryId || categoryId.toString().trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product category" } };
        }
        if (!price || price.toString().trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid price" } };
        }
        if (currencyId && currencyId.toString().trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid currency" } };
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["products"],
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

        const currency = await Currency.findOne(currencyId);
        if (!currency) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Currency does not exist" } };
        }

        const productCategory = await ProductCategory.findOne({ where: { id: categoryId }, relations: ["productComponents"] });
        if (!productCategory) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provided a valid product category" } };
        }

        const newProduct = Product.create({
          name,
          beachBar,
          category: productCategory,
          isIndividual: productCategory.productComponents.length === 1 ? true : false,
          price,
          currency,
          isActive,
        });

        try {
          await newProduct.save();

          productCategory.productComponents.forEach(async productComponent => {
            await BundleProductComponent.create({ product: newProduct, component: productComponent }).save();
          });
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "product_name_beach_bar_id_key"') {
            const product = await Product.findOne({
              where: { beachBar, name },
              relations: ["beachBar", "category", "category.productComponents", "currency"],
            });
            if (product && product.deletedAt) {
              await getConnection().getRepository(Product).restore({ beachBar, name });
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
    t.field("updateBeachBarProduct", {
      type: UpdateProductResult,
      description: "Update a #beach_bar's product info",
      nullable: false,
      args: {
        beachBarId: intArg({
          required: true,
          description: "The ID value of the #beach_bar",
        }),
        productId: intArg({
          required: true,
          description: "The ID value of the product",
        }),
        categoryId: intArg({ required: false, description: "The ID value of the category of the product" }),
        price: floatArg({ required: false, description: "The price of the product" }),
        currencyId: intArg({ required: false, description: "The ID value of the currency of the product's price", default: 1 }),
        isActive: booleanArg({
          required: false,
          description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
        }),
      },
      resolve: async (
        _,
        { beachBarId, productId, categoryId, price, currencyId, isActive },
        { payload }: MyContext,
      ): Promise<UpdateProductType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product", "beach_bar@update:product"])) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to update this product of the #beach_bar",
            },
          };
        }

        if (!beachBarId || beachBarId.toString().trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
        }
        if (!productId || productId.toString().trim().length === 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
        }

        const product = await Product.findOne({
          where: { id: productId },
          relations: ["beachBar", "currency", "category", "category.productComponents", "components"],
        });
        if (!product) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist" } };
        }
        if (product.beachBar.id !== beachBarId) {
          return { error: { code: errors.CONFLICT, message: "Specified product does not exist on this #beach_bar" } };
        }

        const owners = await BeachBarOwner.find({ where: { beachBarId }, relations: ["owner", "owner.user"] });
        if (!owners) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }
        const owner = owners.find(beachBarOwner => beachBarOwner.owner.user.id === payload.sub);
        if (!owner) {
          return { error: { code: errors.UNAUTHORIZED_CODE, message: errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
        }
        if (!owner.isPrimary && !payload.scope.includes("beach_bar@update:product")) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update this product of this #beah_bar" },
          };
        }

        try {
          if (price && price >= 0.5 && product.currency.isoCode === "EUR" && currencyId === 1) {
            product.price = price;
          } else if (price && price <= 0.5) {
            return { error: { code: errors.INVALID_ARGUMENTS, message: "You should provide a price greater than 0.50 EUR" } };
          }
          if (currencyId && currencyId !== product.currencyId && currencyId.toString().trim().length !== 0) {
            const currency = await Currency.findOne(currencyId);
            if (currency) {
              product.currency = currency;
            } else {
              return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid currency" } };
            }
          }
          if (categoryId && categoryId !== product.categoryId && categoryId.toString().trim().length !== 0) {
            const category = await ProductCategory.findOne({ where: { id: categoryId }, relations: ["productComponents"] });
            if (category) {
              product.category = category;
              category.productComponents.forEach(async productComponent => {
                const bundleProductComponents = await BundleProductComponent.find({ product, component})
                await BundleProductComponent.remove([]);
              });
            } else {
              return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid product category" } };
            }
          }
          if (isActive !== null || isActive !== undefined) {
            product.isActive = isActive;
          }
          await product.save();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          error: { message: "Success" },
        };
      },
    });
  },
});
