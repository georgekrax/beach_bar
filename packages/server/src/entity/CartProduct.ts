import { COMMON_CONFIG } from "@beach_bar/common";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Check,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "utils/softRemove";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { HourTime } from "./Time";

@Entity({ name: "cart_product", schema: "public" })
@Check(`"quantity" >= ${COMMON_CONFIG.DATA.cartProductQuantity.min} AND "quantity" <= ${COMMON_CONFIG.DATA.cartProductQuantity.max}`)
export class CartProduct extends BaseEntity {
  @PrimaryColumn({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @PrimaryColumn({ type: "integer", name: "product_id" })
  productId: number;

  @PrimaryColumn({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @PrimaryColumn({ type: "date", name: "date", default: () => `CURRENT_DATE` })
  date: Dayjs;

  @PrimaryColumn({ type: "integer", name: "time_id" })
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
