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
exports.BeachBarRestaurantCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const BeachBar_1 = require("entity/BeachBar");
const BeachBarRestaurant_1 = require("entity/BeachBarRestaurant");
const nexus_1 = require("nexus");
const types_1 = require("../../types");
const types_2 = require("./types");
exports.BeachBarRestaurantCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBarRestaurant", {
            type: types_2.AddBeachBarRestaurantResult,
            description: "Add a restaurant of a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar the restaurant will be added to" }),
                name: nexus_1.stringArg({ description: "The name of the restaurant" }),
                description: nexus_1.nullable(nexus_1.stringArg({ description: "A short description, info text, about the restaurant itself" })),
                isActive: nexus_1.nullable(nexus_1.booleanArg({
                    description: "A boolean that indicates if the restaurant is active or not. Its default value is false",
                    default: false,
                })),
            },
            resolve: (_, { beachBarId, name, description, isActive }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_restaurant"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add 'this' a restaurant to a #beach_bar",
                        },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
                }
                if (!name || name.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid name" } };
                }
                if (description && description.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid description text" } };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne(beachBarId);
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                const newRestaurant = BeachBarRestaurant_1.BeachBarRestaurant.create({
                    name,
                    description,
                    beachBar,
                    isActive,
                });
                try {
                    yield newRestaurant.save();
                    yield beachBar.updateRedis();
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "beach_bar_restaurant_beach_bar_id_name_key"') {
                        return {
                            error: { code: common_1.errors.CONFLICT, message: `Specified restaurant with name '${name}' already exists in this #beach_bar` },
                        };
                    }
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    restaurant: newRestaurant,
                    added: true,
                };
            }),
        });
        t.field("updateBeachBarRestaurant", {
            type: types_2.UpdateBeachBarRestaurantResult,
            description: "Update the restaurant details of a #beach_bar",
            args: {
                restaurantId: nexus_1.intArg({ description: "The ID value of the restaurant" }),
                name: nexus_1.nullable(nexus_1.stringArg({ description: "The name of the restaurant" })),
                description: nexus_1.nullable(nexus_1.stringArg({ description: "A short description, info text, about the restaurant itself" })),
                isActive: nexus_1.nullable(nexus_1.booleanArg({ description: "A boolean that indicates if the restaurant is active or not" })),
            },
            resolve: (_, { restaurantId, name, description, isActive }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_restaurant", "beach_bar@update:beach_bar_restaurant"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update 'this' restaurant's info",
                        },
                    };
                }
                if (!restaurantId || restaurantId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar restaurant" } };
                }
                const restaurant = yield BeachBarRestaurant_1.BeachBarRestaurant.findOne({ where: { id: restaurantId }, relations: ["beachBar", "foodItems"] });
                if (!restaurant) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified restaurant does not exist" } };
                }
                restaurant.foodItems = restaurant.foodItems.filter(item => !item.deletedAt);
                try {
                    const updatedRestaurant = yield restaurant.update(name, description, isActive);
                    if (!updatedRestaurant) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    return {
                        restaurant: updatedRestaurant,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteBeachBarRestaurant", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a restaurant from a #beach_bar",
            args: {
                restaurantId: nexus_1.intArg({ description: "The ID value of the #beach_bar restaurant" }),
            },
            resolve: (_, { restaurantId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_restaurant"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete a restaurant from a #beach_bar",
                        },
                    };
                }
                if (!restaurantId || restaurantId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar restaurant" } };
                }
                const restaurant = yield BeachBarRestaurant_1.BeachBarRestaurant.findOne({ where: { id: restaurantId }, relations: ["beachBar"] });
                if (!restaurant) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified restaurant does not exist" } };
                }
                try {
                    yield restaurant.softRemove();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
