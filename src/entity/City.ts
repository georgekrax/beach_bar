import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./Country";
import { LoginDetails } from "./LoginDetails";
import { UserContactDetails } from "./UserContactDetails";

@Entity({ name: "city", schema: "public" })
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100, name: "name", unique: true })
  name: string;

  @Column({ name: "country_id", type: "integer" })
  countryId: number;

  @ManyToOne(() => Country, country => country.cities, { nullable: false })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @OneToMany(() => UserContactDetails, userContactDetails => userContactDetails.city)
  userContactDetails: UserContactDetails[];

  @OneToMany(() => LoginDetails, loginDetails => loginDetails.city)
  loginDetails: LoginDetails[];
}
