import redisKeys from "constants/redisKeys";
import { Dayjs } from "dayjs";
import { Redis } from "ioredis";
import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SearchFilter } from "./SearchFilter";
import { SearchInputValue } from "./SearchInputValue";
import { User } from "./User";
import { SearchSort } from "./SearchSort";

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

  @Column({ type: "integer", name: "user_id", nullable: true })
  userId: number;

  @Column({ type: "bigint", name: "input_value_id" })
  inputValueId: bigint;

  @Column({ type: "smallint", name: "sort_id", nullable: true })
  sortId?: number;

  @ManyToOne(() => User, user => user.searches, { nullable: true, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => SearchInputValue, searchInputValue => searchInputValue.searches, { nullable: false })
  @JoinColumn({ name: "input_value_id" })
  inputValue: SearchInputValue;

  @ManyToOne(() => SearchSort, searchSort => searchSort.searches, { nullable: true })
  @JoinColumn({ name: "input_value_id" })
  sort?: SearchSort;

  @ManyToMany(() => SearchFilter, searchFilter => searchFilter.userSearches, { nullable: true })
  @JoinTable({
    name: "user_search_filter",
    joinColumn: { name: "search_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "filter_id", referencedColumnName: "id" },
  })
  filters?: SearchFilter[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  getRedisKey(userId?: number): string {
    if (userId !== undefined) return redisKeys.USER  +":"  + userId + ":" + redisKeys.USER_SEARCH;
    else return redisKeys.USER_SEARCH;
  }

  async getRedisIdx(redis: Redis, userId?: number): Promise<number> {
    const userSearches = await redis.lrange(this.getRedisKey(userId), 0, -1);
    const idx = userSearches.findIndex((x: string) => JSON.parse(x).id === this.id);
    return idx;
  }
}
