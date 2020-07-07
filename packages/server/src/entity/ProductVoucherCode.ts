import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { ProductVoucherCampaign } from "./ProductVoucherCampaign";

@Entity({ name: "product_voucher_code", schema: "public" })
export class ProductVoucherCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 23, name: "ref_code" })
  refCode: string;

  @Column({ type: "integer", name: "campaign_id" })
  campaignId: number;

  @ManyToOne(() => ProductVoucherCampaign, productVoucherCampaign => productVoucherCampaign.voucherCodes, {
    nullable: false,
    cascade: ["soft-remove", "recover"],
  })
  @JoinColumn({ name: "campaign_id" })
  campaign: ProductVoucherCampaign;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async softRemove(): Promise<any> {
    await softRemove(ProductVoucherCode, { id: this.id });
  }
}
