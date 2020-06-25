import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Product } from "./Product";
import { ProductComponent } from "./ProductComponent";

@Entity({ name: "bundle_product_component", schema: "public" })
export class BundleProductComponent extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "product_id" })
  productId: number;

  @PrimaryColumn({ type: "integer", name: "component_id" })
  componentId: number;

  @Column({ type: "smallint", name: "quantity", default: () => 1 })
  quantity: number;

  @ManyToOne(() => Product, product => product.components, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => ProductComponent, productComponent => productComponent.products, { nullable: false })
  @JoinColumn({ name: "component_id" })
  component: ProductComponent;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true, primary: true })
  deletedAt?: Date;
}
