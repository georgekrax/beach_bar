import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserSearch } from "./UserSearch";

@Entity({ name: "search_filter", schema: "public" })
export class SearchFilter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 3, name: "public_id", unique: true })
  publicId: string;

  @Column("varchar", { length: 255, name: "name", unique: true })
  name: string;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @ManyToMany(() => UserSearch, userSearch => userSearch.filters, { nullable: true })
  userSearches?: UserSearch[];
}
