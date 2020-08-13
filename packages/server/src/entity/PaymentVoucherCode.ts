import { Dayjs } from "dayjs";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { CouponCode } from "./CouponCode";
import { OfferCampaignCode } from "./OfferCampaignCode";
import { Payment } from "./Payment";

@Entity({ name: "payment_voucher_code", schema: "public" })
export class PaymentVoucherCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "bigint", name: "payment_id" })
  paymentId: bigint;

  @Column({ type: "bigint", name: "coupon_code_id", nullable: true })
  couponCodeId?: bigint;

  @Column({ type: "bigint", name: "offer_code_id", nullable: true })
  offerCodeId?: bigint;

  @OneToOne(() => Payment, payment => payment.voucherCode, { nullable: false })
  @JoinColumn({ name: "payment_id" })
  payment: Payment;

  @ManyToOne(() => CouponCode, couponCode => couponCode.payments, { nullable: true })
  @JoinColumn({ name: "coupon_code_id" })
  couponCode?: CouponCode;

  @ManyToOne(() => OfferCampaignCode, offerCampaignCode => offerCampaignCode.payments, { nullable: true })
  @JoinColumn({ name: "offer_code_id" })
  offerCode?: OfferCampaignCode;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;
}
