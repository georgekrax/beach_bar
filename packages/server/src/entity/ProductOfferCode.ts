import { generateID } from "@beach_bar/common";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { ProductOfferCampaign } from "./ProductOfferCampaign";

@Entity({ name: "product_offer_code", schema: "public" })
export class ProductOfferCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "campaign_id" })
  campaignId: number;

  @Column("varchar", { length: 23, name: "ref_code" })
  refCode: string;

  @Column({ type: "smallint", name: "times_used", default: () => 0 })
  timesUsed: number;

  @Column({ type: "smallint", name: "is_redeemed", default: () => false })
  isRedeemed: boolean;

  @ManyToOne(() => ProductOfferCampaign, productOfferCampaign => productOfferCampaign.offerCodes, { nullable: false })
  @JoinColumn({ name: "campaign_id" })
  campaign: ProductOfferCampaign;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @BeforeInsert()
  generateRefCode(): void {
    this.refCode = generateID(23);
  }

  async softRemove(): Promise<any> {
    await softRemove(ProductOfferCode, { id: this.id });
  }
}
