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
exports.removeUserSessions = void 0;
const Account_1 = require("../entity/Account");
const User_1 = require("../entity/User");
const typeorm_1 = require("typeorm");
const redisKeys_1 = __importDefault(require("../constants/redisKeys"));
exports.removeUserSessions = (userId, redis) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis.del(`${redisKeys_1.default.USER}:${userId.toString()}`);
    yield typeorm_1.getConnection().getRepository(User_1.User).increment({ id: userId }, "tokenVersion", 1);
    yield typeorm_1.getConnection().createQueryBuilder().update(Account_1.Account).set({ isActive: false }).where("userId = :userId", { userId }).execute();
});
//# sourceMappingURL=removeUserSessions.js.map