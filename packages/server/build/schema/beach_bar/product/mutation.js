"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRestoreMutation = exports.ProductCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const BeachBar_1 = require("entity/BeachBar");
const Product_1 = require("entity/Product");
const ProductCategory_1 = require("entity/ProductCategory");
const ProductPriceHistory_1 = require("entity/ProductPriceHistory");
const nexus_1 = require("nexus");
const checkMinimumProductPrice_1 = require("utils/beach_bar/checkMinimumProductPrice");
const checkScopes_1 = require("utils/checkScopes");
const types_1 = require("../../types");
const types_2 = require("./types");
exports.ProductCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addProduct", {
            type: types_2.AddProductResult,
            description: "Add a product to a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar to add the product to" }),
                name: nexus_1.stringArg({ description: "The name of the product" }),
                description: nexus_1.nullable(nexus_1.stringArg({ description: "A short description of the product" })),
                categoryId: nexus_1.intArg({ description: "The ID value of the category of the product" }),
                price: nexus_1.floatArg({ description: "The price of the product" }),
                isActive: nexus_1.nullable(nexus_1.booleanArg({
                    description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
                    default: false,
                })),
                maxPeople: nexus_1.intArg({ description: "How many people can use this specific product" }),
                imgUrl: nexus_1.arg({
                    type: graphql_1.UrlScalar,
                    description: "An image for the #beach_bar's product",
                }),
            },
            resolve: (_, { beachBarId, name, description, categoryId, price, isActive, maxPeople, imgUrl }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:product"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add this product to a #beach_bar",
                        },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
                }
                if (!name || name.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
                }
                if (!categoryId || categoryId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid product category" } };
                }
                if (price === null || price === undefined || price < 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid price" } };
                }
                if (maxPeople === null || maxPeople === undefined || maxPeople <= 0) {
                    return {
                        error: {
                            code: common_1.errors.INVALID_ARGUMENTS,
                            message: "Please provide a valid number for maximum people, that can use the product simultaneously",
                        },
                    };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne({
                    where: { id: beachBarId },
                    relations: ["entryFees", "owners", "owners.owner"],
                });
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                const owner = beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload.sub).trim());
                if (!owner) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!owner.isPrimary) {
                    return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER } };
                }
                const productCategory = yield ProductCategory_1.ProductCategory.findOne({ where: { id: categoryId }, relations: ["productComponents"] });
                if (!productCategory) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provided a valid product category" } };
                }
                try {
                    yield checkMinimumProductPrice_1.checkMinimumProductPrice(price, productCategory, beachBar, beachBar.defaultCurrencyId);
                }
                catch (err) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: err.message } };
                }
                const newProduct = Product_1.Product.create({
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
                    yield newProduct.save();
                    yield newProduct.createProductComponents(false);
                    yield ProductPriceHistory_1.ProductPriceHistory.create({ product: newProduct, owner: owner.owner, newPrice: newProduct.price }).save();
                    yield beachBar.updateRedis();
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "product_name_beach_bar_id_key"') {
                        const product = yield Product_1.Product.findOne({
                            where: { beachBar, name },
                            relations: ["beachBar", "category", "category.productComponents", "currency"],
                        });
                        if (product && product.deletedAt) {
                            product.deletedAt = undefined;
                            yield product.save();
                            return {
                                product,
                                added: true,
                            };
                        }
                        else {
                            return { error: { code: common_1.errors.CONFLICT, message: `A product with the name of '${name}' already exists` } };
                        }
                    }
                    else {
                        return { error: { message: `Something went wrong: ${err.message}` } };
                    }
                }
                return {
                    product: newProduct,
                    added: true,
                };
            }),
        });
        t.field("updateProduct", {
            type: types_2.UpdateProductResult,
            description: "Update a #beach_bar's product info",
            args: {
                productId: nexus_1.intArg({ description: "The ID value of the product" }),
                name: nexus_1.stringArg({ description: "The name of the product" }),
                description: nexus_1.nullable(nexus_1.stringArg({ description: "A short description of the product" })),
                categoryId: nexus_1.nullable(nexus_1.intArg({ description: "The ID value of the category of the product" })),
                price: nexus_1.nullable(nexus_1.floatArg({ description: "The price of the product" })),
                isActive: nexus_1.nullable(nexus_1.booleanArg({
                    description: "A boolean that indicates if the product is active & can be purchased by a user or a customer",
                })),
                maxPeople: nexus_1.intArg({
                    description: "How many people can use this specific product",
                }),
                imgUrl: nexus_1.nullable(nexus_1.arg({
                    type: graphql_1.UrlScalar,
                    description: "An image for the #beach_bar's product",
                })),
            },
            resolve: (_, { productId, name, description, categoryId, price, isActive, maxPeople, imgUrl }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!checkScopes_1.checkScopes(payload, ["beach_bar@crud:product", "beach_bar@update:product"])) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update this product of a #beach_bar",
                        },
                    };
                }
                if (!productId || productId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
                }
                const product = yield Product_1.Product.findOne({
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
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified product does not exist" } };
                }
                const owner = product.beachBar.owners.find(beachBarOwner => String(beachBarOwner.owner.userId).trim() === String(payload.sub).trim());
                if (!owner) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
                }
                try {
                    const updatedProduct = yield product.update({
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
                }
                catch (err) {
                    if (err.message === common_1.errors.SOMETHING_WENT_WRONG) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
            }),
        });
        t.field("deleteProduct", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a product from a #beach_bar",
            args: {
                productId: nexus_1.intArg({ description: "The ID value of the product" }),
            },
            resolve: (_, { productId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.includes("beach_bar@crud:product")) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete (remove) a product from a #beach_bar",
                        },
                    };
                }
                if (!productId || productId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
                }
                const product = yield Product_1.Product.findOne({ where: { id: productId }, relations: ["beachBar", "offerCampaigns"] });
                if (!product) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified product does not exist" } };
                }
                try {
                    yield product.softRemove();
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
exports.ProductRestoreMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("restoreBeachBarProduct", {
            type: types_2.UpdateProductResult,
            description: "Restore a (soft) deleted #beach_bar product",
            args: {
                productId: nexus_1.intArg({ description: "The ID value of the product" }),
            },
            resolve: (_, { productId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.includes("beach_bar@crud:product")) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to restore a deleted product of a #beach_bar",
                        },
                    };
                }
                if (!productId || productId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid product" } };
                }
                const product = yield Product_1.Product.findOne({
                    where: { id: productId },
                    relations: ["beachBar", "category", "components"],
                });
                if (!product) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified product does not exist" } };
                }
                try {
                    product.deletedAt = undefined;
                    yield product.save();
                    yield product.beachBar.updateRedis();
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                return {
                    product,
                    updated: true,
                };
            }),
        });
    },
});
