import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { SearchFilter } from "./SearchFilter";

@Entity({ name: "search_filter_category", schema: "public" })
export class SearchFilterCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "name", unique: true })
  name: string;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @ManyToMany(() => SearchFilter, searchFilter => searchFilter.categories, { nullable: true })
  filters?: SearchFilter[];
}
