import { Dayjs } from "dayjs";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Currency } from "./Currency";

@Entity({ name: "currency_product_price", schema: "public" })
export class CurrencyProductPrice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "currency_id", unique: true })
  currencyId: number;

  @Column({ type: "decimal", precision: 5, scale: 2, name: "price" })
  price: number;

  @OneToOne(() => Currency, currency => currency.productPrice, { nullable: false })
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;
}
