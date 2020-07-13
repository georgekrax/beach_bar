import { Dayjs } from "dayjs";
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
  UpdateDateColumn,
} from "typeorm";
import { BeachBarService } from "./BeachBarService";
import { SearchInputValue } from "./SearchInputValue";
import { User } from "./User";

@Entity({ name: "user_search", schema: "public" })
@Check(`"searchAdults" <= 12`)
@Check(`"searchChildren" <= 8`)
export class UserSearch extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "date", name: "search_date", nullable: true })
  searchDate?: Dayjs;

  @Column({ type: "smallint", name: "search_adults", nullable: true })
  searchAdults?: number;

  @Column({ type: "smallint", name: "search_children", nullable: true })
  searchChildren?: number;

  @Column({ type: "json", name: "extra_filters", nullable: true })
  extraFilters?: string | Record<string, unknown> | any;

  @Column({ type: "integer", name: "user_id", nullable: true })
  userId: number;

  @Column({ type: "bigint", name: "input_value_id" })
  inputValueId: bigint;

  @ManyToOne(() => User, user => user.searches, { nullable: true, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => SearchInputValue, searchInputValue => searchInputValue.searches, { nullable: false })
  @JoinColumn({ name: "input_value_id" })
  inputValue: SearchInputValue;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @BeforeInsert()
  @BeforeUpdate()
  async checkJsonFilters(): Promise<Error | void> {
    const validFeatures = await BeachBarService.find();
    if (this.extraFilters && Object.keys(this.extraFilters).length === 0 && this.extraFilters.constructor === Object) {
      Object.entries(this.extraFilters).forEach(([key, value]) => {
        if (typeof key !== "object" && !validFeatures.map(feature => feature.name).includes(key)) {
          throw new Error("Something went wrong");
        }
        if (typeof value !== "boolean" || typeof value !== "object") {
          throw new Error("Something went wrong");
        }
      });
    }
  }
}
