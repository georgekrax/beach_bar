import { Entity, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { BeachBar } from "./BeachBar";
import { BeachBarFeature } from "./BeachBarFeature";

@Entity({ name: "service_beach_bar", schema: "public" })
export class ServiceBeachBar extends BaseEntity {
  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "integer", name: "service_id" })
  serviceId: number;

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @Column({ type: "text", name: "description", nullable: true })
  description: string;

  @ManyToOne(() => BeachBar, beachBar => beachBar.serviceBeachBar, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => BeachBarFeature, beachBarFeature => beachBarFeature.serviceBeachBar, { nullable: false })
  service: BeachBarFeature;
}
