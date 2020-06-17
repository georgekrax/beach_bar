import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBarRestaurant } from "./BeachBarRestaurant";
import { BeachBarReview } from "./BeachBarReview";
import { BeachBarOwner } from "./BeachBarOwner";
import { ServiceBeachBar } from "./ServiceBeachBar";

@Entity({ name: "beach_bar", schema: "public" })
export class BeachBar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, unique: true })
  name: string;

  @Column({ type: "text", name: "description", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 3, scale: 1, name: "avg_rating" })
  @Check(`"avgRating" >= 0 AND "avgRating" <= 10`)
  avgRating: number;

  @Column({ type: "boolean", name: "is_active", default: () => false })
  isActive: boolean;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt: Date;

  @OneToMany(() => BeachBarOwner, beachBarOwner => beachBarOwner.beachBar, { nullable: false })
  owners: BeachBarOwner[];

  @OneToMany(() => ServiceBeachBar, serviceBeachBar => serviceBeachBar.beachBar)
  serviceBeachBar: ServiceBeachBar[];

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.beachBar)
  reviews: BeachBarReview[];

  @OneToMany(() => BeachBarRestaurant, beachBarRestaurant => beachBarRestaurant.beachBar)
  restaurants: BeachBarReview[];
}
