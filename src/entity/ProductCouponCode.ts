import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product";

@Entity({ name: "product_coupon_code", schema: "public" })
export class ProductCouponCode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 75, name: "title" })
  title: string;

  @Column("varchar", { length: 10, name: "ref_code", unique: true })
  refCode: string;

  @Column({ type: "integer", name: "product_id" })
  productId: number;

  @Column({ type: "decimal", precision: 5, scale: 2, name: "discount_amount" })
  discountAmount: number;

  @Column({ type: "decimal", precision: 3, scale: 0, name: "discount_percentage" })
  discountPercentage: number;

  @Column({ type: "boolean", name: "beach_bar_offer", default: () => true })
  beachBarOffer: boolean;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @Column({ type: "timestamptz", name: "valid_until", nullable: true })
  validUntil?: Date;

  @ManyToOne(() => Product, product => product.coupons, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;
}
