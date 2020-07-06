import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "refund_percentage", schema: "public" })
export class RefundPercentage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "percentage_value" })
  percentageValue: number;

  @Column({ type: "integer", name: "days_limit" })
  daysLimit: number;

  @Column({ type: "bigint", name: "days_milliseconds" })
  daysMilliseconds: number;
}
