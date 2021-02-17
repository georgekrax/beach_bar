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
exports.ClientBrowser = exports.ClientOs = void 0;
const typeorm_1 = require("typeorm");
const LoginDetails_1 = require("./LoginDetails");
let ClientOs = class ClientOs extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ClientOs.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 50, name: "name", unique: true }),
    __metadata("design:type", String)
], ClientOs.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => LoginDetails_1.LoginDetails, loginDetails => loginDetails.clientOs),
    __metadata("design:type", Array)
], ClientOs.prototype, "loginDetails", void 0);
ClientOs = __decorate([
    typeorm_1.Entity({ name: "client_os", schema: "public" })
], ClientOs);
exports.ClientOs = ClientOs;
let ClientBrowser = class ClientBrowser extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ClientBrowser.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 20, name: "name", unique: true }),
    __metadata("design:type", String)
], ClientBrowser.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => LoginDetails_1.LoginDetails, loginDetails => loginDetails.clientBrowser),
    __metadata("design:type", Array)
], ClientBrowser.prototype, "loginDetails", void 0);
ClientBrowser = __decorate([
    typeorm_1.Entity({ name: "client_browser", schema: "public" })
], ClientBrowser);
exports.ClientBrowser = ClientBrowser;
