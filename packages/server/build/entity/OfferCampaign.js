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
var OfferCampaign_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferCampaign = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const OfferCampaignCode_1 = require("./OfferCampaignCode");
const Product_1 = require("./Product");
let OfferCampaign = OfferCampaign_1 = class OfferCampaign extends typeorm_1.BaseEntity {
    update(productIds, title, discountPercentage, validUntil, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (productIds && productIds.length >= 1) {
                    const products = yield Product_1.Product.find({ where: { id: typeorm_1.In(productIds) } });
                    if (products.some(product => !product.isActive)) {
                        throw new Error("All the products should be active, in order to be applied for an offer campaign");
                    }
                    this.products = products;
                }
                if (title && title !== this.title) {
                    this.title = title;
                }
                if (discountPercentage && discountPercentage !== this.discountPercentage) {
                    this.discountPercentage = discountPercentage;
                }
                if (validUntil && validUntil !== this.validUntil) {
                    this.validUntil = validUntil;
                }
                if (isActive !== null && isActive !== undefined && isActive !== this.isActive) {
                    this.isActive = isActive;
                }
                yield this.save();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    calculateTotalProductPrice() {
        if (this.products) {
            return this.products.reduce((sum, i) => {
                return parseFloat(sum.toString()) + parseFloat(i.price.toString());
            }, 0);
        }
        return undefined;
    }
    softRemove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield softRemove_1.softRemove(OfferCampaign_1, { id: this.id }, [OfferCampaignCode_1.OfferCampaignCode], { campaignId: this.id });
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], OfferCampaign.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "title" }),
    __metadata("design:type", String)
], OfferCampaign.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 3, scale: 0, name: "discount_percentage" }),
    __metadata("design:type", Number)
], OfferCampaign.prototype, "discountPercentage", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_active", default: () => false }),
    __metadata("design:type", Boolean)
], OfferCampaign.prototype, "isActive", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamptz", name: "valid_until", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], OfferCampaign.prototype, "validUntil", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Product_1.Product, product => product.offerCampaigns, { nullable: false }),
    typeorm_1.JoinTable({
        name: "offer_campaign_product",
        joinColumn: {
            name: "campaign_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "product_id",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], OfferCampaign.prototype, "products", void 0);
__decorate([
    typeorm_1.OneToMany(() => OfferCampaignCode_1.OfferCampaignCode, offerCampaignCode => offerCampaignCode.campaign, { nullable: true }),
    __metadata("design:type", Array)
], OfferCampaign.prototype, "offerCodes", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], OfferCampaign.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], OfferCampaign.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], OfferCampaign.prototype, "deletedAt", void 0);
OfferCampaign = OfferCampaign_1 = __decorate([
    typeorm_1.Entity({ name: "offer_campaign", schema: "public" })
], OfferCampaign);
exports.OfferCampaign = OfferCampaign;
//# sourceMappingURL=OfferCampaign.js.map