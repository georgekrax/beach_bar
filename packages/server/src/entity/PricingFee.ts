import { Dayjs } from "dayjs";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BeachBar } from "./BeachBar";

@Entity({ name: "pricing_fee", schema: "public" })
export class PricingFee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 75, name: "name", unique: true })
  name: string;

  @Column({ type: "decimal", precision: 4, scale: 2, name: "percentage_value" })
  percentageValue: number;

  @Column({ type: "decimal", precision: 4, scale: 2, name: "max_capacity_percentage" })
  maxCapacityPercentage: number;

  @OneToMany(() => BeachBar, beachBar => beachBar.fee)
  beachBars: BeachBar[];

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;
}
