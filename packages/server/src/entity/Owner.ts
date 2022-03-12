import { softRemove } from "@/utils/softRemove";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBarOwner } from "./BeachBarOwner";
import { ProductPriceHistory } from "./ProductPriceHistory";
import { User } from "./User";

@Entity({ name: "owner", schema: "public" })
export class Owner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", name: "user_id" })
  userId: number;

  @OneToOne(() => User, user => user.owner, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => BeachBarOwner, beachBarOwner => beachBarOwner.owner)
  beachBars: BeachBarOwner[];

  @OneToMany(() => ProductPriceHistory, productPriceHistory => productPriceHistory.owner)
  priceHistory: ProductPriceHistory[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async softRemove(): Promise<any> {
    const findOptions: any = { ownerId: this.id };
    await softRemove(Owner, { id: this.id }, [BeachBarOwner], findOptions);
  }
}
