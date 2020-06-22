import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./Account";
import { Country } from "./Country";

@Entity({ name: "user_contact_details", schema: "public" })
@Unique("contact_details_phone_number_key", ["accountId", "phoneNumber"])
@Unique("contact_details_secondary_email_key", ["accountId", "secondaryEmail"])
@Unique("contact_details_phone_number_secondary_email_key", ["accountId", "secondaryEmail", "phoneNumber"])
export class UserContactDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "account_id", type: "integer" })
  accountId: number;

  @Column({ name: "country_id", type: "integer", nullable: true })
  countryId: number;

  @Column("varchar", { length: 255, name: "secondary_email", nullable: true })
  secondaryEmail: string;

  @Column("varchar", { name: "phone_number", length: 20, unique: true, nullable: true })
  phoneNumber: string;

  @ManyToOne(() => Account, account => account.contactDetails, {
    nullable: false,
    cascade: ["soft-remove", "recover"],
  })
  @JoinColumn({ name: "account_id" })
  account: Account;

  @ManyToOne(() => Country, country => country.userContactDetails, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;
}
