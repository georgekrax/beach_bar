import { Dayjs } from "dayjs";
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { Account } from "./Account";
import { AccountPreferenceType } from "./AccountPreferenceType";

@Entity({ name: "account_preference", schema: "public" })
export class AccountPreference extends BaseEntity {
  @PrimaryColumn({ type: "integer", name: "account_id" })
  accountId: number;

  @PrimaryColumn({ type: "integer", name: "preference_id" })
  preferenceId: number;

  @ManyToOne(() => Account, account => account.preferences, { nullable: false })
  @JoinColumn({ name: "account_id" })
  account: Account;

  @ManyToOne(() => AccountPreferenceType, accountPreferenceType => accountPreferenceType.accounts, { nullable: false })
  @JoinColumn({ name: "preference_id" })
  preference: AccountPreferenceType;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async softRemove(): Promise<any> {
    await softRemove(AccountPreference, { accountId: this.accountId, preferenceId: this.preferenceId });
  }
}
