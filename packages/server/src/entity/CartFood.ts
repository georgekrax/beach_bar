import { softRemove } from "@/utils/softRemove";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Food } from "./Food";

@Entity({ name: "cart_food", schema: "public" })
@Check(`"quantity" > 0`)
export class CartFood extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @PrimaryColumn({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @PrimaryColumn({ type: "bigint", name: "food_id" })
  foodId: bigint;

  @Column({ type: "date", name: "date", default: () => `CURRENT_DATE` })
  date: Dayjs;

  @ManyToOne(() => Cart, cart => cart.foods)
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Food, food => food.carts)
  @JoinColumn({ name: "food_id" })
  food: Food;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async softRemove(): Promise<any> {
    await softRemove(CartFood, { cartId: this.cartId, foodId: this.foodId });
  }
}
