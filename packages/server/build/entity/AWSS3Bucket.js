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
exports.AWSS3Bucket = void 0;
const typeorm_1 = require("typeorm");
let AWSS3Bucket = class AWSS3Bucket extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], AWSS3Bucket.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "name", unique: true }),
    __metadata("design:type", String)
], AWSS3Bucket.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 25, name: "region" }),
    __metadata("design:type", String)
], AWSS3Bucket.prototype, "region", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 2, name: "signature_version" }),
    __metadata("design:type", String)
], AWSS3Bucket.prototype, "signatureVersion", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "url_expiration" }),
    __metadata("design:type", Number)
], AWSS3Bucket.prototype, "urlExpiration", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "key_length" }),
    __metadata("design:type", Number)
], AWSS3Bucket.prototype, "keyLength", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 5, name: "key_and_filename_separator" }),
    __metadata("design:type", String)
], AWSS3Bucket.prototype, "keyAndFilenameSeparator", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "table_name", unique: true }),
    __metadata("design:type", String)
], AWSS3Bucket.prototype, "tableName", void 0);
AWSS3Bucket = __decorate([
    typeorm_1.Entity({ name: "aws_s3_bucket", schema: "public" })
], AWSS3Bucket);
exports.AWSS3Bucket = AWSS3Bucket;
