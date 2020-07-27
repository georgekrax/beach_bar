import { softRemove } from "@utils/softRemove";
import { Dayjs } from "dayjs";
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
import { BeachBarRestaurant } from "./BeachBarRestaurant";
import { RestaurantMenuCategory } from "./RestaurantMenuCategory";
import { checkScopes } from "@utils/checkScopes";

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
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async update(
    payload: any,
    name?: string,
    price?: number,
    menuCategoryId?: number,
    imgUrl?: string
  ): Promise<RestaurantFoodItem | any> {
    try {
      if (name && name !== this.name && name.trim().length !== 0) {
        this.name = name;
      }
      if (price && price !== this.price && price >= 0) {
        if (checkScopes(payload, ["beach_bar@update:restaurant_food_item"])) {
          throw new Error("You are not allowed to modify the price of the food item product");
        }
        this.price = price;
      }
      if (menuCategoryId && menuCategoryId !== this.menuCategoryId && menuCategoryId >= 0) {
        const menuCategory = await RestaurantMenuCategory.findOne(menuCategoryId);
        if (!menuCategory) {
          throw new Error("Please provide a valid menu category");
        }
        this.menuCategory = menuCategory;
      }
      if (imgUrl && imgUrl !== this.imgUrl && imgUrl.trim().length !== 0) {
        this.imgUrl = imgUrl;
      }
      await this.save();
      await this.restaurant.beachBar.updateRedis();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    await softRemove(RestaurantFoodItem, { id: this.id });
    await this.restaurant.beachBar.updateRedis();
  }
}
