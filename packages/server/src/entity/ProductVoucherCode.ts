import { generateID } from "@beach_bar/common";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  getConnection,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { ProductVoucherCampaign } from "./ProductVoucherCampaign";
import { Dayjs } from "dayjs";

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
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @BeforeInsert()
  generateRefCode(): void {
    const column = getConnection()
      .getMetadata(ProductVoucherCampaign)
      .columns.find(column => (column.propertyName = "refCode"));
    if (column) {
      this.refCode = generateID(parseInt(column.length));
    }
  }

  async softRemove(): Promise<any> {
    await softRemove(ProductVoucherCode, { id: this.id });
  }
}
