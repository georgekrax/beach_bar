"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const dayjs_1 = __importStar(require("dayjs"));
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const Account_1 = require("./Account");
const BeachBarReview_1 = require("./BeachBarReview");
const Cart_1 = require("./Cart");
const City_1 = require("./City");
const Country_1 = require("./Country");
const Customer_1 = require("./Customer");
const Owner_1 = require("./Owner");
const UserFavoriteBar_1 = require("./UserFavoriteBar");
const UserHistory_1 = require("./UserHistory");
const UserSearch_1 = require("./UserSearch");
const Vote_1 = require("./Vote");
let User = User_1 = class User extends typeorm_1.BaseEntity {
    getFullName() {
        return `${this.firstName ? this.firstName : ""}${this.firstName && this.lastName ? " " : ""}${this.lastName ? this.lastName : ""}`;
    }
    getRedisKey(scope = false) {
        if (scope) {
            return `${redisKeys_1.default.USER}:${this.id}:${redisKeys_1.default.USER_SCOPE}`;
        }
        return `${redisKeys_1.default.USER}:${this.id}`;
    }
    getIsNew(data) {
        let isNew = false;
        const { email, firstName, lastName, imgUrl, personTitle, birthday, countryId, cityId, address, zipCode } = data;
        if (email !== this.email ||
            firstName !== this.firstName ||
            lastName !== this.lastName ||
            imgUrl !== this.account.imgUrl ||
            personTitle !== this.account.personTitle ||
            birthday !== this.account.birthday ||
            countryId !== this.account.countryId ||
            cityId !== this.account.cityId ||
            address !== this.account.address ||
            zipCode !== this.account.zipCode) {
            isNew = true;
        }
        return isNew;
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isNew = this.getIsNew(data);
            const { email, firstName, lastName, imgUrl, personTitle, birthday, countryId, cityId, address, zipCode, trackHistory } = data;
            try {
                if (email && email !== this.email) {
                    this.email = email;
                }
                if (firstName && firstName !== this.firstName) {
                    this.firstName = firstName;
                }
                if (lastName && lastName !== this.lastName) {
                    this.lastName = lastName;
                }
                if (imgUrl && imgUrl !== this.account.imgUrl) {
                    this.account.imgUrl = imgUrl.toString();
                }
                if (personTitle && personTitle !== this.account.personTitle) {
                    this.account.personTitle = personTitle;
                }
                if (birthday && dayjs_1.default(birthday) !== dayjs_1.default(this.account.birthday)) {
                    this.account.birthday = birthday;
                }
                if (address && address !== this.account.address) {
                    this.account.address = address;
                }
                if (zipCode && zipCode !== this.account.zipCode) {
                    this.account.zipCode = zipCode;
                }
                if (countryId && countryId !== this.account.countryId) {
                    const country = yield Country_1.Country.findOne(countryId);
                    if (country) {
                        this.account.country = country;
                    }
                }
                if (cityId && cityId !== this.account.cityId) {
                    const city = yield City_1.City.findOne({ id: cityId });
                    if (city) {
                        this.account.city = city;
                    }
                }
                if (trackHistory !== undefined && trackHistory !== this.account.trackHistory) {
                    this.account.trackHistory = trackHistory;
                }
                if (isNew) {
                    yield this.save();
                    yield this.account.save();
                }
                return { user: this, isNew };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = { userId: this.id };
            yield softRemove_1.softRemove(User_1, { id: this.id }, [Account_1.Account, BeachBarReview_1.BeachBarReview, Cart_1.Cart, UserFavoriteBar_1.UserFavoriteBar, Owner_1.Owner, Customer_1.Customer], findOptions);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "email", length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ name: "token_version", type: "integer", default: () => 0 }),
    __metadata("design:type", Number)
], User.prototype, "tokenVersion", void 0);
__decorate([
    typeorm_1.Column({ name: "hashtag_id", type: "bigint", nullable: true }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], User.prototype, "hashtagId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "google_id", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "facebook_id", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "instagram_id", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "instagramId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 35, name: "instagram_username", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "instagramUsername", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "first_name", length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "last_name", length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typeorm_1.OneToOne(() => Account_1.Account, account => account.user),
    __metadata("design:type", Account_1.Account)
], User.prototype, "account", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserSearch_1.UserSearch, userSearch => userSearch.user),
    __metadata("design:type", Array)
], User.prototype, "searches", void 0);
__decorate([
    typeorm_1.OneToMany(() => Cart_1.Cart, cart => cart.user),
    __metadata("design:type", Array)
], User.prototype, "carts", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserFavoriteBar_1.UserFavoriteBar, userFavoriteBar => userFavoriteBar.user),
    __metadata("design:type", Array)
], User.prototype, "favoriteBars", void 0);
__decorate([
    typeorm_1.OneToMany(() => Vote_1.Vote, vote => vote.user, { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "votes", void 0);
__decorate([
    typeorm_1.OneToOne(() => Owner_1.Owner, owner => owner.user),
    __metadata("design:type", Owner_1.Owner)
], User.prototype, "owner", void 0);
__decorate([
    typeorm_1.OneToOne(() => Customer_1.Customer, customer => customer.user),
    __metadata("design:type", Customer_1.Customer)
], User.prototype, "customer", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserHistory_1.UserHistory, userHistory => userHistory.user, { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "history", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], User.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], User.prototype, "deletedAt", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity({ name: "user", schema: "public" })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map