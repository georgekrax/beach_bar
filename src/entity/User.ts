import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  // eslint-disable-next-line prettier/prettier
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./Account";
import { BeachBarOwner } from "./BeachBarOwner";
import { BeachBarReview } from "./BeachBarReview";
import { UserSearch } from "./UserSearch";

@Entity({ name: "user", schema: "public" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { name: "email", length: 255 })
  @Index({ where: `"deletedAt" IS NULL`, unique: true })
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

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @OneToOne(() => Account, account => account.user, { eager: false })
  account: Account;

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.user)
  reviews?: BeachBarReview[];

  @OneToMany(() => UserSearch, userSearch => userSearch.user)
  searches?: UserSearch[];

  @OneToMany(() => BeachBarOwner, beachBarOwner => beachBarOwner.user, { nullable: true })
  beachBars: BeachBarOwner[];
}
