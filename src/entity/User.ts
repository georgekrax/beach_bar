import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";

@Entity({ name: "user", schema: "public" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column("varchar", { name: "username", length: 30, unique: true })
  username: string;

  @Column("varchar", { name: "email", length: 255, unique: true })
  email: string;

  @Column({ name: "hashtag_id", type: "bigint", unique: true })
  hashtagId: bigint;

  @Column({ name: "google_id", type: "bigint", unique: true, nullable: true })
  googleId: bigint;

  @Column({ name: "facebook_id", type: "bigint", unique: true, nullable: true })
  facebookId: bigint;

  @Column({ name: "instagram_id", type: "bigint", unique: true, nullable: true })
  instagramId: bigint;

  @Column("varchar", { name: "first_name", length: 255, nullable: true })
  firstName: string;

  @Column("varchar", { name: "last_name", length: 255, nullable: true })
  lastName: string;

  @Column({ name: "account_id", unique: true, type: "bigint" })
  accountId: bigint;

  @OneToOne(() => Account)
  @JoinColumn({ name: "account_id" })
  account: Account;
}
