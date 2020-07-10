import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BeachBar } from "./BeachBar";
import { BeachBarFeeCurrency } from "./BeachBarFeeCurrency";
import { Country } from "./Country";
import { CurrencyProductPrice } from "./CurrencyProductPrice";
import { Product } from "./Product";
import { StripeFee } from "./StripeFee";
import { StripeMinimumCurrency } from "./StripeMinimumCurrency";

@Entity({ name: "currency", schema: "public" })
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 3, name: "iso_code", unique: true })
  isoCode: string;

  @Column("varchar", { length: 10, name: "symbol", unique: true })
  symbol: string;

  @Column("varchar", { length: 10, name: "second_symbol", nullable: true })
  secondSymbol: string;

  @OneToMany(() => Country, country => country.currency, { nullable: true })
  countries?: Country[];

  @OneToOne(() => CurrencyProductPrice, currencyProductPrice => currencyProductPrice.currency)
  productPrice: CurrencyProductPrice;

  @OneToMany(() => BeachBar, beachBar => beachBar.defaultCurrency, { nullable: true })
  beachBars?: Product[];

  @OneToMany(() => BeachBarFeeCurrency, beachBarFeeCurrency => beachBarFeeCurrency.currency, { nullable: true })
  beachBarFees?: BeachBarFeeCurrency[];

  @OneToMany(() => StripeFee, stripeFee => stripeFee.currency, { nullable: true })
  stripeFees?: StripeFee[];

  @OneToOne(() => StripeMinimumCurrency, stripeMinimumCurrency => stripeMinimumCurrency.currency)
  stripeMinimumCurrency: StripeMinimumCurrency;
}
