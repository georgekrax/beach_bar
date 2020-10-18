import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BeachBarType } from "./BeachBarType";

@Entity({ name: "beach_bar_style", schema: "public" })
export class BeachBarStyle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "name", unique: true })
  name: string;

  @OneToMany(() => BeachBarType, beachBarType => beachBarType.style)
  beachBars?: BeachBarType[];
}
