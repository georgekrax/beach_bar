import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { CartFood } from "./CartFood";
import { FoodCategory } from "./FoodCategory";

@Entity({ name: "food", schema: "public" })
export class Food extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 255, name: "name" })
  name: string;

  @Column({ type: "smallint", name: "category_id" })
  categoryId: number;
  
  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;
  
  @Column("text", { name: "ingredients", nullable: true })
  ingredients?: string;

  @Column({ type: "decimal", precision: 5, scale: 2, name: "price" })
  price: number;

  @Column({ type: "smallint", name: "max_quantity", default: () => 9 })
  maxQuantity: number;

  @ManyToOne(() => FoodCategory, category => category.foods)
  @JoinColumn({ name: "category_id" })
  category: FoodCategory;

  @ManyToOne(() => BeachBar, beachBar => beachBar.foods, { nullable: false })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @OneToMany(() => CartFood, cart => cart.food)
  carts?: CartFood[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;
}
