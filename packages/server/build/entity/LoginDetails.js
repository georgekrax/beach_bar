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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDetails = exports.LoginDetailStatus = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const ClientOs_Browser_1 = require("./ClientOs&Browser");
const Country_1 = require("./Country");
const LoginPlatform_1 = require("./LoginPlatform");
var LoginDetailStatus;
(function (LoginDetailStatus) {
    LoginDetailStatus["loggedIn"] = "logged_in";
    LoginDetailStatus["invalidPassword"] = "invalid_password";
    LoginDetailStatus["failed"] = "failed";
})(LoginDetailStatus = exports.LoginDetailStatus || (exports.LoginDetailStatus = {}));
let LoginDetails = class LoginDetails extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], LoginDetails.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: "account_id", type: "integer" }),
    __metadata("design:type", Number)
], LoginDetails.prototype, "accountId", void 0);
__decorate([
    typeorm_1.Column({ name: "status", type: "enum", enum: LoginDetailStatus, enumName: "login_details_status" }),
    __metadata("design:type", String)
], LoginDetails.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ name: "platform_id", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], LoginDetails.prototype, "platformId", void 0);
__decorate([
    typeorm_1.Column({ name: "os_id", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], LoginDetails.prototype, "osId", void 0);
__decorate([
    typeorm_1.Column({ name: "browser_id", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], LoginDetails.prototype, "browserId", void 0);
__decorate([
    typeorm_1.Column({ name: "country_id", type: "integer", nullable: true }),
    __metadata("design:type", Number)
], LoginDetails.prototype, "countryId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "city", nullable: true }),
    __metadata("design:type", String)
], LoginDetails.prototype, "city", void 0);
__decorate([
    typeorm_1.Column({ type: "cidr", name: "ip_addr", nullable: true }),
    __metadata("design:type", String)
], LoginDetails.prototype, "ipAddr", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => "NOW()" }),
    __metadata("design:type", dayjs_1.Dayjs)
], LoginDetails.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Account_1.Account, account => account.loginDetails, { nullable: false }),
    typeorm_1.JoinColumn({ name: "account_id" }),
    __metadata("design:type", Account_1.Account)
], LoginDetails.prototype, "account", void 0);
__decorate([
    typeorm_1.ManyToOne(() => LoginPlatform_1.LoginPlatform, loginPlatform => loginPlatform.loginDetails, { nullable: true }),
    typeorm_1.JoinColumn({ name: "platform_id" }),
    __metadata("design:type", LoginPlatform_1.LoginPlatform)
], LoginDetails.prototype, "platform", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ClientOs_Browser_1.ClientOs, clientOs => clientOs.loginDetails, { nullable: true }),
    typeorm_1.JoinColumn({ name: "os_id" }),
    __metadata("design:type", ClientOs_Browser_1.ClientOs)
], LoginDetails.prototype, "clientOs", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ClientOs_Browser_1.ClientBrowser, clientBrowser => clientBrowser.loginDetails, { nullable: true }),
    typeorm_1.JoinColumn({ name: "browser_id" }),
    __metadata("design:type", ClientOs_Browser_1.ClientBrowser)
], LoginDetails.prototype, "clientBrowser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.loginDetails, { nullable: true }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], LoginDetails.prototype, "country", void 0);
LoginDetails = __decorate([
    typeorm_1.Entity({ name: "login_details", schema: "public" })
], LoginDetails);
exports.LoginDetails = LoginDetails;
