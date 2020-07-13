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
  UpdateDateColumn
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { BeachBar } from "./BeachBar";
import { RestaurantFoodItem } from "./RestaurantFoodItem";

@Entity({ name: "beach_bar_restaurant", schema: "public" })
export class BeachBarRestaurant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "name" })
  name: string;

  @Column({ type: "text", name: "description", nullable: true })
  description: string;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @ManyToOne(() => BeachBar, beachBar => beachBar.restaurants, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @OneToMany(() => RestaurantFoodItem, restaurantFoodItem => restaurantFoodItem.restaurant)
  foodItems: RestaurantFoodItem[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async update(name?: string, description?: string, isActive?: boolean): Promise<BeachBarRestaurant | any> {
    try {
      if (name && name !== this.name && name.trim().length !== 0) {
        this.name = name;
      }
      if (description && description !== this.description && description.trim().length !== 0) {
        this.description = description;
      }
      if (isActive !== null && isActive !== undefined && isActive !== this.isActive) {
        this.isActive = isActive;
      }
      await this.save();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    const findOptions: any = { restaurantId: this.id };
    await softRemove(BeachBarRestaurant, { id: this.id }, [RestaurantFoodItem], findOptions);
  }
}
