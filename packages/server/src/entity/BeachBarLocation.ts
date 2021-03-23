import { Dayjs } from "dayjs";
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
  whereIs?: number[];

  @Column({ type: "integer", name: "country_id" })
  countryId: number;

  @Column({ type: "integer", name: "city_id" })
  cityId: bigint;

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

  async update({
    address,
    zipCode,
    latitude,
    longitude,
    countryId,
    city,
    region,
  }: Partial<Pick<BeachBarLocation, "address" | "zipCode" | "latitude" | "longitude" | "countryId">> & {
    city?: string;
    region?: string;
  }): Promise<BeachBarLocation | any> {
    try {
      if (address && address !== this.address) this.address = address;
      if (zipCode && zipCode !== this.zipCode) this.zipCode = zipCode;
      if (latitude && latitude !== this.latitude) this.latitude = latitude;
      if (longitude && longitude !== this.longitude) this.longitude = longitude;
      if (countryId && countryId !== this.countryId) {
        const country = await Country.findOne(countryId);
        if (!country) throw new Error("Invalid country");
        this.country = country;
      }
      if (city && city.toLowerCase() !== this.city.name.toLowerCase()) {
        let newCity = await City.findOne({ where: `"name" ILIKE '${city}'` });
        if (!newCity) {
          newCity = City.create({
            name: city,
            countryId: this.country.id,
            country: this.country,
          });
          await newCity.save();
        }
        this.city = newCity;
        await this.save();
      }

      if (region && region.toLowerCase() !== this.region?.name.toLowerCase()) {
        let newRegion = await Region.findOne({ where: `"name" ILIKE '${region}'` });
        if (!newRegion) {
          newRegion = Region.create({
            name: region,
            countryId: this.country.id,
            country: this.country,
            cityId: this.city.id,
            city: this.city,
          });
          await newRegion.save();
        }
        this.region = newRegion;
      }

      await this.save();
      await this.beachBar.updateRedis();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
