import dayjs, { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  getManager,
  getRepository,
  JoinColumn,




  ManyToMany, ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { dayjsFormat } from "../constants/dayjs";
import { softRemove } from "../utils/softRemove";
import { BeachBar } from "./BeachBar";
import { BundleProductComponent } from "./BundleProductComponent";
import { CartProduct } from "./CartProduct";
import { ProductCategory } from "./ProductCategory";
import { ProductCouponCode } from "./ProductCouponCode";
import { ProductPriceHistory } from "./ProductPriceHistory";
import { ProductReservationLimit } from "./ProductReservationLimit";
import { ProductVoucherCampaign } from "./ProductVoucherCampaign";
import { ReservedProduct } from "./ReservedProduct";

@Entity({ name: "product", schema: "public" })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 120, name: "name" })
  name: string;

  @Column({ type: "integer", name: "category_id" })
  categoryId: number;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  price: number;

  @Column({ type: "integer", name: "max_people" })
  maxPeople: number;

  @Column({ type: "boolean", name: "is_active", default: () => true })
  isActive: boolean;

  @Column({ type: "boolean", name: "is_individual" })
  isIndividual: boolean;

  @ManyToOne(() => BeachBar, beachBar => beachBar.products, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => ProductCategory, productCategory => productCategory.products, { nullable: false })
  @JoinColumn({ name: "category_id" })
  category: ProductCategory;

  @OneToMany(() => BundleProductComponent, bundleProductComponent => bundleProductComponent.product)
  components: BundleProductComponent[];

  @OneToMany(() => ProductPriceHistory, productPriceHistory => productPriceHistory.product, { nullable: true })
  priceHistory?: ProductPriceHistory[];

  @OneToMany(() => CartProduct, cartProduct => cartProduct.product, { nullable: true })
  carts?: CartProduct[];

  @OneToMany(() => ProductReservationLimit, productReservationLimit => productReservationLimit.product, { nullable: true })
  reservationLimits?: ProductReservationLimit[];

  @OneToMany(() => ReservedProduct, reservedProduct => reservedProduct.product, { nullable: true })
  reservedProducts?: ReservedProduct[];

  @ManyToMany(() => ProductCouponCode, productCouponCode => productCouponCode.products, { nullable: true })
  coupons?: ProductCouponCode[];

  @ManyToMany(() => ProductVoucherCampaign, productCouponCode => productCouponCode.products, { nullable: true })
  voucherCampaigns?: ProductCouponCode[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @Column({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async getReservationLimit(timeId: number, date?: Date | Dayjs): Promise<number | undefined> {
    const formattedDate = date ? dayjs(date).format(dayjsFormat.ISO_STRING) : dayjs().format(dayjsFormat.ISO_STRING);
    const reservationLimit = await ProductReservationLimit.find({ product: this, date: formattedDate });
    if (reservationLimit) {
      const limitNumber = reservationLimit.find(limit => timeId >= limit.startTimeId && timeId <= limit.endTimeId);
      if (limitNumber) {
        return limitNumber.limitNumber;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  async getReservedProducts(timeId: number, date?: Date | Dayjs): Promise<number | undefined> {
    const reservedProductsNumber = await getManager()
      .createQueryBuilder(ReservedProduct, "reservedProduct")
      .select("COUNT(*)", "count")
      .where("reservedProduct.date = :date", { date: date ? date : dayjs() })
      .andWhere("reservedProduct.timeId = :timeId", { timeId })
      .getRawOne();

    if (reservedProductsNumber) {
      return parseInt(reservedProductsNumber.count);
    } else {
      return undefined;
    }
  }

  async checkIfAvailable(timeId: number, date?: Date | Dayjs, elevator = 0): Promise<boolean | undefined> {
    const limit = await this.getReservationLimit(timeId, date);
    const reservedProductsNumber = await this.getReservedProducts(timeId, date);
    if (limit && reservedProductsNumber && reservedProductsNumber + elevator >= limit) {
      return false;
    } else {
      return true;
    }
  }

  async createProductComponents(update: boolean): Promise<void> {
    if (update) {
      const bundleProducts = await BundleProductComponent.find({ product: this });
      await getRepository(BundleProductComponent).softRemove(bundleProducts);
    }

    this.category.productComponents.forEach(async productComponent => {
      await BundleProductComponent.create({ product: this, component: productComponent, deletedAt: undefined }).save();
    });
  }

  async softRemove(): Promise<any> {
    const findOptions: any = { productId: this.id };
    await softRemove(
      Product,
      { id: this.id, name: this.name, beachBarId: this.beachBarId },
      [BundleProductComponent, CartProduct, ProductCouponCode, ProductCouponCode, ReservedProduct, ProductReservationLimit],
      findOptions,
    );
  }
}
