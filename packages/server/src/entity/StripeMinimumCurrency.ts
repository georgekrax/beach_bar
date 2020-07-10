import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Currency } from "./Currency";

@Entity({ name: "stripe_minimum_currency", schema: "public" })
export class StripeMinimumCurrency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 4, scale: 2, name: "charge_amount" })
  chargeAmount: number;

  @Column({ type: "integer", name: "currency_id", unique: true })
  currencyId: number;

  @OneToOne(() => Currency, currency => currency.stripeMinimumCurrency, { nullable: false })
  currency: Currency;
}
