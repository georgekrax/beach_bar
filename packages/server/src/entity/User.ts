import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  // eslint-disable-next-line prettier/prettier
  UpdateDateColumn,
} from "typeorm";
import { UpdateUser } from "../schema/user/returnTypes";
import { softRemove } from "../utils/softRemove";
import { Account } from "./Account";
import { BeachBarReview } from "./BeachBarReview";
import { Cart } from "./Cart";
import { City } from "./City";
import { Country } from "./Country";
import { Customer } from "./Customer";
import { Owner } from "./Owner";
import { UserSearch } from "./UserSearch";
import { Vote } from "./Vote";
import { Dayjs } from "dayjs";

@Entity({ name: "user", schema: "public" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { length: 35, name: "username", unique: true })
  username?: string;

  @Column({ name: "token_version", type: "integer", default: () => 0 })
  tokenVersion: number;

  @Column({ name: "hashtag_id", type: "bigint", nullable: true })
  hashtagId?: bigint;

  @Column("varchar", { length: 255, name: "google_id", nullable: true })
  googleId?: string;

  @Column("varchar", { length: 255, name: "facebook_id", nullable: true })
  facebookId?: string;

  @Column("varchar", { length: 255, name: "instagram_id", nullable: true })
  instagramId?: string;

  @Column("varchar", { length: 35, name: "instagram_username", nullable: true })
  instagramUsername?: string;

  @Column("varchar", { name: "first_name", length: 255, nullable: true })
  firstName?: string;

  @Column("varchar", { name: "last_name", length: 255, nullable: true })
  lastName?: string;

  @OneToOne(() => Account, account => account.user)
  account: Account;

  // * excluded in softRemove
  @OneToMany(() => UserSearch, userSearch => userSearch.user)
  searches?: UserSearch[];

  @OneToMany(() => Cart, cart => cart.user)
  carts?: Cart[];

  // * excluded in softRemove
  @OneToMany(() => Vote, vote => vote.user, { nullable: true })
  votes?: Vote[];

  @OneToOne(() => Owner, owner => owner.user)
  owner: Owner;

  @OneToOne(() => Customer, customer => customer.user)
  customer?: Customer;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  getFullName(): string {
    return `${this.firstName ? this.firstName : ""}${this.firstName && this.lastName ? " " : ""}${this.lastName ? this.lastName : ""}`;
  }

  getIsNew(data: UpdateUser): boolean {
    let isNew = false;
    const { email, username, firstName, lastName, imgUrl, personTitle, birthday, countryId, cityId, address, zipCode } = data;
    if (
      email !== this.email ||
      username !== this.username ||
      firstName !== this.firstName ||
      lastName !== this.lastName ||
      imgUrl !== this.account.imgUrl ||
      personTitle !== this.account.personTitle ||
      birthday !== this.account.birthday ||
      countryId !== this.account.countryId ||
      cityId !== this.account.cityId ||
      address !== this.account.address ||
      zipCode !== this.account.zipCode
    ) {
      isNew = true;
    }
    return isNew;
  }

  async updateUser(data: UpdateUser): Promise<{ user: User; isNew: boolean }> {
    const isNew = this.getIsNew(data);
    const { email, username, firstName, lastName, imgUrl, personTitle, birthday, countryId, cityId, address, zipCode } = data;
    if (email && email.trim().length !== 0) {
      this.email = email;
    }
    if (username && username.trim().length === 0) {
      this.username = undefined;
    } else if (username) {
      this.username = username;
    }
    if (firstName && firstName.trim().length === 0) {
      this.firstName = undefined;
    } else if (firstName) {
      this.firstName = firstName;
    }
    if (lastName && lastName.trim().length === 0) {
      this.lastName = undefined;
    } else if (lastName) {
      this.lastName = lastName;
    }
    if (imgUrl && imgUrl.toString().trim().length === 0) {
      this.account.imgUrl = undefined;
    } else if (imgUrl) {
      this.account.imgUrl = imgUrl;
    }
    if (personTitle && personTitle.trim().length === 0) {
      this.account.personTitle = undefined;
    } else if (personTitle) {
      this.account.personTitle = personTitle;
    }
    if (birthday && birthday.toString().trim().length === 0) {
      this.account.birthday = undefined;
    } else if (birthday) {
      this.account.birthday = birthday;
    }
    if (address && address.trim().length === 0) {
      this.account.address = undefined;
    } else if (address) {
      this.account.address = address;
    }
    if (zipCode && zipCode.trim().length === 0) {
      this.account.zipCode = undefined;
    } else if (zipCode) {
      this.account.zipCode = zipCode;
    }
    if (countryId && countryId <= 0) {
      this.account.country = undefined;
    } else if (countryId) {
      const country = await Country.findOne(countryId);
      if (country) {
        this.account.country = country;
      }
    }
    if (cityId && cityId <= 0) {
      this.account.city = undefined;
    } else if (cityId) {
      const city = await City.findOne(cityId);
      if (city) {
        this.account.city = city;
      }
    }
    if (isNew) {
      await this.save();
      await this.account.save();
    }
    return { user: this, isNew };
  }

  async softRemove(): Promise<any> {
    const findOptions: any = { userId: this.id };
    await softRemove(User, { id: this.id }, [Account, BeachBarReview, Cart, Owner, Customer], findOptions);
  }
}
