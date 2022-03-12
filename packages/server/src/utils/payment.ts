import { voucherCodeLength } from "@/constants/_index";
import { PaymentVoucherCode } from "@/entity/PaymentVoucherCode";
import { NexusGenArgTypes, NexusGenScalars, NexusGenTypes } from "@/graphql/generated/nexusTypes";
import { getTotal, GetTotalCartInclude } from "@/utils/cart";
import { errors, TABLES } from "@beach_bar/common";
import { CouponCode, Customer, Prisma, RefundPercentage } from "@prisma/client";
import { ApolloError } from "apollo-server-express";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { prisma } from "..";

const { REFUND_PERCENTAGE } = TABLES;

const offerCodeInclude = Prisma.validator<Prisma.OfferCampaignCodeInclude>()({ campaign: true });

type CheckVoucherCodeReturnType = {
  couponCode?: CouponCode;
  offerCode?: Prisma.OfferCampaignCodeGetPayload<{ include: typeof offerCodeInclude }>;
};

export const checkVoucherCode = async (refCode: string): Promise<CheckVoucherCodeReturnType> => {
  if (refCode.trim().length === voucherCodeLength.COUPON_CODE) {
    const couponCode = await prisma.couponCode.findUnique({ where: { refCode } });
    if (!couponCode) throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.CONFLICT);
    const { isActive, validUntil, timesLimit, timesUsed } = couponCode;
    if (!isActive || dayjs(validUntil).isBefore(dayjs())) {
      throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.INVALID_PRODUCT_OFFER_CODE);
    }
    if (timesLimit && timesUsed >= timesLimit) {
      throw new ApolloError("You have exceeded the times of use of a coupon code", errors.INVALID_PRODUCT_OFFER_CODE);
    }
    return { couponCode };
  } else if (refCode.trim().length === voucherCodeLength.OFFER_CAMPAIGN_CODE) {
    const offerCode = await prisma.offerCampaignCode.findUnique({ where: { refCode }, include: offerCodeInclude });
    // const offerCode = await OfferCampaignCode.findOne({ where: { refCode }, relations: ["campaign", "campaign.products"] });
    if (!offerCode) throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.CONFLICT);
    const { campaign } = offerCode;
    if (dayjs(campaign.validUntil).isBefore(dayjs()) || !campaign.isActive) {
      throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.INVALID_PRODUCT_OFFER_CODE);
    }
    return { offerCode };
  } else throw new ApolloError(errors.INVALID_REF_CODE_MESSAGE, errors.INVALID_PRODUCT_OFFER_CODE);
};

export const formatMetadata = (str: string) => {
  return "[" + str.toString().replace(/[[\]]/g, "").replace(/},{/g, "}, {").replace(/[:]/g, ": ").replace(/[,]/g, ", ") + "]";
};

export const formatVoucherCodeMetadata = (voucherCode?: PaymentVoucherCode): string | null => {
  if (!voucherCode) return null;
  const { couponCode, offerCode } = voucherCode;
  return formatMetadata(
    JSON.stringify({
      id: couponCode ? couponCode.id : offerCode?.id,
      discount_percentage: couponCode ? couponCode.discountPercentage : offerCode?.campaign.discountPercentage,
      type: couponCode ? "coupon_code" : "offer_campaign_code",
    })
  );
};

// getRefundPercentage()
export const GetRefundPercentageInclude = Prisma.validator<Prisma.PaymentInclude>()({
  cart: { include: { products: true } },
});
type GetRefundPercentagePayment = Prisma.PaymentGetPayload<{ include: typeof GetRefundPercentageInclude }>;
type GetRefundPercentageReturn = RefundPercentage & { daysDiff: number };

export const getRefundPercentage = <T extends GetRefundPercentagePayment>({ cart }: T): GetRefundPercentageReturn | undefined => {
  dayjs.extend(minMax);
  const products = cart.products;
  if (!products || products.length === 0) return undefined;
  const minDate = dayjs.min(products.map(product => dayjs(product.date)).filter(date => date.isAfter(dayjs())));
  let daysDiff = dayjs(minDate).toDate().getTime() - dayjs().toDate().getTime();
  if (isNaN(daysDiff)) daysDiff = 0;
  let refundPercentage: RefundPercentage | undefined = undefined;
  if (!minDate) refundPercentage = REFUND_PERCENTAGE[0];
  else {
    refundPercentage = Array.from(REFUND_PERCENTAGE)
      .sort((a, b) => Number(b.daysMilliseconds) - Number(a.daysMilliseconds))
      .find(({ daysMilliseconds }) => daysMilliseconds <= daysDiff);
  }
  if (!refundPercentage) return undefined;
  refundPercentage = REFUND_PERCENTAGE[1];

  return { ...refundPercentage, daysDiff };
};

