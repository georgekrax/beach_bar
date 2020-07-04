import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { RestaurantFoodItem } from "./RestaurantFoodItem";

@Entity({ name: "restaurant_menu_category", schema: "public" })
export class RestaurantMenuCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "name" })
  name: string;

  @OneToMany(() => RestaurantFoodItem, restaurantFoodItem => restaurantFoodItem.menuCategory)
  foodItems: RestaurantFoodItem[];
}
