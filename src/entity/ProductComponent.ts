import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BundleProductComponent } from "./BundleProductComponent";
import { ProductCategory } from "./ProductCategory";

@Entity({ name: "product_component", schema: "public" })
export class ProductComponent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50, name: "title", unique: true })
  title: string;

  @Column({ type: "text", name: "description" })
  description: string;

  @Column({ type: "text", name: "icon_url" })
  iconUrl: string;

  @OneToMany(() => BundleProductComponent, bundleProductComponent => bundleProductComponent.component)
  products: BundleProductComponent[];

  @ManyToMany(() => ProductCategory, productCategory => productCategory.productComponents)
  productCategories: ProductCategory[];
}
