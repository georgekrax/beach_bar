import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserSearch } from "./UserSearch";

@Entity({ name: "search_sort", schema: "public" })
export class SearchSort extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 255, name: "name", unique: true })
  name: string;

  @OneToMany(() => UserSearch, userSearch => userSearch.inputValue, { nullable: true })
  searches?: UserSearch[];
}
