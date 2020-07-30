import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CountryFlagIcon } from "./CountryFlagIcon";

@Entity({ name: "icon_size", schema: "public" })
export class IconSize extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "smallint", name: "value", unique: true })
  value: number;

  @Column("varchar", { length: 25, name: "formatted_value", unique: true })
  formattedValue: string;

  @OneToMany(() => CountryFlagIcon, countryFlagIcon => countryFlagIcon.size, { nullable: true })
  flagIcons?: CountryFlagIcon[];
}
