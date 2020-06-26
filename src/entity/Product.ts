import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { BeachBar } from "./BeachBar";
import { BundleProductComponent } from "./BundleProductComponent";
import { CartProduct } from "./CartProduct";
import { Currency } from "./Currency";
import { ProductCategory } from "./ProductCategory";
import { ProductCouponCode } from "./ProductCouponCode";
import { ProductPriceHistory } from "./ProductPriceHistory";
import { ProductVoucherCampaign } from "./ProductVoucherCampaign";

@Entity({ name: "product", schema: "public" })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 120, name: "name" })
  name: string;

  @Column({ type: "integer", name: "category_id" })
  categoryId: number;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  price: number;

  @Column({ type: "integer", name: "currency_id", default: () => 1 })
  currencyId: number;

  @Column({ type: "boolean", name: "is_active", default: () => true })
  isActive: boolean;

  @Column({ type: "boolean", name: "is_individual" })
  isIndividual: boolean;

  @ManyToOne(() => Currency, currency => currency.products, { nullable: false })
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @ManyToOne(() => BeachBar, beachBar => beachBar.products, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => ProductCategory, productCategory => productCategory.products, { nullable: false })
  @JoinColumn({ name: "category_id" })
  category: ProductCategory;

  @OneToMany(() => BundleProductComponent, bundleProductComponent => bundleProductComponent.product)
  components: BundleProductComponent[];

  @OneToMany(() => ProductPriceHistory, productPriceHistrory => productPriceHistrory.product, { nullable: true })
  priceHistory?: ProductPriceHistory[];

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

  @Column({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async createProductComponents(update: boolean): Promise<void> {
    if (update) {
      const bundleProducts = await BundleProductComponent.find({ product: this });
      await getRepository(BundleProductComponent).softRemove(bundleProducts);
    }

    this.category.productComponents.forEach(async productComponent => {
      await BundleProductComponent.create({ product: this, component: productComponent, deletedAt: undefined }).save();
    });
  }

  async softRemove(): Promise<any> {
    const findOptions: any = { productId: this.id };
    await softRemove(
      Product,
      { id: this.id, name: this.name, beachBarId: this.beachBarId },
      [BundleProductComponent, CartProduct, ProductCouponCode, ProductCouponCode],
      findOptions,
    );
  }
}
