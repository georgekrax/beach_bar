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
exports.LoginPlatform = void 0;
const typeorm_1 = require("typeorm");
const LoginDetails_1 = require("./LoginDetails");
let LoginPlatform = class LoginPlatform extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], LoginPlatform.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 25, name: "name", unique: true }),
    __metadata("design:type", String)
], LoginPlatform.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "url_hostname", unique: true }),
    __metadata("design:type", String)
], LoginPlatform.prototype, "urlHostname", void 0);
__decorate([
    typeorm_1.OneToMany(() => LoginDetails_1.LoginDetails, LoginDetails => LoginDetails.platform, { onDelete: "SET NULL" }),
    __metadata("design:type", Array)
], LoginPlatform.prototype, "loginDetails", void 0);
LoginPlatform = __decorate([
    typeorm_1.Entity({ name: "login_platform", schema: "public" })
], LoginPlatform);
exports.LoginPlatform = LoginPlatform;
//# sourceMappingURL=LoginPlatform.js.map