import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { City } from "./City";
import { Country } from "./Country";
import { Region } from "./Region";
import { User } from "./User";

const JSON_FILTERS = ["pool"];

@Entity({ name: "user_search", schema: "public" })
@Check(`"searchAdults" <= 12`)
@Check(`"searchChildren" <= 8`)
export class UserSearch extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 255, name: "search_value" })
  searchValue: string;

  @Column({ type: "date", name: "search_date", nullable: true })
  searchDate?: Date;

  @Column({ type: "smallint", name: "search_adults", nullable: true })
  searchAdults?: number;

  @Column({ type: "smallint", name: "search_children", nullable: true })
  searchChildren?: number;

  @Column({ type: "json", name: "extra_filters", nullable: true })
  extraFilters?: string | object | any;

  @Column({ type: "integer", name: "user_id" })
  userId: number;

  @Column({ type: "integer", name: "country_id", nullable: true })
  countryId?: number;

  @Column({ type: "integer", name: "city_id", nullable: true })
  cityId?: number;

  @Column({ type: "integer", name: "region_id", nullable: true })
  regionId?: number;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @ManyToOne(() => User, user => user.searches, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Country, country => country.userSearches, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country?: Country;

  @ManyToOne(() => City, city => city.userSearches, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city?: City;

  @ManyToOne(() => Region, region => region.userSearches, { nullable: true })
  @JoinColumn({ name: "region_id" })
  region?: Region;

  @BeforeInsert()
  @BeforeUpdate()
  checkJsonFilters(): Error | void {
    if (this.extraFilters && Object.keys(this.extraFilters).length === 0 && this.extraFilters.constructor === Object) {
      Object.entries(this.extraFilters).forEach(([key, value]) => {
        if (typeof key !== "object" && !JSON_FILTERS.includes(key)) {
          throw new Error("Something went wrong");
        }
        if (typeof value !== "boolean" || typeof value !== "object") {
          throw new Error("Something went wrong");
        }
      });
    }
  }
}
