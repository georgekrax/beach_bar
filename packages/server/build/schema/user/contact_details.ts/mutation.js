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
exports.UserContactDetailsCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const Country_1 = require("entity/Country");
const User_1 = require("entity/User");
const UserContactDetails_1 = require("entity/UserContactDetails");
const nexus_1 = require("nexus");
const typeorm_1 = require("typeorm");
const types_1 = require("../../types");
const types_2 = require("./types");
exports.UserContactDetailsCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("addUserContactDetails", {
            type: types_2.AddUserContactDetailsResult,
            description: "Add contact details to a user",
            args: {
                countryId: nexus_1.nullable(nexus_1.intArg({ description: "The ID value of the country of the contact details" })),
                secondaryEmail: nexus_1.nullable(nexus_1.arg({
                    type: graphql_1.EmailScalar,
                    description: "A secondary email address for the user",
                })),
                phoneNumber: nexus_1.nullable(nexus_1.stringArg({ description: "A phone number to call the user" })),
            },
            resolve: (_, { countryId, secondaryEmail, phoneNumber }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: common_1.errors.SOMETHING_WENT_WRONG,
                        },
                    };
                }
                if (countryId && countryId === ("" || " ")) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid country" } };
                }
                if (phoneNumber && phoneNumber === ("" || " ")) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid phone number" } };
                }
                if (secondaryEmail && secondaryEmail === ("" || " ")) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.INVALID_EMAIL_ADDRESS } };
                }
                if (!countryId && !secondaryEmail && !phoneNumber) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: common_1.errors.EMPTY_VALUES } };
                }
                const user = yield User_1.User.findOne({
                    where: { id: payload.sub },
                    relations: ["account", "account.contactDetails"],
                });
                if (!user) {
                    return { error: { code: common_1.errors.NOT_FOUND, message: common_1.errors.USER_NOT_FOUND_MESSAGE } };
                }
                const userContactDetails = yield UserContactDetails_1.UserContactDetails.findOne({ account: user.account, phoneNumber, secondaryEmail });
                if (userContactDetails) {
                    return {
                        error: {
                            code: common_1.errors.CONFLICT,
                            message: `Contact details with the phone number of '${phoneNumber}' & secondary email address of '${secondaryEmail}' already exist`,
                        },
                    };
                }
                const country = yield Country_1.Country.findOne({ where: { id: countryId } });
                if (!country) {
                    return { error: { code: common_1.errors.NOT_FOUND, message: `Country with ID of ${countryId} does not exist` } };
                }
                const newContactDetails = UserContactDetails_1.UserContactDetails.create({
                    account: user.account,
                    country,
                    secondaryEmail,
                    phoneNumber,
                });
                try {
                    yield newContactDetails.save();
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "contact_details_phone_number_key"') {
                        return {
                            error: {
                                code: common_1.errors.CONFLICT,
                                message: `Contact details with phone number of '${phoneNumber.toString()}', without a secondary email, already exist`,
                            },
                        };
                    }
                    else if (err.message === 'duplicate key value violates unique constraint "contact_details_secondary_email_key"') {
                        return {
                            error: {
                                code: common_1.errors.CONFLICT,
                                message: `Contact details with secondary email of '${secondaryEmail}', without a phone number, already exist`,
                            },
                        };
                    }
                    else {
                        return { error: { message: `Something went wrong: ${err.message}` } };
                    }
                }
                newContactDetails.account.user = user;
                return {
                    contactDetails: newContactDetails,
                    added: true,
                };
            }),
        });
        t.field("updateUserContactDetails", {
            type: types_2.UpdateUserContactDetailsResult,
            description: "Update specific contact details of a user",
            args: {
                id: nexus_1.intArg(),
                secondaryEmail: nexus_1.nullable(nexus_1.arg({ type: graphql_1.EmailScalar })),
                phoneNumber: nexus_1.nullable(nexus_1.stringArg()),
            },
            resolve: (_, { id, secondaryEmail, phoneNumber }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: common_1.errors.SOMETHING_WENT_WRONG,
                        },
                    };
                }
                if (secondaryEmail && secondaryEmail === ("" || " ")) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid secondary email address" } };
                }
                if (phoneNumber && phoneNumber === ("" || " ")) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid phone number" } };
                }
                if (!secondaryEmail && !phoneNumber) {
                    return {
                        error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide either a new phone number or a secondary email" },
                    };
                }
                const user = yield User_1.User.findOne({
                    where: { id: payload.sub },
                    relations: ["account", "account.contactDetails"],
                });
                if (!user) {
                    return { error: { code: common_1.errors.NOT_FOUND, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const contactDetails = yield UserContactDetails_1.UserContactDetails.findOne({
                    where: { id },
                    relations: ["account", "country", "account.user", "account.contactDetails", "country.cities"],
                });
                if (!contactDetails) {
                    return { error: { code: common_1.errors.NOT_FOUND, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (phoneNumber) {
                    contactDetails.phoneNumber = phoneNumber;
                }
                if (secondaryEmail) {
                    contactDetails.secondaryEmail = secondaryEmail;
                }
                try {
                    yield contactDetails.save();
                }
                catch (err) {
                    if (err.message === 'duplicate key value violates unique constraint "contact_details_phone_number_key"') {
                        return {
                            error: {
                                code: common_1.errors.CONFLICT,
                                message: `Contact details with phone number of '${phoneNumber.toString()}', without a secondary email, already exist`,
                            },
                        };
                    }
                    else if (err.message === 'duplicate key value violates unique constraint "contact_details_secondary_email_key"') {
                        return {
                            error: {
                                code: common_1.errors.CONFLICT,
                                message: `Contact details with secondary email of '${secondaryEmail}', without a phone number, already exist`,
                            },
                        };
                    }
                    else {
                        return { error: { message: `Something went wrong: ${err.message}` } };
                    }
                }
                return {
                    contactDetails,
                    updated: true,
                };
            }),
        });
        t.field("deleteContactDetails", {
            type: types_1.DeleteResult,
            description: "Delete (remove) specific contact details from user",
            args: {
                id: nexus_1.nullable(nexus_1.intArg()),
            },
            resolve: (_, { id }, { payload }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: common_1.errors.SOMETHING_WENT_WRONG,
                        },
                    };
                }
                if (!id || id === ("" || " ")) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid contact details ID" } };
                }
                const user = yield User_1.User.findOne({
                    where: { id: payload.sub },
                    relations: ["account", "account.contactDetails"],
                });
                if (!user || !user.account || !user.account.contactDetails) {
                    return { error: { code: common_1.errors.NOT_FOUND, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const contactDetails = user.account.contactDetails.find(contactDetails => contactDetails.id === id);
                if (!contactDetails) {
                    return { error: { code: common_1.errors.NOT_FOUND, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                try {
                    yield typeorm_1.getConnection().getRepository(UserContactDetails_1.UserContactDetails).softDelete(contactDetails.id);
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
