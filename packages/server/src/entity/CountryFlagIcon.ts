import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, JoinColumn } from "typeorm";
import { Country } from "./Country";
import { IconSize } from "./IconSize";

@Entity({ name: "country_flag_icon", schema: "public" })
@Unique("country_flag_icon_unique", ["sizeId", "countryId"])
export class CountryFlagIcon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", name: "url_value" })
  urlValue: string;

  @Column({ type: "integer", name: "size_id" })
  sizeId: number;

  @Column({ type: "integer", name: "country_id", nullable: false })
  countryId: number;

  @ManyToOne(() => IconSize, iconSize => iconSize.flagIcons, { nullable: false })
  @JoinColumn({ name: "size_id" })
  size: IconSize;

  @ManyToOne(() => Country, country => country.flagIcons, { nullable: false })
  @JoinColumn({ name: "country_id" })
  country: Country;
}
