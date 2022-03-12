import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { Payment } from "./Payment";

@Entity({ name: "app_transaction", schema: "public" })
export class AppTransaction extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "bigint", name: "payment_id" })
  paymentId: number;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "decimal", precision: 12, scale: 2, name: "net" })
  net: number;

  @Column({ type: "decimal", precision: 12, scale: 2, name: "app_fee" })
  appFee: number;

  @Column({ type: "decimal", precision: 12, scale: 2, name: "stripe_proccessing_fee" })
  stripeProccessingFee: number;

  @ManyToOne(() => Payment, payment => payment.appTransactions)
  @JoinColumn({ name: "payment_id" })
  payment: Payment;

  @ManyToOne(() => BeachBar, beachBar => beachBar.appTransactions)
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  // @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  // deletedAt?: Dayjs;

  // async softRemove(): Promise<any> {
  //   const findOptions: any = { accountId: this.id };
  //   await softRemove(Account, { id: this.id }, [], findOptions);
  // }
}
