import {
  BaseEntity,
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
import { CartProduct } from "./CartProduct";
import { Currency } from "./Currency";
import { ProductCouponCode } from "./ProductCouponCode";
import { ProductType } from "./ProductType";
import { ProductVoucherCampaign } from "./ProductVoucherCampaign";

@Entity({ name: "product", schema: "public" })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 120, name: "name" })
  name: string;

  @Column({ type: "integer", name: "type_id" })
  typeId: number;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  price: number;

  @Column({ type: "integer", name: "currency_id", default: () => 1 })
  currencyId: number;

  @Column({ type: "boolean", name: "is_active", default: () => true })
  isActive: boolean;

  @ManyToOne(() => Currency, currency => currency.products, { nullable: false })
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @ManyToOne(() => BeachBar, beachBar => beachBar.products, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => ProductType, productType => productType.products, { nullable: false })
  @JoinColumn({ name: "type_id" })
  type: ProductType;

  @OneToMany(() => CartProduct, cartProduct => cartProduct.product, { nullable: true })
  carts?: CartProduct[];

  @OneToMany(() => ProductCouponCode, productCouponCode => productCouponCode.product, { nullable: true })
  coupons?: ProductCouponCode[];

  @OneToMany(() => ProductVoucherCampaign, productCouponCode => productCouponCode.product, { nullable: true })
  voucherCampaigns?: ProductCouponCode[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;
}
