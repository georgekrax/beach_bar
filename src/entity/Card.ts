import {
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
import { softRemove } from "../utils/softRemove";
import { CardBrand } from "./CardBrand";
import { Country } from "./Country";
import { Customer } from "./Customer";

export enum cardType {
  physical = "physical",
  virtual = "virtual",
}

@Entity({ name: "card", schema: "public" })
@Check(`"expMonth" >= 0 AND "expMonth" <= 12`)
@Check(`length("expYear"::text) = 4`)
@Check(`length("last4") = 4`)
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "enum", name: "type", enum: cardType, enumName: "card_type", default: () => "physical" })
  type: string;

  @Column({ type: "integer", name: "brand_id", nullable: true })
  brandId?: number;

  @Column({ type: "integer", name: "country_id", nullable: true })
  countryId?: number;

  @Column({ type: "smallint", name: "exp_month", nullable: true })
  expMonth?: number;

  @Column({ type: "smallint", name: "exp_year", nullable: true })
  expYear?: number;

  @Column("varchar", { length: 4, name: "last_4" })
  last4: string;

  @Column("varchar", { length: 255, name: "cardholder_name", nullable: true })
  cardholderName?: string;

  @Column({ type: "boolean", name: "is_default", default: () => true })
  isDefault: boolean;

  @Column({ type: "bigint", name: "customer_id" })
  customerId: bigint;

  @Column("varchar", { length: 255, name: "stripe_id" })
  stripeId: string;

  @ManyToOne(() => CardBrand, cardBrand => cardBrand.cards, { nullable: true })
  @JoinColumn({ name: "brand_id" })
  brand?: CardBrand;

  @ManyToOne(() => Country, country => country.cards, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country?: Country;

  @ManyToOne(() => Customer, customer => customer.cards, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async softRemove(): Promise<any> {
    await softRemove(Card, { id: this.id });
  }
}
