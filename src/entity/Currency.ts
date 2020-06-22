import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./Country";
import { Product } from "./Product";

@Entity({ name: "currency", schema: "public" })
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 3, name: "iso_code", unique: true })
  isoCode: string;

  @Column("varchar", { length: 10, name: "symbol", unique: true })
  symbol: string;

  @Column("varchar", { length: 10, name: "second_symbol", nullable: true })
  secondSymbol: string;

  @OneToMany(() => Country, country => country.currency, { nullable: true })
  countries?: Country[];

  @OneToMany(() => Product, product => product.currency, { nullable: true })
  products?: Product[];
}
