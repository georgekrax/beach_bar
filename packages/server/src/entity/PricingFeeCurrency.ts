import { Dayjs } from "dayjs";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Currency } from "./Currency";

@Entity({ name: "pricing_fee_currency", schema: "public" })
export class PricingFeeCurrency extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "currency_id" })
  currencyId: number;

  @Column({ type: "decimal", precision: 4, scale: 2, name: "numeric_value" })
  numericValue: number;

  @ManyToOne(() => Currency, currency => currency.beachBarFees)
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;
}
