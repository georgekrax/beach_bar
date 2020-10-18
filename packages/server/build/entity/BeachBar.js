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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BeachBar_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarRepository = exports.BeachBar = void 0;
const common_1 = require("@beach_bar/common");
const common_2 = require("@georgekrax-hashtag/common");
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const relations_1 = __importDefault(require("constants/relations"));
const _index_1 = require("constants/_index");
const dayjs_1 = __importStar(require("dayjs"));
const typeorm_1 = require("typeorm");
const checkAvailability_1 = require("utils/beach_bar/checkAvailability");
const getReservationLimits_1 = require("utils/beach_bar/getReservationLimits");
const getReservedProducts_1 = require("utils/beach_bar/getReservedProducts");
const groupBy_1 = require("utils/groupBy");
const softRemove_1 = require("utils/softRemove");
const index_1 = require("../index");
const BeachBarCategory_1 = require("./BeachBarCategory");
const BeachBarEntryFee_1 = require("./BeachBarEntryFee");
const BeachBarFeature_1 = require("./BeachBarFeature");
const BeachBarImgUrl_1 = require("./BeachBarImgUrl");
const BeachBarLocation_1 = require("./BeachBarLocation");
const BeachBarOwner_1 = require("./BeachBarOwner");
const BeachBarRestaurant_1 = require("./BeachBarRestaurant");
const BeachBarReview_1 = require("./BeachBarReview");
const BeachBarType_1 = require("./BeachBarType");
const CouponCode_1 = require("./CouponCode");
const Currency_1 = require("./Currency");
const PricingFee_1 = require("./PricingFee");
const PricingFeeCurrency_1 = require("./PricingFeeCurrency");
const Product_1 = require("./Product");
const ProductReservationLimit_1 = require("./ProductReservationLimit");
const ReservedProduct_1 = require("./ReservedProduct");
const SearchInputValue_1 = require("./SearchInputValue");
const StripeMinimumCurrency_1 = require("./StripeMinimumCurrency");
const Time_1 = require("./Time");
const UserFavoriteBar_1 = require("./UserFavoriteBar");
let BeachBar = BeachBar_1 = class BeachBar extends typeorm_1.BaseEntity {
    updateSearchInputValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const inputValue = yield SearchInputValue_1.SearchInputValue.findOne({ beachBarId: this.id });
            if (this.isActive) {
                const res = yield typeorm_1.getRepository(SearchInputValue_1.SearchInputValue).restore({ beachBarId: this.id });
                if (res.affected === 0) {
                    yield SearchInputValue_1.SearchInputValue.create({
                        beachBarId: this.id,
                        publicId: common_2.generateId({ length: 5, numbersOnly: true }),
                    }).save();
                }
            }
            else {
                if (inputValue) {
                    yield inputValue.softRemove();
                }
            }
        });
    }
    getRedisKey() {
        return redisKeys_1.default.BEACH_BAR_CACHE_KEY;
    }
    getReservationLimits(date, timeId) {
        return getReservationLimits_1.getReservationLimits(this, date, timeId);
    }
    getReservedProducts(redis, date, timeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservedProducts = yield getReservedProducts_1.getReservedProducts(redis, this, date, timeId);
            return reservedProducts;
        });
    }
    getRedisIdx(redis) {
        return __awaiter(this, void 0, void 0, function* () {
            const beachBars = yield redis.lrange(this.getRedisKey(), 0, -1);
            const idx = beachBars.findIndex((x) => JSON.parse(x).id === this.id);
            return idx;
        });
    }
    update(name, description, thumbnailUrl, contactPhoneNumber, hidePhoneNumber, zeroCartTotal, isAvailable, categoryId, openingTimeId, closingTimeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (name && name !== this.name) {
                    this.name = name;
                }
                if (description && description !== this.description) {
                    this.description = description;
                }
                if (thumbnailUrl && thumbnailUrl !== this.thumbnailUrl) {
                    this.thumbnailUrl = thumbnailUrl.toString();
                }
                if (contactPhoneNumber && contactPhoneNumber !== this.contactPhoneNumber) {
                    this.contactPhoneNumber = contactPhoneNumber;
                }
                if (hidePhoneNumber !== null && hidePhoneNumber !== undefined && hidePhoneNumber !== this.hidePhoneNumber) {
                    this.hidePhoneNumber = hidePhoneNumber;
                }
                if (zeroCartTotal !== null && zeroCartTotal !== undefined && zeroCartTotal !== this.zeroCartTotal) {
                    this.zeroCartTotal = zeroCartTotal;
                }
                if (isAvailable !== null && isAvailable !== undefined && isAvailable !== this.isAvailable) {
                    this.isAvailable = isAvailable;
                }
                if (categoryId && categoryId !== this.categoryId) {
                    const category = yield BeachBarCategory_1.BeachBarCategory.findOne(categoryId);
                    if (category) {
                        this.category = category;
                    }
                }
                if (openingTimeId && openingTimeId !== this.openingTimeId) {
                    const quarterTime = yield Time_1.QuarterTime.findOne(openingTimeId);
                    if (quarterTime) {
                        this.openingTime = quarterTime;
                    }
                }
                if (closingTimeId && closingTimeId !== this.closingTimeId) {
                    const quarterTime = yield Time_1.QuarterTime.findOne(closingTimeId);
                    if (quarterTime) {
                        this.closingTime = quarterTime;
                    }
                }
                yield this.save();
                yield this.updateRedis();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    updateRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const beachBar = yield BeachBar_1.findOne({
                    where: { id: this.id },
                    relations: relations_1.default.BEACH_BAR_EXTENSIVE,
                });
                if (!beachBar) {
                    throw new Error();
                }
                beachBar.features = beachBar.features.filter(feature => !feature.deletedAt);
                beachBar.products = beachBar.products.filter(product => !product.deletedAt);
                beachBar.products.forEach(product => {
                    var _a;
                    if (product.reservationLimits && ((_a = product.reservationLimits) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        product.reservationLimits = product.reservationLimits.filter(limit => !limit.deletedAt);
                    }
                });
                const idx = yield beachBar.getRedisIdx(index_1.redis);
                yield index_1.redis.lset(beachBar.getRedisKey(), idx, JSON.stringify(beachBar));
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getEntryFee(date, getAvg = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (getAvg) {
                const entryFees = yield BeachBarEntryFee_1.BeachBarEntryFee.find({ beachBar: this });
                if (entryFees) {
                    const entryFeeValues = entryFees.map(entryFee => entryFee.fee);
                    const avg = entryFeeValues.reduce((a, b) => a + b) / entryFeeValues.length;
                    return avg;
                }
                else {
                    return undefined;
                }
            }
            const entryFees = yield BeachBarEntryFee_1.BeachBarEntryFee.findOne({ beachBar: this, date: date ? date : dayjs_1.default() });
            if (entryFees) {
                return entryFees;
            }
            return undefined;
        });
    }
    getPricingFee() {
        return __awaiter(this, void 0, void 0, function* () {
            const productIds = this.products.map(product => product.id);
            const reservationLimits = yield ProductReservationLimit_1.ProductReservationLimit.find({
                where: { productId: typeorm_1.In(productIds) },
            });
            const dateLimits = Array.from(groupBy_1.groupBy(reservationLimits, reservationLimits => reservationLimits.date)).map(i => i[1]);
            const totalLimits = dateLimits.reduce((sum, i) => sum + i.map(limit => limit.limitNumber).reduce((sum, i) => sum + i, 0), 0);
            const avgCapacity = totalLimits / dateLimits.length;
            const [, count] = yield ReservedProduct_1.ReservedProduct.findAndCount({
                where: { productId: typeorm_1.In(productIds), isRefunded: false },
            });
            const avgPayments = parseFloat((count / productIds.length).toFixed(2));
            const capacityPercentage = parseFloat(((avgPayments / avgCapacity) * 100).toFixed(2));
            if (capacityPercentage) {
                const pricingFee = yield PricingFee_1.PricingFee.findOne({ maxCapacityPercentage: typeorm_1.MoreThanOrEqual(capacityPercentage) });
                return pricingFee;
            }
            else {
                const pricingFee = yield PricingFee_1.PricingFee.findOne();
                return pricingFee;
            }
        });
    }
    setPricingFee() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pricingFee = yield this.getPricingFee();
                if (pricingFee) {
                    this.fee = pricingFee;
                    yield this.save();
                }
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getFullPricingFee() {
        return __awaiter(this, void 0, void 0, function* () {
            const pricingFee = yield this.getPricingFee();
            const currencyFee = yield PricingFeeCurrency_1.PricingFeeCurrency.findOne({ currencyId: this.defaultCurrencyId });
            if (!pricingFee || !currencyFee) {
                return undefined;
            }
            return {
                pricingFee,
                currencyFee,
            };
        });
    }
    getBeachBarPaymentDetails(total, stripeFee) {
        return __awaiter(this, void 0, void 0, function* () {
            const beachBarPricingFee = yield this.getFullPricingFee();
            if (!beachBarPricingFee) {
                return undefined;
            }
            const { pricingFee, currencyFee } = beachBarPricingFee;
            const percentageFee = parseFloat(((total * parseFloat(pricingFee.percentageValue.toString())) / 100).toFixed(2));
            const beachBarAppFee = parseFloat((percentageFee + parseFloat(currencyFee.numericValue.toString())).toFixed(2));
            const transferAmount = parseFloat((total - beachBarAppFee - stripeFee).toFixed(2));
            return {
                total,
                transferAmount,
                beachBarAppFee,
                stripeFee,
            };
        });
    }
    getMinimumCurrency() {
        return __awaiter(this, void 0, void 0, function* () {
            const minimumCurrency = yield StripeMinimumCurrency_1.StripeMinimumCurrency.findOne({ currencyId: this.defaultCurrencyId });
            if (!minimumCurrency) {
                return undefined;
            }
            else {
                return minimumCurrency;
            }
        });
    }
    checkMinimumCurrency(total) {
        return __awaiter(this, void 0, void 0, function* () {
            const minimumCurrency = yield this.getMinimumCurrency();
            if (!minimumCurrency) {
                return undefined;
            }
            if (total <= minimumCurrency.chargeAmount) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    setIsActive(isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isActive !== null && isActive !== undefined && isActive !== this.isActive) {
                    this.isActive = isActive;
                }
                yield this.save();
                yield this.updateRedis();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    checkAvailability(redis, date, timeId, totalPeople) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield checkAvailability_1.checkAvailability(redis, this, date, timeId, totalPeople);
            return res;
        });
    }
    customSoftRemove(redis) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputValues = yield SearchInputValue_1.SearchInputValue.findOne({ beachBarId: this.id });
            if (inputValues) {
                yield SearchInputValue_1.SearchInputValue.softRemove(inputValues);
            }
            try {
                const idx = yield this.getRedisIdx(redis);
                yield redis.lset(this.getRedisKey(), idx, "");
                yield redis.lrem(this.getRedisKey(), 0, "");
            }
            catch (err) {
                throw new Error(err.message);
            }
            const findOptions = { beachBarId: this.id };
            yield softRemove_1.softRemove(BeachBar_1, { id: this.id }, [
                BeachBarLocation_1.BeachBarLocation,
                BeachBarImgUrl_1.BeachBarImgUrl,
                BeachBarOwner_1.BeachBarOwner,
                BeachBarFeature_1.BeachBarFeature,
                BeachBarReview_1.BeachBarReview,
                Product_1.Product,
                UserFavoriteBar_1.UserFavoriteBar,
                BeachBarEntryFee_1.BeachBarEntryFee,
                BeachBarRestaurant_1.BeachBarRestaurant,
                SearchInputValue_1.SearchInputValue,
                BeachBarType_1.BeachBarType,
            ], findOptions);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BeachBar.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "name", unique: true }),
    __metadata("design:type", String)
], BeachBar.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "description", nullable: true }),
    __metadata("design:type", String)
], BeachBar.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "default_currency_id" }),
    __metadata("design:type", Number)
], BeachBar.prototype, "defaultCurrencyId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "fee_id" }),
    __metadata("design:type", Number)
], BeachBar.prototype, "feeId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "category_id" }),
    __metadata("design:type", Number)
], BeachBar.prototype, "categoryId", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 2, scale: 1, name: "avg_rating" }),
    __metadata("design:type", Number)
], BeachBar.prototype, "avgRating", void 0);
__decorate([
    typeorm_1.Column({ type: "text", name: "thumbnail_url", nullable: true }),
    __metadata("design:type", String)
], BeachBar.prototype, "thumbnailUrl", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 20, name: "contact_phone_number" }),
    __metadata("design:type", String)
], BeachBar.prototype, "contactPhoneNumber", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "hide_phone_number", default: () => false }),
    __metadata("design:type", Boolean)
], BeachBar.prototype, "hidePhoneNumber", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_active", default: () => false }),
    __metadata("design:type", Boolean)
], BeachBar.prototype, "isActive", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_available", default: () => false }),
    __metadata("design:type", Boolean)
], BeachBar.prototype, "isAvailable", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "is_manually_controlled", default: () => false }),
    __metadata("design:type", Boolean)
], BeachBar.prototype, "isManuallyControlled", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", name: "zero_cart_total" }),
    __metadata("design:type", Boolean)
], BeachBar.prototype, "zeroCartTotal", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "opening_time_id" }),
    __metadata("design:type", Number)
], BeachBar.prototype, "openingTimeId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "closing_time_id" }),
    __metadata("design:type", Number)
], BeachBar.prototype, "closingTimeId", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "stripe_connect_id", unique: true }),
    __metadata("design:type", String)
], BeachBar.prototype, "stripeConnectId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => PricingFee_1.PricingFee, pricingFee => pricingFee.beachBars),
    typeorm_1.JoinColumn({ name: "fee_id" }),
    __metadata("design:type", PricingFee_1.PricingFee)
], BeachBar.prototype, "fee", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BeachBarCategory_1.BeachBarCategory, beachBarCategory => beachBarCategory.beachBars, { nullable: false }),
    typeorm_1.JoinColumn({ name: "category_id" }),
    __metadata("design:type", BeachBarCategory_1.BeachBarCategory)
], BeachBar.prototype, "category", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Currency_1.Currency, currency => currency.beachBars),
    typeorm_1.JoinColumn({ name: "default_currency_id" }),
    __metadata("design:type", Currency_1.Currency)
], BeachBar.prototype, "defaultCurrency", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Time_1.QuarterTime, quarterTime => quarterTime.beachBarsOpeningTime, { nullable: false }),
    typeorm_1.JoinColumn({ name: "opening_time_id" }),
    __metadata("design:type", Time_1.QuarterTime)
], BeachBar.prototype, "openingTime", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Time_1.QuarterTime, quarterTime => quarterTime.beachBarsClosingTime, { nullable: false }),
    typeorm_1.JoinColumn({ name: "closing_time_id" }),
    __metadata("design:type", Time_1.QuarterTime)
], BeachBar.prototype, "closingTime", void 0);
__decorate([
    typeorm_1.OneToMany(() => SearchInputValue_1.SearchInputValue, searchInputValue => searchInputValue.city, { nullable: true }),
    __metadata("design:type", Array)
], BeachBar.prototype, "searchInputValues", void 0);
__decorate([
    typeorm_1.OneToOne(() => BeachBarLocation_1.BeachBarLocation, location => location.beachBar),
    __metadata("design:type", BeachBarLocation_1.BeachBarLocation)
], BeachBar.prototype, "location", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarImgUrl_1.BeachBarImgUrl, beachBarImgUrls => beachBarImgUrls.beachBar, { nullable: true }),
    __metadata("design:type", Array)
], BeachBar.prototype, "imgUrls", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarOwner_1.BeachBarOwner, beachBarOwner => beachBarOwner.beachBar),
    __metadata("design:type", Array)
], BeachBar.prototype, "owners", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarFeature_1.BeachBarFeature, beachBarFeature => beachBarFeature.beachBar),
    __metadata("design:type", Array)
], BeachBar.prototype, "features", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarType_1.BeachBarType, beachBarType => beachBarType.beachBar),
    __metadata("design:type", Array)
], BeachBar.prototype, "styles", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarReview_1.BeachBarReview, beachBarReview => beachBarReview.beachBar),
    __metadata("design:type", Array)
], BeachBar.prototype, "reviews", void 0);
__decorate([
    typeorm_1.OneToMany(() => Product_1.Product, product => product.beachBar),
    __metadata("design:type", Array)
], BeachBar.prototype, "products", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarEntryFee_1.BeachBarEntryFee, beachBarEntryFee => beachBarEntryFee.beachBar),
    __metadata("design:type", Array)
], BeachBar.prototype, "entryFees", void 0);
__decorate([
    typeorm_1.OneToMany(() => BeachBarRestaurant_1.BeachBarRestaurant, beachBarRestaurant => beachBarRestaurant.beachBar),
    __metadata("design:type", Array)
], BeachBar.prototype, "restaurants", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserFavoriteBar_1.UserFavoriteBar, userFavoriteBar => userFavoriteBar.beachBar, { nullable: true }),
    __metadata("design:type", Array)
], BeachBar.prototype, "usersFavorite", void 0);
__decorate([
    typeorm_1.OneToMany(() => CouponCode_1.CouponCode, couponCode => couponCode.beachBar, { nullable: true }),
    __metadata("design:type", Array)
], BeachBar.prototype, "couponCodes", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBar.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBar.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBar.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.AfterInsert(),
    typeorm_1.AfterUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BeachBar.prototype, "updateSearchInputValue", null);
