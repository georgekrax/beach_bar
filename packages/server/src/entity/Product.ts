import { errors } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import dayjs, { Dayjs } from "dayjs";
import { redis } from "index";
import {
  BaseEntity,
  Between,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  getRedisAvailabilityKey() {
    return `beach_bar:${this.beachBarId}:product:${this.id}`;
  }

  getReservationLimit(date: string, timeId?: string): number | undefined {
    // const barLimits = this.beachBar.getReservationLimits(date, timeId);
    let limits = this.reservationLimits;
    if (!limits) return undefined;
    if (date) limits = limits.filter(limit => dayjs(limit.date).isSame(date));
    if (timeId) {
      const parsed = parseInt(timeId);
      limits = limits.filter(limit => limit.startTimeId <= parsed && limit.endTimeId >= parsed);
    }
    console.log(limits);
    // if (limits.length > 0 && timeId) {
    //   const parsed = parseInt(timeId);
    //   const limitNumbers = limits.filter(limit => parsed >= limit.startTimeId && parsed <= limit.endTimeId);
    //   if (limitNumbers) return limitNumbers.reduce((sum, i) => sum + i.limitNumber, 0);
    //   else return undefined;
    // } else return Math.floor(limits.reduce((sum, i) => sum + i.limitNumber, 0) / limits.length);
    // return Math.floor(limits.reduce((sum, i) => sum + i.limitNumber, 0) / limits.length);
    return limits.reduce((sum, i) => sum + i.limitNumber, 0);
  }

  getReservedProducts(date: string, timeId?: string): ReservedProduct[] {
    let reserved = this.reservedProducts;
    if (!reserved) throw new ApolloError("`reservedProducts` are not fetched with the `Product` entity");
    if (date) reserved = reserved.filter(product => dayjs(product.date).isSame(date));
    if (timeId) reserved = reserved.filter(product => product.timeId.toString() === timeId);
    return reserved;
    // return this.beachBar
    //   .getReservedProducts(date, timeId)
    // .filter(reservedProduct => reservedProduct.productId.toString() === this.id.toString());
  }

  // isAvailable(date: string, timeId?: string, totalPeople?: number, elevator: number = 0) {
  //   const { quantity } = checkProductAvailable(this, date, timeId, totalPeople, elevator);
  //   return { quantity, available: quantity > 0 };
  // }

  async isAvailable({ date, timeId, elevator = 0 }: { date: string; timeId: string; elevator?: number }): Promise<boolean> {
    const availableProducts = await redis.hget(
      this.beachBar.getRedisAvailabilityKey({ date, timeId }),
      this.getRedisAvailabilityKey()
    );
    if (!availableProducts) return false;
    return parseInt(availableProducts.toString()) - elevator > 0;
  }

  async getHoursAvailability(date: string): Promise<ProductAvailabilityHourReturnType[]> {
    const openingTime = this.beachBar.openingTime.value.split(":")[0] + ":00:00";
    const closingTime = this.beachBar.closingTime.value.startsWith("00:")
      ? "24:00:00"
      : this.beachBar.closingTime.value.split(":")[0] + ":00:00";
    const hourTimes = await HourTime.find({ value: Between(openingTime, closingTime) });

    const results: ProductAvailabilityHourReturnType[] = [];
    for (let i = 0; i < hourTimes.length; i++) {
      const hourTime = hourTimes[i];
      const isAvailable = await this.isAvailable({ date, timeId: hourTime.id.toString() });
      results.push({ hourTime, isAvailable });
    }
    return results;
  }

  getQuantityAvailability(date: string, timeId: string): number {
    const limit = this.getReservationLimit(date, timeId);
    if (!limit) return 0;
    const { length } = this.getReservedProducts(date, timeId);
    if (limit !== 0 && length !== 0 && limit === length) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
    else if (limit - length === 0 || limit - length >= parseInt(process.env.MAX_PRODUCT_QUANTITY!)) return 0;
    else return limit - length;
  }

  // async createProductComponents(update: boolean): Promise<void> {
  //   if (update) {
  //     const bundleProducts = await BundleProductComponent.find({ product: this });
  //     await getRepository(BundleProductComponent).softRemove(bundleProducts);
  //   }

  //   this.category.productComponents.forEach(async productComponent => {
  //     await BundleProductComponent.create({ product: this, component: productComponent, deletedAt: undefined }).save();
  //   });
  // }

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
          await checkMinimumProductPrice(price, this.category, this.beachBar.defaultCurrencyId);
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
          // await this.createProductComponents(true);
        } else {
          throw new Error("Please provide a valid product category");
        }
      }
      if (isActive !== null && isActive !== undefined) this.isActive = isActive;
      if (name && name !== this.name) this.name = name;
      if (description && description !== this.description) this.description = description;
      if (maxPeople && maxPeople !== this.maxPeople && maxPeople > 0) this.maxPeople = maxPeople;
      if (imgUrl && imgUrl !== this.imgUrl) this.imgUrl = imgUrl.toString();
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
      // [BundleProductComponent, CartProduct, ReservedProduct, ProductReservationLimit],
      [CartProduct, ReservedProduct, ProductReservationLimit],
      findOptions
    );
    this.offerCampaigns?.forEach(async campaign => campaign.softRemove());
    await this.beachBar.updateRedis();
  }
}
