import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";
import { BeachBarLocation } from "./BeachBarLocation";
import { Card } from "./Card";
import { City } from "./City";
import { Currency } from "./Currency";
import { Customer } from "./Customer";
import { LoginDetails } from "./LoginDetails";
import { Region } from "./Region";
import { SearchInputValue } from "./SearchInputValue";

@Entity({ name: "country", schema: "public" })
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 2, name: "alpha_2_code", unique: true})
  alpha2Code: string;

  @Column("varchar", { length: 3, name: "alpha_3_code", unique: true })
  alpha3Code: string;

  @Column("varchar", { length: 10, name: "calling_code", unique: true })
  callingCode: string;

  @Column({ type: "boolean", name: "is_eu" })
  isEu: boolean;

  @Column({ type: "integer", name: "currency_id" })
  currencyId: number;

  @ManyToOne(() => Currency, currency => currency.countries, { nullable: false })
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @OneToMany(() => City, city => city.country)
  cities?: City[];

  @OneToMany(() => Account, account => account.country)
  accounts?: Account[];

  @OneToMany(() => Account, account => account.telCountry)
  accountsTel?: Account[];

  @OneToMany(() => Region, region => region.country)
  regions?: Region[];

  @OneToMany(() => BeachBarLocation, beachBarLocation => beachBarLocation.country)
  beachBarLocations?: BeachBarLocation[];

  @OneToMany(() => Card, card => card.country, { nullable: true })
  cards?: Card[];

  @OneToMany(() => Customer, customer => customer.country, { nullable: true })
  customers?: Customer[];

  @OneToMany(() => SearchInputValue, searchInputValue => searchInputValue.country, { nullable: true })
  searchInputValues?: SearchInputValue[];

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.country, { nullable: true })
  loginDetails?: LoginDetails[];
}
