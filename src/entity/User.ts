import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: "user", schema: "public" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column("varchar", { name: "email", length: 255, unique: true })
  email: string;

  @Column({ name: "hashtag_id", type: "bigint", unique: true, nullable: true })
  hashtagId: bigint;

  @Column({ name: "token_version", type: "integer", default: 0 })
  tokenVersion: number;

  @Column({ name: "google_id", type: "bigint", unique: true, nullable: true })
  googleId: bigint;

  @Column({ name: "facebook_id", type: "bigint", unique: true, nullable: true })
  facebookId: bigint;

  @Column({ name: "instagram_id", type: "bigint", unique: true, nullable: true })
  instagramId: bigint;

  @Column("varchar", { name: "first_name", length: 255, nullable: true })
  firstName: string;

  @Column("varchar", { name: "last_name", length: 255, nullable: true })
  lastName: string;

  @Column({ name: "is_owner", type: "boolean", default: false })
  isOwner: boolean;
}
