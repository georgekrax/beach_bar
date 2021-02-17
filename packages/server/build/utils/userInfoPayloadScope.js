"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfoPayloadScope = void 0;
const userInfoPayloadScope = (payload, user) => {
    var _a, _b;
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        reviews: payload.scope.some(scope => ["beach_bar@crud:user", "beach_bar@crud:user_review", "hashtag@read:user_review"].includes(scope))
            ? user.customer && user.customer.reviews
            : undefined,
        account: payload.scope.some(scope => ["beach_bar@crud:user", "beach_bar@read:user_account"].includes(scope))
            ? {
                id: user.account.id,
                user: user,
                userId: user.id,
                personTitle: payload.scope.some(scope => ["beach_bar@crud:user", "hashtag@read:user_account:person_title"].includes(scope) && user.account.personTitle)
                    ? user.account.personTitle
                    : undefined,
                imgUrl: user.account.imgUrl && user.account.imgUrl,
                birthday: payload.scope.some(scope => ["beach_bar@crud:user", "hashtag@read:user_account:birthday_and_age"].includes(scope) && user.account.birthday)
                    ? user.account.birthday
                    : undefined,
                age: payload.scope.some(scope => ["beach_bar@crud:user", "hashtag@read:user_account:birthday_and_age"].includes(scope) && user.account.age)
                    ? user.account.age
                    : undefined,
                country: payload.scope.some(scope => ["beach_bar@crud:user", "hashtag@read:user_account:country"].includes(scope) && user.account.country)
                    ? user.account.country
                    : undefined,
                countryId: payload.scope.some(scope => ["beach_bar@crud:user", "hashtag@read:user_account:country"].includes(scope) && user.account.country)
                    ? (_a = user.account.country) === null || _a === void 0 ? void 0 : _a.id : undefined,
                city: payload.scope.some(scope => ["beach_bar@crud:user", "hashtag@read:user_account:city"].includes(scope) && user.account.city)
                    ? user.account.city
                    : undefined,
                cityId: payload.scope.some(scope => ["beach_bar@crud:user", "hashtag@read:user_account:city"].includes(scope) && user.account.city)
                    ? (_b = user.account.city) === null || _b === void 0 ? void 0 : _b.id : undefined,
                address: payload.scope.some(scope => ["beach_bar@crud:user", "beach_bar@read:user_account:address"].includes(scope) && user.account.address)
                    ? user.account.address
                    : undefined,
                zipCode: payload.scope.some(scope => ["beach_bar@crud:user", "beach_bar@read:user_account:zip_code"].includes(scope) && user.account.zipCode)
                    ? user.account.zipCode
                    : undefined,
                contactDetails: payload.scope.some(scope => ["beach_bar@crud:user", "beach_bar@read:user_contact_details"].includes(scope) && user.account.contactDetails)
                    ? user.account.contactDetails
                    : undefined,
            }
            : undefined,
    };
};
exports.userInfoPayloadScope = userInfoPayloadScope;
