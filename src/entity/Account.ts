import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ContactDetails } from "./ContactDetails";
import { LoginDetails } from "./LoginDetails";
import { User } from "./User";

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

  @OneToMany(() => ContactDetails, contactDetails => contactDetails.account, { eager: true })
  contactDetails: ContactDetails[];

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
