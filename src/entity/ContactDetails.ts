import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { City } from "./City";
import { Country } from "./Country";
import { Account } from "./Account";

@Entity({ name: "contact_details", schema: "public" })
export class ContactDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ name: "account_id", type: "bigint" })
  accountId: bigint;

  @ManyToOne(() => Account, account => account.contactDetails)
  @JoinColumn({ name: "account_id" })
  account: Account;

  @Column({ name: "country_id", type: "integer", nullable: true })
  countryId: number;

  @ManyToOne(() => Country, country => country.contactDetails)
  @JoinColumn({ name: "country_id" })
  country: Country;

  @Column({ name: "city_id", type: "integer", nullable: true })
  cityId: number;

  @ManyToOne(() => City, city => city.contactDetails)
  @JoinColumn({ name: "city_id" })
  city: City;

  @Column("varchar", { name: "phone_number", length: 20, unique: true, nullable: true })
  phoneNumber: string;
}
