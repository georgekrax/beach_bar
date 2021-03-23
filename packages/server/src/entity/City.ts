import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BeachBarLocation } from "./BeachBarLocation";
import { Country } from "./Country";
import { LoginDetails } from "./LoginDetails";
import { Region } from "./Region";
import { SearchInputValue } from "./SearchInputValue";

@Entity({ name: "city", schema: "public" })
export class City extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 100, name: "name", unique: true })
  name: string;

  @Column({ name: "country_id", type: "integer" })
  countryId: number;

  @ManyToOne(() => Country, country => country.cities, { nullable: false })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @OneToMany(() => Region, region => region.city, { nullable: true })
  regions?: Region[];

  @OneToMany(() => BeachBarLocation, beachBarLocation => beachBarLocation.city, { nullable: true })
  beachBarLocations?: BeachBarLocation[];

  @OneToMany(() => SearchInputValue, searchInputValue => searchInputValue.city, { nullable: true })
  searchInputValues?: SearchInputValue[];

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.city, { nullable: true })
  loginDetails?: LoginDetails[];
}
