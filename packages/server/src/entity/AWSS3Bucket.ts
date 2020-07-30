import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "aws_s3_bucket", schema: "public" })
export class AWSS3Bucket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, name: "name", unique: true })
  name: string;

  @Column("varchar", { length: 25, name: "region" })
  region: string;

  @Column("varchar", { length: 2, name: "signature_version" })
  signatureVersion: string;

  @Column({ type: "smallint", name: "url_expiration" })
  urlExpiration: number;

  @Column({ type: "smallint", name: "key_length" })
  keyLength: number;

  @Column("varchar", { length: 5, name: "key_and_filename_separator" })
  keyAndFilenameSeparator: string;

  @Column("varchar", { length: 255, name: "table_name", unique: true })
  tableName: string;
}
