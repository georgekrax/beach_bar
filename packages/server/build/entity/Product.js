"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var Product_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const common_1 = require("@beach_bar/common");
const dayjs_1 = __importStar(require("dayjs"));
const typeorm_1 = require("typeorm");
const checkMinimumProductPrice_1 = require("utils/beach_bar/checkMinimumProductPrice");
const checkScopes_1 = require("utils/checkScopes");
const softRemove_1 = require("utils/softRemove");
const BeachBar_1 = require("./BeachBar");
const BundleProductComponent_1 = require("./BundleProductComponent");
const CartProduct_1 = require("./CartProduct");
const OfferCampaign_1 = require("./OfferCampaign");
const ProductCategory_1 = require("./ProductCategory");
const ProductPriceHistory_1 = require("./ProductPriceHistory");
const ProductReservationLimit_1 = require("./ProductReservationLimit");
const ReservedProduct_1 = require("./ReservedProduct");
const Time_1 = require("./Time");
let Product = Product_1 = class Product extends typeorm_1.BaseEntity {
    getReservationLimit(timeId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedDate = date ? dayjs_1.default(date).format(common_1.dayjsFormat.ISO_STRING) : dayjs_1.default().format(common_1.dayjsFormat.ISO_STRING);
            const reservationLimit = yield ProductReservationLimit_1.ProductReservationLimit.find({ product: this, date: formattedDate });
            if (reservationLimit) {
                const limitNumber = reservationLimit.find(limit => timeId >= limit.startTimeId && timeId <= limit.endTimeId);
                if (limitNumber) {
                    return limitNumber.limitNumber;
                }
                else {
                    return 0;
                }
            }
            else {
                return 0;
            }
        });
    }
    getReservedProducts(timeId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservedProductsNumber = yield typeorm_1.getManager()
                .createQueryBuilder(ReservedProduct_1.ReservedProduct, "reservedProduct")
                .select("COUNT(*)", "count")
                .where("reservedProduct.date = :date", {
                date: date ? date.format(common_1.dayjsFormat.ISO_STRING) : dayjs_1.default().format(common_1.dayjsFormat.ISO_STRING),
            })
                .andWhere("reservedProduct.timeId = :timeId", { timeId })
                .getRawOne();
            if (reservedProductsNumber) {
                return parseInt(reservedProductsNumber.count);
            }
            else {
                return 0;
            }
        });
    }
    checkIfAvailable(timeId, date, elevator = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = yield this.getReservationLimit(timeId, date);
            const reservedProductsNumber = yield this.getReservedProducts(timeId, date);
            if (limit !== 0 && reservedProductsNumber !== 0 && reservedProductsNumber + elevator >= limit) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    getHoursAvailability(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const openingTime = this.beachBar.openingTime.value.split(":")[0] + ":00:00";
            const closingTime = this.beachBar.closingTime.value.startsWith("00:")
                ? "24:00:00"
                : this.beachBar.closingTime.value.split(":")[0] + ":00:00";
            const hourTimes = yield Time_1.HourTime.find({ value: typeorm_1.Between(openingTime, closingTime) });
            const results = [];
            for (let i = 0; i < hourTimes.length; i++) {
                const element = hourTimes[i];
                const res = yield this.checkIfAvailable(element.id, date);
                results.push({
                    hourTime: element,
                    isAvailable: res,
                });
            }
            return results;
        });
    }
    getQuantityAvailability(date, timeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = yield this.getReservationLimit(timeId, date);
            const reservedProductsCount = yield this.getReservedProducts(timeId, date);
            if (limit !== 0 && reservedProductsCount !== 0 && limit === reservedProductsCount) {
                return null;
            }
            else if (limit - reservedProductsCount === 0 || limit - reservedProductsCount >= parseInt(process.env.MAX_PRODUCT_QUANTITY)) {
                return 0;
            }
            else {
                return limit - reservedProductsCount;
            }
        });
    }
    createProductComponents(update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (update) {
                const bundleProducts = yield BundleProductComponent_1.BundleProductComponent.find({ product: this });
                yield typeorm_1.getRepository(BundleProductComponent_1.BundleProductComponent).softRemove(bundleProducts);
            }
            this.category.productComponents.forEach((productComponent) => __awaiter(this, void 0, void 0, function* () {
                yield BundleProductComponent_1.BundleProductComponent.create({ product: this, component: productComponent, deletedAt: undefined }).save();
            }));
        });
    }
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, categoryId, description, price, maxPeople, imgUrl, isActive, owner, payload } = options;
            try {
                if (price && checkScopes_1.checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
                    try {
                        yield checkMinimumProductPrice_1.checkMinimumProductPrice(price, this.category, this.beachBar, this.beachBar.defaultCurrencyId);
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                    this.price = price;
                    yield ProductPriceHistory_1.ProductPriceHistory.create({ product: this, owner, newPrice: price }).save();
                }
                if (categoryId && categoryId !== this.categoryId && categoryId <= 0) {
                    const category = yield ProductCategory_1.ProductCategory.findOne({ where: { id: categoryId }, relations: ["productComponents"] });
                    if (category) {
                        this.category = category;
                        yield this.createProductComponents(true);
                    }
                    else {
                        throw new Error("Please provide a valid product category");
                    }
                }
                if (isActive !== null && isActive !== undefined) {
                    this.isActive = isActive;
                }
                if (name && name !== this.name) {
                    this.name = name;
                }
                if (description && description !== this.description) {
                    this.description = description;
                }
                if (maxPeople && maxPeople !== this.maxPeople && maxPeople > 0) {
                    this.maxPeople = maxPeople;
                }
                if (imgUrl && imgUrl !== this.imgUrl) {
                    this.imgUrl = imgUrl.toString();
                }
                yield this.save();
                yield this.beachBar.updateRedis();
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    softRemove() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = { productId: this.id };
            yield softRemove_1.softRemove(Product_1, { id: this.id, name: this.name, beachBarId: this.beachBarId }, [BundleProductComponent_1.BundleProductComponent, CartProduct_1.CartProduct, ReservedProduct_1.ReservedProduct, ProductReservationLimit_1.ProductReservationLimit], findOptions);
            (_a = this.offerCampaigns) === null || _a === void 0 ? void 0 : _a.forEach((campaign) => __awaiter(this, void 0, void 0, function* () { return campaign.softRemove(); }));
            yield this.beachBar.updateRedis();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 120, name: "name" }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "category_id" }),
    __metadata("design:type", Number)
], Product.prototype, "categoryId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "beach_bar_id" }),
    __metadata("design:type", Number)
], Product.prototype, "beachBarId", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "description", nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "max_people" }),
    __metadata("design:type", Number)
], Product.prototype, "maxPeople", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "img_url", nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "imgUrl", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_active", default: () => true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_individual" }),
    __metadata("design:type", Boolean)
], Product.prototype, "isIndividual", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBar_1.BeachBar, beachBar => beachBar.products, { nullable: false, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "beach_bar_id" }),
    __metadata("design:type", BeachBar_1.BeachBar)
], Product.prototype, "beachBar", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ProductCategory_1.ProductCategory, productCategory => productCategory.products, { nullable: false }),
    typeorm_1.JoinColumn({ name: "category_id" }),
    __metadata("design:type", ProductCategory_1.ProductCategory)
], Product.prototype, "category", void 0);
__decorate([
    typeorm_1.OneToMany(() => BundleProductComponent_1.BundleProductComponent, bundleProductComponent => bundleProductComponent.product),
    __metadata("design:type", Array)
], Product.prototype, "components", void 0);
__decorate([
    typeorm_1.OneToMany(() => ProductPriceHistory_1.ProductPriceHistory, productPriceHistory => productPriceHistory.product, { nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "priceHistory", void 0);
__decorate([
    typeorm_1.OneToMany(() => CartProduct_1.CartProduct, cartProduct => cartProduct.product, { nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "carts", void 0);
__decorate([
    typeorm_1.OneToMany(() => ProductReservationLimit_1.ProductReservationLimit, productReservationLimit => productReservationLimit.product, { nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "reservationLimits", void 0);
__decorate([
    typeorm_1.OneToMany(() => ReservedProduct_1.ReservedProduct, reservedProduct => reservedProduct.product, { nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "reservedProducts", void 0);
__decorate([
    typeorm_1.ManyToMany(() => OfferCampaign_1.OfferCampaign, offerCampaign => offerCampaign.products, { nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "offerCampaigns", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Product.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Product.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], Product.prototype, "deletedAt", void 0);
Product = Product_1 = __decorate([
    typeorm_1.Entity({ name: "product", schema: "public" })
], Product);
exports.Product = Product;
