import { errors } from "@beach_bar/common";
import { validateEmailSchema } from "@the_hashtag/common";
import { Dayjs } from "dayjs";
import { Stripe } from "stripe";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  EntityRepository,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from "typeorm";
import { TAddCustomer } from "typings/customer";
import { softRemove } from "utils/softRemove";
import { Account } from "./Account";
import { BeachBarReview } from "./BeachBarReview";
import { Card } from "./Card";
import { Country } from "./Country";
import { Payment } from "./Payment";
import { User } from "./User";

@Entity({ name: "customer", schema: "public" })
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "user_id", nullable: true })
  userId?: number;

  @Column("varchar", { length: 255, name: "email" })
  email: string;

  @Column("varchar", { length: 20, name: "phone_number", nullable: true })
  phoneNumber?: string;

  @Column({ type: "integer", name: "country_id", nullable: true })
  countryId?: number;

  @Column("varchar", { length: 255, name: "stripe_customer_id" })
  stripeCustomerId: string;

  @OneToOne(() => User, user => user.customer, { nullable: true, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @ManyToOne(() => Country, country => country.customers, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country?: Country;

  @OneToMany(() => Card, card => card.customer, { nullable: true })
  cards?: Card[];

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.customer, { nullable: true })
  reviews?: BeachBarReview[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  checkReviewsQuantity(beachBarId: number, payment: Payment): boolean {
    if (this.reviews) {
      const customerBeachBarReviews = this.reviews.filter(review => review.beachBarId === beachBarId && !review.deletedAt);
      if (customerBeachBarReviews && customerBeachBarReviews.length >= 1) {
        const paymentBeachBarProducts = payment.getBeachBarProducts(beachBarId);
        if (paymentBeachBarProducts && paymentBeachBarProducts.length <= customerBeachBarReviews.length) {
          return false;
        }
        return true;
      }
      return true;
    }
    return true;
  }

  async update(phoneNumber?: string, countryAlpha2Code?: string): Promise<Customer | any> {
    try {
      if (phoneNumber && phoneNumber !== this.phoneNumber && phoneNumber.trim().length !== 0) {
        this.phoneNumber = phoneNumber;
      }
      if (countryAlpha2Code && countryAlpha2Code.trim().length !== 0) {
        const country = await Country.findOne({ alpha2Code: countryAlpha2Code });
        if (country) {
          this.country = country;
        }
      }
      await this.save();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async customSoftRemove(stripe: Stripe, webhook = false): Promise<void | Error> {
    if (!webhook) {
      // delete customer in Stripe too
      try {
        await stripe.customers.del(this.stripeCustomerId);
      } catch (err) {
        throw new Error(err.message);
      }
    }

    const findOptions: any = { customerId: this.id };
    await softRemove(Customer, { id: this.id }, [Card], findOptions);
  }
}

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async getOrCreateCustomer(
    stripe: Stripe,
    email: string,
    phoneNumber?: string,
    countryAlpha2Code?: string,
    payload?: any
  ): Promise<TAddCustomer> {
    let user: User | undefined = undefined;
    if (payload && payload.sub) {
      user = await User.findOne({
        where: [{ id: payload.sub }, { email }],
        relations: ["account", "account.country", "customer", "customer.user", "customer.cards", "customer.country"],
      });
      if (!user) throw new Error(errors.USER_NOT_FOUND_MESSAGE);
    } else
      user = await User.findOne({
        where: { email },
        relations: ["account", "account.country", "customer", "customer.user", "customer.cards", "customer.country"],
      });

    if (user && user.customer)
      return {
        customer: user.customer,
        added: false,
      };

    if (email && !user) {
      try {
        await validateEmailSchema(email);
      } catch (err) {
        throw new Error(err.message);
      }
    }

    const newCustomer = Customer.create({
      user,
      email: user ? user.email : email,
    });

    try {
      if (user && user.account && user.account && user.account.phoneNumber) newCustomer.phoneNumber = user.account.phoneNumber;
      else newCustomer.phoneNumber = phoneNumber;
      if (countryAlpha2Code) {
        const country = await Country.findOne({ alpha2Code: countryAlpha2Code });
        if (country) newCustomer.country = country;
      }

      // create a customer in Stripe too, to get its Stripe customer ID
      let userAccount: Account | undefined = undefined;
      if (user && user.account) userAccount = user.account;

      const stripeCustomer: any = await stripe.customers.create({
        email: newCustomer.email,
        description: user ? "#beach_bar user" : undefined,
        name: user ? user.getFullName() : undefined,
        address: userAccount
          ? {
              line1: userAccount.address || "",
              country: userAccount.country?.alpha2Code || undefined,
              city: userAccount.city || undefined,
              postal_code: userAccount.zipCode || undefined,
            }
          : undefined,
        phone: newCustomer.phoneNumber,
        metadata: {
          is_signed_up: user ? "true" : "false",
        },
      });
      if (!stripeCustomer && (stripeCustomer.email !== email || stripeCustomer.email !== user?.email))
        throw new Error(errors.SOMETHING_WENT_WRONG);
      newCustomer.stripeCustomerId = stripeCustomer.id;
      await newCustomer.save();
    } catch (err) {
      throw new Error(errors.SOMETHING_WENT_WRONG + ": " + err.message);
    }

    return {
      customer: newCustomer,
      added: true,
    };
  }

  async createStripeWebhookCustomer(stripeCustomer: any): Promise<void | Error> {
    const { email, id } = stripeCustomer;
    const user = await User.findOne({
      where: { email },
      relations: ["account", "account.country", "customer", "customer.user", "customer.cards"],
    });

    if (email && !user) {
      try {
        await validateEmailSchema(email);
      } catch (err) {
        throw new Error(err.message);
      }
    }

    const newCustomer = Customer.create({
      user,
      email: user ? user.email : email,
    });

    try {
      newCustomer.stripeCustomerId = id;
      await newCustomer.save();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateStripeWebhookCustomer(stripeCustomer: any): Promise<void | Error> {
    const { email, address, name, phone, default_source: defaultSource } = stripeCustomer;
    const customer = await Customer.findOne({
      where: { stripeCustomerId: stripeCustomer.id },
      relations: ["user", "user.account", "cards", "cards.customer", "cards.customer.cards"],
    });
    if (!customer) throw new Error("Customer does not exist");

    if (customer.user) {
      let country: Country | undefined = undefined;
      if (address.country) country = await Country.findOne({ alpha2Code: address.country });
      await customer.user.update({
        email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
        address: address.line1,
        countryId: country ? country.id : undefined,
        city: customer.user.account.city ? customer.user.account.city : undefined,
        zipCode: address.zipCode ? address.zipCode : undefined,
      });
      if (phone) {
        customer.phoneNumber = phone;
        await customer.save();
      }
      if (defaultSource && customer.cards) {
        const defaultCard = customer.cards.find(card => card.stripeId === defaultSource && card.isExpired === false);
        if (defaultCard) await defaultCard.updateCard(undefined, undefined, undefined, true, true);
      }
    }
  }
}
