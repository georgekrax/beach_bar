import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity({ name: "cart_product", schema: "public" })
export class CartProduct extends BaseEntity {
  @PrimaryColumn({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @PrimaryColumn({ type: "integer", name: "product_id" })
  productId: number;

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @ManyToOne(() => Cart, cart => cart.products, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Product, product => product.carts, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;
}
