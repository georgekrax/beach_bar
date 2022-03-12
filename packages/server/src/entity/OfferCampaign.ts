import { softRemove } from "@/utils/softRemove";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  In,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OfferCampaignCode } from "./OfferCampaignCode";
import { Product } from "./Product";

@Entity({ name: "offer_campaign", schema: "public" })
export class OfferCampaign extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "title" })
  title: string;

  @Column({ type: "decimal", precision: 3, scale: 0, name: "discount_percentage" })
  discountPercentage: number;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @Column({ type: "timestamptz", name: "valid_until", nullable: true })
  validUntil: Dayjs;

  @ManyToMany(() => Product, product => product.offerCampaigns, { nullable: false })
  @JoinTable({
    name: "offer_campaign_product",
    joinColumn: {
      name: "campaign_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[];

  @OneToMany(() => OfferCampaignCode, offerCampaignCode => offerCampaignCode.campaign, { nullable: true })
  offerCodes?: OfferCampaignCode[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async update(
    productIds: number[],
    title?: string,
    discountPercentage?: number,
    validUntil?: Dayjs,
    isActive?: boolean
  ): Promise<OfferCampaign | any> {
    try {
      if (productIds && productIds.length >= 1) {
        const products = await Product.find({ where: { id: In(productIds) } });
        if (products.some(product => !product.isActive)) {
          throw new Error("All the products should be active, in order to be applied for an offer campaign.");
        }
        this.products = products;
      }
      if (title && title !== this.title) this.title = title;
      if (discountPercentage && discountPercentage !== this.discountPercentage) this.discountPercentage = discountPercentage;
      if (validUntil && validUntil !== this.validUntil) this.validUntil = validUntil;
      if (isActive != null && isActive !== this.isActive) this.isActive = isActive;
      await this.save();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  calculateTotalProductPrice(): number | undefined {
    return this.products?.reduce((sum, i) => +sum.toString() + +i.price.toString(), 0);
  }

  async softRemove(): Promise<any> {
    await softRemove(OfferCampaign, { id: this.id }, [OfferCampaignCode], { campaignId: this.id });
  }
}
