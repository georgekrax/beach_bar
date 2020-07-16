import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  In,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { Product } from "./Product";
import { ProductVoucherCode } from "./ProductVoucherCode";

@Entity({ name: "product_voucher_campaign", schema: "public" })
export class ProductVoucherCampaign extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "title" })
  title: string;

  @Column({ type: "decimal", precision: 3, scale: 0, name: "discount_percentage" })
  discountPercentage: number;

  @Column({ type: "boolean", name: "beach_bar_offer" })
  beachBarOffer: boolean;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @Column({ type: "timestamptz", name: "valid_until", nullable: true })
  validUntil: Dayjs;

  @ManyToMany(() => Product, product => product.voucherCampaigns, { nullable: false })
  @JoinTable({
    name: "voucher_campaign_offer_product",
    joinColumn: {
      name: "voucher_campaign_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[];

  @OneToMany(() => ProductVoucherCode, productVoucherCode => productVoucherCode.campaign, { nullable: true })
  voucherCodes?: ProductVoucherCode[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @Column({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async update(
    productIds: number[],
    title?: string,
    discountPercentage?: number,
    beachBarOffer?: boolean,
    validUntil?: Dayjs,
    isActive?: boolean,
  ): Promise<ProductVoucherCampaign | any> {
    try {
      if (productIds && productIds.length >= 1) {
        const products = await Product.find({ where: { id: In(productIds) } });
        if (products.some(product => !product.isActive)) {
          throw new Error("All the products should be active, in order to be applied for a voucher campaign");
        }
        this.products = products;
      }
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
      await this.save();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  calculateTotalProductPrice(): number | undefined {
    if (this.products) {
      return this.products.reduce((sum, i) => {
        return parseFloat(sum.toString()) + parseFloat(i.price.toString());
      }, 0);
    }
    return undefined;
  }

  async softRemove(): Promise<any> {
    const findOptions: any = { campaignId: this.id };
    await softRemove(ProductVoucherCampaign, { id: this.id }, [ProductVoucherCode], findOptions);
  }
}
