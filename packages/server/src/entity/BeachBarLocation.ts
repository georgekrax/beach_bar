import { Dayjs } from "dayjs";
import { Redis } from "ioredis";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { errors } from "@beach_bar/common";
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
  latitude: string;

  @Column({ type: "decimal", precision: 10, scale: 6, name: "longitude" })
  longitude: string;

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
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async update(
    redis: Redis,
    address?: string,
    zipCode?: string,
    latitude?: string,
    longitude?: string,
    countryId?: number,
    cityId?: number,
    regionId?: number,
  ): Promise<BeachBarLocation | any> {
    try {
      if (address && address !== this.address) {
        this.address = address;
      }
      if (zipCode && zipCode !== this.zipCode) {
        this.zipCode = zipCode;
      }
      if (latitude && latitude !== this.latitude) {
        if (latitude.length > 16) {
          throw new Error();
        }
        this.latitude = latitude;
      }
      if (longitude && longitude !== this.longitude) {
        if (longitude.length > 16) {
          throw new Error(errors.SOMETHING_WENT_WRONG);
        }
        this.longitude = longitude;
      }
      if (countryId && countryId !== this.countryId) {
        const country = await Country.findOne(countryId);
        if (!country) {
          throw new Error("Invalid country");
        }
        this.country = country;
      }
      if (cityId && cityId !== this.cityId) {
        const city = await City.findOne(cityId);
        if (!city) {
          throw new Error("Invalid city");
        }
        this.city = city;
      }
      if (regionId && regionId !== this.regionId) {
        const region = await Region.findOne(regionId);
        if (!region) {
          throw new Error("Invalid region");
        }
        this.region = region;
      }

      await this.save();
      await this.beachBar.updateRedis(redis);
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
