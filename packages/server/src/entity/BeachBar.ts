import { generateID } from "@beach_bar/common";
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
  getRepository,
  JoinColumn,
  LessThanOrEqual,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from "typeorm";
import { dayjsFormat } from "../constants/dayjs";
import redisKeys from "../constants/redisKeys";
import { checkAvailability, BeachBarCheckAvailability } from "../utils/beach_bar/checkAvailability";
import { getReservationLimits } from "../utils/beach_bar/getReservationLimits";
import { getReservedProducts } from "../utils/beach_bar/getReservedProducts";
import { BeachBarEntryFee } from "./BeachBarEntryFee";
import { BeachBarFeature } from "./BeachBarFeature";
import { BeachBarFeeCurrency } from "./BeachBarFeeCurrency";
import { BeachBarLocation } from "./BeachBarLocation";
import { BeachBarOwner } from "./BeachBarOwner";
import { BeachBarPricingFee } from "./BeachBarPricingFee";
import { BeachBarRestaurant } from "./BeachBarRestaurant";
import { BeachBarReview } from "./BeachBarReview";
import { Currency } from "./Currency";
import { Product } from "./Product";
import { ProductReservationLimit } from "./ProductReservationLimit";
import { ReservedProduct } from "./ReservedProduct";
import { SearchInputValue } from "./SearchInputValue";
import { StripeFee } from "./StripeFee";
import { StripeMinimumCurrency } from "./StripeMinimumCurrency";
import { softRemove } from "../utils/softRemove";

interface GetFullPricingReturnType {
  pricingFee: BeachBarPricingFee;
  currencyFee: BeachBarFeeCurrency;
}

interface GetBeachBarPaymentFee {
  total: number;
  transferAmount: number;
  beachBarAppFee: number;
}

