import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";
import { City } from "./City";
import { CountryFlagIcon } from "./CountryFlagIcon";
import { LoginDetails } from "./LoginDetails";
import { UserContactDetails } from "./UserContactDetails";

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

  @Column("varchar", { length: 5, name: "language_identifier", unique: false })
  languageIdentifier: string;

  @OneToMany(() => City, city => city.country)
  cities: City[];

  @OneToMany(() => Account, account => account.country)
  accounts: Country[];

  @OneToMany(() => CountryFlagIcon, countryFlagIcon => countryFlagIcon.country, { eager: true, nullable: false })
  flagIcons: CountryFlagIcon[];

  @OneToMany(() => UserContactDetails, userContactDetails => userContactDetails.country)
  userContactDetails: UserContactDetails[];

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.country)
  loginDetails: LoginDetails[];
}
