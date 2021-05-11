<<<<<<< HEAD
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BeachBarService } from "./BeachBarService";
import { ProductComponent } from "./ProductComponent";

@Entity({ name: "icon", schema: "public" })
export class Icon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50, name: "name", unique: true })
  name: string;

  @Column("char", { length: 3, name: "public_id", unique: true })
  publicId: string;

  @OneToOne(() => BeachBarService, service => service.icon, { nullable: true })
  service?: BeachBarService;

  @OneToOne(() => ProductComponent, component => component.icon, { nullable: true })
  component?: ProductComponent;
}
=======
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BeachBarService } from "./BeachBarService";
import { ProductComponent } from "./ProductComponent";

@Entity({ name: "icon", schema: "public" })
export class Icon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50, name: "name", unique: true })
  name: string;

  @Column("char", { length: 3, name: "public_id", unique: true })
  publicId: string;

  @OneToOne(() => BeachBarService, service => service.icon, { nullable: true })
  service?: BeachBarService;

  @OneToOne(() => ProductComponent, component => component.icon, { nullable: true })
  component?: ProductComponent;
}
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
