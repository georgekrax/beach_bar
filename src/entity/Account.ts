import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ContactDetails } from "./ContactDetails";
import { AccountStatus } from "./AccountStatus";

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
  id: bigint;

  @Column({ name: "person_title", type: "enum", enum: personHonorificTitle, enumName: "person_honorific_title", nullable: true })
  personTitle: string;

  @Column({ name: "img_url", type: "text", nullable: true })
  imgUrl: string;

  @Column({ name: "birthday", type: "date", nullable: true })
  birthday: Date;

  @Column({ name: "age", type: "smallint", nullable: true })
  age: number;

  @Column({ name: "status_id", type: "integer", default: 1, nullable: true })
  statusId: number;

  @ManyToOne(() => AccountStatus, accountStatus => accountStatus.accounts)
  @JoinColumn({ name: "status_id" })
  status: AccountStatus;

  @Column({ name: "is_active", type: "boolean", nullable: true, default: false })
  isActive: boolean;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @OneToMany(() => ContactDetails, contactDetails => contactDetails.account)
  contactDetails: ContactDetails[];
}
