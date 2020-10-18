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
exports.signUpUser = void 0;
const common_1 = require("@beach_bar/common");
const scopes_1 = require("constants/scopes");
const Account_1 = require("entity/Account");
const Owner_1 = require("entity/Owner");
const User_1 = require("entity/User");
exports.signUpUser = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, redis, isPrimaryOwner, hashtagId, googleId, facebookId, instagramId, instagramUsername, firstName, lastName, countryId, cityId, birthday, } = options;
    const user = yield User_1.User.findOne({ where: { email }, relations: ["account"] });
    if (user) {
        return { error: { code: common_1.errors.CONFLICT, message: "User already exists" } };
    }
    const newUser = User_1.User.create({
        email,
        hashtagId,
        googleId,
        facebookId,
        instagramId,
        instagramUsername,
        firstName,
        lastName,
    });
    const newUserAccount = Account_1.Account.create({ countryId, cityId, birthday });
    try {
        yield newUser.save();
        newUserAccount.user = newUser;
        yield newUserAccount.save();
        if (isPrimaryOwner) {
            yield Owner_1.Owner.create({ user: newUser }).save();
        }
    }
    catch (err) {
        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: `Something went wrong: ${err.message}` } };
    }
    if (isPrimaryOwner) {
        yield redis.sadd(newUser.getRedisKey(true), scopes_1.user.PRIMARY_OWNER);
    }
    else {
        yield redis.sadd(newUser.getRedisKey(true), scopes_1.user.SIMPLE_USER);
    }
    return { user: newUser };
});
//# sourceMappingURL=signUpUser.js.map