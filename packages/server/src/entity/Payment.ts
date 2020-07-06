import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  MoreThanOrEqual,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import errors from "../constants/errors";
import { payment } from "../constants/status";
import { softRemove } from "../utils/softRemove";
import { BeachBarReview } from "./BeachBarReview";
import { Card } from "./Card";
import { Cart } from "./Cart";
import { PaymentStatus } from "./PaymentStatus";
import { RefundPercentage } from "./RefundPercentage";
import { ReservedProduct } from "./ReservedProduct";

interface GetRefundPercentage {
  refundPercentage: RefundPercentage;
  daysDiff: number;
}

@Entity({ name: "payment", schema: "public" })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @Column({ type: "bigint", name: "card_id" })
  cardId: bigint;

  @Column("varchar", { length: 10, name: "ref_code", unique: true })
  refCode: string;

  @Column({ type: "integer", name: "status_id", default: () => 1 })
  statusId: number;

  @Column("varchar", { length: 255, name: "stripe_id" })
  stripeId: string;

  @Column({ type: "boolean", name: "is_refunded", default: () => false })
  isRefunded: boolean;

  @Column({ type: "decimal", precision: 12, scale: 2, name: "app_fee" })
  appFee: number;

  @Column({ type: "integer", name: "transfer_amount" })
  transferAmount: number;

  @ManyToOne(() => Cart, cart => cart.payments, { nullable: false })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Card, card => card.payments, { nullable: false })
  @JoinColumn({ name: "card_id" })
  card: Card;

  @ManyToOne(() => PaymentStatus, paymentStatus => paymentStatus.payments, { nullable: false })
  @JoinColumn({ name: "status_id" })
  status: PaymentStatus;

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.payment, { nullable: true })
  reviews?: BeachBarReview[];

  @OneToMany(() => ReservedProduct, reservedProduct => reservedProduct.payment, { nullable: true })
  reservedProducts?: ReservedProduct[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Date;

  async createReservedProducts(): Promise<ReservedProduct[] | any> {
    const cartProducts = this.cart.products;
    if (cartProducts) {
      const newReservedProducts: ReservedProduct[] = [];
      for (let i = 0; i < cartProducts.length; i++) {
        const cartProduct = cartProducts[i];
        const newReservedProduct = ReservedProduct.create({
          product: cartProduct.product,
          payment: this,
          date: cartProduct.date,
          time: cartProduct.time,
        });
        await newReservedProduct.save();
        newReservedProducts.push(newReservedProduct);
      }

      if (newReservedProducts.length === 0) {
        throw new Error(errors.SOMETHING_WENT_WRONG);
      }

      const status = await PaymentStatus.findOne({ status: payment.PAID });
      if (!status) {
        throw new Error(errors.SOMETHING_WENT_WRONG);
      }

      this.status = status;
      await this.save();

      return newReservedProducts;
    } else {
      throw new Error(errors.SOMETHING_WENT_WRONG);
    }
  }

  async getRefundPercentage(): Promise<GetRefundPercentage | undefined> {
    const products = this.cart.products;
    if (!products) {
      return undefined;
    }
    const minDate = products
      .map(product => product.date)
      .reduce(function (a, b) {
        return a < b ? a : b;
      });
    const daysDiff = new Date().getTime() - new Date(minDate.toString()).getTime();
    const refundPercentage = await RefundPercentage.findOne({ daysMilliseconds: MoreThanOrEqual(daysDiff) });
    if (!refundPercentage) {
      return undefined;
    }

    return {
      refundPercentage,
      daysDiff,
    };
  }

  async softRemove(): Promise<any> {
    await this.cart.customSoftRemove(false);
    const findOptions: any = { paymentId: this.id };
    await softRemove(Payment, { id: this.id }, [ReservedProduct], findOptions);
  }
}
