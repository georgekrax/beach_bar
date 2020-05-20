import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToMany } from "typeorm";

import { Owner } from "./Owner";

@Entity({ name: "beach_bar", schema: "public" })
export class BeachBar extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 255, unique: true })
  name: string;

  @ManyToMany(() => Owner, owner => owner.beachBars)
  owners: Owner[];
}
