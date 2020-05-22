import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";

import { City } from "./City";
import { LoginDetails } from "./LoginDetails";
import { ContactDetails } from "./ContactDetails";

@Entity({ name: "country", schema: "public" })
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
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

  @OneToMany(() => ContactDetails, contactDetails => contactDetails.country)
  contactDetails: ContactDetails[];

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.country)
  loginDetails: LoginDetails[];
}
