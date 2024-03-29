import { dayjsFormat, toSlug } from "@beach_bar/common";
import { generateId } from "@the_hashtag/common";
import redisKeys from "constants/redisKeys";
import relations from "constants/relations";
import { beachBarReviewRatingMaxValue } from "constants/_index";
import dayjs, { Dayjs } from "dayjs";
import { Redis } from "ioredis";
import chunk from "lodash/chunk";
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
  getRepository,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from "typeorm";
import { GetBeachBarPaymentDetails } from "typings/beach_bar";
import { BeachBarRecommendedProductsType } from "typings/beach_bar/product";
import { getReservationLimits } from "utils/beach_bar/getReservationLimits";
import { getReservedProducts } from "utils/beach_bar/getReservedProducts";
import { numberTypeToNum, toFixed2 } from "utils/format";
import { softRemove } from "utils/softRemove";
import { redis } from "../index";
import { BeachBarCategory } from "./BeachBarCategory";
import { BeachBarFeature } from "./BeachBarFeature";
import { BeachBarImgUrl } from "./BeachBarImgUrl";
import { BeachBarLocation } from "./BeachBarLocation";
import { BeachBarOwner } from "./BeachBarOwner";
import { BeachBarRestaurant } from "./BeachBarRestaurant";
import { BeachBarReview } from "./BeachBarReview";
import { BeachBarType } from "./BeachBarType";
import { CouponCode } from "./CouponCode";
import { Currency } from "./Currency";
import { PricingFee } from "./PricingFee";
import { Product } from "./Product";
import { ProductReservationLimit } from "./ProductReservationLimit";
import { ReservedProduct } from "./ReservedProduct";
import { SearchInputValue } from "./SearchInputValue";
import { StripeMinimumCurrency } from "./StripeMinimumCurrency";
import { HourTime } from "./Time";
import { UserFavoriteBar } from "./UserFavoriteBar";

