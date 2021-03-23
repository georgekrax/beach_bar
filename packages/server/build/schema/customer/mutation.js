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
const apollo_server_express_1 = require("apollo-server-express");
const Customer_1 = require("entity/Customer");
const User_1 = require("entity/User");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const types_1 = require("../types");
const types_2 = require("./types");
exports.CustomerCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateCustomer", {
            type: types_2.UpdateCustomerType,
            description: "Update a customer's details",
            args: {
                customerId: nexus_1.idArg({
                    description: "The ID value of the customer",
                }),
                phoneNumber: nexus_1.nullable(nexus_1.stringArg({ description: "The phone number of the customer" })),
                countryIsoCode: nexus_1.nullable(nexus_1.stringArg({ description: "The ISO code of the country of customer's telephone" })),
            },
            resolve: (_, { customerId, phoneNumber, countryIsoCode }) => __awaiter(this, void 0, void 0, function* () {
                if (!customerId || customerId <= 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid customer ID", { code: common_1.errors.INVALID_ARGUMENTS });
                if (phoneNumber && phoneNumber.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid phone number", { code: common_1.errors.INVALID_ARGUMENTS });
                if (countryIsoCode && countryIsoCode.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid country", { code: common_1.errors.INVALID_ARGUMENTS });
                const customer = yield Customer_1.Customer.findOne({ where: { id: customerId }, relations: ["country", "user", "cards"] });
                if (!customer)
                    throw new apollo_server_express_1.ApolloError("Specified customer does not exist", common_1.errors.NOT_FOUND);
                try {
                    const response = yield customer.update(phoneNumber, countryIsoCode);
                    if (!response)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG);
                    return {
                        customer: response,
                        updated: true,
                    };
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
            }),
        });
        t.field("deleteCustomer", {
            type: types_1.DeleteGraphQlType,
            description: "Delete (remove) a customer",
            args: {
                customerId: nexus_1.nullable(nexus_1.idArg({
                    description: "The ID value of the registered customer to delete",
                })),
            },
            resolve: (_, { customerId }, { payload, stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (customerId && customerId <= 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid customer", { code: common_1.errors.INVALID_ARGUMENTS });
                if (!customerId && !payload)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INVALID_ARGUMENTS);
                let user = undefined;
                if (payload && payload.sub) {
                    user = yield User_1.User.findOne(payload.sub);
                    if (!user)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.USER_NOT_FOUND_MESSAGE, common_1.errors.NOT_AUTHENTICATED_MESSAGE);
                }
                const customer = yield Customer_1.Customer.findOne({ where: [{ id: customerId }, { userId: user ? user.id : typeorm_1.IsNull() }] });
                if (!customer)
                    throw new apollo_server_express_1.ApolloError("Specified customer does not exist", common_1.errors.NOT_FOUND);
                try {
                    yield customer.customSoftRemove(stripe);
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ": " + err.message);
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
