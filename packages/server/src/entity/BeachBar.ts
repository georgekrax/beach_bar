import { dayjsFormat, toSlug } from "@beach_bar/common";
import { generateId } from "@the_hashtag/common";
import redisKeys from "constants/redisKeys";
import relations from "constants/relations";
import { beachBarReviewRatingMaxValue } from "constants/_index";
import dayjs, { Dayjs } from "dayjs";
import { Redis } from "ioredis";
import {
  AfterInsert,
  AfterUpdate,
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  EntityRepository,
  getConnection,
  getRepository,
  In,
  JoinColumn,
  ManyToOne,
  MoreThanOrEqual,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from "typeorm";
import { BeachBarAvailabilityReturnType, GetBeachBarPaymentDetails, GetFullPricingReturnType } from "typings/beach_bar";
import { checkAvailability } from "utils/beach_bar/checkAvailability";
import { getReservationLimits } from "utils/beach_bar/getReservationLimits";
import { getReservedProducts } from "utils/beach_bar/getReservedProducts";
import { groupBy } from "utils/groupBy";
import { softRemove } from "utils/softRemove";
import { redis } from "../index";
import { BeachBarCategory } from "./BeachBarCategory";
import { BeachBarEntryFee } from "./BeachBarEntryFee";
import { BeachBarFeature } from "./BeachBarFeature";
import { BeachBarImgUrl } from "./BeachBarImgUrl";
import { BeachBarLocation } from "./BeachBarLocation";
import { BeachBarOwner } from "./BeachBarOwner";
import { BeachBarRestaurant } from "./BeachBarRestaurant";
import { BeachBarReview } from "./BeachBarReview";
import { BeachBarType } from "./BeachBarType";
import { CouponCode } from "./CouponCode";
import { Currency } from "./Currency";
import { Payment } from "./Payment";
import { PricingFee } from "./PricingFee";
import { PricingFeeCurrency } from "./PricingFeeCurrency";
import { Product } from "./Product";
import { ProductReservationLimit } from "./ProductReservationLimit";
import { ReservedProduct } from "./ReservedProduct";
import { SearchInputValue } from "./SearchInputValue";
import { StripeMinimumCurrency } from "./StripeMinimumCurrency";
import { QuarterTime } from "./Time";
import { UserFavoriteBar } from "./UserFavoriteBar";

@Entity({ name: "beach_bar", schema: "public" })
@Check(`"avgRating" >= 0 AND "avgRating" <= ${beachBarReviewRatingMaxValue}`)
export class BeachBar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 255, name: "slug", unique: true })
  slug: string;

  @Column({ type: "text", name: "description", nullable: true })
  description: string;

  @Column({ type: "integer", name: "default_currency_id" })
  defaultCurrencyId: number;

  @Column({ type: "integer", name: "fee_id" })
  feeId: number;

  @Column({ type: "integer", name: "category_id" })
  categoryId: number;

  @Column({ type: "decimal", precision: 2, scale: 1, name: "avg_rating" })
  avgRating: number;

  @Column({ type: "text", name: "thumbnail_url", nullable: true })
  thumbnailUrl: string;

  @Column("varchar", { length: 20, name: "contact_phone_number" })
  contactPhoneNumber: string;

  @Column({ type: "boolean", name: "hide_phone_number", default: () => false })
  hidePhoneNumber: boolean;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @Column({ type: "boolean", name: "is_available", default: () => false })
  isAvailable: boolean;

  @Column({ type: "boolean", name: "is_manually_controlled", default: () => false })
  isManuallyControlled: boolean;

  @Column({ type: "boolean", name: "zero_cart_total" })
  zeroCartTotal: boolean;

  @Column({ type: "integer", name: "opening_time_id" })
  openingTimeId: number;

  @Column({ type: "integer", name: "closing_time_id" })
  closingTimeId: number;

  @Column("varchar", { length: 255, name: "stripe_connect_id", unique: true })
  stripeConnectId: string;

  @ManyToOne(() => PricingFee, pricingFee => pricingFee.beachBars)
  @JoinColumn({ name: "fee_id" })
  fee: PricingFee;

  @ManyToOne(() => BeachBarCategory, beachBarCategory => beachBarCategory.beachBars, { nullable: false })
  @JoinColumn({ name: "category_id" })
  category: BeachBarCategory;

  @ManyToOne(() => Currency, currency => currency.beachBars)
  @JoinColumn({ name: "default_currency_id" })
  defaultCurrency: Currency;

  @ManyToOne(() => QuarterTime, quarterTime => quarterTime.beachBarsOpeningTime, { nullable: false })
  @JoinColumn({ name: "opening_time_id" })
  openingTime: QuarterTime;

  @ManyToOne(() => QuarterTime, quarterTime => quarterTime.beachBarsClosingTime, { nullable: false })
  @JoinColumn({ name: "closing_time_id" })
  closingTime: QuarterTime;

  @OneToMany(() => SearchInputValue, searchInputValue => searchInputValue.city, { nullable: true })
  searchInputValues?: SearchInputValue[];

  @OneToOne(() => BeachBarLocation, location => location.beachBar)
  location: BeachBarLocation;

  @OneToMany(() => BeachBarImgUrl, beachBarImgUrls => beachBarImgUrls.beachBar, { nullable: true })
  imgUrls?: BeachBarImgUrl[];

  @OneToMany(() => BeachBarOwner, beachBarOwner => beachBarOwner.beachBar)
  owners: BeachBarOwner[];

  @OneToMany(() => BeachBarFeature, beachBarFeature => beachBarFeature.beachBar)
  features: BeachBarFeature[];

  @OneToMany(() => BeachBarType, beachBarType => beachBarType.beachBar)
  styles?: BeachBarType[];

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.beachBar)
  reviews: BeachBarReview[];

  @OneToMany(() => Product, product => product.beachBar)
  products: Product[];

  @OneToMany(() => BeachBarEntryFee, beachBarEntryFee => beachBarEntryFee.beachBar)
  entryFees: BeachBarEntryFee[];

  @OneToMany(() => BeachBarRestaurant, beachBarRestaurant => beachBarRestaurant.beachBar)
  restaurants: BeachBarRestaurant[];

  @OneToMany(() => UserFavoriteBar, userFavoriteBar => userFavoriteBar.beachBar, { nullable: true })
  usersFavorite?: UserFavoriteBar[];

  @OneToMany(() => CouponCode, couponCode => couponCode.beachBar, { nullable: true })
  couponCodes?: CouponCode[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @AfterInsert()
  @AfterUpdate()
  async updateSearchInputValue(): Promise<void> {
    const inputValue = await SearchInputValue.findOne({ beachBarId: this.id });
    if (this.isActive) {
      await getRepository(SearchInputValue).restore({ beachBarId: this.id });
      try {
        const { countryId, cityId, regionId } = this.location;
        const searchInputs = await SearchInputValue.find({
          where: [{ beachBarId: this.id }, { countryId }, { countryId, cityId }, { countryId, cityId, regionId }],
        });
        if (!searchInputs.find(input => input.beachBarId?.toString() === this.id.toString())) {
          await SearchInputValue.create({
            beachBarId: this.id,
            publicId: generateId({ length: 5, numbersOnly: true }),
          }).save();
        }
        if (!searchInputs.find(input => input.countryId?.toString() === countryId.toString())) {
          await SearchInputValue.create({
            countryId,
            publicId: generateId({ length: 5, numbersOnly: true }),
          }).save();
        }
        if (
          !searchInputs.find(
            input => input.cityId?.toString() === cityId.toString() && input.countryId?.toString() === countryId.toString()
          )
        ) {
          await SearchInputValue.create({
            countryId,
            cityId,
            publicId: generateId({ length: 5, numbersOnly: true }),
          }).save();
        }
        if (
          regionId &&
          !searchInputs.find(
            input =>
              input.regionId?.toString() === regionId.toString() &&
              input.cityId?.toString() === cityId.toString() &&
              input.countryId?.toString() === countryId.toString()
          )
        ) {
          await SearchInputValue.create({
            countryId,
            cityId,
            regionId,
            publicId: generateId({ length: 5, numbersOnly: true }),
          }).save();
        }
      } catch {}
    } else if (inputValue) await inputValue.softRemove();
  }

  getRedisKey(): string {
    return redisKeys.BEACH_BAR_CACHE_KEY;
  }

  getReservationLimits(date?: Dayjs, timeId?: number): ProductReservationLimit[] | undefined {
    return getReservationLimits(this, date, timeId);
  }

  async getReservedProducts(redis: Redis, date?: Dayjs, timeId?: number): Promise<ReservedProduct[]> {
    const reservedProducts = await getReservedProducts(redis, this, date, timeId);
    return reservedProducts;
  }

  async getPayments(): Promise<Payment[]> {
    const payments = await getConnection()
      .createQueryBuilder(Payment, "payment")
      .leftJoinAndSelect("payment.cart", "paymentCart")
      .leftJoinAndSelect("paymentCart.products", "products")
      .leftJoinAndSelect("products.product", "cartProduct")
      .leftJoinAndSelect("cartProduct.beachBar", "beachBar")
      .where("payment.isRefunded IS FALSE")
      .andWhere("beachBar.id = :id", { id: this.id })
      .getMany();

    return payments;
  }

  async getRedisIdx(redis: Redis): Promise<number> {
    const beachBars = await redis.lrange(this.getRedisKey(), 0, -1);
    const idx = beachBars.findIndex((x: string) => JSON.parse(x).id === this.id);
    return idx;
  }

  async update(
    name?: string,
    description?: string,
    thumbnailUrl?: string,
    contactPhoneNumber?: string,
    hidePhoneNumber?: boolean,
    zeroCartTotal?: boolean,
    isAvailable?: boolean,
    isActive?: boolean,
    categoryId?: number,
    openingTimeId?: number,
    closingTimeId?: number
  ): Promise<BeachBar | any> {
    try {
      if (name && name !== this.name) {
        this.name = name
        this.slug = toSlug(name);
      };
      if (description && description !== this.description) this.description = description;
      if (thumbnailUrl && thumbnailUrl !== this.thumbnailUrl) this.thumbnailUrl = thumbnailUrl.toString();
      if (contactPhoneNumber && contactPhoneNumber !== this.contactPhoneNumber) this.contactPhoneNumber = contactPhoneNumber;
      if (hidePhoneNumber !== null && hidePhoneNumber !== undefined && hidePhoneNumber !== this.hidePhoneNumber)
        this.hidePhoneNumber = hidePhoneNumber;
      if (zeroCartTotal !== null && zeroCartTotal !== undefined && zeroCartTotal !== this.zeroCartTotal)
        this.zeroCartTotal = zeroCartTotal;
      if (isAvailable !== null && isAvailable !== undefined && isAvailable !== this.isAvailable) this.isAvailable = isAvailable;
      if (isActive !== null && isActive !== undefined && isActive !== this.isActive) this.isActive = isActive;
      if (categoryId && categoryId !== this.categoryId) {
        const category = await BeachBarCategory.findOne(categoryId);
        if (category) this.category = category;
      }
      if (openingTimeId && openingTimeId !== this.openingTimeId) {
        const quarterTime = await QuarterTime.findOne(openingTimeId);
        if (quarterTime) this.openingTime = quarterTime;
      }
      if (closingTimeId && closingTimeId !== this.closingTimeId) {
        const quarterTime = await QuarterTime.findOne(closingTimeId);
        if (quarterTime) this.closingTime = quarterTime;
      }
      await this.save();
      await this.updateRedis();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateRedis(): Promise<void | Error> {
    try {
      const beachBar = await BeachBar.findOne({
        where: { id: this.id },
        relations: relations.BEACH_BAR_EXTENSIVE,
      });
      if (!beachBar) throw new Error();
      beachBar.features = beachBar.features.filter(feature => !feature.deletedAt);
      beachBar.products = beachBar.products.filter(product => !product.deletedAt);
      beachBar.products.forEach(product => {
        if (product.reservationLimits && product.reservationLimits?.length > 0)
          product.reservationLimits = product.reservationLimits.filter(limit => !limit.deletedAt);
      });
      const idx = await beachBar.getRedisIdx(redis);

      await redis.lset(beachBar.getRedisKey(), idx, JSON.stringify(beachBar));
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getEntryFee(date?: Dayjs, getAvg = false): Promise<BeachBarEntryFee | number | undefined> {
    if (getAvg) {
      const entryFees = await BeachBarEntryFee.find({ beachBar: this });
      if (entryFees) {
        const entryFeeValues = entryFees.map(entryFee => entryFee.fee);
        const avg = entryFeeValues.reduce((a, b) => a + b) / entryFeeValues.length;
        return avg;
      } else return undefined;
    }
    const entryFees = await BeachBarEntryFee.findOne({ beachBar: this, date: date ? date : dayjs() });
    if (entryFees) return entryFees;
    return undefined;
  }

  async getPricingFee(): Promise<PricingFee | undefined> {
    const productIds = this.products.map(product => product.id);
    const reservationLimits = await ProductReservationLimit.find({
      where: { productId: In(productIds) },
    });
    const dateLimits = Array.from(groupBy(reservationLimits, reservationLimits => reservationLimits.date)).map(i => i[1]);
    const totalLimits = dateLimits.reduce((sum, i) => sum + i.map(limit => limit.limitNumber).reduce((sum, i) => sum + i, 0), 0);
    const avgCapacity: number = totalLimits / dateLimits.length;
    const [, count] = await ReservedProduct.findAndCount({
      where: { productId: In(productIds), isRefunded: false },
    });
    const avgPayments: number = parseFloat((count / productIds.length).toFixed(2));
    const capacityPercentage = parseFloat(((avgPayments / avgCapacity) * 100).toFixed(2));
    if (capacityPercentage) {
      const pricingFee = await PricingFee.findOne({ maxCapacityPercentage: MoreThanOrEqual(capacityPercentage) });
      return pricingFee;
    } else {
      const pricingFee = await PricingFee.findOne();
      return pricingFee;
    }
  }

  async setPricingFee(): Promise<void | Error> {
    try {
      const pricingFee = await this.getPricingFee();
      if (pricingFee) {
        this.fee = pricingFee;
        await this.save();
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getFullPricingFee(): Promise<GetFullPricingReturnType | undefined> {
    const pricingFee = await this.getPricingFee();
    const currencyFee = await PricingFeeCurrency.findOne({ currencyId: this.defaultCurrencyId });
    if (!pricingFee || !currencyFee) return undefined;
    return {
      pricingFee,
      currencyFee,
    };
  }

  async getBeachBarPaymentDetails(total: number, stripeFee: number): Promise<GetBeachBarPaymentDetails | undefined> {
    const beachBarPricingFee = await this.getFullPricingFee();
    if (!beachBarPricingFee) return undefined;
    const { pricingFee, currencyFee } = beachBarPricingFee;
    const percentageFee = parseFloat(((total * parseFloat(pricingFee.percentageValue.toString())) / 100).toFixed(2));
    const beachBarAppFee = parseFloat((percentageFee + parseFloat(currencyFee.numericValue.toString())).toFixed(2));
    const transferAmount = parseFloat((total - beachBarAppFee - stripeFee).toFixed(2));
    return {
      total,
      transferAmount,
      beachBarAppFee,
      stripeFee,
    };
  }

  async getMinimumCurrency(): Promise<StripeMinimumCurrency | undefined> {
    const minimumCurrency = await StripeMinimumCurrency.findOne({ currencyId: this.defaultCurrencyId });
    if (!minimumCurrency) return undefined;
    else return minimumCurrency;
  }
  async checkAvailability(redis: Redis, date: Dayjs, timeId?: number, totalPeople?: number): Promise<BeachBarAvailabilityReturnType> {
    const res = await checkAvailability(redis, this, date, timeId, totalPeople);
    return res;
  }

  async customSoftRemove(redis: Redis): Promise<any> {
    // delete from search dropdown results
    const inputValues = await SearchInputValue.findOne({ beachBarId: this.id });
    if (inputValues) await SearchInputValue.softRemove(inputValues);

    // delete #beach_bar in Redis too
    try {
      const idx = await this.getRedisIdx(redis);
      await redis.lset(this.getRedisKey(), idx, "");
      await redis.lrem(this.getRedisKey(), 0, "");
    } catch (err) {
      throw new Error(err.message);
    }

    const findOptions: any = { beachBarId: this.id };
    await softRemove(
      BeachBar,
      { id: this.id },
      [
        BeachBarLocation,
        BeachBarImgUrl,
        BeachBarOwner,
        BeachBarFeature,
        BeachBarReview,
        Product,
        UserFavoriteBar,
        BeachBarEntryFee,
        BeachBarRestaurant,
        SearchInputValue,
        BeachBarType,
      ],
      findOptions
    );
  }
}

@EntityRepository(BeachBar)
export class BeachBarRepository extends Repository<BeachBar> {
  async findInRedis(): Promise<BeachBar[]> {
    const redisList = await redis.lrange(redisKeys.BEACH_BAR_CACHE_KEY, 0, -1);
    const redisResults = redisList.map((x: string) => JSON.parse(x));
    return redisResults;
  }

  async findOneInRedis(id: number): Promise<BeachBar | undefined> {
    const results = await this.findInRedis();
    return results.find(bar => bar.id === id);
  }

  getMaxProductReservationLimitNumber(beachBar: BeachBar, date: Dayjs, timeId?: number): ProductReservationLimit | undefined {
    let reservationLimits: any[] = beachBar.products
      .filter(product => product.reservationLimits && product.reservationLimits.length > 0)
      .map(product => product.reservationLimits)
      .map(
        limits =>
          limits && limits.filter(limit => dayjs(limit.date).format(dayjsFormat.ISO_STRING) === date.format(dayjsFormat.ISO_STRING))
      )
      .filter(limit => limit !== null && limit !== undefined && limit.length > 0);
    reservationLimits = [].concat.apply([], ...reservationLimits);
    if (timeId) {
      reservationLimits = reservationLimits.filter(limit => limit.startTimeId >= timeId && limit.endTimeId <= timeId);
    }

    if (reservationLimits.length > 0) {
      const maxLimit = reservationLimits.reduce((p, v) => {
        return p.limitNumber > v.limitNumber ? p : v;
      });
      return maxLimit;
    } else return undefined;
  }
}
