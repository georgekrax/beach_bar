import dayjs, { Dayjs } from "dayjs";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "@/utils/softRemove";
import { Country } from "./Country";
import { LoginDetails } from "./LoginDetails";
import { User } from "./User";

export enum personHonorificTitle {
  dr = "Dr",
  lady = "Lady",
  miss = "Miss",
  mr = "Mr",
  mrs = "Mrs",
  ms = "Ms",
  sr = "Sr",
}

@Entity({ name: "account", schema: "public" })
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", unique: true, type: "integer" })
  userId: number;

  @Column({ name: "honorific_title", type: "enum", enum: personHonorificTitle, enumName: "person_honorific_title", nullable: true })
  honorificTitle?: string | null;

  @Column({ name: "img_url", type: "text", nullable: true })
  imgUrl?: string;

  @Column({ name: "birthday", type: "date", nullable: true })
  birthday?: Dayjs | "none" | null;

  @Column({ name: "age", type: "smallint", nullable: true })
  age?: number;

  @Column({ name: "country_id", type: "integer", nullable: true })
  countryId?: number;

  @Column("varchar", { length: 255, name: "city", nullable: true })
  city?: string;

  @Column("varchar", { length: 20, name: "phone_number", nullable: true })
  phoneNumber?: string;

  @Column({ name: "tel_country_id", type: "integer", nullable: true })
  telCountryId?: number;

  @Column("varchar", { length: 100, name: "address", nullable: true })
  address?: string;

  @Column("varchar", { length: 12, name: "zip_code", nullable: true })
  zipCode?: string;

  @Column({ name: "is_active", type: "boolean", default: () => true })
  isActive: boolean;

  @Column({ name: "track_history", type: "boolean", default: () => true })
  trackHistory: boolean;

  @ManyToOne(() => Country, country => country.accounts, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country?: Country | null;

  @ManyToOne(() => Country, country => country.accounts, { nullable: true })
  @JoinColumn({ name: "tel_country_id" })
  telCountry?: Country | null;

  @OneToOne(() => User, user => user.account, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.account, { nullable: true })
  loginDetails?: LoginDetails[];

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  @BeforeInsert() // Done
  @BeforeUpdate() // Done
  calculateUsersAge(): void {
    if (this.birthday) {
      const differenceMs = dayjs().subtract(+dayjs(this.birthday), "millisecond");
      const ageFormat = Math.abs(dayjs(differenceMs).year() - 1970);
      this.age = ageFormat;
    }
  }

  async softRemove(): Promise<any> {
    const findOptions: any = { accountId: this.id };
    await softRemove(Account, { id: this.id }, [], findOptions);
  }
}
