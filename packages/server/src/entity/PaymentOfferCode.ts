import { BaseEntity, Check, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { CouponCode } from "./CouponCode";
import { OfferCampaignCode } from "./OfferCampaignCode";
import { Payment } from "./Payment";

@Entity({ name: "payment_offer_code", schema: "public" })
@Check(`"discountPercentage" >= 0 AND "discountPercentage" <= 100`)
export class PaymentOfferCode extends BaseEntity {
  @PrimaryColumn({ type: "bigint", name: "payment_id" })
  paymentId: bigint;

  @Column({ type: "bigint", name: "coupon_code_id", nullable: true })
  couponCodeId?: bigint;

  @Column({ type: "bigint", name: "offer_code_id", nullable: true })
  offerCodeId?: bigint;

  @Column({ type: "decimal", precision: 4, scale: 2, name: "discount_percentage" })
  discountPercentage: number;

  @ManyToOne(() => Payment, payment => payment.offerCodes, { nullable: false })
  @JoinColumn({ name: "payment_id" })
  payment: Payment;

  @ManyToOne(() => CouponCode, couponCode => couponCode.payments, { nullable: true })
  @JoinColumn({ name: "coupon_code_id" })
  couponCode?: CouponCode;

  @ManyToOne(() => OfferCampaignCode, offerCampaignCode => offerCampaignCode.payments, { nullable: true })
  @JoinColumn({ name: "payment_id" })
  offerCode?: OfferCampaignCode;
}
