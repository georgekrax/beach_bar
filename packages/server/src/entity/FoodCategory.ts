import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Food } from "./Food";
import { Icon } from "./Icon";

@Entity({ name: "food_category", schema: "public" })
export class FoodCategory extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "smallint" })
  id: number;

  @Column("varchar", { length: 50, name: "name", unique: true })
  name: string;

  @Column({ type: "smallint", name: "icon_id", unique: true })
  iconId: number;

  @OneToOne(() => Icon, icon => icon.foodCategory)
  @JoinColumn({ name: "icon_id" })
  icon: Icon;

  @OneToMany(() => Food, food => food.category)
  foods: Food[];
}
