import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { SearchFilterCategory } from "./SearchFilterCategory";
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

  @ManyToMany(() => SearchFilterCategory, searchFilterCategory => searchFilterCategory.filters, { nullable: false })
  @JoinTable({
    name: "search_filter_section",
    joinColumn: {
      name: "filter_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
  })
  categories: SearchFilterCategory[];

  @ManyToMany(() => UserSearch, userSearch => userSearch.filters, { nullable: true })
  userSearches?: UserSearch[];
}
