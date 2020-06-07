import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BeachBar } from "./BeachBar";
import { BeachBarFeature } from "./BeachBarFeature";

@Entity({ name: "service_beach_bar", schema: "public" })
export class ServiceBeachBar extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @PrimaryColumn({ type: "integer", name: "service_id" })
  serviceId: number;

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @Column({ type: "text", name: "description", nullable: true })
  description: string;

  @ManyToOne(() => BeachBar, beachBar => beachBar.serviceBeachBar, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => BeachBarFeature, beachBarFeature => beachBarFeature.serviceBeachBar, { nullable: false, eager: true })
  @JoinColumn({ name: "service_id" })
  service: BeachBarFeature;
}
