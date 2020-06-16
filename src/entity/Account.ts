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
import { LoginDetails } from "././LoginDetails";
import { City } from "./City";
import { Country } from "./Country";
import { User } from "./User";
import { UserContactDetails } from "./UserContactDetails";

export enum personHonorificTitle {
  mr = "Mr",
  mrs = "Mrs",
  ms = "Ms",
  miss = "Miss",
  sr = "Sr",
  dr = "Dr",
  lady = "Lady",
}

@Entity({ name: "account", schema: "public" })
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", unique: true, type: "integer" })
  userId: number;

  @Column({ name: "person_title", type: "enum", enum: personHonorificTitle, enumName: "person_honorific_title", nullable: true })
  personTitle: string;

  @Column({ name: "img_url", type: "text", nullable: true })
  imgUrl: string;

  @Column({ name: "birthday", type: "date", nullable: true })
  birthday: Date;

  @Column({ name: "age", type: "smallint", nullable: true })
  age: number;

  @Column({ name: "country_id", type: "integer", nullable: true })
  countryId: number;

  @Column({ name: "city_id", type: "integer", nullable: true })
  cityId: number;

  @Column("varchar", { length: 100, name: "address", nullable: true })
  address: string;

  @Column("varchar", { length: 12, name: "zip_code", nullable: true })
  zipCode: string;

  @Column({ name: "is_active", type: "boolean", nullable: true, default: () => false })
  isActive: boolean;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt: Date;

  @OneToOne(() => User, { nullable: false, cascade: ["soft-remove", "recover", "insert", "update"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Country, country => country.accounts, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @ManyToOne(() => City, city => city.accounts, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city: City;

  @OneToMany(() => UserContactDetails, userContactDetails => userContactDetails.account, { nullable: true })
  contactDetails: UserContactDetails[];

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.account)
  loginDetails: LoginDetails[];

  @BeforeInsert()
  @BeforeUpdate()
  calculateUsersAge(): void {
    if (this.birthday) {
      const differenceMs = Date.now() - this.birthday.getTime();
      const ageDifference = new Date(differenceMs);
      const ageFormat = Math.abs(ageDifference.getUTCFullYear() - 1970);
      this.age = ageFormat;
    }
  }
}
