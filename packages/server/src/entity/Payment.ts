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
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { Card } from "./Card";
import { Cart } from "./Cart";
import { PaymentStatus } from "./PaymentStatus";
import { ReservedProduct } from "./ReservedProduct";

@Entity({ name: "payment", schema: "public" })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @Column({ type: "bigint", name: "card_id" })
  cardId: bigint;

  @Column("varchar", { length: 10, name: "ref_code", unique: true })
  refCode: string;

  @Column({ type: "integer", name: "status_id", default: () => 1 })
  statusId: number;

  @Column("varchar", { length: 255, name: "stripe_checkout_id" })
  stripeCheckoutId: string;

  @ManyToOne(() => Cart, cart => cart.payments, { nullable: false })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Card, card => card.payments, { nullable: false })
  @JoinColumn({ name: "card_id" })
  card: Card;

  @ManyToOne(() => PaymentStatus, paymentStatus => paymentStatus.payments, { nullable: false })
  @JoinColumn({ name: "status_id" })
  status: PaymentStatus;

  @OneToMany(() => ReservedProduct, reservedProduct => reservedProduct.payment, { nullable: true })
  reservedProducts?: ReservedProduct[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async softRemove(): Promise<any> {
    await softRemove(Cart, { id: this.id }, [ReservedProduct], { paymentId: this.id });
  }
}
