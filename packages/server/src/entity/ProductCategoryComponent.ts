import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ProductCategory } from "./ProductCategory";
import { ProductComponent } from "./ProductComponent";

@Entity({ name: "product_category_component", schema: "public" })
export class ProductCategoryComponent extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "category_id" })
  categoryId: ProductCategory["id"];

  @PrimaryColumn({ type: "integer", name: "component_id" })
  componentId: ProductComponent["id"];

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: boolean;

  @ManyToOne(() => ProductCategory, category => category.components)
  @JoinColumn({ name: "category_id" })
  category: ProductCategory;

  @ManyToOne(() => ProductComponent, component => component.categories)
  @JoinColumn({ name: "component_id" })
  component: ProductComponent;
}
