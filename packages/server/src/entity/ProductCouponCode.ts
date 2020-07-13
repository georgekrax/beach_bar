import { generateID } from "@beach_bar/common";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  getConnection,
  In,
  IsNull,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { Product } from "./Product";

@Entity({ name: "product_coupon_code", schema: "public" })
export class ProductCouponCode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "title" })
  title: string;

  @Column("varchar", { length: 18, name: "ref_code", unique: true })
  refCode: string;

  @Column({ type: "decimal", precision: 3, scale: 0, name: "discount_percentage" })
  discountPercentage: number;

  @Column({ type: "boolean", name: "beach_bar_offer" })
  beachBarOffer: boolean;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @Column({ type: "timestamptz", name: "valid_until", nullable: true })
  validUntil?: Dayjs;

  @ManyToMany(() => Product, product => product.coupons, { nullable: false })
  @JoinTable({
    name: "coupon_code_offer_product",
    joinColumn: {
      name: "coupon_code_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @Column({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @BeforeInsert()
  generateRefCode(): void {
    const column = getConnection()
      .getMetadata(ProductCouponCode)
      .columns.find(column => (column.propertyName = "refCode"));
    if (column) {
      this.refCode = generateID(parseInt(column.length));
    }
  }

  async update(
    productIds: number[],
    title?: string,
    discountPercentage?: number,
    beachBarOffer?: boolean,
    validUntil?: Dayjs,
    isActive?: boolean,
  ): Promise<ProductCouponCode[] | any> {
    try {
      if (productIds && productIds.length >= 1) {
        const products = await Product.find({ where: { id: In(productIds), deletedAt: IsNull() } });
        if (products.some(product => !product.isActive)) {
          throw new Error("All the products should be active, in order to be applied for a coupon code");
        }
        this.products = products;
      }
      if (title && title !== this.title) {
        this.title = title;
      }
      if (discountPercentage && discountPercentage !== this.discountPercentage) {
        this.discountPercentage = discountPercentage;
      }
      if (beachBarOffer !== null && beachBarOffer !== undefined && beachBarOffer !== this.beachBarOffer) {
        this.beachBarOffer = beachBarOffer;
      }
      if (validUntil && validUntil !== this.validUntil) {
        this.validUntil = validUntil;
      }
      if (isActive !== null && isActive !== undefined && isActive !== this.isActive) {
        this.isActive = isActive;
      }
      await this.save();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  calculateTotalDiscountAmount(): number | undefined {
    if (this.products) {
      const total = this.calculateTotalProductPrice();
      if (!total) {
        return undefined;
      }
      const diffAmount = (total * parseFloat(this.discountPercentage.toFixed(2))) / 100;
      return total - diffAmount;
    }
    return undefined;
  }

  calculateTotalProductPrice(): number | undefined {
    if (this.products) {
      return this.products.reduce((sum, i) => {
        return parseFloat(sum.toString()) + parseFloat(i.price.toString());
      }, 0);
    }
    return undefined;
  }

  async softRemove(): Promise<any> {
    await softRemove(ProductCouponCode, { id: this.id });
  }
}