BeachBar = BeachBar_1 = __decorate([
    typeorm_1.Entity({ name: "beach_bar", schema: "public" }),
    typeorm_1.Check(`"avgRating" >= 0 AND "avgRating" <= ${_index_1.beachBarReviewRatingMaxValue}`)
], BeachBar);
exports.BeachBar = BeachBar;
let BeachBarRepository = class BeachBarRepository extends typeorm_1.Repository {
    findInRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisList = yield index_1.redis.lrange(redisKeys_1.default.BEACH_BAR_CACHE_KEY, 0, -1);
            const redisResults = redisList.map((x) => JSON.parse(x));
            return redisResults;
        });
    }
    findOneInRedis(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.findInRedis();
            return results.find(bar => bar.id === id);
        });
    }
    getMaxProductReservationLimitNumber(beachBar, date, timeId) {
        let reservationLimits = beachBar.products
            .filter(product => product.reservationLimits && product.reservationLimits.length > 0)
            .map(product => product.reservationLimits)
            .map(limits => limits && limits.filter(limit => dayjs_1.default(limit.date).format(common_1.dayjsFormat.ISO_STRING) === date.format(common_1.dayjsFormat.ISO_STRING)))
            .filter(limit => limit !== null && limit !== undefined && limit.length > 0);
        reservationLimits = [].concat.apply([], ...reservationLimits);
        if (timeId) {
            reservationLimits = reservationLimits.filter(limit => limit.startTimeId >= timeId && limit.endTimeId <= timeId);
        }
        if (reservationLimits.length > 0) {
            const maxLimit = reservationLimits.reduce((p, v) => {
                return p.limitNumber > v.limitNumber ? p : v;
            });
            return maxLimit;
        }
        else {
            return undefined;
        }
    }
};
BeachBarRepository = __decorate([
    typeorm_1.EntityRepository(BeachBar)
], BeachBarRepository);
exports.BeachBarRepository = BeachBarRepository;
//# sourceMappingURL=BeachBar.js.map