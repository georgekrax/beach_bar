import { generateID } from "@beach_bar/common";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";

@Entity({ name: "product_coupon_code", schema: "public" })
export class ProductCouponCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 255, name: "title" })
  title: string;

  @Column("varchar", { length: 18, name: "ref_code", unique: true })
  refCode: string;

  @Column({ type: "decimal", precision: 3, scale: 0, name: "discount_percentage" })
  discountPercentage: number;

  @Column({ type: "boolean", name: "beach_bar_offer" })
  beachBarOffer: boolean;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @Column({ type: "timestamptz", name: "valid_until", nullable: true })
  validUntil?: Dayjs;

  @Column({ type: "smallint", name: "times_limit" })
  timesLimit: number;

  @Column({ type: "smallint", name: "times_used", default: () => 0 })
  timesUsed: number;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @BeforeInsert()
  generateRefCode(): void {
    this.refCode = generateID(18);
  }

  async update(
    title?: string,
    discountPercentage?: number,
    beachBarOffer?: boolean,
    validUntil?: Dayjs,
    isActive?: boolean,
    timesLimit?: number
  ): Promise<ProductCouponCode[] | { deleted: true } | any> {
    try {
      if (title && title !== this.title) {
        this.title = title;
      }
      if (discountPercentage && discountPercentage !== this.discountPercentage) {
        this.discountPercentage = discountPercentage;
      }
      if (beachBarOffer !== null && beachBarOffer !== undefined && beachBarOffer !== this.beachBarOffer) {
        this.beachBarOffer = beachBarOffer;
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
    await softRemove(ProductCouponCode, { id: this.id });
  }
}
