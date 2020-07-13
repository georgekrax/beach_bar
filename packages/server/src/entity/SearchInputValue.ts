import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { City } from "./City";
import { Country } from "./Country";
import { Region } from "./Region";
import { UserSearch } from "./UserSearch";

@Entity({ name: "search_input_value", schema: "public" })
export class SearchInputValue extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 5, name: "public_id", unique: true })
  publicId: string;

  @Column({ type: "integer", name: "country_id", nullable: true })
  countryId: number;

  @Column({ type: "integer", name: "city_id", nullable: true })
  cityId: number;

  @Column({ type: "integer", name: "region_id", nullable: true })
  regionId: number;

  @Column({ type: "integer", name: "beach_bar_id", nullable: true })
  beachBarId: number;

  @ManyToOne(() => Country, country => country.searchInputValues, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @ManyToOne(() => City, city => city.searchInputValues, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city: City;

  @ManyToOne(() => Region, region => region.searchInputValues, { nullable: true })
  @JoinColumn({ name: "region_id" })
  region: Region;

  @ManyToOne(() => BeachBar, beachBar => beachBar.searchInputValues, { nullable: true })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @OneToMany(() => UserSearch, userSearch => userSearch.inputValue, { nullable: true })
  searches?: UserSearch[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  format(): string {
    let formattedString = "";
    if (this.beachBar) {
      formattedString = this.beachBar.name;
      return formattedString;
    } else {
      if (this.country) {
        formattedString = this.country.name;
      }
      if (this.city) {
        formattedString = this.city.name;
        if (this.country) {
          // @ts-ignore
          formattedString = formattedString.concat(`, ${this.country.name}`);
        }
      }
      if (this.region) {
        formattedString = this.region.name;
        if (this.city && this.country) {
          // @ts-ignore
          formattedString = formattedString.concat(`, ${this.city.name}`).concat(`, ${this.country.name}`);
        } else if (this.city) {
          // @ts-ignore
          formattedString = formattedString.concat(`, ${this.city.name}`);
        } else if (this.country) {
          // @ts-ignore
          formattedString = formattedString.concat(`, ${this.country.name}`);
        }
      }
    }
    return formattedString;
  }
}
