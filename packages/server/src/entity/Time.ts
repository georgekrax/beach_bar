import { BaseEntity, Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BeachBar } from "./BeachBar";
import { BeachBarReview } from "./BeachBarReview";
import { CartProduct } from "./CartProduct";
import { ProductReservationLimit } from "./ProductReservationLimit";
import { ReservedProduct } from "./ReservedProduct";

@Entity({ name: "hour_time", schema: "public" })
@Check(`length("value"::text) = 8`)
export class HourTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "time without time zone", scale: 0, name: "value" })
  value: string;

  @OneToMany(() => ProductReservationLimit, productReservationLimit => productReservationLimit.startTime, { nullable: true })
  reservationLimitStartTimes?: ProductReservationLimit[];

  @OneToMany(() => ProductReservationLimit, productReservationLimit => productReservationLimit.endTime, { nullable: true })
  reservationLimitEndTimes?: ProductReservationLimit[];

  @OneToMany(() => CartProduct, cartProduct => cartProduct.startTime, { nullable: true })
  cartProductStartTimes?: CartProduct[];

  @OneToMany(() => CartProduct, cartProduct => cartProduct.endTime, { nullable: true })
  cartProductEndTimes?: CartProduct[];

  @OneToMany(() => ReservedProduct, reservedProduct => reservedProduct.startTime, { nullable: true })
  reservedProductStartTimes?: ReservedProduct[];

  @OneToMany(() => ReservedProduct, reservedProduct => reservedProduct.endTime, { nullable: true })
  reservedProductEndTimes?: ReservedProduct[];

  @OneToMany(() => BeachBar, beachBar => beachBar.openingTime)
  beachBarsOpeningTime: BeachBar[];

  @OneToMany(() => BeachBar, beachBar => beachBar.closingTime)
  beachBarsClosingTime: BeachBar[];
}

@Entity({ name: "month_time", schema: "public" })
export class MonthTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 9, name: "value", unique: true })
  value: string;

  @Column({ type: "integer", name: "days" })
  days: number;

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.month)
  reviews: BeachBarReview[];
}

@Entity({ name: "quarter_time", schema: "public" })
@Check(`length("value"::text) = 8`)
export class QuarterTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "time without time zone", scale: 0, name: "value" })
  value: string;
}
