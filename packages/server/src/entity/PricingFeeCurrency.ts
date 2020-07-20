import { Dayjs } from "dayjs";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Currency } from "./Currency";
import { PricingFee } from "./PricingFee";

@Entity({ name: "pricing_fee_currency", schema: "public" })
export class PricingFeeCurrency extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "fee_id" })
  feeId: number;

  @Column({ type: "integer", name: "currency_id" })
  currencyId: number;

  @Column({ type: "decimal", precision: 4, scale: 2, name: "percentage_value" })
  percentageValue: number;

  @ManyToOne(() => PricingFee, pricingFee => pricingFee.currencies)
  @JoinColumn({ name: "fee_id" })
  fee: PricingFee;

  @ManyToOne(() => Currency, currency => currency.beachBarFees)
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;
}
