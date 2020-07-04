import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, JoinColumn } from "typeorm";
import { Country } from "./Country";

export enum iconSize {
  x12 = "12x12",
  x16 = "16x16",
  x24 = "24x24",
  x29 = "29x29",
  x32 = "32x32",
  x48 = "48x48",
  x58 = "58x58",
  x64 = "64x64x",
  x72 = "72x72",
  x96 = "96x96",
  x100 = "100x100",
  x120 = "120x120",
  x128 = "128x128",
  x180 = "180x180",
  x192 = "192x192",
  x256 = "256x256",
  x512 = "512x512",
  x1024 = "1024x1024",
}

@Entity({ name: "country_flag_icon", schema: "public" })
@Unique("country_flag_icon_unique", ["size", "countryId"])
export class CountryFlagIcon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", name: "url_value" })
  urlValue: string;

  @Column({ type: "enum", enum: iconSize, enumName: "icon_size", name: "size" })
  size: string;

  @Column({ type: "integer", name: "country_id", nullable: false })
  countryId: number;

  @ManyToOne(() => Country, country => country.flagIcons, { nullable: false })
  @JoinColumn({ name: "country_id" })
  country: Country;
}
