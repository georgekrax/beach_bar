import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { BeachBarReview } from "./BeachBarReview";

@Entity({ name: "review_visit_type", schema: "public" })
export class ReviewVisitType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, unique: true, name: "name" })
  name: string;

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.visitType)
  reviews: BeachBarReview[];
}
