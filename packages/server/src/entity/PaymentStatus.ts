import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "./Payment";

@Entity({ name: "payment_status", schema: "public" })
export class PaymentStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 25, name: "name", unique: true })
  name: string;

  @OneToMany(() => Payment, payment => payment.status, { nullable: true })
  payments?: Payment[];
}
