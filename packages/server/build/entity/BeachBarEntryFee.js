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
var BeachBarEntryFee_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarEntryFee = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBar_1 = require("./BeachBar");
let BeachBarEntryFee = BeachBarEntryFee_1 = class BeachBarEntryFee extends typeorm_1.BaseEntity {
    update(fee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (fee && fee > 0) {
                    this.fee = fee;
                    yield this.save();
                    yield this.beachBar.updateRedis();
                }
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(BeachBarEntryFee_1, { id: this.id });
            yield this.beachBar.updateRedis();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], BeachBarEntryFee.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", name: "fee", precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], BeachBarEntryFee.prototype, "fee", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "beach_bar_id" }),
    __metadata("design:type", Number)
], BeachBarEntryFee.prototype, "beachBarId", void 0);
__decorate([
    typeorm_1.Column({ type: "date", name: "date" }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarEntryFee.prototype, "date", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBar_1.BeachBar, beachBar => beachBar.entryFees),
    typeorm_1.JoinColumn({ name: "beach_bar_id" }),
    __metadata("design:type", BeachBar_1.BeachBar)
], BeachBarEntryFee.prototype, "beachBar", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarEntryFee.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarEntryFee.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarEntryFee.prototype, "deletedAt", void 0);
BeachBarEntryFee = BeachBarEntryFee_1 = __decorate([
    typeorm_1.Entity({ name: "beach_bar_entry_fee", schema: "public" })
], BeachBarEntryFee);
exports.BeachBarEntryFee = BeachBarEntryFee;
