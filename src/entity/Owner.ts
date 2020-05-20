import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable } from "typeorm";

import { BeachBar } from "./BeachBar";

@Entity({ name: "owner", schema: "public" })
export class Owner extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @ManyToMany(() => BeachBar, beachBar => beachBar.owners)
  @JoinTable({
    name: "owner_beach_bar",
    joinColumn: {
      name: "owner_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "beach_bar_id",
      referencedColumnName: "id",
    },
  })
  beachBars: BeachBar[];
}
