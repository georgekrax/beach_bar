import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { LoginDetails } from "./LoginDetails";

@Entity({ name: "platform", schema: "public" })
export class Platform extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 25, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 255, name: "url_hostname", unique: true })
  urlHostname: string;

  @OneToMany(() => LoginDetails, LoginDetails => LoginDetails.platform)
  loginDetails: LoginDetails[];
}
