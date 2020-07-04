import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Check, OneToMany } from "typeorm";
import { ProductReservationLimit } from "./ProductReservationLimit";
import { CartProduct } from "./CartProduct";
import { ReservedProduct } from "./ReservedProduct";

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
