import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BeachBarRestaurant } from "./BeachBarRestaurant";
import { RestaurantMenuCategory } from "./RestaurantMenuCategory";

@Entity({ name: "restaurant_food_item", schema: "public" })
export class RestaurantFoodItem extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { length: 255, name: "name" })
  name: string;

  @Column({ type: "decimal", precision: 5, scale: 2, name: "price" })
  price: number;

  @Column({ type: "text", name: "img_url", nullable: true })
  imgUrl: string;

  @Column({ type: "integer", name: "menu_category_id" })
  menuCategoryId: number;

  @Column({ type: "integer", name: "restaurant_id" })
  restaurantId: number;

  @ManyToOne(() => BeachBarRestaurant, beachBarRestaurant => beachBarRestaurant.foodItems, { nullable: false })
  @JoinColumn({ name: "restaurant_id" })
  restaurant: BeachBarRestaurant;

  @ManyToOne(() => RestaurantMenuCategory, restaurantMenuCategory => restaurantMenuCategory.foodItems, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: "menu_category_id" })
  menuCategory: RestaurantMenuCategory;
}
