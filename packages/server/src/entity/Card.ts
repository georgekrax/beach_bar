import { Dayjs } from "dayjs";
import { Stripe } from "stripe";
import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  EntityRepository,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "utils/softRemove";
import { stripe } from "..";
import { CardBrand } from "./CardBrand";
import { Country } from "./Country";
import { Customer } from "./Customer";
import { Payment } from "./Payment";

export enum cardType {
  physical = "physical",
  virtual = "virtual",
  unknown = "unknown",
}

export enum cardFunding {
  credit = "credit",
  debit = "debit",
  prepaid = "prepaid",
  unknown = "unknown",
}

@Entity({ name: "card", schema: "public" })
@Check(`"expMonth" >= 0 AND "expMonth" <= 12`)
@Check(`length("expYear"::text) = 4`)
@Check(`length("last4") = 4`)
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "enum", name: "type", enum: cardType, enumName: "card_type", default: () => "unknown" })
  type: string;

  @Column({ type: "enum", name: "funding", enum: cardFunding, enumName: "card_funding", default: () => "unknown" })
  funding: string;

  @Column({ type: "integer", name: "brand_id", nullable: true })
  brandId?: number;

  @Column({ type: "integer", name: "country_id", nullable: true })
  countryId?: number;

  @Column({ type: "smallint", name: "exp_month", nullable: true })
  expMonth?: number;

  @Column({ type: "smallint", name: "exp_year", nullable: true })
  expYear?: number;

  @Column("varchar", { length: 4, name: "last_4" })
  last4: string;

  @Column("varchar", { length: 255, name: "cardholder_name", nullable: true })
  cardholderName?: string;

  @Column({ type: "boolean", name: "is_default", default: () => false })
  isDefault: boolean;

  @Column({ type: "boolean", name: "is_expired", default: () => false })
  isExpired: boolean;

  @Column({ type: "bigint", name: "customer_id" })
  customerId: bigint;

  @Column("varchar", { length: 255, name: "stripe_id" })
  stripeId: string;

  @ManyToOne(() => CardBrand, cardBrand => cardBrand.cards, { nullable: true })
  @JoinColumn({ name: "brand_id" })
  brand?: CardBrand;

  @ManyToOne(() => Country, country => country.cards, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country?: Country;

  @ManyToOne(() => Customer, customer => customer.cards, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @OneToMany(() => Payment, payment => payment.card, { nullable: true })
  payments?: Payment[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async updateCard(
    cardholderName?: string,
    expMonth?: number,
    expYear?: number,
    isDefault?: boolean,
    webhook = false
  ): Promise<Card | any> {
    try {
      if (cardholderName && cardholderName !== this.cardholderName) {
        this.cardholderName = cardholderName;
      }
      if (expMonth && expMonth !== this.expMonth) {
        this.expMonth = expMonth;
      }
      if (expYear && expYear !== this.expYear) {
        this.expYear = expYear;
      }
      if (isDefault !== null && isDefault !== undefined && isDefault !== this.isDefault) {
        if (this.customer.cards) {
          const defaultCard = this.customer.cards.find(card => card.isDefault === true && card.isExpired === false);
          if (!webhook && defaultCard) {
            throw new Error("You are not allowed to have more than one default card");
          } else if (webhook && defaultCard) {
            defaultCard.isDefault = false;
            await defaultCard.save();
          }
          this.isDefault = isDefault;
        }
      }
      await this.save();
      if (!webhook) {
        await stripe.customers.updateSource(this.customer.stripeCustomerId, this.stripeId, {
          name: this.cardholderName || undefined,
          exp_month: this.expMonth?.toString() || undefined,
          exp_year: this.expYear?.toString() || undefined,
        });
        if (isDefault && this.isDefault) {
          await stripe.customers.update(this.customer.stripeCustomerId, {
            default_source: this.stripeId,
          });
        }
      }
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async expireCard(): Promise<void> {
    this.isExpired = true;
    await this.save();
  }

  async customSoftRemove(stripe: Stripe, webhook = false): Promise<any> {
    if (!webhook) {
      // delete card in Stripe too
      try {
        await stripe.customers.deleteSource(this.customer.stripeCustomerId, this.stripeId);
      } catch (err) {
        throw new Error(err.message);
      }
    }
    await softRemove(Card, { id: this.id }, [Payment], { cardId: this.id });
  }
}

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  async createCard(
    stripe: Stripe,
    stripeCard: any,
    customer: Customer,
    brand?: CardBrand,
    country?: Country,
    isDefault?: boolean,
    cardholderName?: string
  ): Promise<Card | any> {
    try {
      const newCustomerCard = Card.create({
        brand,
        country,
        customer,
        stripeId: stripeCard.id,
        expMonth: stripeCard.exp_month,
        expYear: stripeCard.exp_year,
        last4: stripeCard.last4,
        isDefault: customer.cards && isDefault && customer.cards.length === 0 ? true : false,
        cardholderName:
          customer.user?.getFullName() && !cardholderName ? customer.user?.getFullName() : cardholderName ? cardholderName : undefined,
      });
      await newCustomerCard.save();

      if (newCustomerCard.isDefault) {
        await stripe.customers.update(customer.stripeCustomerId, { default_source: newCustomerCard.stripeId });
      }

      return newCustomerCard;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async createStripeWebhookCard(stripe: Stripe, stripeCard: any): Promise<void | Error> {
    const customer = await Customer.findOne({ stripeCustomerId: stripeCard.customer });
    if (!customer) {
      throw new Error("Specified customer does not exist");
    }

    const brand = await CardBrand.findOne({ name: stripeCard.brand });
    const country = await Country.findOne({ isoCode: stripeCard.country });

    try {
      await this.createCard(stripe, stripeCard, customer, brand, country, undefined, stripeCard.name);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateStripeWebhookCard(stripeCard: any): Promise<void | Error> {
    const { id, name, exp_month: expMonth, exp_year: expYear } = stripeCard;
    const card = await Card.findOne({
      where: { stripeId: id, isExpired: false },
      relations: ["customer"],
    });
    if (!card) {
      throw new Error("Card does not exist");
    }

    try {
      await card.updateCard(name, expMonth, expYear);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
