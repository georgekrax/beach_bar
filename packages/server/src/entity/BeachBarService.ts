import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BeachBarFeature } from "./BeachBarFeature";

@Entity({ name: "beach_bar_service", schema: "public" })
export class BeachBarService extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, unique: true, name: "name" })
  name: string;

  @OneToMany(() => BeachBarFeature, beachBarFeature => beachBarFeature.service, { nullable: true })
  beachBars?: BeachBarFeature[];
}
