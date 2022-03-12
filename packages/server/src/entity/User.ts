import { UpdateUserInfo } from "@/typings/user";
import { softRemove } from "@/utils/softRemove";
import dayjs, { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./Account";
import { BeachBarReview } from "./BeachBarReview";
import { Cart } from "./Cart";
import { Country } from "./Country";
import { Customer } from "./Customer";
import { Owner } from "./Owner";
import { ReviewVote } from "./ReviewVote";
import { UserFavoriteBar } from "./UserFavoriteBar";
import { UserHistory } from "./UserHistory";
import { UserSearch } from "./UserSearch";
import { Vote } from "./Vote";

@Entity({ name: "user", schema: "public" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

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

  @OneToMany(() => UserFavoriteBar, userFavoriteBar => userFavoriteBar.user)
  favoriteBars?: UserFavoriteBar[];

  // * excluded in softRemove
  @OneToMany(() => Vote, vote => vote.user, { nullable: true })
  votes?: Vote[];

  @OneToMany(() => ReviewVote, vote => vote.user, { nullable: true })
  reviewVotes?: ReviewVote[];

  @OneToOne(() => Owner, owner => owner.user)
  owner: Owner;

  @OneToOne(() => Customer, customer => customer.user)
  customer?: Customer;

  @OneToMany(() => UserHistory, userHistory => userHistory.user, { nullable: true })
  history: UserHistory[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  getFullName(): string {
    return `${this.firstName ? this.firstName : ""}${this.firstName && this.lastName ? " " : ""}${this.lastName ? this.lastName : ""}`;
  }

  // getRedisKey(scope = false): string {
  //   if (scope) return redisKeys.USER + ":" + this.id + ":" + redisKeys.USER_SCOPE;
  //   return redisKeys.USER + ":" + this.id;
  // }

  getIsNew(data: UpdateUserInfo): boolean {
    let isNew = false;
    const { email, firstName, lastName, imgUrl, honorificTitle, birthday, countryId, city, phoneNumber, address, zipCode } = data;
    if (
      email !== this.email ||
      firstName !== this.firstName ||
      lastName !== this.lastName ||
      imgUrl !== this.account.imgUrl ||
      honorificTitle !== this.account.honorificTitle ||
      birthday !== this.account.birthday ||
      countryId !== this.account.countryId ||
      city !== this.account.city ||
      phoneNumber !== this.account.phoneNumber ||
      address !== this.account.address ||
      zipCode !== this.account.zipCode
    )
      isNew = true;
    return isNew;
  }

  async update(data: UpdateUserInfo): Promise<{ user: User; isNew: boolean } | any> {
    const isNew = this.getIsNew(data);
    const {
      email,
      firstName,
      lastName,
      imgUrl,
      honorificTitle,
      birthday,
      countryId,
      city,
      phoneNumber,
      telCountryId,
      address,
      zipCode,
      trackHistory,
    } = data;
    try {
      if (email && email !== this.email) this.email = email;
      if (firstName && firstName !== this.firstName) this.firstName = firstName;
      if (lastName && lastName !== this.lastName) this.lastName = lastName;
      if (imgUrl && imgUrl !== this.account.imgUrl) this.account.imgUrl = imgUrl.toString();
      if (honorificTitle && honorificTitle !== this.account.honorificTitle) {
        if (honorificTitle.toLowerCase().trim() === "none") this.account.honorificTitle = null;
        else this.account.honorificTitle = honorificTitle;
      }
      if (birthday) {
        if (birthday.toString().toLowerCase().trim() === "none") this.account.birthday = null;
        else if (dayjs(birthday) !== (this.account.birthday ? dayjs(this.account.birthday) : undefined))
          this.account.birthday = birthday;
      }
      if (address && address !== this.account.address) this.account.address = address;
      if (zipCode && zipCode !== this.account.zipCode) this.account.zipCode = zipCode;
      if (countryId && countryId !== this.account.countryId) {
        if (countryId.toString().toLowerCase().trim() === "none") this.account.country = null;
        else {
          const country = await Country.findOne(countryId);
          if (country) this.account.country = country;
        }
      }
      if (city && city !== this.account.city) this.account.city = city;
      if (phoneNumber && phoneNumber !== this.account.phoneNumber) this.account.phoneNumber = phoneNumber;
      if (telCountryId && telCountryId !== this.account.telCountryId) {
        if (telCountryId.toString().toLowerCase().trim() === "none") this.account.telCountry = null;
        else {
          const telCountry = await Country.findOne(telCountryId);
          if (telCountryId) this.account.telCountry = telCountry;
        }
      }
      if (trackHistory !== undefined && trackHistory !== this.account.trackHistory) this.account.trackHistory = trackHistory;
      if (isNew) {
        await this.save();
        await this.account.save();
      }
      return { user: this, isNew };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    const findOptions: any = { userId: this.id };
    // delete in Redis, happens within the User mutation resolvers
    await softRemove(
      User,
      { id: this.id },
      [Account, BeachBarReview, Cart, UserFavoriteBar, Owner, Customer, ReviewVote],
      findOptions
    );
  }
}
