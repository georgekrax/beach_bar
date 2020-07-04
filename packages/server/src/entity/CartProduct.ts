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
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { HourTime } from "./HourTime";

@Entity({ name: "cart_product", schema: "public" })
@Check(`"quantity" >= 0 AND "quantity" <= 20`)
export class CartProduct extends BaseEntity {
  @PrimaryColumn({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @PrimaryColumn({ type: "integer", name: "product_id" })
  productId: number;

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @Column({ type: "date", name: "date", default: () => `CURRENT_DATE` })
  date: Date;

  @Column({ type: "integer", name: "time_id" })
  timeId: number;

  @ManyToOne(() => Cart, cart => cart.products, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Product, product => product.carts, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => HourTime, hourTime => hourTime.cartProductTimes, { nullable: false })
  @JoinColumn({ name: "time_id" })
  time: HourTime;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async softRemove(): Promise<any> {
    await softRemove(CartProduct, { cartId: this.cartId, productId: this.productId });
  }
}
