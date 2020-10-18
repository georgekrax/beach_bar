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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const schema_1 = require("@nexus/schema");
const scopes_1 = require("constants/scopes");
const BeachBar_1 = require("entity/BeachBar");
const BeachBarOwner_1 = require("entity/BeachBarOwner");
const Owner_1 = require("entity/Owner");
const arrDiff_1 = __importDefault(require("utils/arrDiff"));
const types_1 = require("../types");
const types_2 = require("./types");
exports.OwnerCrudMutation = schema_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addBeachBarOwner", {
            type: types_2.AddBeachBarOwnerResult,
            description: "Add (assign) another owner to a #beach_bar too. Only available for the primary owner of a #beach_bar",
            nullable: false,
            args: {
                beachBarId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the #beach_bar the owner will be added (assigned) to",
                }),
                userId: schema_1.intArg({
                    required: false,
                    description: "The user to add (assign) to the #beach_bar, to become one of its owners",
                }),
                isPrimary: schema_1.booleanArg({
                    required: false,
                    description: "Set to true if the user will become the or one of the primary owners of the #beach_bar. It is set to false by default",
                    default: false,
                }),
            },
            resolve: (_, { userId, beachBarId, isPrimary }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:owner_beach_bar", "beach_bar@create:owner_beach_bar"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to add 'this' owner to a #beach_bar",
                        },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
                }
                if (userId && userId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid user" } };
                }
                const beachBar = yield BeachBar_1.BeachBar.findOne(beachBarId);
                if (!beachBar) {
                    return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.BEACH_BAR_DOES_NOT_EXIST } };
                }
                if (!userId) {
                    const owner = yield Owner_1.Owner.findOne({
                        where: { userId: payload.sub },
                        relations: ["user", "beachBars", "beachBars.beachBar"],
                    });
                    if (!owner) {
                        return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.YOU_ARE_NOT_AN_OWNER } };
                    }
                    const isOwner = yield BeachBarOwner_1.BeachBarOwner.findOne({ owner, beachBar });
                    if (isOwner) {
                        return { error: { code: common_1.errors.CONFLICT, message: "You are already an owner at this #beach_bar" } };
                    }
                    const newOwner = BeachBarOwner_1.BeachBarOwner.create({
                        beachBar,
                        owner,
                        isPrimary: isPrimary && payload.scope.includes("beach_bar@crud:beach_bar") ? true : false,
                    });
                    try {
                        yield newOwner.save();
                        yield beachBar.updateRedis();
                        return {
                            owner: newOwner,
                            added: true,
                        };
                    }
                    catch (err) {
                        return { error: { message: `Something went wrong: ${err.message}` } };
                    }
                }
                else if (userId && payload.scope.includes("beach_bar@crud:owner_beach_bar")) {
                    const primaryOwner = yield Owner_1.Owner.findOne({
                        where: { userId: payload.sub },
                        relations: ["beachBars", "beachBars.beachBar"],
                    });
                    if (!primaryOwner) {
                        return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.YOU_ARE_NOT_AN_OWNER } };
                    }
                    const primaryBeachBarOwner = yield BeachBarOwner_1.BeachBarOwner.findOne({ owner: primaryOwner, beachBar });
                    if (!primaryBeachBarOwner) {
                        return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: common_1.errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
                    }
                    if (!primaryBeachBarOwner.isPrimary) {
                        return {
                            error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not a primary owner, to add a new owner to the #beach_bar" },
                        };
                    }
                    const owner = yield Owner_1.Owner.findOne({ where: { userId }, relations: ["user"] });
                    if (!owner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.USER_OWNER_DOES_NOT_EXIST } };
                    }
                    const isOwner = yield BeachBarOwner_1.BeachBarOwner.findOne({ owner, beachBar });
                    if (isOwner) {
                        return { error: { code: common_1.errors.CONFLICT, message: "User is already an owner of this #beach_bar" } };
                    }
                    const newOwner = BeachBarOwner_1.BeachBarOwner.create({
                        beachBar,
                        owner,
                        isPrimary: isPrimary && payload.scope.includes("beach_bar@crud:beach_bar") ? true : false,
                    });
                    try {
                        yield newOwner.save();
                        yield beachBar.updateRedis();
                        return {
                            owner: newOwner,
                            added: true,
                        };
                    }
                    catch (err) {
                        return { error: { message: `Something went wrong: ${err.message}` } };
                    }
                }
                return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
            }),
        });
        t.field("updateBeachBarOwner", {
            type: types_2.UpdateBeachBarOwnerResult,
            description: "Update a #beach_bar's owner info",
            nullable: false,
            args: {
                beachBarId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the #beach_bar the owner is added (assigned) to",
                }),
                userId: schema_1.intArg({
                    required: false,
                    description: "The user to update its info. It should not be null or 0, if a primary owner wants to update another owner",
                }),
                publicInfo: schema_1.booleanArg({
                    required: false,
                    description: "A boolean that indicates if the owner info (contact details) are meant to be presented online to the public",
                }),
                isPrimary: schema_1.booleanArg({
                    required: false,
                    description: "Set to true if the user will become the or one of the primary owners of the #beach_bar. It is set to false by default",
                    default: false,
                }),
            },
            resolve: (_, { beachBarId, userId, publicInfo, isPrimary }, { payload, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:owner_beach_bar", "beach_bar@update:owner_beach_bar"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update 'this' owner",
                        },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
                }
                if (userId && userId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid owner" } };
                }
                let beachBarOwner;
                let primaryBeachBarOwner;
                if (!userId) {
                    const owner = yield Owner_1.Owner.findOne({ where: { userId: payload.sub }, relations: ["user"] });
                    if (!owner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.YOU_ARE_NOT_AN_OWNER } };
                    }
                    beachBarOwner = yield BeachBarOwner_1.BeachBarOwner.findOne({
                        where: { owner, beachBarId },
                        relations: ["beachBar", "owner", "owner.user", "beachBar"],
                    });
                    if (!beachBarOwner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
                    }
                }
                else if (userId) {
                    const primaryOwner = yield Owner_1.Owner.findOne({
                        where: { userId: payload.sub },
                        relations: ["beachBars", "beachBars.beachBar"],
                    });
                    if (!primaryOwner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.YOU_ARE_NOT_AN_OWNER } };
                    }
                    primaryBeachBarOwner = primaryOwner.beachBars.find(beachBar => beachBar.beachBar.id === beachBarId && (beachBar.deletedAt === null || beachBar.deletedAt === undefined));
                    if (!primaryBeachBarOwner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
                    }
                    if (!primaryBeachBarOwner.isPrimary) {
                        return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' owner info" } };
                    }
                    const owner = yield Owner_1.Owner.findOne({ userId });
                    if (!owner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.USER_OWNER_DOES_NOT_EXIST } };
                    }
                    beachBarOwner = yield BeachBarOwner_1.BeachBarOwner.findOne({
                        where: { owner, beachBarId },
                        relations: ["beachBar", "owner", "owner.user", "beachBar"],
                    });
                }
                if (!beachBarOwner) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                try {
                    if (isPrimary && !payload.scope.includes("beach_bar@crud:beach_bar")) {
                        return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to make this owner a primary one" } };
                    }
                    else if (isPrimary && payload.scope.includes("beach_bar@crud:beach_bar")) {
                        beachBarOwner.isPrimary = true;
                        yield redis.sadd(beachBarOwner.owner.user.getRedisKey(true), [scopes_1.user.CRUD_OWNER_BEACH_BAR, scopes_1.user.CRUD_BEACH_BAR]);
                    }
                    else {
                        beachBarOwner.isPrimary = false;
                        yield redis.srem(beachBarOwner.owner.user.getRedisKey(true), [scopes_1.user.CRUD_OWNER_BEACH_BAR, scopes_1.user.CRUD_BEACH_BAR]);
                    }
                    if ((publicInfo !== undefined || null) && primaryBeachBarOwner) {
                        return {
                            error: {
                                code: common_1.errors.UNAUTHORIZED_CODE,
                                message: "You are not allowed to update 'this' owner's public info",
                            },
                        };
                    }
                    else if ((publicInfo !== undefined || null) && !primaryBeachBarOwner) {
                        beachBarOwner.publicInfo = publicInfo;
                    }
                    yield beachBarOwner.save();
                    yield beachBarOwner.beachBar.updateRedis();
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                return {
                    owner: beachBarOwner,
                    updated: true,
                };
            }),
        });
        t.field("deleteBeachBarOwner", {
            type: types_1.DeleteResult,
            description: "Delete (remove) an owner from a #beach_bar",
            nullable: false,
            args: {
                beachBarId: schema_1.intArg({
                    required: true,
                    description: "The ID value of the #beach_bar the owner is added (assigned) to",
                }),
                userId: schema_1.intArg({
                    required: false,
                    description: "The owner with its userId to delete (remove) from the #beach_bar. Its value should not be null or 0, if a primary owner wants to update another primary owner",
                }),
            },
            resolve: (_, { beachBarId, userId }, { payload, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:owner_beach_bar", "beach_bar@delete:owner_beach_bar"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete 'this' owner",
                        },
                    };
                }
                if (!beachBarId || beachBarId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid #beach_bar" } };
                }
                if (userId && userId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid owner" } };
                }
                let beachBarOwner;
                if (!userId) {
                    const owner = yield Owner_1.Owner.findOne({ userId: payload.sub });
                    if (!owner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.YOU_ARE_NOT_AN_OWNER } };
                    }
                    beachBarOwner = yield BeachBarOwner_1.BeachBarOwner.findOne({
                        where: { owner, beachBarId },
                        relations: ["beachBar", "owner", "owner.user"],
                    });
                    if (!beachBarOwner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
                    }
                }
                else if (userId) {
                    const primaryOwner = yield Owner_1.Owner.findOne({ userId: payload.sub });
                    if (!primaryOwner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.YOU_ARE_NOT_AN_OWNER } };
                    }
                    const primaryBeachBarOwner = yield BeachBarOwner_1.BeachBarOwner.findOne({
                        owner: primaryOwner,
                        beachBarId,
                    });
                    if (!primaryBeachBarOwner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.YOU_ARE_NOT_BEACH_BAR_OWNER } };
                    }
                    if (!primaryBeachBarOwner.isPrimary) {
                        return { error: { code: common_1.errors.UNAUTHORIZED_CODE, message: "You are not allowed to delete 'this' owner" } };
                    }
                    const owner = yield Owner_1.Owner.findOne({ userId });
                    if (!owner) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.USER_OWNER_DOES_NOT_EXIST } };
                    }
                    beachBarOwner = yield BeachBarOwner_1.BeachBarOwner.findOne({
                        where: { owner, beachBarId },
                        relations: ["beachBar", "owner", "owner.user"],
                    });
                    if (!beachBarOwner) {
                        return { error: { code: common_1.errors.CONFLICT, message: "Specified user is not an owner at this #beach_bar" } };
                    }
                }
                if (!beachBarOwner) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                try {
                    const ownerScopes = yield redis.smembers(beachBarOwner.owner.user.getRedisKey(true));
                    const diff = arrDiff_1.default(scopes_1.user.SIMPLE_USER, ownerScopes);
                    if (diff.length > 0) {
                        yield redis.srem(beachBarOwner.owner.user.getRedisKey(true), ...diff);
                    }
                    yield beachBarOwner.softRemove();
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
//# sourceMappingURL=mutation.js.map