export type AvailableProductsType = { product: Product; remainingAvailable: number }[];
export type BeachBarCapacityType = { date: string; timeId: string; totalPeople: number };

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

  @Column({ type: "integer", name: "fee_id", default: () => 1 })
  feeId: number;

  @Column({ type: "integer", name: "category_id" })
  categoryId: number;

  @Column({ type: "decimal", precision: 5, scale: 2, name: "entry_fee" })
  entryFee: number;

  @Column({ type: "decimal", precision: 2, scale: 1, name: "avg_rating" })
  avgRating: number;

  @Column({ type: "text", name: "thumbnail_url" })
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

  @ManyToOne(() => HourTime, hourTIme => hourTIme.beachBarsOpeningTime, { nullable: false })
  @JoinColumn({ name: "opening_time_id" })
  openingTime: HourTime;

  @ManyToOne(() => HourTime, hourTime => hourTime.beachBarsClosingTime, { nullable: false })
  @JoinColumn({ name: "closing_time_id" })
  closingTime: HourTime;

  @OneToMany(() => SearchInputValue, searchInputValue => searchInputValue.city, { nullable: true })
  searchInputValues: SearchInputValue[];

  @OneToOne(() => BeachBarLocation, location => location.beachBar)
  location: BeachBarLocation;

  @OneToMany(() => BeachBarImgUrl, beachBarImgUrls => beachBarImgUrls.beachBar, { nullable: true })
  imgUrls?: BeachBarImgUrl[];

  @OneToMany(() => BeachBarOwner, beachBarOwner => beachBarOwner.beachBar)
  owners: BeachBarOwner[];

  @OneToMany(() => BeachBarFeature, beachBarFeature => beachBarFeature.beachBar)
  features: BeachBarFeature[];

  @OneToMany(() => BeachBarType, beachBarType => beachBarType.beachBar)
  styles: BeachBarType[];

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.beachBar)
  reviews: BeachBarReview[];

  @OneToMany(() => Product, product => product.beachBar)
  products: Product[];

  // @OneToMany(() => BeachBarEntryFee, beachBarEntryFee => beachBarEntryFee.beachBar)
  // entryFees: BeachBarEntryFee[];

  @OneToMany(() => BeachBarRestaurant, beachBarRestaurant => beachBarRestaurant.beachBar)
  restaurants: BeachBarRestaurant[];

  @OneToMany(() => UserFavoriteBar, userFavoriteBar => userFavoriteBar.beachBar, { nullable: true })
  usersFavorite: UserFavoriteBar[];

  @OneToMany(() => CouponCode, couponCode => couponCode.beachBar, { nullable: true })
  couponCodes: CouponCode[];

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

  getRedisAvailabilityKey({ date, timeId }: Omit<BeachBarCapacityType, "totalPeople">): string {
    return `available_products:${date}:${timeId.padEnd(4, "0")}`;
  }

  getReservationLimits(date?: string, timeId?: string): ProductReservationLimit[] {
    return getReservationLimits(this, date, timeId);
  }

  getReservedProducts(date?: string, timeId?: string): ReservedProduct[] {
    return getReservedProducts(this, date, timeId);
  }

  async hasCapacity(args: BeachBarCapacityType, recommendedArr?: BeachBarRecommendedProductsType) {
    const recommendedProducts = recommendedArr ? recommendedArr : await this.calcRecommendedProducts(args);
    return recommendedProducts.length > 0;
  }

  async getAvailableProducts({ date, timeId }: Omit<BeachBarCapacityType, "totalPeople">): Promise<AvailableProductsType> {
    const [_, products] = await redis.hscan(
      this.getRedisAvailabilityKey({ date, timeId }),
      0,
      "MATCH",
      `beach_bar:${this.id}:product:*`
    );
    const groupedProducts: string[][] = chunk(products, 2);
    const parsedRes = groupedProducts
      .map(([key, val]) => {
        const product = this.products.find(({ id }) => id.toString() === key.split(":")[3]);
        if (!product) return [];
        return { product, remainingAvailable: parseInt(val) };
      })
      .flat();
    return parsedRes.filter(({ remainingAvailable }) => remainingAvailable > 0);
  }

  async calcRecommendedProducts({ date, timeId, totalPeople }: BeachBarCapacityType): Promise<BeachBarRecommendedProductsType> {
    console.log("date", date)
    console.log(timeId)
    console.log(totalPeople);
    const availableProducts = await this.getAvailableProducts({ date, timeId });
    const filtered = availableProducts.filter(({ product: { maxPeople } }) => maxPeople >= totalPeople);
    if (availableProducts.length === 0) return [];
    if (filtered.length > 0) {
      console.log("hey")
      const { product } = filtered.sort(
        ({ product: { price: aPrice } }, { product: { price: bPrice } }) => numberTypeToNum(aPrice) - numberTypeToNum(bPrice)
      )[0];
      return [{ product, quantity: 1 }];
    }

    let res: BeachBarRecommendedProductsType = [];
    let remainingPeople = totalPeople;
    // const mostWithRemainings = Math.max(...availableProducts.map(({ remainingAvailable }) => remainingAvailable));
    if (totalPeople === 0) throw new Error("totalPeople cannot be zero (0)");
    while (remainingPeople > 0) {
      const availableWithQuantity = availableProducts
        .sort((a, b) => a.product.maxPeople - b.product.maxPeople)
        .map(({ product, remainingAvailable }) => {
          const maxPeople = product.maxPeople;
          const quantity = maxPeople >= remainingPeople ? 1 : Math.floor(remainingPeople / maxPeople);
          // console.log(product.id, totalPeople, quantity, remainingAvailable);
          return {
            product,
            quantity: remainingAvailable < quantity ? remainingAvailable : quantity, // check for availability after new quantity,
          };
        })
        .filter(({ quantity }) => quantity >= 1);
      // const wholeQuantityArr = availableWithQuantity.filter(({ quantity }) => quantity % 1 === 0);
      const whoMinQuantity = availableWithQuantity.sort(
        ({ product: { price: aPrice }, quantity: aQuantity }, { product: { price: bPrice }, quantity: bQuantity }) => {
          if (aQuantity < bQuantity && numberTypeToNum(aPrice) > numberTypeToNum(bPrice) && res.length > 0) return 1;
          return aQuantity - bQuantity;
        }
      )[0];
      if (res.find(({ product: { id } }) => whoMinQuantity.product.id === id)) {
        res = res.map(item => {
          if (item.product.id === whoMinQuantity.product.id) return { ...item, quantity: item.quantity + whoMinQuantity.quantity };
          else return item;
        });
      } else res.push(whoMinQuantity);
      remainingPeople =
        totalPeople - res.reduce((prev, { product: { maxPeople }, quantity }) => prev + Math.floor(quantity) * maxPeople, 0);
    }
    return res;
  }

  // getAvailableProducts({ date, timeId, totalPeople = 0 }: AvailabilityArgs): TProductAvailability[] {
  //   return this.products
  //     .map(product => {
  //       const { quantity } = product.isAvailable(date, timeId, totalPeople);
  //       if (quantity === 0) return [];
  //       return { product, quantity: quantity };
  //     })
  //     .flat();
  // }

  async getRedisIdx(redis: Redis): Promise<number> {
    const beachBars = await redis.lrange(this.getRedisKey(), 0, -1);
    return beachBars.findIndex((x: string) => JSON.parse(x).id === this.id);
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
        this.name = name;
        this.slug = toSlug(name);
      }
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
        const quarterTime = await HourTime.findOne(openingTimeId);
        if (quarterTime) this.openingTime = quarterTime;
      }
      if (closingTimeId && closingTimeId !== this.closingTimeId) {
        const quarterTime = await HourTime.findOne(closingTimeId);
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

  // async getEntryFee(date?: Dayjs, getAvg = false): Promise<BeachBarEntryFee | number | undefined> {
  //   if (getAvg) {
  //     const entryFees = await BeachBarEntryFee.find({ beachBar: this });
  //     if (entryFees) {
  //       const entryFeeValues = entryFees.map(entryFee => entryFee.fee);
  //       const avg = entryFeeValues.reduce((a, b) => a + b) / entryFeeValues.length;
  //       return avg;
  //     } else return undefined;
  //   }
  //   const entryFees = await BeachBarEntryFee.findOne({ beachBar: this, date: date ? date : dayjs() });
  //   if (entryFees) return entryFees;
  //   return undefined;
  // }

  // async getPricingFee(): Promise<PricingFee | undefined> {
  // const productIds = this.products.map(product => product.id);
  // const reservationLimits = await ProductReservationLimit.find({
  //   where: { productId: In(productIds) },
  // });
  // const dateLimits = Array.from(groupBy(reservationLimits, reservationLimits => reservationLimits.date)).map(i => i[1]);
  // const totalLimits = dateLimits.reduce((sum, i) => sum + i.map(limit => limit.limitNumber).reduce((sum, i) => sum + i, 0), 0);
  // const avgCapacity: number = totalLimits / dateLimits.length;
  // const [, count] = await ReservedProduct.findAndCount({ where: { productId: In(productIds), isRefunded: false } });
  // const avgPayments: number = parseFloat((count / productIds.length).toFixed(2));
  // const capacityPercentage = parseFloat(((avgPayments / avgCapacity) * 100).toFixed(2));
  // if (capacityPercentage) {
  //   const pricingFee = await PricingFee.findOne({ maxCapacityPercentage: MoreThanOrEqual(capacityPercentage) });
  //   return pricingFee;
  // } else {
  //   const pricingFee = await PricingFee.findOne();
  //   return pricingFee;
  // }
  // }

  async setPricingFee(): Promise<void | Error> {
    try {
      const pricingFee = this.fee;
      if (pricingFee) {
        this.fee = pricingFee;
        await this.save();
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // getFullPricingFee(): GetFullPricingReturnType {
  // const pricingFee = this.fee;
  // const currencyFee = await PricingFeeCurrency.findOne({ currencyId: this.defaultCurrencyId });
  // if (!pricingFee || !currencyFee) return undefined;
  // return pricingFee;
  // }

  getPaymentDetails(total: number, stripeFee: number): GetBeachBarPaymentDetails {
    const beachBarAppFee = toFixed2((total * parseFloat(this.fee.percentageValue.toString())) / 100);
    // const beachBarAppFee = toFixed2(percentageFee + parseFloat(currencyFee.numericValue.toString()));
    const transferAmount = toFixed2(total - beachBarAppFee - stripeFee);
    return { total, transferAmount, beachBarAppFee, stripeFee };
  }

  async getMinimumCurrency(): Promise<StripeMinimumCurrency | undefined> {
    const minimumCurrency = await StripeMinimumCurrency.findOne({ currencyId: this.defaultCurrencyId });
    return minimumCurrency;
  }

  // checkAvailability({ date, timeId, totalPeople }: AvailabilityArgs): BeachBarAvailabilityReturnType {
  //   return checkAvailability(this, date, timeId, totalPeople);
  // }

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
        // BeachBarEntryFee,
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
    return redisList.map((x: string) => JSON.parse(x));
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
    if (timeId) reservationLimits = reservationLimits.filter(limit => limit.startTimeId >= timeId && limit.endTimeId <= timeId);

    if (reservationLimits.length > 0) return reservationLimits.reduce((p, v) => (p.limitNumber > v.limitNumber ? p : v));
    else return undefined;
  }
}
