import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { City } from "./City";
import { ContactDetails } from "./ContactDetails";

@Entity({ name: "country", schema: "public" })
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 10, name: "calling_code", unique: true })
  callingCode: string;

  @OneToMany(() => City, city => city.country)
  cities: City[];

  @OneToMany(() => ContactDetails, contactDetails => contactDetails.country)
  contactDetails: ContactDetails[];
}
