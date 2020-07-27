import { generateId } from "@beach_bar/common";
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
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { OfferCampaign } from "./OfferCampaign";
import { PaymentOfferCode } from "./PaymentOfferCode";

@Entity({ name: "offer_campaign_code", schema: "public" })
@Check(`"percentageUsed" >= 0 AND "percentageUsed" <= 100`)
export class OfferCampaignCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "campaign_id" })
  campaignId: number;

  @Column("varchar", { length: 23, name: "ref_code" })
  refCode: string;

  @Column({ type: "decimal", precision: 3, scale: 0, name: "percentage_used", default: () => 0 })
  percentageUsed: number;

  @Column({ type: "smallint", name: "times_used", default: () => 0 })
  timesUsed: number;

  @Column({ type: "smallint", name: "is_redeemed", default: () => false })
  isRedeemed: boolean;

  @ManyToOne(() => OfferCampaign, offerCampaign => offerCampaign.offerCodes, { nullable: false })
  @JoinColumn({ name: "campaign_id" })
  campaign: OfferCampaign;

  @OneToMany(() => PaymentOfferCode, paymentOfferCode => paymentOfferCode.offerCode, { nullable: true })
  payments?: PaymentOfferCode[];

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @BeforeInsert()
  generateRefCode(): void {
    this.refCode = generateId({ length: 23 });
  }

  getProductBeachBars(): BeachBar[] {
    const productBeachBars = this.campaign.products.map(product => product.beachBar);
    return productBeachBars.filter((beachBar, index, self) => index === self.findIndex(t => t.id === beachBar.id));
  }

  async softRemove(): Promise<any> {
    await softRemove(OfferCampaignCode, { id: this.id });
  }
}
