import { dayjsFormat } from "@beach_bar/common";
import dayjs, { Dayjs } from "dayjs";
import {
  BaseEntity,
  Between,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  getManager,
  getRepository,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductAvailabilityHourReturnType } from "typings/beach_bar/product";
import { checkMinimumProductPrice } from "utils/beach_bar/checkMinimumProductPrice";
import { checkScopes } from "utils/checkScopes";
import { softRemove } from "utils/softRemove";
import { BeachBar } from "./BeachBar";
import { BundleProductComponent } from "./BundleProductComponent";
import { CartProduct } from "./CartProduct";
import { OfferCampaign } from "./OfferCampaign";
import { Owner } from "./Owner";
import { ProductCategory } from "./ProductCategory";
import { ProductPriceHistory } from "./ProductPriceHistory";
import { ProductReservationLimit } from "./ProductReservationLimit";
import { ReservedProduct } from "./ReservedProduct";
import { HourTime } from "./Time";

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

  @Column({ type: "text", name: "img_url", nullable: true })
  imgUrl?: string;

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

  @ManyToMany(() => OfferCampaign, offerCampaign => offerCampaign.products, { nullable: true })
  offerCampaigns?: OfferCampaign[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async getReservationLimit(timeId: number, date: Dayjs = dayjs()): Promise<number> {
    const formattedDate = dayjs(date).format(dayjsFormat.ISO_STRING);
    const reservationLimit = await ProductReservationLimit.find({ product: this, date: formattedDate });
    if (reservationLimit.length > 0) {
      const limitNumber = reservationLimit.find(limit => timeId >= limit.startTimeId && timeId <= limit.endTimeId);
      if (limitNumber) {
        return limitNumber.limitNumber;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  async getReservedProducts(timeId: number, date: Dayjs = dayjs()): Promise<number> {
    const reservedProductsNumber = await getManager()
      .createQueryBuilder(ReservedProduct, "reservedProduct")
      .select("COUNT(*)", "count")
      .where("reservedProduct.date = :searchDate", { searchDate: dayjs(date).format(dayjsFormat.ISO_STRING) })
      .andWhere("reservedProduct.timeId = :timeId", { timeId })
      .getRawOne();

    if (reservedProductsNumber) {
      return parseInt(reservedProductsNumber.count);
    } else {
      return 0;
    }
  }

  async checkIfAvailable(timeId: number, date?: Dayjs, elevator = 0): Promise<boolean> {
    const limit = await this.getReservationLimit(timeId, date);
    const reservedProductsNumber = await this.getReservedProducts(timeId, date);
    if (limit !== 0 && reservedProductsNumber !== 0 && reservedProductsNumber + elevator >= limit) {
      return false;
    } else {
      return true;
    }
  }

  async getHoursAvailability(date: Dayjs): Promise<ProductAvailabilityHourReturnType[] | undefined> {
    const openingTime = this.beachBar.openingTime.value.split(":")[0] + ":00:00";
    const closingTime = this.beachBar.closingTime.value.startsWith("00:")
      ? "24:00:00"
      : this.beachBar.closingTime.value.split(":")[0] + ":00:00";
    const hourTimes = await HourTime.find({ value: Between(openingTime, closingTime) });

    const results: ProductAvailabilityHourReturnType[] = [];
    for (let i = 0; i < hourTimes.length; i++) {
      const element = hourTimes[i];
      const res = await this.checkIfAvailable(element.id, date);
      results.push({
        hourTime: element,
        isAvailable: res,
      });
    }
    return results;
  }

  async getQuantityAvailability(date: Dayjs, timeId: number): Promise<number | null> {
    const limit = await this.getReservationLimit(timeId, date);
    const reservedProductsCount = await this.getReservedProducts(timeId, date);
    if (limit !== 0 && reservedProductsCount !== 0 && limit === reservedProductsCount) {
      return null;
    } else if (limit - reservedProductsCount === 0 || limit - reservedProductsCount >= parseInt(process.env.MAX_PRODUCT_QUANTITY!)) {
      return 0;
    } else {
      return limit - reservedProductsCount;
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

  async update(options: {
    name?: string;
    categoryId?: number;
    description?: string;
    price?: number;
    maxPeople?: number;
    imgUrl?: string;
    isActive?: boolean;
    owner?: Owner;
    payload?: any;
  }): Promise<Product | any> {
    const { name, categoryId, description, price, maxPeople, imgUrl, isActive, owner, payload } = options;
    try {
      if (price && checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
        try {
          await checkMinimumProductPrice(price, this.category, this.beachBar, this.beachBar.defaultCurrencyId);
        } catch (err) {
          throw new Error(err.message);
        }
        this.price = price;
        await ProductPriceHistory.create({ product: this, owner, newPrice: price }).save();
      }
      if (categoryId && categoryId !== this.categoryId && categoryId <= 0) {
        const category = await ProductCategory.findOne({ where: { id: categoryId }, relations: ["productComponents"] });
        if (category) {
          this.category = category;
          await this.createProductComponents(true);
        } else {
          throw new Error("Please provide a valid product category");
        }
      }
      if (isActive !== null && isActive !== undefined) {
        this.isActive = isActive;
      }
      if (name && name !== this.name) {
        this.name = name;
      }
      if (description && description !== this.description) {
        this.description = description;
      }
      if (maxPeople && maxPeople !== this.maxPeople && maxPeople > 0) {
        this.maxPeople = maxPeople;
      }
      if (imgUrl && imgUrl !== this.imgUrl) {
        this.imgUrl = imgUrl.toString();
      }
      await this.save();
      await this.beachBar.updateRedis();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    const findOptions: any = { productId: this.id };
    await softRemove(
      Product,
      { id: this.id, name: this.name, beachBarId: this.beachBarId },
      [BundleProductComponent, CartProduct, ReservedProduct, ProductReservationLimit],
      findOptions
    );
    this.offerCampaigns?.forEach(async campaign => campaign.softRemove());
    await this.beachBar.updateRedis();
  }
}
