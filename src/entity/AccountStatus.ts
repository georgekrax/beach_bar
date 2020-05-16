import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Account } from "./Account";

@Entity({ name: "account_status", schema: "public" })
export class AccountStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50 })
  name: string;

  @OneToMany(() => Account, account => account.status)
  accounts: Account[];
}
