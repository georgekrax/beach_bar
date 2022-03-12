import { checkScopes } from "@/utils/auth";
import { softRemove } from "@/utils/softRemove";
import { errors, TABLES } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  BaseEntity,
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
import { BeachBar, BeachBarCapacityType } from "./BeachBar";
import { CartProduct } from "./CartProduct";
import { OfferCampaign } from "./OfferCampaign";
import { Owner } from "./Owner";
import { ProductCategory } from "./ProductCategory";
import { ProductPriceHistory } from "./ProductPriceHistory";
import { ProductReservationLimit } from "./ProductReservationLimit";
import { ReservedProduct } from "./ReservedProduct";

dayjs.extend(isBetween);

type CapacityInfo = Pick<BeachBarCapacityType, "date"> & { startTimeId?: number; endTimeId?: number };

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

  @Column({ type: "decimal", precision: 5, scale: 2, name: "price" })
  price: number;

  @Column({ type: "decimal", precision: 5, scale: 2, name: "min_food_spending", nullable: true })
  minFoodSpending?: number;

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

  getReservationLimit({ date, startTimeId, endTimeId }: CapacityInfo): number | undefined {
    // const barLimits = this.beachBar.getReservationLimits(date, timeId);
    let limits = this.reservationLimits;
    if (!limits) return undefined;
    if (date) limits = limits.filter(({ from, to }) => dayjs(date).isBetween(from, to, undefined, "[]"));
    if (startTimeId && endTimeId) limits = limits.filter(limit => limit.startTimeId <= endTimeId && limit.endTimeId >= startTimeId);
    // if (limits.length > 0 && timeId) {
    //   const parsed = parseInt(timeId);
    //   const limitNumbers = limits.filter(limit => parsed >= limit.startTimeId && parsed <= limit.endTimeId);
    //   if (limitNumbers) return limitNumbers.reduce((sum, i) => sum + i.limitNumber, 0);
    //   else return undefined;
    // } else return Math.floor(limits.reduce((sum, i) => sum + i.limitNumber, 0) / limits.length);
    // return Math.floor(limits.reduce((sum, i) => sum + i.limitNumber, 0) / limits.length);
    return limits.reduce((sum, i) => sum + i.limitNumber, 0);
  }

  getReservedProducts({ date, startTimeId, endTimeId }: CapacityInfo): ReservedProduct[] {
    let reserved = this.reservedProducts;
    if (!reserved) throw new ApolloError("`reservedProducts` are not fetched with the `Product` entity");
    if (date) reserved = reserved.filter(product => dayjs(product.date).isSame(date));
    if (startTimeId) reserved = reserved.filter(product => parseInt(product.startTimeId.toString()) >= startTimeId);
    if (endTimeId) reserved = reserved.filter(product => parseInt(product.endTimeId.toString()) <= endTimeId);
    return reserved;
    // return this.beachBar
    //   .getReservedProducts(date, timeId)
    // .filter(reservedProduct => reservedProduct.productId.toString() === this.id.toString());
  }

  // isAvailable(date: string, timeId?: string, totalPeople?: number, elevator: number = 0) {
  //   const { quantity } = checkProductAvailable(this, date, timeId, totalPeople, elevator);
  //   return { quantity, available: quantity > 0 };
  // }

  // async isAvailable({
  //   elevator = 0,
  //   ...capacity
  // }: Pick<BeachBarCapacityType, "date" | "startTimeId" | "endTimeId"> & { elevator?: number }): Promise<boolean> {
  //   const availableProducts = await this.beachBar.getAvailableProducts(capacity);
  //   if (availableProducts.length === 0) return false;
  //   return (availableProducts.find(({ product }) => product.id === this.id)?.remainingAvailable || 0) - elevator > 0;
  // }

  // async getHoursAvailability(date: string) {
  //   // const openingTime = this.beachBar.openingTime.value.split(":")[0] + ":00:00";
  //   // const closingTime = this.beachBar.closingTime.value.startsWith("00:")
  //   //   ? "24:00:00" : this.beachBar.closingTime.value.split(":")[0] + ":00:00";
  //   // await HourTime.find({ value: Between(openingTime, closingTime) });
  //   const hourTimes = TABLES.HOUR_TIME.filter(({ id }) => id >= +this.beachBar.openingTimeId && id <= +this.beachBar.closingTimeId);

  //   const results: any[] = [];
  //   for (let i = 0; i < hourTimes.length; i++) {
  //     const hourTime = hourTimes[i];
  //     const isAvailable = await this.isAvailable({ date, startTimeId: hourTime.id, endTimeId: hourTime.id });
  //     results.push({ hourTime: hourTime as any, isAvailable });
  //   }
  //   return results;
  // }

  getQuantityAvailability(info: CapacityInfo): number {
    const limit = this.getReservationLimit(info);
    if (!limit) return 0;
    const { length } = this.getReservedProducts(info);
    if (limit !== 0 && length !== 0 && limit === length) throw new ApolloError(errors.SOMETHING_WENT_WRONG);
    else if (limit - length === 0 || limit - length >= process.env.MAX_PRODUCT_QUANTITY) return 0;
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

  async update(
    options: Partial<
      Pick<Product, "name" | "description" | "categoryId" | "price" | "maxPeople" | "minFoodSpending" | "imgUrl" | "isActive"> & {
        owner: Owner;
        payload: any;
      }
    >
  ): Promise<Product | never> {
    const { name, categoryId, description, price, maxPeople, imgUrl, isActive, owner, payload } = options;
    try {
      if (price && checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:product"])) {
        // try { await checkMinimumProductPrice(price, this.category, this.beachBar.defaultCurrencyId);
        // } catch (err) { throw new Error(err.message) }
        this.price = price;
        await ProductPriceHistory.create({ product: this, owner, newPrice: price }).save();
      }
      if (categoryId && categoryId.toString() !== this.categoryId.toString() && categoryId <= 0) {
        const category = TABLES.PRODUCT_CATEGORY.find(({ id }) => id.toString() === categoryId.toString());
        if (category) {
          this.category = category as any;
          // await this.createProductComponents(true);
        } else throw new Error("Please provide a valid product category.");
      }
      if (isActive != null) this.isActive = isActive;
      if (name && name !== this.name) this.name = name;
      if (description && description !== this.description) this.description = description;
      if (maxPeople && maxPeople !== this.maxPeople && maxPeople > 0) this.maxPeople = maxPeople;
      if (imgUrl && imgUrl !== this.imgUrl) this.imgUrl = imgUrl.toString();
      await this.save();
      await this.beachBar.updateRedis();
      return this;
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
