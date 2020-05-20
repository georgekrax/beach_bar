import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";

import { City } from "./City";
import { Account } from "./Account";
import { Country } from "./Country";
import { Platform } from "./Platform";
import { ClientOs, ClientBrowser } from "./ClientOs&Browser";

export enum loginDetailStatus {
  loggedIn = "logged_in",
  invalidPassword = "invalid_password",
  failed = "failed",
}

@Entity({ name: "login_details", schema: "public" })
export class LoginDetails extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ name: "account_id", type: "bigint" })
  accountId: bigint;

  @ManyToOne(() => Account, account => account.loginDetails)
  @JoinColumn({ name: "account_id" })
  account: Account;

  @Column({ name: "platform_id", type: "integer" })
  platformId: number;

  @ManyToOne(() => Platform, platform => platform.loginDetails)
  @JoinColumn({ name: "platform_id" })
  platform: Platform;

  @Column({ name: "status", type: "enum", enum: loginDetailStatus, enumName: "login_details_status" })
  status: loginDetailStatus;

  @Column({ name: "os_id", nullable: true })
  osId: number;

  @ManyToOne(() => ClientOs, clientOs => clientOs.loginDetails)
  @JoinColumn({ name: "os_id" })
  clientOs: ClientOs;

  @Column({ name: "browser_id", nullable: true })
  browserId: number;

  @ManyToOne(() => ClientBrowser, clientBrowser => clientBrowser.loginDetails)
  @JoinColumn({ name: "browser_id" })
  clientBrowser: ClientBrowser;

  @Column({ name: "country_id", nullable: true })
  countryId: number;

  @ManyToOne(() => Country, country => country.loginDetails)
  @JoinColumn({ name: "country_id" })
  country: Country;

  @Column({ name: "city_id", nullable: true })
  cityId: number;

  @ManyToOne(() => City, city => city.loginDetails)
  @JoinColumn({ name: "city_id" })
  city: City;

  @Column({ type: "cidr", name: "ip_addr", nullable: true })
  ipAddr: string;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => "NOW()" })
  timestamp: Date;
}
