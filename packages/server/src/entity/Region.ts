import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BeachBarLocation } from "./BeachBarLocation";
import { City } from "./City";
import { Country } from "./Country";
import { SearchInputValue } from "./SearchInputValue";

@Entity({ name: "region", schema: "public" })
export class Region extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 100, name: "name" })
  name: string;

  @Column({ type: "integer", name: "country_id" })
  countryId: number;

  @Column({ type: "integer", name: "city_id", nullable: true })
  cityId?: bigint;

  @ManyToOne(() => Country, country => country.regions, { nullable: false })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @ManyToOne(() => City, city => city.regions, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city?: City;

  @OneToMany(() => BeachBarLocation, beachBarLocation => beachBarLocation.region)
  beachBarLocations?: BeachBarLocation[];

  @OneToMany(() => SearchInputValue, searchInputValue => searchInputValue.region, { nullable: true })
  searchInputValues?: SearchInputValue[];
}
