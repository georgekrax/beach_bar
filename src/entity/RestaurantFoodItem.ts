import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { BeachBarRestaurant } from "./BeachBarRestaurant";
import { RestaurantMenuCategory } from "./RestaurantMenuCategory";

@Entity({ name: "restaurant_food_item", schema: "public" })
export class RestaurantFoodItem extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 255, name: "name" })
  name: string;

  @Column({ type: "decimal", precision: 7, scale: 2, name: "price" })
  price: number;

  @Column({ type: "text", name: "img_url", nullable: true })
  imgUrl: string;

  @Column({ type: "integer", name: "menu_category_id" })
  menuCategoryId: number;

  @Column({ type: "integer", name: "restaurant_id" })
  restaurantId: number;

  @ManyToOne(() => BeachBarRestaurant, beachBarRestaurant => beachBarRestaurant.foodItems, {
    nullable: false,
    cascade: ["soft-remove", "recover"],
  })
  @JoinColumn({ name: "restaurant_id" })
  restaurant: BeachBarRestaurant;

  @ManyToOne(() => RestaurantMenuCategory, restaurantMenuCategory => restaurantMenuCategory.foodItems, {
    nullable: false,
  })
  @JoinColumn({ name: "menu_category_id" })
  menuCategory: RestaurantMenuCategory;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async softRemove(): Promise<any> {
    await softRemove(RestaurantFoodItem, { id: this.id });
  }
}
