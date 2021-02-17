"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var UserContactDetails_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContactDetails = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const Account_1 = require("./Account");
const Country_1 = require("./Country");
let UserContactDetails = UserContactDetails_1 = class UserContactDetails extends typeorm_1.BaseEntity {
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(UserContactDetails_1, { id: this.id });
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserContactDetails.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: "account_id", type: "integer" }),
    __metadata("design:type", Number)
], UserContactDetails.prototype, "accountId", void 0);
__decorate([
    typeorm_1.Column({ name: "country_id", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], UserContactDetails.prototype, "countryId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "secondary_email", nullable: true }),
    __metadata("design:type", String)
], UserContactDetails.prototype, "secondaryEmail", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "phone_number", length: 20, unique: true, nullable: true }),
    __metadata("design:type", String)
], UserContactDetails.prototype, "phoneNumber", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Account_1.Account, account => account.contactDetails, {
        nullable: false,
        cascade: ["soft-remove", "recover"],
    }),
    typeorm_1.JoinColumn({ name: "account_id" }),
    __metadata("design:type", Account_1.Account)
], UserContactDetails.prototype, "account", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.userContactDetails, { nullable: true }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], UserContactDetails.prototype, "country", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], UserContactDetails.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], UserContactDetails.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], UserContactDetails.prototype, "deletedAt", void 0);
UserContactDetails = UserContactDetails_1 = __decorate([
    typeorm_1.Entity({ name: "user_contact_details", schema: "public" }),
    typeorm_1.Unique("contact_details_phone_number_key", ["accountId", "phoneNumber"]),
    typeorm_1.Unique("contact_details_secondary_email_key", ["accountId", "secondaryEmail"]),
    typeorm_1.Unique("contact_details_phone_number_secondary_email_key", ["accountId", "secondaryEmail", "phoneNumber"])
], UserContactDetails);
exports.UserContactDetails = UserContactDetails;
