import { Dayjs } from "dayjs";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";
import { City } from "./City";
import { ClientBrowser, ClientOs } from "./ClientOs&Browser";
import { Country } from "./Country";
import { LoginPlatform } from "./LoginPlatform";

export enum LoginDetailStatus {
  loggedIn = "logged_in",
  invalidPassword = "invalid_password",
  failed = "failed",
}

@Entity({ name: "login_details", schema: "public" })
export class LoginDetails extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ name: "account_id", type: "integer" })
  accountId: number;

  @Column({ name: "status", type: "enum", enum: LoginDetailStatus, enumName: "login_details_status" })
  status: LoginDetailStatus;

  @Column({ name: "platform_id", type: "integer", nullable: true })
  platformId?: number;

  @Column({ name: "os_id", type: "integer", nullable: true })
  osId?: number;

  @Column({ name: "browser_id", type: "integer", nullable: true })
  browserId?: number;

  @Column({ name: "country_id", type: "integer", nullable: true })
  countryId?: number;

  @Column({ name: "city_id", type: "bigint", nullable: true })
  cityId?: bigint;

  @Column({ type: "cidr", name: "ip_addr", nullable: true })
  ipAddr?: string;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => "NOW()" })
  timestamp: Dayjs;

  @ManyToOne(() => Account, account => account.loginDetails, { nullable: false })
  @JoinColumn({ name: "account_id" })
  account: Account;

  @ManyToOne(() => LoginPlatform, loginPlatform => loginPlatform.loginDetails, { nullable: true })
  @JoinColumn({ name: "platform_id" })
  platform?: LoginPlatform;

  @ManyToOne(() => ClientOs, clientOs => clientOs.loginDetails, { nullable: true })
  @JoinColumn({ name: "os_id" })
  clientOs?: ClientOs;

  @ManyToOne(() => ClientBrowser, clientBrowser => clientBrowser.loginDetails, { nullable: true })
  @JoinColumn({ name: "browser_id" })
  clientBrowser?: ClientBrowser;

  @ManyToOne(() => Country, country => country.loginDetails, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country?: Country;

  @ManyToOne(() => City, city => city.loginDetails, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city?: City;
}
