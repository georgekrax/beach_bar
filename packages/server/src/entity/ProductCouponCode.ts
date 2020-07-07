import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  // eslint-disable-next-line prettier/prettier
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { Product } from "./Product";

@Entity({ name: "product_coupon_code", schema: "public" })
export class ProductCouponCode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 75, name: "title" })
  title: string;

  @Column("varchar", { length: 18, name: "ref_code", unique: true })
  refCode: string;

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

  @ManyToMany(() => Product, product => product.coupons, { nullable: false })
  @JoinTable({
    name: "coupon_code_offer_product",
    joinColumn: {
      name: "coupon_code_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async softRemove(): Promise<any> {
    await softRemove(ProductCouponCode, { id: this.id });
  }
}
