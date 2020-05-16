import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Country } from "./Country";
import { ContactDetails } from "./ContactDetails";

@Entity({ name: "city", schema: "public" })
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100, name: "name", unique: true })
  name: string;

  @Column({ name: "country_id" })
  countryId: number;

  @ManyToOne(() => Country, country => country.cities)
  @JoinColumn({ name: "country_id" })
  country: Country;

  @OneToMany(() => ContactDetails, contactDetails => contactDetails.city)
  contactDetails: ContactDetails[];
}
