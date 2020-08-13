import { generateId } from "@beach_bar/common";
import { generateIdSpecialCharacters, voucherCodeLength } from "@constants/.index";
import { softRemove } from "@utils/softRemove";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  BeforeInsert,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { PaymentVoucherCode } from "./PaymentVoucherCode";

@Entity({ name: "coupon_code", schema: "public" })
@Check(`"timesLimit" IS NULL OR "timesLimit" > 0`)
@Check(`"timesUsed" <= "timesLimit"`)
export class CouponCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 255, name: "title" })
  title: string;

  @Column("varchar", { length: voucherCodeLength.COUPON_CODE, name: "ref_code", unique: true })
  refCode: string;

  @Column({ type: "decimal", precision: 3, scale: 0, name: "discount_percentage" })
  discountPercentage: number;

  @Column({ type: "integer", name: "beach_bar_id", nullable: true })
  beachBarId?: number;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @Column({ type: "timestamptz", name: "valid_until", nullable: true })
  validUntil?: Dayjs;

  @Column({ type: "smallint", name: "times_limit", nullable: true })
  timesLimit?: number;

  @Column({ type: "smallint", name: "times_used", default: () => 0 })
  timesUsed: number;

  @ManyToOne(() => BeachBar, beachBar => beachBar.couponCodes, { nullable: true })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @OneToMany(() => PaymentVoucherCode, paymentVoucherCode => paymentVoucherCode.couponCode, { nullable: true })
  payments?: PaymentVoucherCode[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @BeforeInsert()
  generateRefCode(): void {
    this.refCode = generateId({ length: voucherCodeLength.COUPON_CODE, specialCharacters: generateIdSpecialCharacters.VOUCHER_CODE });
  }

  async update(options: {
    title?: string;
    discountPercentage?: number;
    validUntil?: Dayjs;
    isActive?: boolean;
    timesLimit?: number;
  }): Promise<CouponCode[] | { deleted: true } | any> {
    const { title, discountPercentage, validUntil, isActive, timesLimit } = options;
    try {
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
      if (timesLimit && timesLimit !== this.timesLimit) {
        this.timesLimit = timesLimit;
      }
      if (timesLimit && timesLimit < this.timesUsed) {
        await this.softRemove();
        return { deleted: true };
      }
      await this.save();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    await softRemove(CouponCode, { id: this.id });
  }
}
