import dayjs, { Dayjs } from "dayjs";
import {
  AfterInsert,
  AfterUpdate,
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
import { dayjsFormat } from "../../../common/build";
import { redis } from "./../index";
import { Product } from "./Product";
import { HourTime } from "./Time";

@Entity({ name: "product_reservation_limit", schema: "public" })
@Check(`"limitNumber" > 0`)
@Check(`"endTime" >= "startTime"`)
export class ProductReservationLimit extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "limit_number" })
  limitNumber: number;

  @Column({ type: "integer", name: "product_id" })
  productId: number;

  @Column({ type: "date", name: "date" })
  date: string;

  @Column({ type: "integer", name: "start_time_id" })
  startTimeId: number;

  @Column({ type: "integer", name: "end_time_id" })
  endTimeId: number;

  @ManyToOne(() => Product, product => product.reservationLimits, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => HourTime, hourTime => hourTime.reservationLimitStartTimes, { nullable: false })
  @JoinColumn({ name: "start_time_id" })
  startTime: HourTime;

  @ManyToOne(() => HourTime, hourTime => hourTime.reservationLimitEndTimes, { nullable: false })
  @JoinColumn({ name: "end_time_id" })
  endTime: HourTime;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @AfterUpdate()
  @AfterInsert()
  async setInRedis() {
    const { product, limitNumber, date, startTimeId, endTimeId } = this;
    for (let i = startTimeId; startTimeId <= endTimeId; i++) {
      const redisKey = `available_products:${product.id}:${dayjs(date).format(dayjsFormat.ISO_STRING)}:${i}`;
      const existingAvailable = await redis.get(redisKey);
      await redis.set(redisKey, limitNumber - (existingAvailable ? parseInt(existingAvailable) : 0));
    }
  }

  async update(limit?: number, startTimeId?: number, endTimeId?: number): Promise<ProductReservationLimit | any> {
    try {
      if (startTimeId && this.startTimeId !== startTimeId && startTimeId > 0) {
        const startTime = await HourTime.findOne(startTimeId);
        if (!startTime) throw new Error("Invalid start time of the limit");
        this.startTime = startTime;
      }
      if (endTimeId && this.endTimeId !== endTimeId && endTimeId > 0) {
        const endTime = await HourTime.findOne(endTimeId);
        if (!endTime) throw new Error("Invalid end time of the limit");
        this.endTime = endTime;
      }
      if (limit && limit !== this.limitNumber && limit > 0) this.limitNumber = limit;
      await this.save();
      await this.product.beachBar.updateRedis();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    await softRemove(ProductReservationLimit, { id: this.id });
    await this.product.beachBar.updateRedis();
  }
}
