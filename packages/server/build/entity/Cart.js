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
var Cart_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = exports.Cart = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const softRemove_1 = require("utils/softRemove");
const BeachBarEntryFee_1 = require("./BeachBarEntryFee");
const CartProduct_1 = require("./CartProduct");
const Payment_1 = require("./Payment");
const StripeFee_1 = require("./StripeFee");
const User_1 = require("./User");
let Cart = Cart_1 = class Cart extends typeorm_1.BaseEntity {
    getUniqueBeachBars() {
        if (this.products) {
            const beachBars = this.products.map(product => product.product.beachBar);
            const uniqueBeachBars = beachBars.filter((beachBar, index, self) => index === self.findIndex(t => t.id === beachBar.id));
            return uniqueBeachBars;
        }
        else {
            return undefined;
        }
    }
    getBeachBarProducts(beachBarId) {
        if (this.products) {
            return this.products.filter(product => product.product.beachBarId === beachBarId);
        }
        else {
            return undefined;
        }
    }
    getTotalPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.products) {
                const filteredProducts = this.products.filter(product => !product.deletedAt);
                const total = filteredProducts.reduce((sum, i) => {
                    return sum + i.product.price * i.quantity;
                }, 0);
                const entryFeesTotal = yield this.getBeachBarsEntryFeeTotal();
                if (entryFeesTotal === undefined) {
                    return undefined;
                }
                return {
                    totalWithoutEntryFees: total,
                    totalWithEntryFees: total + entryFeesTotal,
                };
            }
            return undefined;
        });
    }
    getStripeFee(isEu, total) {
        return __awaiter(this, void 0, void 0, function* () {
            const cardProcessingFee = yield StripeFee_1.StripeFee.findOne({ isEu });
            if (!cardProcessingFee) {
                return undefined;
            }
            let totalWithEntryFees;
            if (!total) {
                const total = yield this.getTotalPrice();
                if (total === undefined) {
                    return undefined;
                }
                totalWithEntryFees = total.totalWithEntryFees;
            }
            else {
                totalWithEntryFees = total;
            }
            const stripeTotalFee = parseFloat((totalWithEntryFees * (parseFloat(cardProcessingFee.percentageValue.toString()) / 100) +
                parseFloat(cardProcessingFee.pricingFee.toString())).toFixed(2));
            return parseFloat(stripeTotalFee.toFixed(2));
        });
    }
    getBeachBarsEntryFeeTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.products) {
                const uniqueBeachBars = this.getUniqueBeachBars();
                if (!uniqueBeachBars) {
                    return undefined;
                }
                const uniqueProductDates = Array.from(new Set(this.products.map(product => product.date)));
                let entryFeeTotal = 0;
                for (let i = 0; i < uniqueBeachBars.length; i++) {
                    for (let i = 0; i < uniqueProductDates.length; i++) {
                        const productDate = uniqueProductDates[i];
                        const beachBar = uniqueBeachBars[i];
                        const entryFee = yield BeachBarEntryFee_1.BeachBarEntryFee.findOne({ where: { beachBar, date: productDate } });
                        if (entryFee) {
                            entryFeeTotal = entryFeeTotal + parseFloat(entryFee.fee.toString());
                        }
                    }
                }
                return entryFeeTotal;
            }
            return undefined;
        });
    }
    getBeachBarEntryFee(beachBarId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.products) {
                const isBeachBarIncluded = this.products.some(product => product.product.beachBarId === beachBarId);
                if (!isBeachBarIncluded) {
                    return undefined;
                }
                const uniqueProductDates = Array.from(new Set(this.products.filter(product => product.product.beachBarId === beachBarId).map(product => product.date)));
                let entryFeeTotal = 0;
                for (let i = 0; i < uniqueProductDates.length; i++) {
                    const productDate = uniqueProductDates[i];
                    const entryFee = yield BeachBarEntryFee_1.BeachBarEntryFee.findOne({ where: { beachBarId, date: productDate } });
                    if (entryFee) {
                        entryFeeTotal = entryFeeTotal + parseFloat(entryFee.fee.toString());
                    }
                }
                return entryFeeTotal;
            }
            return undefined;
        });
    }
    getBeachBarTotalPrice(beachBarId, couponCodeDiscount = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.products) {
                const products = this.products.filter(product => product.product.beachBarId === beachBarId && !product.product.deletedAt);
                if (products) {
                    const total = products.reduce((sum, i) => {
                        return sum + i.product.price * i.quantity;
                    }, 0);
                    const totalEntryFees = yield this.getBeachBarEntryFee(beachBarId);
                    if (totalEntryFees === undefined) {
                        return undefined;
                    }
                    return {
                        entryFeeTotal: parseFloat(totalEntryFees.toFixed(2)),
                        totalWithoutEntryFees: parseFloat((total - couponCodeDiscount).toFixed(2)),
                        totalWithEntryFees: parseFloat((total + totalEntryFees - couponCodeDiscount).toFixed(2)),
                    };
                }
                return undefined;
            }
            return undefined;
        });
    }
    getProductTotalPrice(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.products) {
                const product = this.products.filter(product => product.product.id === productId);
                if (product) {
                    const total = product.reduce((sum, i) => {
                        return sum + i.product.price * i.quantity;
                    }, 0);
                    return total;
                }
                return undefined;
            }
            return undefined;
        });
    }
    verifyZeroCartTotal(beachBar) {
        if (!beachBar.zeroCartTotal) {
            return false;
        }
        else {
            return true;
        }
    }
    customSoftRemove(deleteTotal = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = { cartId: this.id };
            if (deleteTotal) {
                yield softRemove_1.softRemove(Cart_1, { id: this.id }, [CartProduct_1.CartProduct], findOptions);
            }
            else {
                yield softRemove_1.softRemove(Cart_1, { id: this.id });
            }
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Cart.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "user_id", nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 12, scale: 2, default: () => 0 }),
    __metadata("design:type", Number)
], Cart.prototype, "total", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.carts, { nullable: true, cascade: ["soft-remove", "recover"] }),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], Cart.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(() => CartProduct_1.CartProduct, cartProduct => cartProduct.cart, { nullable: true }),
    __metadata("design:type", Array)
], Cart.prototype, "products", void 0);
__decorate([
    typeorm_1.OneToOne(() => Payment_1.Payment, payment => payment.cart, { nullable: true }),
    __metadata("design:type", Payment_1.Payment)
], Cart.prototype, "payment", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], Cart.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], Cart.prototype, "deletedAt", void 0);
Cart = Cart_1 = __decorate([
    typeorm_1.Entity({ name: "cart", schema: "public" })
], Cart);
exports.Cart = Cart;
let CartRepository = class CartRepository extends typeorm_1.Repository {
    createCart(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = Cart.create({
                user,
                total: 0,
            });
            try {
                yield cart.save();
            }
            catch (_a) {
                return undefined;
            }
            return cart;
        });
    }
    getOrCreateCart(payload, cartId, getOnly) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload && payload.sub) {
                const cart = yield typeorm_1.getManager()
                    .createQueryBuilder(Cart, "cart")
                    .where("cart.userId = :userId", { userId: payload.sub })
                    .leftJoinAndSelect("cart.user", "user")
                    .leftJoinAndSelect("cart.products", "products", "products.deletedAt IS NULL")
                    .leftJoinAndSelect("products.product", "cartProduct", "cartProduct.deletedAt IS NULL")
                    .orderBy("cart.timestamp", "DESC")
                    .getOne();
                if (!cart && !getOnly) {
                    const user = yield User_1.User.findOne(payload.sub);
                    if (!user) {
                        return undefined;
                    }
                    const cart = yield this.createCart(user);
                    if (!cart) {
                        return undefined;
                    }
                    return cart;
                }
                return cart;
            }
            if (cartId) {
                const cart = yield typeorm_1.getManager()
                    .createQueryBuilder(Cart, "cart")
                    .where("cart.id = :cartId", { cartId })
                    .leftJoinAndSelect("cart.user", "user")
                    .leftJoinAndSelect("cart.products", "products", "products.deletedAt IS NULL")
                    .leftJoinAndSelect("products.product", "cartProduct", "cartProduct.deletedAt IS NULL")
                    .orderBy("cart.timestamp", "DESC")
                    .getOne();
                if (!cart && !getOnly) {
                    const cart = yield this.createCart();
                    if (!cart) {
                        return undefined;
                    }
                    return cart;
                }
                return cart;
            }
            else if (!cartId && !getOnly) {
                const cart = yield this.createCart();
                if (!cart) {
                    return undefined;
                }
                return cart;
            }
            else {
                return undefined;
            }
        });
    }
};
CartRepository = __decorate([
    typeorm_1.EntityRepository(Cart)
], CartRepository);
exports.CartRepository = CartRepository;
//# sourceMappingURL=Cart.js.map