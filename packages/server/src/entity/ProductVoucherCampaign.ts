import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @Column("varchar", { length: 75, name: "title" })
  title: string;

  @Column({ type: "decimal", precision: 3, scale: 0, name: "discount_percentage" })
  discountPercentage: number;

  @Column({ type: "boolean", name: "beach_bar_offer", default: () => false })
  beachBarOffer: boolean;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @Column({ type: "timestamptz", name: "valid_until", nullable: true })
  validUntil?: Date;

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
  updatedAt: Date;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

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
