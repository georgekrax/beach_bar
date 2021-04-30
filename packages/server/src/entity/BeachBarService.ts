import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BeachBarFeature } from "./BeachBarFeature";
import { Icon } from "./Icon";

@Entity({ name: "beach_bar_service", schema: "public" })
export class BeachBarService extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, unique: true, name: "name" })
  name: string;

  @Column({ type: "integer", name: "icon_id", unique: true })
  iconId: number;

  @OneToOne(() => Icon, icon => icon.service, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "icon_id" })
  icon: Icon;

  @OneToMany(() => BeachBarFeature, beachBarFeature => beachBarFeature.service, { nullable: true })
  beachBars?: BeachBarFeature[];
}
