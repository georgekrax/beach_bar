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
exports.QuarterTime = exports.MonthTime = exports.HourTime = void 0;
const typeorm_1 = require("typeorm");
const BeachBar_1 = require("./BeachBar");
const BeachBarReview_1 = require("./BeachBarReview");
const CartProduct_1 = require("./CartProduct");
const ProductReservationLimit_1 = require("./ProductReservationLimit");
const ReservedProduct_1 = require("./ReservedProduct");
let HourTime = class HourTime extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], HourTime.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "time without time zone", scale: 0, name: "value" }),
    __metadata("design:type", String)
], HourTime.prototype, "value", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 9, name: "utc_value" }),
    __metadata("design:type", String)
], HourTime.prototype, "utcValue", void 0);
__decorate([
    typeorm_1.OneToMany(() => ProductReservationLimit_1.ProductReservationLimit, productReservationLimit => productReservationLimit.startTime, { nullable: true }),
    __metadata("design:type", Array)
], HourTime.prototype, "reservationLimitStartTimes", void 0);
__decorate([
    typeorm_1.OneToMany(() => ProductReservationLimit_1.ProductReservationLimit, productReservationLimit => productReservationLimit.endTime, { nullable: true }),
    __metadata("design:type", Array)
], HourTime.prototype, "reservationLimitEndTimes", void 0);
__decorate([
    typeorm_1.OneToMany(() => CartProduct_1.CartProduct, cartProduct => cartProduct.time, { nullable: true }),
    __metadata("design:type", Array)
], HourTime.prototype, "cartProductTimes", void 0);
__decorate([
    typeorm_1.OneToMany(() => ReservedProduct_1.ReservedProduct, reservedProduct => reservedProduct.time, { nullable: true }),
    __metadata("design:type", Array)
], HourTime.prototype, "reservedProductTimes", void 0);
HourTime = __decorate([
    typeorm_1.Entity({ name: "hour_time", schema: "public" }),
    typeorm_1.Check(`length("value"::text) = 8`),
    typeorm_1.Check(`length("utcValue") = 9`)
], HourTime);
exports.HourTime = HourTime;
let MonthTime = class MonthTime extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MonthTime.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 9, name: "value", unique: true }),
    __metadata("design:type", String)
], MonthTime.prototype, "value", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "days" }),
    __metadata("design:type", Number)
], MonthTime.prototype, "days", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarReview_1.BeachBarReview, beachBarReview => beachBarReview.monthTime, { nullable: true }),
    __metadata("design:type", Array)
], MonthTime.prototype, "reviews", void 0);
MonthTime = __decorate([
    typeorm_1.Entity({ name: "month_time", schema: "public" })
], MonthTime);
exports.MonthTime = MonthTime;
let QuarterTime = class QuarterTime extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], QuarterTime.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "time without time zone", scale: 0, name: "value" }),
    __metadata("design:type", String)
], QuarterTime.prototype, "value", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 9, name: "utc_value" }),
    __metadata("design:type", String)
], QuarterTime.prototype, "utcValue", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBar_1.BeachBar, beachBar => beachBar.openingTime, { nullable: true }),
    __metadata("design:type", Array)
], QuarterTime.prototype, "beachBarsOpeningTime", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBar_1.BeachBar, beachBar => beachBar.closingTime, { nullable: true }),
    __metadata("design:type", Array)
], QuarterTime.prototype, "beachBarsClosingTime", void 0);
QuarterTime = __decorate([
    typeorm_1.Entity({ name: "quarter_time", schema: "public" }),
    typeorm_1.Check(`length("value"::text) = 8`),
    typeorm_1.Check(`length("utcValue") = 9`)
], QuarterTime);
exports.QuarterTime = QuarterTime;
