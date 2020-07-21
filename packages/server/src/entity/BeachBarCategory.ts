import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BeachBar } from "./BeachBar";

@Entity({ name: "beach_bar_category", schema: "public" })
export class BeachBarCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "name", unique: true })
  name: string;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @OneToMany(() => BeachBar, beachBar => beachBar.category, { nullable: true })
  beachBars?: BeachBar[];
}
