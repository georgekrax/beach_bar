import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { Payment } from "./Payment";
import { Product } from "./Product";
import { HourTime } from "./HourTime";

@Entity({ name: "reserved_product", schema: "public" })
export class ReservedProduct extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "product_id" })
  productId: number;

  @Column({ type: "bigint", name: "payment_id" })
  paymentId: bigint;

  @Column({ type: "date", name: "date" })
  date: Date;

  @Column({ type: "integer", name: "time_id" })
  timeId: number;

  @Column({ type: "boolean", name: "is_refunded", default: () => false })
  isRefunded: boolean;

  @ManyToOne(() => Product, product => product.reservedProducts, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Payment, payment => payment.reservedProducts, { nullable: false })
  @JoinColumn({ name: "payment_id" })
  payment: Payment;

  @ManyToOne(() => HourTime, hourTime => hourTime.reservedProductTimes, { nullable: false })
  @JoinColumn({ name: "time_id" })
  time: HourTime;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async softRemove(): Promise<any> {
    await softRemove(ReservedProduct, { id: this.id });
  }
}
