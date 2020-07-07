import dayjs from "dayjs";
import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  LessThanOrEqual,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
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
import { StripeFee } from "./StripeFee";

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

  @Column("varchar", { length: 255, name: "stripe_connect_id", unique: true })
  stripeConnectId: string;

  @ManyToOne(() => BeachBarPricingFee, beachBarPricingFee => beachBarPricingFee.beachBars)
  @JoinColumn({ name: "fee_id" })
  pricingFee: BeachBarPricingFee;

  @ManyToOne(() => Currency, currency => currency.beachBars)
  @JoinColumn({ name: "default_currency_id" })
  defaultCurrency: Currency;

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
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async getEntryFee(date?: Date, getAvg = false): Promise<BeachBarEntryFee | number | undefined> {
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
    const entryFees = await BeachBarEntryFee.find({ beachBarId: this.id });
    let minEntryFee: number;
    if (entryFees.length === 0) {
      minEntryFee = 0;
    } else {
      const entryFeesValues = entryFees.map(entryFee => entryFee.fee);
      minEntryFee = entryFeesValues.reduce((a, b) => Math.min(a, b));
    }
    const pricingFee = await BeachBarPricingFee.findOne({ entryFeeLimit: LessThanOrEqual(minEntryFee) });
    if (!pricingFee) {
      return undefined;
    }
    return pricingFee;
  }

  async setPricingFee(): Promise<void> {
    const pricingFee = await this.getPricingFee();
    if (pricingFee) {
      this.pricingFee = pricingFee;
      await this.save();
    }
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

  async softRemove(): Promise<any> {
    const findOptions: any = { beachBarId: this.id };
    await softRemove(
      BeachBar,
      { id: this.id },
      [BeachBarLocation, BeachBarOwner, BeachBarFeature, BeachBarReview, Product, BeachBarEntryFee, BeachBarRestaurant],
      findOptions,
    );
  }
}
