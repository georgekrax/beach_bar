import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";
import { City } from "./City";
import { Country } from "./Country";

@Entity({ name: "user_contact_details", schema: "public" })
export class UserContactDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "account_id", type: "integer" })
  accountId: number;

  @Column({ name: "country_id", type: "integer", nullable: true })
  countryId: number;

  @Column({ name: "city_id", type: "integer", nullable: true })
  cityId: number;

  @Column("varchar", { name: "phone_number", length: 20, unique: true, nullable: true })
  phoneNumber: string;

  @ManyToOne(() => Account, account => account.contactDetails, { nullable: false })
  @JoinColumn({ name: "account_id" })
  account: Account;

  @ManyToOne(() => Country, country => country.contactDetails, { nullable: false })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @ManyToOne(() => City, city => city.contactDetails)
  @JoinColumn({ name: "city_id" })
  city: City;
}
