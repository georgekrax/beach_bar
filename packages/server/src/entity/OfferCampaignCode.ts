import { generateId } from "@the_hashtag/common";
import { generateIdSpecialCharacters, voucherCodeLength } from "constants/_index";
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
  PrimaryGeneratedColumn
} from "typeorm";
import { softRemove } from "utils/softRemove";
import { BeachBar } from "./BeachBar";
import { OfferCampaign } from "./OfferCampaign";
import { PaymentVoucherCode } from "./PaymentVoucherCode";

@Entity({ name: "offer_campaign_code", schema: "public" })
@Check(`"percentageUsed" >= 0 AND "percentageUsed" <= 100`)
export class OfferCampaignCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "campaign_id" })
  campaignId: number;

  @Column("varchar", { length: voucherCodeLength.OFFER_CAMPAIGN_CODE, name: "ref_code" })
  refCode: string;

  @Column({ type: "smallint", name: "times_used", default: () => 0 })
  timesUsed: number;

  @ManyToOne(() => OfferCampaign, offerCampaign => offerCampaign.offerCodes, { nullable: false })
  @JoinColumn({ name: "campaign_id" })
  campaign: OfferCampaign;

  @OneToMany(() => PaymentVoucherCode, paymentVoucherCode => paymentVoucherCode.offerCode, { nullable: true })
  payments?: PaymentVoucherCode[];

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @BeforeInsert()
  generateRefCode(): void {
    this.refCode = generateId({
      length: voucherCodeLength.OFFER_CAMPAIGN_CODE,
      specialCharacters: generateIdSpecialCharacters.VOUCHER_CODE,
    });
  }

  getProductBeachBars(): BeachBar[] {
    const productBeachBars = this.campaign.products.map(product => product.beachBar);
    return productBeachBars.filter((beachBar, index, self) => index === self.findIndex(t => t.id === beachBar.id));
  }

  async softRemove(): Promise<any> {
    await softRemove(OfferCampaignCode, { id: this.id });
  }
}
