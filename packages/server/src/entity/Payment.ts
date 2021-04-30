import { errors } from "@beach_bar/common";
import { DATA } from "constants/data";
import dayjs, { Dayjs } from "dayjs";
import minMax from "dayjs/plugin/minMax";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  LessThanOrEqual,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { GetRefundPercentage } from "typings/payment";
import { softRemove } from "utils/softRemove";
import { BeachBar } from "./BeachBar";
import { BeachBarReview } from "./BeachBarReview";
import { Card } from "./Card";
import { Cart } from "./Cart";
import { PaymentStatus } from "./PaymentStatus";
import { PaymentVoucherCode } from "./PaymentVoucherCode";
import { Product } from "./Product";
import { RefundPercentage } from "./RefundPercentage";
import { ReservedProduct } from "./ReservedProduct";

const { STATUSES } = DATA.PAYMENT;

@Entity({ name: "payment", schema: "public" })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "bigint", name: "cart_id" })
  cartId: bigint;

  @Column({ type: "bigint", name: "card_id" })
  cardId: bigint;

  @Column("varchar", { length: 16, name: "ref_code", unique: true })
  refCode: string;

  @Column({ type: "integer", name: "status_id", default: () => 1 })
  statusId: number;

  @Column("varchar", { length: 255, name: "stripe_id" })
  stripeId: string;

  @Column("varchar", { length: 19, name: "transfer_group_code", unique: true })
  transferGroupCode: string;

  @Column({ type: "boolean", name: "is_refunded", default: () => false })
  isRefunded: boolean;

  @Column({ type: "decimal", precision: 12, scale: 2, name: "app_fee" })
  appFee: number;

  @Column({ type: "decimal", precision: 12, scale: 2, name: "transfer_amount" })
  transferAmount: number;

  @Column({ type: "decimal", precision: 12, scale: 2, name: "stripe_proccessing_fee" })
  stripeProccessingFee: number;

  @ManyToOne(() => Cart, cart => cart.payment, { nullable: false })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @OneToOne(() => Card, card => card.payments, { nullable: false })
  @JoinColumn({ name: "card_id" })
  card: Card;

  @ManyToOne(() => PaymentStatus, paymentStatus => paymentStatus.payments, { nullable: false })
  @JoinColumn({ name: "status_id" })
  status: PaymentStatus;

  @OneToMany(() => BeachBarReview, beachBarReview => beachBarReview.payment, { nullable: true })
  reviews?: BeachBarReview[];

  @OneToOne(() => PaymentVoucherCode, paymentVoucherCode => paymentVoucherCode.payment, { nullable: true })
  voucherCode?: PaymentVoucherCode;

  @OneToMany(() => ReservedProduct, reservedProduct => reservedProduct.payment, { nullable: true })
  reservedProducts?: ReservedProduct[];

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

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

      if (newReservedProducts.length === 0) throw new Error(errors.SOMETHING_WENT_WRONG);

      const status = STATUSES.PAID;

      this.statusId = status.id;
      await this.save();
      return newReservedProducts;
    } else throw new Error(errors.SOMETHING_WENT_WRONG);
  }

  async getRefundPercentage(): Promise<GetRefundPercentage | undefined> {
    dayjs.extend(minMax);

    const products = this.cart.products;
    if (!products) return undefined;
    const minDate = dayjs.min(products.map(product => dayjs(product.date)).filter(date => date.isAfter(dayjs())));
    const daysDiff = dayjs(minDate).toDate().getTime() - dayjs().toDate().getTime();
    const refundPercentage = await RefundPercentage.findOne({
      where: { daysMilliseconds: LessThanOrEqual(daysDiff) },
      order: {
        daysMilliseconds: "DESC",
      },
    });
    if (!refundPercentage) return undefined;

    return {
      refundPercentage,
      daysDiff,
    };
  }

  hasBeachBarProduct(beachBarId: string): boolean {
    if ((this.cart.products?.length || 0) > 0) {
      return this.cart.products!.some(product => product.product.beachBarId.toString() === beachBarId && !product.product.deletedAt);
    } else return false;
  }

  getProductsMonth(beachBarId: number): number[] | undefined {
    if (!this.cart.products) return undefined;
    return this.cart.products
      .filter(product => product.product.beachBarId === beachBarId)
      .map(product => dayjs(product.date).month() + 1);
  }

  getBeachBarProducts(beachBarId: string): Product[] | undefined {
    if (!this.hasBeachBarProduct(beachBarId) || !this.cart.products) return undefined;
    const beachBarProducts = this.cart.products
      .map(product => product.product)
      .filter(product => product.beachBarId.toString() === beachBarId);
    return beachBarProducts;
  }

  getBeachBars(): BeachBar[] {
    return this.cart.products?.map(({ product }) => product.beachBar) || [];
  }

  async softRemove(): Promise<any> {
    // await this.cart.customSoftRemove(false);
    this.statusId = STATUSES.REFUNDED.id;
    await this.save();
    const findOptions: any = { paymentId: this.id };
    await softRemove(Payment, { id: this.id }, [ReservedProduct], findOptions);
  }
}
