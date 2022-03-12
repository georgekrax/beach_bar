import { softRemove } from "@/utils/softRemove";
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
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { HourTime } from "./Time";

@Entity({ name: "cart_product", schema: "public" })
@Check(`"quantity" >= ${COMMON_CONFIG.DATA.cartProductQuantity.min} AND "quantity" <= ${COMMON_CONFIG.DATA.cartProductQuantity.max}`)
export class CartProduct extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @PrimaryColumn({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @PrimaryColumn({ type: "integer", name: "product_id" })
  productId: number;

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @Column({ type: "date", name: "date", default: () => `CURRENT_DATE` })
  date: Dayjs;

  @Column({ type: "integer", name: "start_time_id" })
  startTimeId: number;

  @Column({ type: "integer", name: "end_time_id" })
  endTimeId: number;

  @Column({ type: "smallint", name: "people" })
  people: number;

  @ManyToOne(() => Cart, cart => cart.products, { nullable: false })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Product, product => product.carts, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => HourTime, hourTime => hourTime.cartProductStartTimes, { nullable: false })
  @JoinColumn({ name: "start_time_id" })
  startTime: HourTime;

  @ManyToOne(() => HourTime, hourTime => hourTime.cartProductEndTimes, { nullable: false })
  @JoinColumn({ name: "end_time_id" })
  endTime: HourTime;

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
