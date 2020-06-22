import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./Card";

@Entity({ name: "card_brand", schema: "public" })
export class CardBrand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 35, name: "name", unique: true })
  name: string;

  @OneToMany(() => Card, card => card.brand, { nullable: true })
  cards?: Card[];
}
