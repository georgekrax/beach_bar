// import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Currency } from "./Currency";

// @Entity({ name: "stripe_fee", schema: "public" })
// export class StripeFee extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: "decimal", precision: 4, scale: 2, name: "percentage_value" })
//   percentageValue: number;

//   @Column({ type: "decimal", precision: 4, scale: 2, name: "pricing_fee" })
//   pricingFee: number;

//   @Column({ type: "boolean", name: "is_eu" })
//   isEu: boolean;

//   @Column({ type: "integer", name: "currency_id" })
//   currencyId: number;

//   @Column({ type: "text", name: "description", unique: true })
//   description: string;

//   @ManyToOne(() => Currency, currency => currency.stripeFees, { nullable: false })
//   @JoinColumn({ name: "currency_id" })
//   currency: Currency;
// }
