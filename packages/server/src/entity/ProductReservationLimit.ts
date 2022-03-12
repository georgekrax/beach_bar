import { genDatesArr } from "@/utils/data";
import { softRemove } from "@/utils/softRemove";
import { dayjsFormat, TABLES } from "@beach_bar/common";
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

  @Column({ type: "date", name: "from" })
  from: string;

  @Column({ type: "date", name: "to" })
  to: string;

  // @Column({ type: "date", name: "date" })
  // date: string;

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

  @AfterUpdate() // Done
  @AfterInsert() // Done
  async setInRedis(atDelete: boolean = false) {
    const {
      product: { id, beachBarId },
      limitNumber,
      from,
      to,
      startTimeId,
      endTimeId,
    } = this;
    for (const date of genDatesArr(dayjs(from), dayjs(to))) {
      for (let i = startTimeId; i <= endTimeId; i++) {
        const redisKey = `available_products:${dayjs(date).format(dayjsFormat.ISO_STRING)}:${i
          .toString()
          .padStart(2, "0")
          .padEnd(4, "0")}`;
        const fieldKey = `beach_bar:${beachBarId}:product:${id}`;
        if (atDelete) {
          await redis.hdel(redisKey, fieldKey);
        } else {
          const existingAvailable = await redis.hget(redisKey, fieldKey);
          await redis.hset(redisKey, fieldKey, limitNumber - (existingAvailable ? +existingAvailable : 0));
        }
      }
    }
  }

  async update(limit?: number, startTimeId?: number, endTimeId?: number): Promise<ProductReservationLimit | any> {
    try {
      if (startTimeId && this.startTimeId !== startTimeId && startTimeId > 0) {
        const startTime = TABLES.HOUR_TIME.find(({ id }) => id === startTimeId);
        if (!startTime) throw new Error("Invalid start time of the limit.");
        this.startTime = startTime as any;
      }
      if (endTimeId && this.endTimeId !== endTimeId && endTimeId > 0) {
        const endTime = TABLES.HOUR_TIME.find(({ id }) => id === endTimeId);
        if (!endTime) throw new Error("Invalid end time of the limit.");
        this.endTime = endTime as any;
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
    await this.setInRedis(true);
    await softRemove(ProductReservationLimit, { id: this.id });
    await this.product.beachBar.updateRedis();
  }
}
