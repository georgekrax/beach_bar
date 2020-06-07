import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BeachBar } from "./BeachBar";
import { User } from "./User";

@Entity({ name: "owner", schema: "public" })
export class Owner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "user_id", unique: true })
  userId: number;

  @Column({ name: "is_primary", type: "boolean", default: false })
  isPrimary: boolean;

  @OneToOne(() => User, user => user.owner, { nullable: false, eager: true })
  @JoinColumn({ name: "user_id" })
  user: User;

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
