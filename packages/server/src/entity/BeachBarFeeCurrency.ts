import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { BeachBarPricingFee } from "./BeachBarPricingFee";
import { Currency } from "./Currency";

@Entity({ name: "beach_bar_fee_currency", schema: "public" })
export class BeachBarFeeCurrency extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "fee_id" })
  feeId: number;

  @Column({ type: "integer", name: "currency_id" })
  currencyId: number;

  @Column({ type: "decimal", precision: 4, scale: 2, name: "pricing_value" })
  pricingValue: number;

  @ManyToOne(() => BeachBarPricingFee, beachBarFee => beachBarFee.currencies)
  @JoinColumn({ name: "fee_id" })
  fee: BeachBarPricingFee;

  @ManyToOne(() => Currency, currency => currency.beachBarFees)
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;
}
