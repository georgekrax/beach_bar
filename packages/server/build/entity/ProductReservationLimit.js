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
var ProductReservationLimit_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReservationLimit = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const Product_1 = require("./Product");
const Time_1 = require("./Time");
let ProductReservationLimit = ProductReservationLimit_1 = class ProductReservationLimit extends typeorm_1.BaseEntity {
    update(limit, startTimeId, endTimeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (startTimeId && this.startTimeId !== startTimeId && startTimeId > 0) {
                    const startTime = yield Time_1.HourTime.findOne(startTimeId);
                    if (!startTime) {
                        throw new Error("Invalid start time of the limit");
                    }
                    this.startTime = startTime;
                }
                if (endTimeId && this.endTimeId !== endTimeId && endTimeId > 0) {
                    const endTime = yield Time_1.HourTime.findOne(endTimeId);
                    if (!endTime) {
                        throw new Error("Invalid end time of the limit");
                    }
                    this.endTime = endTime;
                }
                if (limit && limit !== this.limitNumber && limit > 0) {
                    this.limitNumber = limit;
                }
                yield this.save();
                yield this.product.beachBar.updateRedis();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(ProductReservationLimit_1, { id: this.id });
            yield this.product.beachBar.updateRedis();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], ProductReservationLimit.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "limit_number" }),
    __metadata("design:type", Number)
], ProductReservationLimit.prototype, "limitNumber", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "product_id" }),
    __metadata("design:type", Number)
], ProductReservationLimit.prototype, "productId", void 0);
__decorate([
    typeorm_1.Column({ type: "date", name: "date" }),
    __metadata("design:type", dayjs_1.Dayjs)
], ProductReservationLimit.prototype, "date", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "start_time_id" }),
    __metadata("design:type", Number)
], ProductReservationLimit.prototype, "startTimeId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "end_time_id" }),
    __metadata("design:type", Number)
], ProductReservationLimit.prototype, "endTimeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Product_1.Product, product => product.reservationLimits, { nullable: false }),
    typeorm_1.JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product_1.Product)
], ProductReservationLimit.prototype, "product", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Time_1.HourTime, hourTime => hourTime.reservationLimitStartTimes, { nullable: false }),
    typeorm_1.JoinColumn({ name: "start_time_id" }),
    __metadata("design:type", Time_1.HourTime)
], ProductReservationLimit.prototype, "startTime", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Time_1.HourTime, hourTime => hourTime.reservationLimitEndTimes, { nullable: false }),
    typeorm_1.JoinColumn({ name: "end_time_id" }),
    __metadata("design:type", Time_1.HourTime)
], ProductReservationLimit.prototype, "endTime", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], ProductReservationLimit.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], ProductReservationLimit.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], ProductReservationLimit.prototype, "deletedAt", void 0);
ProductReservationLimit = ProductReservationLimit_1 = __decorate([
    typeorm_1.Entity({ name: "product_reservation_limit", schema: "public" }),
    typeorm_1.Check(`"limitNumber" > 0`),
    typeorm_1.Check(`"endTime" >= "startTime"`)
], ProductReservationLimit);
exports.ProductReservationLimit = ProductReservationLimit;
