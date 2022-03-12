import { Dayjs } from "dayjs";
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
import { SearchSort } from "./SearchSort";
import { User } from "./User";

@Entity({ name: "user_search", schema: "public" })
@Check(`"adults" <= 12`)
@Check(`"children" <= 8`)
export class UserSearch extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "date", name: "date", nullable: true })
  date?: Dayjs;

  @Column({ type: "smallint", name: "adults", nullable: true })
  adults?: number;

  @Column({ type: "smallint", name: "children", nullable: true })
  children?: number;

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

  // getRedisKey(userId?: number): string {
  //   if (userId !== undefined) return redisKeys.USER + ":" + userId + ":" + redisKeys.USER_SEARCH;
  //   else return redisKeys.USER_SEARCH;
  // }

  // async getRedisIdx(redis: Redis, userId?: number): Promise<number> {
  //   const userSearches = await redis.lrange(this.getRedisKey(userId), 0, -1);
  //   const idx = userSearches.findIndex((x: string) => JSON.parse(x).id === this.id);
  //   return idx;
  // }
}
