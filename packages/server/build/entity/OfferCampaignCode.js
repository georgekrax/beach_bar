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
var OfferCampaignCode_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferCampaignCode = void 0;
const common_1 = require("@the_hashtag/common");
const _index_1 = require("constants/_index");
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const OfferCampaign_1 = require("./OfferCampaign");
const PaymentVoucherCode_1 = require("./PaymentVoucherCode");
let OfferCampaignCode = OfferCampaignCode_1 = class OfferCampaignCode extends typeorm_1.BaseEntity {
    generateRefCode() {
        this.refCode = common_1.generateId({
            length: _index_1.voucherCodeLength.OFFER_CAMPAIGN_CODE,
            specialCharacters: _index_1.generateIdSpecialCharacters.VOUCHER_CODE,
        });
    }
    getProductBeachBars() {
        const productBeachBars = this.campaign.products.map(product => product.beachBar);
        return productBeachBars.filter((beachBar, index, self) => index === self.findIndex(t => t.id === beachBar.id));
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(OfferCampaignCode_1, { id: this.id });
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], OfferCampaignCode.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "campaign_id" }),
    __metadata("design:type", Number)
], OfferCampaignCode.prototype, "campaignId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: _index_1.voucherCodeLength.OFFER_CAMPAIGN_CODE, name: "ref_code" }),
    __metadata("design:type", String)
], OfferCampaignCode.prototype, "refCode", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint", name: "times_used", default: () => 0 }),
    __metadata("design:type", Number)
], OfferCampaignCode.prototype, "timesUsed", void 0);
__decorate([
    typeorm_1.ManyToOne(() => OfferCampaign_1.OfferCampaign, offerCampaign => offerCampaign.offerCodes, { nullable: false }),
    typeorm_1.JoinColumn({ name: "campaign_id" }),
    __metadata("design:type", OfferCampaign_1.OfferCampaign)
], OfferCampaignCode.prototype, "campaign", void 0);
__decorate([
    typeorm_1.OneToMany(() => PaymentVoucherCode_1.PaymentVoucherCode, paymentVoucherCode => paymentVoucherCode.offerCode, { nullable: true }),
    __metadata("design:type", Array)
], OfferCampaignCode.prototype, "payments", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], OfferCampaignCode.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], OfferCampaignCode.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OfferCampaignCode.prototype, "generateRefCode", null);
OfferCampaignCode = OfferCampaignCode_1 = __decorate([
    typeorm_1.Entity({ name: "offer_campaign_code", schema: "public" }),
    typeorm_1.Check(`"percentageUsed" >= 0 AND "percentageUsed" <= 100`)
], OfferCampaignCode);
exports.OfferCampaignCode = OfferCampaignCode;
