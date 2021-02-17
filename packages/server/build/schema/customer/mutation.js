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
exports.CustomerCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const Customer_1 = require("entity/Customer");
const User_1 = require("entity/User");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const types_1 = require("../types");
const types_2 = require("./types");
exports.CustomerCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("getOrAddCustomer", {
            type: types_2.AddCustomerResult,
            description: "Add a customer",
            args: {
                email: nexus_1.arg({
                    type: graphql_1.EmailScalar,
                    description: "The email address of an authenticated or non user, to register as a client",
                }),
                phoneNumber: nexus_1.nullable(nexus_1.stringArg({
                    description: "The phone number of the customer",
                })),
                countryIsoCode: nexus_1.nullable(nexus_1.stringArg({
                    description: "The ISO code of the country of customer's telephone",
                })),
            },
            resolve: (_, { email, phoneNumber, countryIsoCode }, { payload, stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (!email && !payload) {
                    return {
                        error: { code: common_1.errors.INVALID_ARGUMENTS, message: "You should either be authenticated or provide an email address" },
                    };
                }
                if (!email || email.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
                }
                if (phoneNumber || phoneNumber.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid phone number" } };
                }
                if (countryIsoCode || countryIsoCode.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid country" } };
                }
                const response = yield typeorm_1.getCustomRepository(Customer_1.CustomerRepository).getOrCreateCustomer(stripe, email, phoneNumber, countryIsoCode, payload);
                if (response) {
                    return response;
                }
                return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
            }),
        });
        t.field("updateCustomer", {
            type: types_2.UpdateCustomerResult,
            description: "Update a customer's details",
            args: {
                customerId: nexus_1.arg({
                    type: graphql_1.BigIntScalar,
                    description: "The ID value of the customer",
                }),
                phoneNumber: nexus_1.nullable(nexus_1.stringArg({ description: "The phone number of the customer" })),
                countryIsoCode: nexus_1.nullable(nexus_1.stringArg({ description: "The ISO code of the country of customer's telephone" })),
            },
            resolve: (_, { customerId, phoneNumber, countryIsoCode }) => __awaiter(this, void 0, void 0, function* () {
                if (!customerId || customerId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid customer ID" } };
                }
                if (phoneNumber && phoneNumber.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid phone number" } };
                }
                if (countryIsoCode && countryIsoCode.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid country" } };
                }
                const customer = yield Customer_1.Customer.findOne({ where: { id: customerId }, relations: ["country", "user", "cards"] });
                if (!customer) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified customer does not exist" } };
                }
                try {
                    const response = yield customer.update(phoneNumber, countryIsoCode);
                    if (!response) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    return {
                        customer: response,
                        updated: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("deleteCustomer", {
            type: types_1.DeleteResult,
            description: "Delete (remove) a customer",
            args: {
                customerId: nexus_1.nullable(nexus_1.arg({
                    type: graphql_1.BigIntScalar,
                    description: "The ID value of the registered customer to delete",
                })),
            },
            resolve: (_, { customerId }, { payload, stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (customerId && customerId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid customer" } };
                }
                if (!customerId && !payload) {
                    return {
                        error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.SOMETHING_WENT_WRONG },
                    };
                }
                let user = undefined;
                if (payload && payload.sub) {
                    user = yield User_1.User.findOne(payload.sub);
                    if (!user) {
                        return { error: { code: common_1.errors.CONFLICT, message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                }
                const customer = yield Customer_1.Customer.findOne({ where: [{ id: customerId }, { userId: user ? user.id : typeorm_1.IsNull() }] });
                if (!customer) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified customer does not exist" } };
                }
                try {
                    yield customer.customSoftRemove(stripe);
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
