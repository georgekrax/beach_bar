import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Owner } from "./Owner";
import { Product } from "./Product";
import { Dayjs } from "dayjs";

@Entity({ name: "product_price_history", schema: "public" })
export class ProductPriceHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "product_id" })
  productId: number;

  @Column({ type: "integer", name: "owner_id" })
  ownerId: number;

  @Column({ type: "decimal", precision: 5, scale: 2, name: "diff_amount" })
  diffAmount: number;

  @Column({ type: "decimal", precision: 5, scale: 2, name: "new_price" })
  newPrice: number;

  @ManyToOne(() => Product, product => product.priceHistory, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Owner, owner => owner.priceHistory, { nullable: false })
  @JoinColumn({ name: "owner_id" })
  owner: Owner;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;
}
