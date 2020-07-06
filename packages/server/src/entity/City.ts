import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";
import { BeachBarLocation } from "./BeachBarLocation";
import { Country } from "./Country";
import { LoginDetails } from "./LoginDetails";
import { Region } from "./Region";
import { UserSearch } from "./UserSearch";

@Entity({ name: "city", schema: "public" })
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100, name: "name", unique: true })
  name: string;

  @Column({ name: "country_id", type: "integer" })
  countryId: number;

  @ManyToOne(() => Country, country => country.cities, { nullable: false })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @OneToMany(() => Account, account => account.city, { nullable: true })
  accounts?: Account[];

  @OneToMany(() => Region, region => region.city, { nullable: true })
  regions?: Region[];

  @OneToMany(() => BeachBarLocation, beachBarLocation => beachBarLocation.city, { nullable: true })
  beachBarLocations?: BeachBarLocation[];

  @OneToMany(() => UserSearch, userSearch => userSearch.city, { nullable: true })
  userSearches?: UserSearch[];

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.city, { nullable: true })
  loginDetails: LoginDetails[];
}