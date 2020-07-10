import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { BeachBar } from "./BeachBar";
import { City } from "./City";
import { Country } from "./Country";
import { Region } from "./Region";

@Entity({ name: "beach_bar_location", schema: "public" })
export class BeachBarLocation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100, name: "address" })
  address: string;

  @Column("varchar", { length: 12, name: "zip_code", nullable: true })
  zipCode?: string;

  @Column({ type: "decimal", precision: 10, scale: 6, name: "latitude" })
  latitude: number;

  @Column({ type: "decimal", precision: 10, scale: 6, name: "longitude" })
  longitude: number;

  @Column({ type: "geography", name: "where_is" })
  whereIs: string;

  @Column({ type: "integer", name: "country_id" })
  countryId: number;

  @Column({ type: "integer", name: "city_id" })
  cityId: number;

  @Column({ type: "integer", name: "region_id", nullable: true })
  regionId?: number;

  @Column({ type: "integer", name: "beach_bar_id", unique: true })
  beachBarId: number;

  @OneToOne(() => BeachBar, beachBar => beachBar.location, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => Country, country => country.beachBarLocations, { nullable: false })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @ManyToOne(() => City, city => city.beachBarLocations, { nullable: false })
  @JoinColumn({ name: "city_id" })
  city: City;

  @ManyToOne(() => Region, region => region.beachBarLocations, { nullable: true })
  @JoinColumn({ name: "region_id" })
  region?: Region;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;
}
