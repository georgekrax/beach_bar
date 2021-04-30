import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Icon } from "./Icon";
import { ProductCategoryComponent } from "./ProductCategoryComponent";

@Entity({ name: "product_component", schema: "public" })
export class ProductComponent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50, name: "name", unique: true })
  name: string;

  @Column({ type: "integer", name: "icon_id", unique: true })
  iconId: number;

  @OneToOne(() => Icon, icon => icon.component, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "icon_id" })
  icon: Icon;

  // @OneToMany(() => BundleProductComponent, bundleProductComponent => bundleProductComponent.component)
  // products: BundleProductComponent[];

  @OneToMany(() => ProductCategoryComponent, productCategory => productCategory.component)
  categories: ProductCategoryComponent[];
}
