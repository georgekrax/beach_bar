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
var Account_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.personHonorificTitle = void 0;
const dayjs_1 = __importStar(require("dayjs"));
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const City_1 = require("./City");
const Country_1 = require("./Country");
const LoginDetails_1 = require("./LoginDetails");
const User_1 = require("./User");
const UserContactDetails_1 = require("./UserContactDetails");
var personHonorificTitle;
(function (personHonorificTitle) {
    personHonorificTitle["dr"] = "Dr";
    personHonorificTitle["lady"] = "Lady";
    personHonorificTitle["miss"] = "Miss";
    personHonorificTitle["mr"] = "Mr";
    personHonorificTitle["mrs"] = "Mrs";
    personHonorificTitle["ms"] = "Ms";
    personHonorificTitle["sr"] = "Sr";
})(personHonorificTitle = exports.personHonorificTitle || (exports.personHonorificTitle = {}));
let Account = Account_1 = class Account extends typeorm_1.BaseEntity {
    calculateUsersAge() {
        if (this.birthday) {
            const differenceMs = dayjs_1.default().subtract(+dayjs_1.default(this.birthday), "millisecond");
            const ageFormat = Math.abs(dayjs_1.default(differenceMs).year() - 1970);
            this.age = ageFormat;
        }
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = { accountId: this.id };
            yield softRemove_1.softRemove(Account_1, { id: this.id }, [UserContactDetails_1.UserContactDetails], findOptions);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Account.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: "user_id", unique: true, type: "integer" }),
    __metadata("design:type", Number)
], Account.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ name: "person_title", type: "enum", enum: personHonorificTitle, enumName: "person_honorific_title", nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "personTitle", void 0);
__decorate([
    typeorm_1.Column({ name: "img_url", type: "text", nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "imgUrl", void 0);
__decorate([
    typeorm_1.Column({ name: "birthday", type: "date", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], Account.prototype, "birthday", void 0);
__decorate([
    typeorm_1.Column({ name: "age", type: "smallint", nullable: true }),
    __metadata("design:type", Number)
], Account.prototype, "age", void 0);
__decorate([
    typeorm_1.Column({ name: "country_id", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], Account.prototype, "countryId", void 0);
__decorate([
    typeorm_1.Column({ name: "city_id", type: "integer", nullable: true }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Account.prototype, "cityId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 100, name: "address", nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "address", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 12, name: "zip_code", nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "zipCode", void 0);
__decorate([
    typeorm_1.Column({ name: "is_active", type: "boolean", default: () => true }),
    __metadata("design:type", Boolean)
], Account.prototype, "isActive", void 0);
__decorate([
    typeorm_1.Column({ name: "track_history", type: "boolean", default: () => true }),
    __metadata("design:type", Boolean)
], Account.prototype, "trackHistory", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.accounts, { nullable: true }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], Account.prototype, "country", void 0);
__decorate([
    typeorm_1.ManyToOne(() => City_1.City, city => city.accounts, { nullable: true }),
    typeorm_1.JoinColumn({ name: "city_id" }),
    __metadata("design:type", City_1.City)
], Account.prototype, "city", void 0);
__decorate([
    typeorm_1.OneToOne(() => User_1.User, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], Account.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(() => LoginDetails_1.LoginDetails, loginDetails => loginDetails.account, { nullable: true }),
    __metadata("design:type", Array)
], Account.prototype, "loginDetails", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserContactDetails_1.UserContactDetails, userContactDetails => userContactDetails.account, { nullable: true }),
    __metadata("design:type", Array)
], Account.prototype, "contactDetails", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Account.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Account.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], Account.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Account.prototype, "calculateUsersAge", null);
Account = Account_1 = __decorate([
    typeorm_1.Entity({ name: "account", schema: "public" })
], Account);
exports.Account = Account;
//# sourceMappingURL=Account.js.map