import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { ProductComponent } from "./ProductComponent";

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

  @ManyToMany(() => ProductComponent, productComponent => productComponent.productCategories, { nullable: false })
  @JoinTable({
    name: "product_category_component",
    joinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "component_id",
      referencedColumnName: "id",
    },
  })
  productComponents: ProductComponent[];

  @OneToMany(() => Product, product => product.category)
  products?: Product[];
}