@Entity({ name: "beach_bar", schema: "public" })
@Check(`"avgRating" >= 0 AND "avgRating" <= 10`)
export class BeachBar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "name", unique: true })
  name: string;

  @Column({ type: "text", name: "description", nullable: true })
  description: string;

  @Column({ type: "integer", name: "default_currency_id" })
  defaultCurrencyId: number;

  @Column({ type: "integer", name: "fee_id" })
  feeId: number;

  @Column({ type: "decimal", precision: 3, scale: 1, name: "avg_rating" })
  avgRating: number;

  @Column({ type: "text", name: "thumbnail_url", nullable: true })
  thumbnailUrl?: string;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @Column({ type: "boolean", name: "is_available", default: () => false })
  isAvailable: boolean;

  @Column({ type: "boolean", name: "zero_cart_total" })
  zeroCartTotal: boolean;

  @Column("varchar", { length: 255, name: "stripe_connect_id", unique: true })
  stripeConnectId: string;

  @ManyToOne(() => BeachBarPricingFee, beachBarPricingFee => beachBarPricingFee.beachBars)
  @JoinColumn({ name: "fee_id" })
  fee: BeachBarPricingFee;

  @ManyToOne(() => Currency, currency => currency.beachBars)
  @JoinColumn({ name: "default_currency_id" })
  defaultCurrency: Currency;

  @OneToMany(() => SearchInputValue, searchInputValue => searchInputValue.city, { nullable: true })
  searchInputValues?: SearchInputValue[];

  @OneToOne(() => BeachBarLocation, location => location.beachBar)
  location: BeachBarLocation;

  @OneToMany(() => BeachBarOwner, beachBarOwner => beachBarOwner.beachBar)
  owners: BeachBarOwner[];

  @OneToMany(() => BeachBarFeature, beachBarFeature => beachBarFeature.beachBar)
  features: BeachBarFeature[];

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.beachBar)
  reviews: BeachBarReview[];

  @OneToMany(() => Product, product => product.beachBar)
  products: Product[];

  @OneToMany(() => BeachBarEntryFee, beachBarEntryFee => beachBarEntryFee.beachBar)
  entryFees: BeachBarEntryFee[];

  @OneToMany(() => BeachBarRestaurant, beachBarRestaurant => beachBarRestaurant.beachBar)
  restaurants: BeachBarRestaurant[];

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
      const res = await getRepository(SearchInputValue).restore({ beachBarId: this.id });
      if (res.affected === 0) {
        await SearchInputValue.create({
          beachBarId: this.id,
          publicId: generateID(5, true),
        }).save();
      }
    } else {
      if (inputValue) {
        await inputValue.softRemove();
      }
    }
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

  async getRedisIdx(redis: Redis): Promise<number> {
    const beachBars = await redis.lrange(this.getRedisKey(), 0, -1);
    const idx = beachBars.findIndex((x: string) => JSON.parse(x).id === this.id);
    return idx;
  }

  async update(
    redis: Redis,
    name?: string,
    description?: string,
    thumbnailUrl?: string,
    zeroCartTotal?: boolean,
    isAvailable?: boolean,
  ): Promise<BeachBar | any> {
    try {
      if (name && name !== this.name) {
        this.name = name;
      }
      if (description && description !== this.description) {
        this.description = description;
      }
      if (thumbnailUrl && thumbnailUrl !== thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
      }
      if (zeroCartTotal !== null && zeroCartTotal !== undefined && zeroCartTotal !== this.zeroCartTotal) {
        this.zeroCartTotal = zeroCartTotal;
      }
      if (isAvailable !== null && isAvailable !== undefined && isAvailable !== this.isAvailable) {
        this.isAvailable = isAvailable;
      }
      await this.save();
      await this.updateRedis(redis);
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateRedis(redis: Redis): Promise<void | any> {
    try {
      const beachBar = await BeachBar.findOne({
        where: { id: this.id },
        relations: [
          "products",
          "products.category",
          "products.components",
          "products.reservationLimits",
          "products.reservationLimits.startTime",
          "products.reservationLimits.endTime",
          "products.reservationLimits.product",
          "features",
          "features.service",
          "location",
          "location.country",
          "location.city",
          "location.region",
          "fee",
          "reviews",
          "reviews.customer",
          "reviews.answer",
          "defaultCurrency",
          "owners",
          "owners.owner",
          "owners.owner.user",
          "entryFees",
          "restaurants",
          "restaurants.foodItems",
        ],
      });
      if (!beachBar) {
        throw new Error();
      }
      beachBar.features = beachBar.features.filter(feature => !feature.deletedAt);
      beachBar.products = beachBar.products.filter(product => !product.deletedAt);
      beachBar.products.forEach(product => {
        if (product.reservationLimits && product.reservationLimits?.length > 0) {
          product.reservationLimits = product.reservationLimits.filter(limit => !limit.deletedAt);
        }
      });
      const idx = await beachBar.getRedisIdx(redis);
      await redis.lset(beachBar.getRedisKey(), idx, JSON.stringify(beachBar));
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getEntryFee(date?: Date | Dayjs, getAvg = false): Promise<BeachBarEntryFee | number | undefined> {
    if (getAvg) {
      const entryFees = await BeachBarEntryFee.find({ beachBar: this });
      if (entryFees) {
        const entryFeeValues = entryFees.map(entryFee => entryFee.fee);
        const avg = entryFeeValues.reduce((a, b) => a + b) / entryFeeValues.length;
        return avg;
      } else {
        return undefined;
      }
    }
    const entryFees = await BeachBarEntryFee.findOne({ beachBar: this, date: date ? date : dayjs() });
    if (entryFees) {
      return entryFees;
    }
    return undefined;
  }

  async getPricingFee(): Promise<BeachBarPricingFee | undefined> {
    let minEntryFee: number;
    if (this.id) {
      const entryFees = await BeachBarEntryFee.find({ beachBarId: this.id });
      if (entryFees.length === 0) {
        minEntryFee = 0;
      } else {
        const entryFeesValues = entryFees.map(entryFee => entryFee.fee);
        minEntryFee = entryFeesValues.reduce((a, b) => Math.min(a, b));
      }
    } else {
      minEntryFee = 0;
    }
    const pricingFee = await BeachBarPricingFee.findOne({ entryFeeLimit: LessThanOrEqual(minEntryFee) });
    if (!pricingFee) {
      return undefined;
    }
    return pricingFee;
  }

  async getFullPricingFee(): Promise<GetFullPricingReturnType | undefined> {
    const pricingFee = await this.getPricingFee();
    const currencyFee = await BeachBarFeeCurrency.findOne({ fee: pricingFee, currency: this.defaultCurrency });
    if (!pricingFee || !currencyFee) {
      return undefined;
    }
    return {
      pricingFee,
      currencyFee,
    };
  }

  async getBeachBarPaymentFee(cardProcessingFee: StripeFee, total: number): Promise<GetBeachBarPaymentFee | undefined> {
    const beachBarPricingFee = await this.getFullPricingFee();
    if (!beachBarPricingFee) {
      return undefined;
    }
    const { pricingFee, currencyFee } = beachBarPricingFee;
    const percentageFee = (total * parseInt(pricingFee.percentageValue.toString())) / 100;
    const beachBarAppFee = percentageFee + parseFloat(currencyFee.pricingValue.toString());
    const totalPricingFeeWithoutStripe = Math.trunc(total - beachBarAppFee);
    const stripeTotalFee: number = parseFloat(
      (
        total * (parseFloat(cardProcessingFee.percentageValue.toString()) / 100) +
        parseFloat(cardProcessingFee.pricingFee.toString())
      ).toFixed(2),
    );
    const transferAmount = Math.trunc(totalPricingFeeWithoutStripe - stripeTotalFee);
    return {
      total,
      transferAmount,
      beachBarAppFee,
    };
  }

  async getMinimumCurrency(): Promise<StripeMinimumCurrency | undefined> {
    const minimumCurrency = await StripeMinimumCurrency.findOne({ currencyId: this.defaultCurrencyId });
    if (!minimumCurrency) {
      return undefined;
    } else {
      return minimumCurrency;
    }
  }

  async checkMinimumCurrency(total: number): Promise<boolean | undefined> {
    const minimumCurrency = await this.getMinimumCurrency();
    if (!minimumCurrency) {
      return undefined;
    }
    if (total <= minimumCurrency.chargeAmount) {
      return false;
    } else {
      return true;
    }
  }

  async setIsActive(redis: Redis, isActive?: boolean): Promise<BeachBar | any> {
    try {
      if (isActive !== null && isActive !== undefined && isActive !== this.isActive) {
        this.isActive = isActive;
      }
      await this.save();
      await this.updateRedis(redis);
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async checkAvailability(redis: Redis, date: Dayjs, timeId?: number, totalPeople?: number): Promise<BeachBarCheckAvailability> {
    const res = await checkAvailability(redis, this, date, timeId, totalPeople);
    return res;
  }

  async customSoftRemove(redis: Redis): Promise<any> {
    // delete from search dropdown results
    const inputValues = await SearchInputValue.findOne({ beachBarId: this.id });
    if (inputValues) {
      await SearchInputValue.softRemove(inputValues);
    }

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
        BeachBarOwner,
        BeachBarFeature,
        BeachBarReview,
        Product,
        BeachBarEntryFee,
        BeachBarRestaurant,
        SearchInputValue,
      ],
      findOptions,
    );
  }
}

@EntityRepository(BeachBar)
export class BeachBarRepository extends Repository<BeachBar> {
  getMaxProductReservationLimitNumber(beachBar: BeachBar, date: Dayjs, timeId?: number): ProductReservationLimit | undefined {
    let reservationLimits: any[] = beachBar.products
      .filter(product => product.reservationLimits && product.reservationLimits.length > 0)
      .map(product => product.reservationLimits)
      .map(
        limits =>
          limits && limits.filter(limit => dayjs(limit.date).format(dayjsFormat.ISO_STRING) === date.format(dayjsFormat.ISO_STRING)),
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
    } else {
      return undefined;
    }
  }
}
