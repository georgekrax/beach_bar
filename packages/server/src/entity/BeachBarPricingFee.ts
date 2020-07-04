import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BeachBar } from "./BeachBar";
import { BeachBarFeeCurrency } from "./BeachBarFeeCurrency";

@Entity({ name: "beach_bar_pricing_fee", schema: "public" })
export class BeachBarPricingFee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 75, name: "name", unique: true })
  name: string;

  @Column({ type: "decimal", precision: 4, scale: 2, name: "percentage_value" })
  percentageValue: number;

  @Column({ type: "decimal", precision: 4, scale: 2, name: "entry_fee_limit" })
  entryFeeLimit: number;

  @OneToMany(() => BeachBar, beachBar => beachBar.pricingFee)
  beachBars: BeachBar[];

  @OneToMany(() => BeachBarFeeCurrency, beachBarFeeCurrency => beachBarFeeCurrency.fee)
  currencies: BeachBarFeeCurrency[];
}
