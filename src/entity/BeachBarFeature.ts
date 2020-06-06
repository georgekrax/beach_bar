import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ServiceBeachBar } from "./ServiceBeachBar";

@Entity({ name: "beach_bar_feature", schema: "public" })
export class BeachBarFeature extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, unique: true, name: "name" })
  name: string;

  @Column({ type: "text", name: "icon_url" })
  iconUrl: string;

  @OneToMany(() => ServiceBeachBar, serviceBeachBar => serviceBeachBar.beachBar)
  serviceBeachBar: ServiceBeachBar[];
}
