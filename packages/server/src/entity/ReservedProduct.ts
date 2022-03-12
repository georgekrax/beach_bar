import { getRedisKey } from "@/utils/db";
import { softRemove } from "@/utils/softRemove";
import { Dayjs } from "dayjs";
import { Redis } from "ioredis";
import {
  AfterInsert,
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
import { redis } from "../index";
import { Payment } from "./Payment";
import { Product } from "./Product";
import { HourTime } from "./Time";

@Entity({ name: "reserved_product", schema: "public" })
export class ReservedProduct extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "product_id" })
  productId: number;

  @Column({ type: "bigint", name: "payment_id" })
  paymentId: bigint;

  @Column({ type: "date", name: "date" })
  date: Dayjs;

  @Column({ type: "integer", name: "start_time_id" })
  startTimeId: number;

  @Column({ type: "integer", name: "end_time_id" })
  endTimeId: number;

  @Column({ type: "boolean", name: "is_refunded", default: () => false })
  isRefunded: boolean;

  @ManyToOne(() => Product, product => product.reservedProducts, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Payment, payment => payment.reservedProducts, { nullable: false })
  @JoinColumn({ name: "payment_id" })
  payment: Payment;

  @ManyToOne(() => HourTime, hourTime => hourTime.reservedProductStartTimes, { nullable: false })
  @JoinColumn({ name: "start_time_id" })
  startTime: HourTime;

  @ManyToOne(() => HourTime, hourTime => hourTime.reservedProductEndTimes, { nullable: false })
  @JoinColumn({ name: "end_time_id" })
  endTime: HourTime;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @AfterInsert() // Done
  async updateAlsoInRedis(): Promise<void | any> {
    try {
      await this.updateRedis(redis, true);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  getRedisKey(): string {
    return getRedisKey({ model: "ReservedProduct", beachBarId: this.product.beachBarId });
  }

  async getPrice(): Promise<number | undefined> {
    const entryFee = this.product.beachBar.entryFee;
    if (entryFee === undefined) return undefined;

    const productTotal = await this.payment.cart.getProductTotal(this.productId);
    if (productTotal === undefined) return undefined;
    return productTotal + entryFee;
  }

  async getRedisIdx(redis: Redis): Promise<number> {
    const reservedProducts = await redis.lrange(this.getRedisKey(), 0, -1);
    const idx = reservedProducts.findIndex((x: string) => JSON.parse(x).id === this.id);
    return idx;
  }

  async updateRedis(redis: Redis, create = false): Promise<void | any> {
    try {
      const reservedProduct = await ReservedProduct.findOne({
        where: { id: this.id },
        relations: ["product", "product.beachBar", "product.category", "product.components", "time", "payment"],
      });
      if (!reservedProduct) throw new Error();
      if (create) await redis.lpush(this.getRedisKey(), JSON.stringify(this));
      else {
        const idx = await reservedProduct.getRedisIdx(redis);
        await redis.lset(reservedProduct.getRedisKey(), idx, JSON.stringify(reservedProduct));
      }
      await reservedProduct.product.beachBar.updateRedis();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async customSoftRemove(redis: Redis, daysDiff: boolean): Promise<any> {
    if (daysDiff) {
      this.isRefunded = true;
      await this.save();
    }

    // delete in Redis too
    try {
      const idx = await this.getRedisIdx(redis);
      await redis.lset(this.getRedisKey(), idx, "");
      await redis.lrem(this.getRedisKey(), 0, "");
    } catch (err) {
      throw new Error(err.message);
    }

    await softRemove(ReservedProduct, { id: this.id });
    // update #beach_bar Redis cache
    await this.product.beachBar.updateRedis();
  }
}
