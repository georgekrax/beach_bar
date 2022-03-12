import { softRemove } from "@/utils/softRemove";
import { dayjsFormat, errors, TABLES } from "@beach_bar/common";
import { ApolloError } from "apollo-server-errors";
import dayjs, { Dayjs } from "dayjs";
import minMax from "dayjs/plugin/minMax";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  LessThanOrEqual,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { redis } from "../index";
import { AppTransaction } from "./AppTransaction";
import { BeachBarReview } from "./BeachBarReview";
import { Card } from "./Card";
import { Cart } from "./Cart";
import { PaymentStatus } from "./PaymentStatus";
import { PaymentVoucherCode } from "./PaymentVoucherCode";
import { Product } from "./Product";
import { RefundPercentage } from "./RefundPercentage";
import { ReservedProduct } from "./ReservedProduct";

const { PAYMENT_STATUS } = TABLES;

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

  @OneToOne(() => Cart, cart => cart.payment, { nullable: false })
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

  @OneToOne(() => PaymentVoucherCode, paymentVoucherCode => paymentVoucherCode.payment, { nullable: true })
  voucherCode?: PaymentVoucherCode;

  @OneToMany(() => ReservedProduct, reservedProduct => reservedProduct.payment, { nullable: true })
  reservedProducts?: ReservedProduct[];

  @OneToMany(() => AppTransaction, appTransaction => appTransaction.payment)
  appTransactions: AppTransaction[];

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  async createReservedProducts(): Promise<ReservedProduct[] | any> {
    const cartProducts = this.cart.products;
    if (cartProducts) {
      const newReservedProducts: ReservedProduct[] = [];
      for (let i = 0; i < cartProducts.length; i++) {
        const { product, date, startTime, startTimeId, endTime, endTimeId, quantity } = cartProducts[i];
        const newReservedProduct = ReservedProduct.create({ payment: this, product, date, startTime, endTime });
        await newReservedProduct.save();
        newReservedProducts.push(newReservedProduct);
        const fDate = date.format(dayjsFormat.ISO_STRING);
        const params = { date: fDate, startTimeId, endTimeId };
        const limits = product.getReservationLimit(params);
        const reserved = product.getReservedProducts(params);
        for (let i = startTimeId; i <= endTimeId; i++) {
          const redisKey = `available_products:${fDate}:${i.toString().padStart(2, "0").padEnd(4, "0")}`;
          if (!limits) {
            await redis.del(redisKey);
            return;
          }
          const availableLeft = limits - reserved.length - quantity;
          await redis.hset(redisKey, `beach_bar:${product.beachBarId}:product:${product.id}`, availableLeft);
        }
      }

      if (newReservedProducts.length === 0) throw new Error(errors.SOMETHING_WENT_WRONG);

      const status = PAYMENT_STATUS.find(({ name }) => name === "PAID")!;

      this.statusId = status.id;
      await this.save();
      return newReservedProducts;
    } else throw new Error(errors.SOMETHING_WENT_WRONG);
  }

  async getRefundPercentage(): Promise<any | undefined> {
    dayjs.extend(minMax);
    const products = this.cart.products;
    if (!products || products.length === 0) return undefined;
    const minDate = dayjs.min(products.map(product => dayjs(product.date)).filter(date => date.isAfter(dayjs())));
    let daysDiff = dayjs(minDate).toDate().getTime() - dayjs().toDate().getTime();
    if (isNaN(daysDiff)) daysDiff = 0;
    let refundPercentage: RefundPercentage | undefined = undefined;
    if (!minDate) refundPercentage = await RefundPercentage.findOne(1);
    else {
      refundPercentage = await RefundPercentage.findOne({
        where: { daysMilliseconds: LessThanOrEqual(daysDiff) },
        order: { daysMilliseconds: "DESC" },
      });
    }
    if (!refundPercentage) return undefined;

    return { refundPercentage: refundPercentage as any, daysDiff };
  }

  async getRefundDetails(beachBarId?: number) {
    const refund = await this.getRefundPercentage();
    if (!refund) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
    const { refundPercentage, daysDiff } = refund;
    const cartTotal = this.cart.getTotal(beachBarId, undefined, true);
    if (cartTotal === undefined) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.SOMETHING_WENT_WRONG);
    const { totalWithoutEntryFees } = cartTotal;
    // if (totalWithoutEntryFees === 0) throw new ApolloError("Your shopping cart total was 0.", errors.CONFLICT);
    // ! Do not divide by 100, because Stipe processes cents, and the number will be already in cents
    let refundedAmount = +(totalWithoutEntryFees * +refundPercentage.percentageValue.toString()).toString();
    refundedAmount = Math.floor(refundedAmount);
    return { refundedAmount, daysDiff };
  }

  hasBeachBarProduct(beachBarId: string): boolean {
    if ((this.cart.products?.length || 0) > 0) {
      return this.cart.products!.some(product => product.product.beachBarId.toString() === beachBarId && !product.product.deletedAt);
    }
    return false;
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

  // getBeachBars(): BeachBar[] {
  //   return this.cart.products?.map(({ product }) => product.beachBar) || [];
  // }

  async softRemove(): Promise<any> {
    // await this.cart.customSoftRemove(false);
    this.statusId = PAYMENT_STATUS.find(({ name }) => name === "REFUNDED")!.id;
    await this.save();
    const findOptions: any = { paymentId: this.id };
    await softRemove(Payment, { id: this.id }, [ReservedProduct], findOptions);
  }
}
