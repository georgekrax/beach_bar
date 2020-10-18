import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LoginDetails } from "./LoginDetails";

@Entity({ name: "login_platform", schema: "public" })
export class LoginPlatform extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 25, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 255, name: "url_hostname", unique: true })
  urlHostname: string;

  @OneToMany(() => LoginDetails, LoginDetails => LoginDetails.platform, { onDelete: "SET NULL" })
  loginDetails: LoginDetails[];
}
