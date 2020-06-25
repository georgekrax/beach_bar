import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";
import { BeachBarLocation } from "./BeachBarLocation";
import { Card } from "./Card";
import { City } from "./City";
import { CountryFlagIcon } from "./CountryFlagIcon";
import { Currency } from "./Currency";
import { LoginDetails } from "./LoginDetails";
import { Region } from "./Region";
import { UserContactDetails } from "./UserContactDetails";
import { UserSearch } from "./UserSearch";

@Entity({ name: "country", schema: "public" })
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 10, name: "calling_code", unique: true })
  callingCode: string;

  @Column("varchar", { length: 5, name: "iso_code", unique: true })
  isoCode: string;

  @Column({ type: "boolean", name: "is_eu" })
  isEu: boolean;

  @Column("varchar", { length: 5, name: "language_identifier", unique: false })
  languageIdentifier: string;

  @Column({ type: "integer", name: "currency_id" })
  currencyId: number;

  @OneToMany(() => City, city => city.country)
  cities?: City[];

  @OneToMany(() => Account, account => account.country)
  accounts?: Account[];

  @OneToMany(() => CountryFlagIcon, countryFlagIcon => countryFlagIcon.country, { nullable: false })
  flagIcons: CountryFlagIcon[];

  @OneToMany(() => UserContactDetails, userContactDetails => userContactDetails.country)
  userContactDetails?: UserContactDetails[];

  @OneToMany(() => Region, region => region.country)
  regions?: Region[];

  @OneToMany(() => BeachBarLocation, beachBarLocation => beachBarLocation.country)
  beachBarLocations?: BeachBarLocation[];

  @OneToMany(() => UserSearch, userSearch => userSearch.country)
  userSearches?: UserSearch[];

  @OneToMany(() => Card, card => card.country, { nullable: true })
  cards?: Card[];

  @ManyToOne(() => Currency, currency => currency.countries, { nullable: false })
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.country)
  loginDetails?: LoginDetails[];
}
