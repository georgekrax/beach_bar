import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { ProductCategoryComponent } from "./ProductCategoryComponent";

@Entity({ name: "product_category", schema: "public" })
export class ProductCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 50, name: "underscored_name", unique: true })
  underscoredName: string;

  @Column({ type: "boolean", name: "zero_price" })
  zeroPrice: boolean;

  @Column({ type: "boolean", name: "whitelist" })
  whitelist: boolean;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @OneToMany(() => ProductCategoryComponent, productCategory => productCategory.category)
  components: ProductCategoryComponent[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
