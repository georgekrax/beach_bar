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
exports.BeachBarFeatureMutation = void 0;
const common_1 = require("@beach_bar/common");
const BeachBar_1 = require("entity/BeachBar");
const BeachBarFeature_1 = require("entity/BeachBarFeature");
const BeachBarService_1 = require("entity/BeachBarService");
const nexus_1 = require("nexus");
const types_1 = require("../../types");
const types_2 = require("./types");
exports.BeachBarFeatureMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBarFeature", {
            type: types_2.AddBeachBarFeatureResult,
            description: "Add (assign) a feature to a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar to add (assign) the feature" }),
                featureId: nexus_1.intArg({ description: "The ID value of the feature to add (assign) to the #beach_bar" }),
                quantity: nexus_1.intArg({
                    description: "An integer that indicates the quantity of the service, a #beach_bar provides",
                    default: 1,
                }),
                description: nexus_1.nullable(nexus_1.stringArg({ description: "A short description about the service" })),
            },
            resolve: (_, { beachBarId, featureId, quantity, description }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:beach_bar"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add a feature to 'this' #beach_bar",
                        },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
                }
                if (!featureId || featureId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid feature" } };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne({
                    where: { id: beachBarId },
                    relations: ["owners", "owners.owner", "features", "features.service"],
                });
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                const feature = beachBar.features.find(feature => feature.service.id === featureId);
                if (feature) {
                    if (feature.deletedAt) {
                        feature.deletedAt = undefined;
                        yield feature.save();
                        const beachBarFeature = yield BeachBarFeature_1.BeachBarFeature.findOne({
                            where: { beachBar, service: feature.service },
                            relations: ["beachBar", "service"],
                        });
                        if (!beachBarFeature) {
                            return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                        }
                        yield beachBar.updateRedis();
                        return {
                            feature: beachBarFeature,
                            added: true,
                        };
                    }
                    else {
                        return { error: { code: common_1.errors.CONFLICT, message: "Feature already exists" } };
                    }
                }
                const owner = beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload.sub));
                if (!owner) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!owner.isPrimary) {
                    return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to add 'this' feature to the #beach_bar" } };
                }
                const beachBarFeature = yield BeachBarService_1.BeachBarService.findOne(featureId);
                if (!beachBarFeature) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified feature does not exist" } };
                }
                const service = BeachBarFeature_1.BeachBarFeature.create({
                    beachBar,
                    service: beachBarFeature,
                    quantity,
                    description,
                });
                try {
                    yield service.save();
                    yield beachBar.updateRedis();
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                return {
                    feature: service,
                    added: true,
                };
            }),
        });
        t.field("updateBeachBarFeature", {
            type: types_2.UpdateBeachBarFeatureResult,
            description: "Update a feature of a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar to update its feature info" }),
                featureId: nexus_1.intArg({ description: "The ID value of the feature of the #beach_bar, to update its info" }),
                quantity: nexus_1.nullable(nexus_1.intArg({ description: "An integer that indicates the quantity of the service, a #beach_bar provides" })),
                description: nexus_1.nullable(nexus_1.stringArg({ description: "A short description about the service" })),
            },
            resolve: (_, { beachBarId, featureId, quantity, description }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:beach_bar", "beach_bar@update:beach_bar_feature:description"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update a feature of 'this' #beach_bar",
                        },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
                }
                if (!featureId || featureId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid feature" } };
                }
                const feature = yield BeachBarFeature_1.BeachBarFeature.findOne({
                    where: { beachBarId, serviceId: featureId },
                    relations: ["beachBar", "beachBar.owners", "beachBar.owners.owner", "service"],
                });
                if (!feature) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified feature does not exist" } };
                }
                const owner = feature.beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload.sub).trim());
                if (!owner) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!owner.isPrimary && !payload.scope.includes("beach_bar@update:beach_bar_feature:description")) {
                    return {
                        error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' feature info of the #beach_bar" },
                    };
                }
                try {
                    if (quantity >= 0 && owner.isPrimary && payload.scope.includes("beach_bar@crud:beach_bar")) {
                        feature.quantity = quantity;
                    }
                    else if (quantity >= 0 && (!owner.isPrimary || !payload.scope.includes("beach_bar@crud:beach_bar"))) {
                        return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to change the quantity of the feature" } };
                    }
                    if (description) {
                        feature.description = description;
                    }
                    yield feature.save();
                    yield feature.beachBar.updateRedis();
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                return {
                    feature,
                    updated: true,
                };
            }),
        });
        t.field("deleteBeachBarFeature", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a feature (service) from a #beach_bar",
            args: {
                beachBarId: nexus_1.intArg({ description: "The ID value of the #beach_bar to delete (remove) its feature" }),
                featureId: nexus_1.intArg({ description: "The ID value of the feature of the #beach_bar, to delete (remove)" }),
            },
            resolve: (_, { beachBarId, featureId }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.includes("beach_bar@crud:beach_bar")) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete (remove) a feature from 'this' #beach_bar",
                        },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
                }
                if (!featureId || featureId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid feature" } };
                }
                const feature = yield BeachBarFeature_1.BeachBarFeature.findOne({
                    where: { beachBarId, serviceId: featureId },
                    relations: ["beachBar", "beachBar.owners", "beachBar.owners.owner", "service"],
                });
                if (!feature) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified feature does not exist" } };
                }
                const owner = feature.beachBar.owners.find(owner => String(owner.owner.userId).trim() === String(payload.sub).trim());
                if (!owner) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!owner.isPrimary) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: common_1.errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER,
                        },
                    };
                }
                try {
                    yield feature.customSoftRemove(featureId);
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
