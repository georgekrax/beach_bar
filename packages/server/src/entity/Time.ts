import { BaseEntity, Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartProduct } from "./CartProduct";
import { ProductReservationLimit } from "./ProductReservationLimit";
import { ReservedProduct } from "./ReservedProduct";
import { BeachBarReview } from "./BeachBarReview";

@Entity({ name: "hour_time", schema: "public" })
@Check(`length("value") = 8`)
@Check(`length("utcValue") = 9`)
export class HourTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "time without time zone", scale: 0, name: "value" })
  value: string;

  @Column("varchar", { length: 9, name: "utc_value" })
  utcValue: string;

  @OneToMany(() => ProductReservationLimit, productReservationLimit => productReservationLimit.startTime, { nullable: true })
  reservationLimitStartTimes?: ProductReservationLimit[];

  @OneToMany(() => ProductReservationLimit, productReservationLimit => productReservationLimit.endTime, { nullable: true })
  reservationLimitEndTimes?: ProductReservationLimit[];

  @OneToMany(() => CartProduct, cartProduct => cartProduct.time, { nullable: true })
  cartProductTimes?: CartProduct[];

  @OneToMany(() => ReservedProduct, reservedProduct => reservedProduct.time, { nullable: true })
  reservedProductTimes?: ReservedProduct[];
}

@Entity({ name: "month_time", schema: "public" })
export class MonthTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 9, name: "utc_value", unique: true })
  value: string;

  @Column({ type: "integer", name: "days" })
  days: number;

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.monthTime, { nullable: true })
  reviews?: BeachBarReview[];
}