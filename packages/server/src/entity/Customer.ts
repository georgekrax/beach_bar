import { validateEmailSchema } from "@beach_bar/common";
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
import errors from "../constants/errors";
import { AddCustomerType } from "../schema/customer/returnTypes";
import { ErrorType } from "../schema/returnTypes";
import { softRemove } from "../utils/softRemove";
import { Account } from "./Account";
import { BeachBarReview } from "./BeachBarReview";
import { Card } from "./Card";
import { City } from "./City";
import { Country } from "./Country";
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
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async update(phoneNumber?: string, countryIsoCode?: string): Promise<Customer | any> {
    try {
      if (phoneNumber && phoneNumber !== this.phoneNumber && phoneNumber.trim().length !== 0) {
        this.phoneNumber = phoneNumber;
      }
      if (countryIsoCode && countryIsoCode.trim().length !== 0) {
        const country = await Country.findOne({ isoCode: countryIsoCode });
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
    countryIsoCode?: string,
    payload?: any,
  ): Promise<AddCustomerType | ErrorType> {
    let user: User | undefined = undefined;
    if (payload && payload.sub) {
      user = await User.findOne({
        where: [{ id: payload.sub }, { email }],
        relations: [
          "account",
          "account.city",
          "account.country",
          "account.contactDetails",
          "customer",
          "customer.user",
          "customer.cards",
          "customer.country",
        ],
      });
      if (!user) {
        return { error: { code: errors.CONFLICT, message: errors.USER_DOES_NOT_EXIST } };
      }
    } else {
      user = await User.findOne({
        where: { email },
        relations: [
          "account",
          "account.city",
          "account.country",
          "account.contactDetails",
          "customer",
          "customer.user",
          "customer.cards",
          "customer.country",
        ],
      });
    }

    if (user && user.customer) {
      return {
        customer: user.customer,
        added: false,
      };
    }

    if (email && !user) {
      try {
        await validateEmailSchema(email);
      } catch (err) {
        return { error: { code: errors.INVALID_ARGUMENTS, message: err.message } };
      }
    }

    const newCustomer = Customer.create({
      user,
      email: user ? user.email : email,
    });

    try {
      if (user && user.account && user.account.contactDetails && user.account.contactDetails[0]) {
        newCustomer.phoneNumber = user.account.contactDetails[0].phoneNumber;
      } else {
        newCustomer.phoneNumber = phoneNumber;
      }
      if (countryIsoCode) {
        const country = await Country.findOne({ isoCode: countryIsoCode });
        if (country) {
          newCustomer.country = country;
        }
      }

      // create a customer in Stripe too, to get its Stripe customer ID
      let userAccount: Account | undefined = undefined;
      if (user && user.account) {
        userAccount = user.account;
      }

      const stripeCustomer: any = await stripe.customers.create({
        email: newCustomer.email,
        description: user ? "#beach_bar user" : undefined,
        name: user ? user.getFullName() : undefined,
        address: userAccount
          ? {
              line1: userAccount.address || "",
              country: userAccount.country?.isoCode || undefined,
              city: userAccount.city?.name || undefined,
              postal_code: userAccount.zipCode || undefined,
            }
          : undefined,
        phone: newCustomer.phoneNumber,
        metadata: {
          is_signed_up: user ? "true" : "false",
        },
      });
      if (!stripeCustomer && (stripeCustomer.email !== email || stripeCustomer.email !== user?.email)) {
        return { error: { message: errors.SOMETHING_WENT_WRONG } };
      }
      newCustomer.stripeCustomerId = stripeCustomer.id;
      await newCustomer.save();
    } catch (err) {
      return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
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
      relations: [
        "account",
        "account.city",
        "account.country",
        "account.contactDetails",
        "customer",
        "customer.user",
        "customer.cards",
      ],
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
      relations: ["user", "user.account", "user.account.contactDetails", "cards", "cards.customer", "cards.customer.cards"],
    });
    if (!customer) {
      throw new Error("Customer does not exist");
    }

    if (customer.user) {
      let country: Country | undefined = undefined;
      if (address.country) {
        country = await Country.findOne({ isoCode: address.country });
      }
      let city: City | undefined = undefined;
      if (address.city) {
        city = await City.findOne({ name: address.city });
      }
      await customer.user.updateUser({
        email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
        address: address.line1,
        countryId: country ? country.id : undefined,
        cityId: city ? city.id : undefined,
        zipCode: address.zipCode ? address.zipCode : undefined,
      });
      if (phone) {
        customer.phoneNumber = phone;
        await customer.save();
      }
      if (defaultSource && customer.cards) {
        const defaultCard = customer.cards.find(card => card.stripeId === defaultSource && card.isExpired === false);
        if (defaultCard) {
          await defaultCard.updateCard(undefined, undefined, undefined, true, true);
        }
      }
    }
  }
}