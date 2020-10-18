"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCrudMutation = void 0;
const common_1 = require("@beach_bar/common");
const common_2 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const prefixes_1 = __importDefault(require("constants/prefixes"));
const status_1 = require("constants/status");
const _index_1 = require("constants/_index");
const Card_1 = require("entity/Card");
const Cart_1 = require("entity/Cart");
const CouponCode_1 = require("entity/CouponCode");
const OfferCampaignCode_1 = require("entity/OfferCampaignCode");
const Payment_1 = require("entity/Payment");
const PaymentStatus_1 = require("entity/PaymentStatus");
const PaymentVoucherCode_1 = require("entity/PaymentVoucherCode");
const StripeMinimumCurrency_1 = require("entity/StripeMinimumCurrency");
const typeorm_1 = require("typeorm");
const checkVoucherCode_1 = require("utils/checkVoucherCode");
const types_1 = require("../types");
const types_2 = require("./types");
exports.PaymentCrudMutation = schema_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("checkout", {
            type: types_2.AddPaymentResult,
            description: "Create (make) a payment for a customer's shopping cart",
            nullable: false,
            args: {
                cartId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID value of the shopping cart with the products to purchase",
                }),
                cardId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID value of the credit or debit card of the customer",
                }),
                voucherCode: schema_1.stringArg({
                    required: false,
                    description: "A coupon or offer campaign code to make a discount to the shopping cart's or payment's price",
                }),
            },
            resolve: (_, { cartId, cardId, voucherCode }, { stripe }) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                if (!cartId || cartId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid shopping cart" } };
                }
                if (!cardId || cardId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid credit or debit card" } };
                }
                const cart = yield Cart_1.Cart.findOne({
                    where: { id: cartId },
                    relations: [
                        "products",
                        "products.product",
                        "products.product.beachBar",
                        "products.product.beachBar.products",
                        "products.product.beachBar.defaultCurrency",
                    ],
                });
                if (!cart || !cart.products || cart.products.length === 0) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified shopping cart does not exist" } };
                }
                const uniqueBeachBars = cart.getUniqueBeachBars();
                if (!uniqueBeachBars || uniqueBeachBars.length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const cartTotal = yield cart.getTotalPrice();
                if (cartTotal === undefined || cartTotal.totalWithoutEntryFees !== parseFloat(cart.total.toString())) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const card = yield Card_1.Card.findOne({ where: { id: cardId }, relations: ["customer", "country", "country.currency"] });
                if (!card || !card.customer || !card.country) {
                    return {
                        error: { code: common_1.errors.CONFLICT, message: "Specified credit or debit card does not exist, or is not your default one" },
                    };
                }
                const customer = card.customer;
                if (!customer) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const status = yield PaymentStatus_1.PaymentStatus.findOne({ status: status_1.payment.CREATED });
                if (!status) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const refCode = common_2.generateId({ length: 16, specialCharacters: _index_1.generateIdSpecialCharacters.PAYMENT });
                const transferGroupCode = `${prefixes_1.default.PAYMENT_TARGET_GROUP}${common_2.generateId({ length: 16 })}`;
                const newPayment = Payment_1.Payment.create({
                    cart,
                    card,
                    status,
                    refCode,
                    transferGroupCode,
                });
                const { totalWithEntryFees, totalWithoutEntryFees } = cartTotal;
                let total = totalWithEntryFees;
                let paymentVoucherCode = undefined;
                if (voucherCode) {
                    const res = yield checkVoucherCode_1.checkVoucherCode(voucherCode);
                    if (res.error) {
                        return res.error;
                    }
                    const newPaymentOfferCode = PaymentVoucherCode_1.PaymentVoucherCode.create({
                        payment: newPayment,
                    });
                    if (res.couponCode) {
                        newPaymentOfferCode.couponCode = res.couponCode;
                    }
                    else if (res.offerCode) {
                        newPaymentOfferCode.offerCode = res.offerCode;
                    }
                    const discountPercentage = res.couponCode
                        ? res.couponCode.discountPercentage
                        : res.offerCode
                            ? res.offerCode.campaign.discountPercentage
                            : 0;
                    paymentVoucherCode = newPaymentOfferCode;
                    const discount = (total * discountPercentage) / 100;
                    total = parseFloat((total - discount).toFixed(2));
                }
                newPayment.voucherCode = paymentVoucherCode;
                try {
                    for (let i = 0; i < uniqueBeachBars.length; i++) {
                        const beachBar = uniqueBeachBars[i];
                        const isZeroCartTotal = cart.verifyZeroCartTotal(beachBar);
                        const minimumCurrency = yield StripeMinimumCurrency_1.StripeMinimumCurrency.findOne({ currencyId: beachBar.defaultCurrencyId });
                        if (!minimumCurrency) {
                            return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                        }
                        const boolean = total <= parseFloat(minimumCurrency.chargeAmount.toString());
                        if (!beachBar.zeroCartTotal && boolean) {
                            return {
                                error: {
                                    code: common_1.errors.ZERO_CART_TOTAL_ERROR_CODE,
                                    message: `You cannot have ${cartTotal} as the total of your shopping cart for this #beach_bar`,
                                },
                            };
                        }
                        else if (isZeroCartTotal && boolean) {
                            const charge = yield stripe.charges.create({
                                amount: minimumCurrency.chargeAmount * 100,
                                currency: beachBar.defaultCurrency.isoCode.toLowerCase(),
                                source: beachBar.stripeConnectId,
                            });
                            newPayment.stripeId = charge.id;
                            console.log(charge);
                            return {
                                payment: newPayment,
                                added: true,
                            };
                        }
                    }
                    const cartProducts = cart.products;
                    const stripePayment = yield stripe.paymentIntents.create({
                        amount: total * 100,
                        currency: card.country.currency.isoCode.toLowerCase(),
                        customer: customer.stripeCustomerId,
                        payment_method: card.stripeId,
                        off_session: true,
                        confirm: true,
                        receipt_email: customer.email,
                        description: `${cartProducts.length}x product${cartProducts.length > 1 ? "s" : ""} purchased by ${customer.email} (${customer.stripeCustomerId})`,
                        metadata: {
                            ref_code: refCode,
                            products_quantity: cartProducts.length,
                            product_ids: cartProducts
                                .map(product => JSON.stringify({ id: product.product.id, name: product.product.name }))
                                .toString()
                                .replace(/[[\]]/g, "")
                                .replace(/},{/g, "} - {")
                                .replace(/[:]/g, ": ")
                                .replace(/[,]/g, ", "),
                            voucher_code: newPayment.voucherCode
                                ? JSON.stringify({
                                    id: newPayment.voucherCode.couponCode
                                        ? newPayment.voucherCode.couponCode.id
                                        : (_a = newPayment.voucherCode.offerCode) === null || _a === void 0 ? void 0 : _a.id,
                                    discount_percentage: newPayment.voucherCode.couponCode
                                        ? newPayment.voucherCode.couponCode.discountPercentage
                                        : (_b = newPayment.voucherCode.offerCode) === null || _b === void 0 ? void 0 : _b.campaign.discountPercentage,
                                    type: newPayment.voucherCode.couponCode ? "coupon_code" : "offer_campaign_code",
                                })
                                    .toString()
                                    .replace(/[[\]]/g, "")
                                    .replace(/},{/g, "} - {")
                                    .replace(/[:]/g, ": ")
                                    .replace(/[,]/g, ", ")
                                : null,
                            entry_fees_total: totalWithEntryFees - totalWithoutEntryFees + total,
                        },
                        transfer_group: transferGroupCode,
                    });
                    if (!stripePayment) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    let beachBarPricingFee = 0;
                    let transferAmount = 0;
                    let discountPerBeachBar = 0;
                    if (newPayment.voucherCode && newPayment.voucherCode.couponCode) {
                        const voucherCouponCode = newPayment.voucherCode.couponCode;
                        if (!voucherCouponCode.beachBarId) {
                            const beachBarCouponCodeDiscount = (totalWithEntryFees * voucherCouponCode.discountPercentage) / 100;
                            discountPerBeachBar = beachBarCouponCodeDiscount / uniqueBeachBars.length;
                        }
                    }
                    console.log(`Discount per #beach_bar: ${discountPerBeachBar}`);
                    for (let i = 0; i < uniqueBeachBars.length; i++) {
                        const beachBar = uniqueBeachBars[i];
                        const cartBeachBarTotal = yield cart.getBeachBarTotalPrice(beachBar.id, discountPerBeachBar);
                        if (cartBeachBarTotal === undefined) {
                            return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                        }
                        console.log(cartBeachBarTotal);
                        const { totalWithEntryFees } = cartBeachBarTotal;
                        let discountAmount = 0;
                        const paymentVoucherCode = newPayment.voucherCode;
                        if (paymentVoucherCode && paymentVoucherCode.offerCode) {
                            discountAmount = (totalWithEntryFees * paymentVoucherCode.offerCode.campaign.discountPercentage) / 100;
                        }
                        console.log((_c = paymentVoucherCode === null || paymentVoucherCode === void 0 ? void 0 : paymentVoucherCode.couponCode) === null || _c === void 0 ? void 0 : _c.beachBarId);
                        console.log(beachBar.id);
                        if (paymentVoucherCode &&
                            paymentVoucherCode.couponCode &&
                            paymentVoucherCode.couponCode.beachBarId &&
                            paymentVoucherCode.couponCode.beachBarId === beachBar.id) {
                            const couponCodeDiscount = (totalWithEntryFees * paymentVoucherCode.couponCode.discountPercentage) / 100;
                            discountAmount += couponCodeDiscount;
                        }
                        const beachBarTotal = parseFloat((totalWithEntryFees - discountAmount).toFixed(2));
                        console.log(`Discount amount: ${discountAmount}`);
                        console.log(`#beach_bar total: ${beachBarTotal}`);
                        if (beachBarTotal > 0) {
                            const beachBarStripeFee = yield cart.getStripeFee(card.country.isEu, beachBarTotal);
                            if (beachBarStripeFee === undefined) {
                                return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                            }
                            const pricingFee = yield beachBar.getBeachBarPaymentDetails(beachBarTotal, beachBarStripeFee);
                            if (pricingFee === undefined) {
                                return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                            }
                            const { beachBarAppFee, transferAmount: beachBarTransferAmount } = pricingFee;
                            console.log(`App fee: ${pricingFee.beachBarAppFee}`);
                            console.log(`Transfer amount: ${pricingFee.transferAmount}`);
                            console.log(`Total: ${pricingFee.total}`);
                            beachBarPricingFee += beachBarAppFee;
                            transferAmount += beachBarTransferAmount;
                            console.log(`Stripe fee: ${beachBarStripeFee}`);
                            console.log(stripePayment.currency.toLowerCase());
                            if (beachBarTransferAmount * 100 > 1) {
                                const stripeTransfer = yield stripe.transfers.create({
                                    amount: Math.round(beachBarTransferAmount * 100),
                                    currency: beachBar.defaultCurrency.isoCode.toLowerCase(),
                                    transfer_group: transferGroupCode,
                                    destination: beachBar.stripeConnectId,
                                    metadata: {
                                        ref_code: refCode,
                                        stripe_fee: beachBarStripeFee,
                                        platform_fee: beachBarAppFee,
                                        products: cartProducts
                                            .filter(product => product.product.beachBarId === beachBar.id)
                                            .map(product => JSON.stringify({ name: product.product.name }))
                                            .toString()
                                            .replace("[", "")
                                            .replace("]", "")
                                            .replace("},{", "} - {"),
                                        offer_codes: newPayment.voucherCode
                                            ? JSON.stringify({
                                                id: newPayment.voucherCode.couponCode
                                                    ? newPayment.voucherCode.couponCode.id
                                                    : (_d = newPayment.voucherCode.offerCode) === null || _d === void 0 ? void 0 : _d.id,
                                                discount_percentage: newPayment.voucherCode.couponCode
                                                    ? newPayment.voucherCode.couponCode.discountPercentage
                                                    : (_e = newPayment.voucherCode.offerCode) === null || _e === void 0 ? void 0 : _e.campaign.discountPercentage,
                                                type: newPayment.voucherCode.couponCode ? "coupon_code" : "offer_campaign_code",
                                            })
                                                .toString()
                                                .replace(/[[\]]/g, "")
                                                .replace(/},{/g, "} - {")
                                                .replace(/[:]/g, ": ")
                                                .replace(/[,]/g, ", ")
                                            : null,
                                    },
                                });
                                if (!stripeTransfer) {
                                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                                }
                            }
                        }
                    }
                    newPayment.appFee = beachBarPricingFee;
                    newPayment.transferAmount = transferAmount;
                    newPayment.stripeId = stripePayment.id;
                    yield newPayment.save();
                    if (newPayment.voucherCode) {
                        const paymentVoucherCode = newPayment.voucherCode;
                        if (paymentVoucherCode.couponCode) {
                            yield typeorm_1.getManager().increment(CouponCode_1.CouponCode, { id: paymentVoucherCode.couponCode.id }, "timesUsed", 1);
                        }
                        else if (paymentVoucherCode.offerCode) {
                            yield typeorm_1.getManager().increment(OfferCampaignCode_1.OfferCampaignCode, { id: paymentVoucherCode.offerCode.id }, "timesUsed", 1);
                        }
                    }
                    return {
                        payment: newPayment,
                        added: true,
                    };
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
            }),
        });
        t.field("refundPayment", {
            type: types_1.DeleteResult,
            description: "Refund a payment",
            nullable: false,
            args: {
                paymentId: schema_1.arg({
                    type: common_2.BigIntScalar,
                    required: true,
                    description: "The ID value of the payment to update",
                }),
            },
            resolve: (_, { paymentId }, { stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (!paymentId || paymentId <= 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid payment" } };
                }
                const payment = yield Payment_1.Payment.findOne({
                    where: { id: paymentId },
                    relations: ["cart", "cart.products", "cart.products.product", "cart.products.product.beachBar"],
                });
                if (!payment) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified payment does not exist" } };
                }
                if (payment.isRefunded) {
                    return { error: { code: common_1.errors.CONFLICT, message: "Specified payment has already been refunded" } };
                }
                try {
                    const refund = yield payment.getRefundPercentage();
                    if (!refund) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    const { refundPercentage, daysDiff } = refund;
                    const cartTotal = yield payment.cart.getTotalPrice();
                    if (cartTotal === undefined) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    const { totalWithEntryFees } = cartTotal;
                    if (totalWithEntryFees === 0) {
                        return { error: { message: "You shopping cart total was 0" } };
                    }
                    const refundedAmount = totalWithEntryFees * parseInt(refundPercentage.percentageValue.toString());
                    if (daysDiff >= 86400000) {
                        const stripeRefund = yield stripe.refunds.create({
                            payment_intent: payment.stripeId,
                            amount: refundedAmount,
                            reason: "requested_by_customer",
                            reverse_transfer: true,
                            refund_application_fee: false,
                        });
                        if (!stripeRefund) {
                            return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                        }
                    }
                    yield payment.softRemove();
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
//# sourceMappingURL=mutation.js.map