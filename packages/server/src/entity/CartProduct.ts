import { COMMON_CONFIG } from "@beach_bar/common";
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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "utils/softRemove";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { HourTime } from "./Time";

@Entity({ name: "cart_product", schema: "public" })
@Check(`"quantity" >= ${COMMON_CONFIG.DATA.cartProductQuantity.min} AND "quantity" <= ${COMMON_CONFIG.DATA.cartProductQuantity.max}`)
export class CartProduct extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @Column({ type: "integer", name: "product_id" })
  productId: number;

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @Column({ type: "date", name: "date", default: () => `CURRENT_DATE` })
  date: Dayjs;

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
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async softRemove(): Promise<any> {
    await softRemove(CartProduct, { cartId: this.cartId, productId: this.productId });
  }
}
