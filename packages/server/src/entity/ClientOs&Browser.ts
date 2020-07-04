import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";

import { LoginDetails } from "./LoginDetails";

@Entity({ name: "client_os", schema: "public" })
export class ClientOs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50, name: "name", unique: true })
  name: string;

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.clientOs)
  loginDetails: LoginDetails[];
}

@Entity({ name: "client_browser", schema: "public" })
export class ClientBrowser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 20, name: "name", unique: true })
  name: string;

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.clientBrowser)
  loginDetails: LoginDetails[];
}
