import { softRemove } from "@/utils/softRemove";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { Cart } from "./Cart";

@Entity({ name: "cart_note", schema: "public" })
export class CartNote extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "text", name: "body" })
  body: string;

  @PrimaryColumn({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @PrimaryColumn({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @ManyToOne(() => Cart, cart => cart.notes)
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => BeachBar, beachBar => beachBar.cartNotes)
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  async softRemove(): Promise<any> {
    await softRemove(CartNote, { cartId: this.cartId, beachBarId: this.beachBarId });
  }
}