// getRefundDetails()
export const GetRefundDetailsInclude = Prisma.validator<Prisma.PaymentInclude>()({ cart: { include: GetTotalCartInclude } });
type GetRefundDetailsCart = Prisma.PaymentGetPayload<{ include: typeof GetRefundDetailsInclude }>;
type GetRefundDetailsOptions = { beachBarId?: number };

export const getRefundDetails = <T extends GetRefundDetailsCart>(payment: T, { beachBarId }: GetRefundDetailsOptions = {}) => {
  const refund = getRefundPercentage(payment);
  if (!refund) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
  const { percentageValue, daysDiff } = refund;
  const cartTotal = getTotal(payment.cart, { beachBarId, afterToday: true });
  if (cartTotal === undefined) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
  // if (totalWithoutEntryFees === 0) throw new ApolloError("Your shopping cart total was 0.", errors.CONFLICT);
  // ! Do not divide by 100, because Stipe processes cents, and the number will be already in cents
  const refundedAmount = Math.floor(cartTotal.totalWithoutEntryFees * percentageValue);
  return { refundedAmount, daysDiff };
};

// hasBarProduct()
export const HasBarProductInclude = Prisma.validator<Prisma.PaymentInclude>()({
  cart: { include: { products: { include: { product: true } } } },
});
type HasBarProductPayment = Prisma.PaymentGetPayload<{ include: typeof HasBarProductInclude }>;
type HasBarProductOptions = { beachBarId: NexusGenScalars["ID"] };

export const hasBarProduct = ({ cart: { products } }: HasBarProductPayment, { beachBarId }: HasBarProductOptions): boolean => {
  if (products.length === 0) return false;
  return products!.some(({ product }) => product.beachBarId.toString() === beachBarId.toString() && !product.deletedAt);
};

// verifyUserReview()
export const VerifyUserReviewInclude = Prisma.validator<Prisma.PaymentInclude>()({
  cart: { include: { products: { include: { product: true } } } },
});
type VerifyUserReviewPayment = Prisma.PaymentGetPayload<{ include: typeof VerifyUserReviewInclude }>;

type VerifyUserReviewOptions = NexusGenArgTypes["Mutation"]["verifyUserPaymentForReview"] & Pick<NexusGenTypes["context"], "payload">;
type VerifyUserReviewReturn = { bool: boolean; customer?: Customer; payment?: VerifyUserReviewPayment };

export const verifyUserReview = async ({ beachBarId, refCode, payload }: VerifyUserReviewOptions): Promise<VerifyUserReviewReturn> => {
  if (refCode) {
    const payment = await prisma.payment.findUnique({
      where: { refCode },
      include: { ...VerifyUserReviewInclude, card: { include: { customer: true } } },
    });
    if (!payment || payment?.cart.products.length === 0) return { bool: false };
    return { payment, bool: hasBarProduct(payment, { beachBarId }), customer: payment.card.customer };
  } else if (payload?.sub) {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { customer: true, carts: { include: { payment: { include: VerifyUserReviewInclude } } } },
    });
    if (!user?.carts || !user?.customer) return { bool: false };
    const { bool, payment }: any = user.carts
      .map(({ payment }) => payment)
      .find(payment => {
        if (payment) return { payment, bool: hasBarProduct(payment, { beachBarId }) };
        return { bool: false };
      });
    return { bool, payment, customer: user.customer };
  } else return { bool: false };
};

// getProductsMonths()
const GetProductsMonthsInclude = Prisma.validator<Prisma.PaymentInclude>()({
  cart: { include: { products: { include: { product: true } } } },
});
type GetProductsMonthsPayment = Prisma.PaymentGetPayload<{ include: typeof GetProductsMonthsInclude }>;
type GetProductsMonthsOptions = HasBarProductOptions;

export const getProductsMonths = ({ cart: { products } }: GetProductsMonthsPayment, { beachBarId }: GetProductsMonthsOptions) => {
  if (!products) return null;
  return products
    .filter(({ product }) => product.beachBarId.toString() === beachBarId.toString())
    .map(({ date }) => dayjs(date).month() + 1);
};
