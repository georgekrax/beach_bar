import { DATA } from "constants/data";
import dayjs, { Dayjs } from "dayjs";
import { uniq, uniqBy } from "lodash";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  EntityRepository,
  getManager,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { toFixed2 } from "utils/payment";
import { softRemove } from "utils/softRemove";
import { BeachBar } from "./BeachBar";
// import { BeachBarEntryFee } from "./BeachBarEntryFee";
import { CartProduct } from "./CartProduct";
import { Payment } from "./Payment";
import { User } from "./User";

const { PROCCESSING_FEES } = DATA.STRIPE;

interface GetTotalPrice {
  totalWithoutEntryFees: number;
  totalWithEntryFees: number;
}

interface GetBeachBarTotalPrice {
  entryFeeTotal: number;
  totalWithoutEntryFees: number;
  totalWithEntryFees: number;
}

@Entity({ name: "cart", schema: "public" })
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "user_id", nullable: true })
  userId?: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: () => 0 })
  total: number;

  @ManyToOne(() => User, user => user.carts, { nullable: true, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @OneToMany(() => CartProduct, cartProduct => cartProduct.cart, { nullable: true })
  products?: CartProduct[];

  // ! Payments of "this" card are not deleted, so to be retrieved later.
  // ! But cart should be deleted so that it can not be used again for charging
  @OneToOne(() => Payment, payment => payment.cart, { nullable: true })
  payment?: Payment;

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Dayjs;

  getUniqBeachBars(): BeachBar[] {
    const beachBars = this.products?.map(product => product.product.beachBar) || [];
    return uniqBy(beachBars, "id");
  }

  getUniqDates(): string[] {
    return uniq((this.products || []).map(({ date }) => date.toString()));
  }

  checkAllProductsAvailable(): { bool: boolean; notAvailable: CartProduct[] } {
    const notAvailable = (this.products || []).filter(({ product, date, timeId, quantity }) =>
      !product.isAvailable(date.toString(), timeId?.toString(), undefined, quantity)
    );
    return { bool: notAvailable.length == 0, notAvailable: notAvailable };
  }

  getBeachBarProducts(beachBarId: number): CartProduct[] {
    return this.products?.filter(product => product.product.beachBarId === beachBarId) || [];
  }

  getTotalPrice(afterToday: boolean = false): GetTotalPrice {
    let filteredProducts = this.products?.filter(product => !product.deletedAt) || [];
    if (afterToday) filteredProducts = filteredProducts.filter(product => dayjs(product.date).isAfter(dayjs()));
    const total = filteredProducts.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const entryFeesTotal = this.getBeachBarsEntryFeeTotal();
    return {
      totalWithoutEntryFees: parseFloat(total.toFixed(2)),
      totalWithEntryFees: parseFloat((total + entryFeesTotal).toFixed(2)),
    };
  }

  getStripeFee(isEu: boolean, total?: number): number {
    const cardProcessingFee = isEu ? PROCCESSING_FEES.EUR : PROCCESSING_FEES.NON_EUR;
    let totalWithEntryFees: number;
    if (!total) {
      const total = this.getTotalPrice();
      totalWithEntryFees = total.totalWithEntryFees;
    } else totalWithEntryFees = total;
    // console.log("CART TOTAL: ", totalWithEntryFees);
    const stripeTotalFee = toFixed2(
      totalWithEntryFees * (parseFloat(cardProcessingFee.percentageValue.toString()) / 100) +
        parseFloat(cardProcessingFee.fixedFeed.toString())
    );
    return toFixed2(stripeTotalFee);
  }

  getBeachBarsEntryFeeTotal(totalPeople: number = 1): number {
    const uniqueBeachBars = this.getUniqBeachBars();
    // const uniqueProductDates = Array.from(new Set(this.products.map(product => product.date)));
    let entryFeeTotal = 0;
    for (let i = 0; i < uniqueBeachBars.length; i++) {
      // for (let i = 0; i < uniqueProductDates.length; i++) {
      // const productDate = uniqueProductDates[i];
      const beachBar = uniqueBeachBars[i];
      // const entryFee = await BeachBarEntryFee.findOne({ where: { beachBar, date: productDate } });
      // if (entryFee) entryFeeTotal = entryFeeTotal + parseFloat(entryFee.fee.toString());
      const dates = this.getUniqDates();
      entryFeeTotal = entryFeeTotal + parseFloat((beachBar.entryFee ?? 0).toString()) * totalPeople * dates.length;
      // }
    }
    return entryFeeTotal;
  }

  // async getBeachBarEntryFee(beachBarId: number): Promise<number | undefined> {
  //   if (this.products) {
  //     const isBeachBarIncluded = this.products.some(product => product.product.beachBarId === beachBarId);
  //     if (!isBeachBarIncluded) return undefined;
  //     const uniqueProductDates = Array.from(
  //       new Set(this.products.filter(product => product.product.beachBarId === beachBarId).map(product => product.date))
  //     );
  //     let entryFeeTotal = 0;
  //     for (let i = 0; i < uniqueProductDates.length; i++) {
  //       const productDate = uniqueProductDates[i];
  //       const entryFee = await BeachBarEntryFee.findOne({ where: { beachBarId, date: productDate } });
  //       if (entryFee) {
  //         entryFeeTotal = entryFeeTotal + parseFloat(entryFee.fee.toString());
  //       }
  //     }
  //     return entryFeeTotal;
  //   }
  //   return undefined;
  // }

  getBeachBarTotal(beachBarId: number, totalPeople = 1, couponCodeDiscount = 0): GetBeachBarTotalPrice {
    const products = this.products?.filter(product => product.product.beachBarId === beachBarId && !product.product.deletedAt) || [];
    const total = products.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const entryFee: number = parseFloat(
      Array.from(new Set(products.map(({ product: { beachBar } }) => beachBar.entryFee || 0)))[0].toString()
    );
    const dates = this.getUniqDates();
    const totalEntryFee = entryFee * dates.length * totalPeople;
    return {
      entryFeeTotal: toFixed2(totalEntryFee),
      totalWithoutEntryFees: toFixed2(total - couponCodeDiscount),
      totalWithEntryFees: toFixed2(total + totalEntryFee - couponCodeDiscount),
    };
  }

  getTotalEntryFees(totalPeople = 1): number {
    const bars = this.getUniqBeachBars();
    return bars.reduce((total, { id }) => total + this.getBeachBarTotal(id, totalPeople).entryFeeTotal, 0);
  }

  async getProductTotal(productId: number): Promise<number> {
    const products = this.products?.filter(product => product.product.id === productId) || [];
    return products.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  verifyZeroCartTotal(beachBar: BeachBar): boolean {
    return beachBar.zeroCartTotal;
  }

  async customSoftRemove(deleteTotal = true): Promise<any> {
    const findOptions: any = { cartId: this.id };
    if (deleteTotal) await softRemove(Cart, { id: this.id }, [CartProduct], findOptions);
    else await softRemove(Cart, { id: this.id });
  }
}

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {
  async createCart(user?: User): Promise<Cart | undefined> {
    const cart = Cart.create({ user, total: 0 });
    try {
      await cart.save();
    } catch {
      return undefined;
    }
    return cart;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getOrCreateCart(payload: any, cartId?: number, getOnly?: boolean): Promise<Cart | undefined> {
    if (payload && payload.sub) {
      const cart = await getManager()
        .createQueryBuilder(Cart, "cart")
        .where("cart.userId = :userId", { userId: payload.sub })
        .leftJoinAndSelect("cart.user", "user")
        .leftJoinAndSelect("cart.products", "products", "products.deletedAt IS NULL")
        .leftJoinAndSelect("products.product", "cartProduct", "cartProduct.deletedAt IS NULL")
        .leftJoinAndSelect("cartProduct.beachBar", "cartProductBeachBar", "cartProductBeachBar.deletedAt IS NULL")
        .leftJoinAndSelect("cartProductBeachBar.defaultCurrency", "cartProductBeachBarCurrency")
        .leftJoinAndSelect("products.time", "productsTime")
        .orderBy("cart.timestamp", "DESC")
        .getOne();

      if (!cart && !getOnly) {
        const user = await User.findOne(payload.sub);
        if (!user) return undefined;
        const cart = await this.createCart(user);
        return cart;
      }
      return cart;
    }
    if (cartId) {
      const cart = await getManager()
        .createQueryBuilder(Cart, "cart")
        .where("cart.id = :cartId", { cartId })
        .leftJoinAndSelect("cart.user", "user")
        .leftJoinAndSelect("cart.products", "products", "products.deletedAt IS NULL")
        .leftJoinAndSelect("products.product", "cartProduct", "cartProduct.deletedAt IS NULL")
        .leftJoinAndSelect("cartProduct.beachBar", "cartProductBeachBar", "cartProductBeachBar.deletedAt IS NULL")
        .leftJoinAndSelect("cartProductBeachBar.defaultCurrency", "cartProductBeachBarCurrency")
        .leftJoinAndSelect("products.time", "productsTime")
        .orderBy("cart.timestamp", "DESC")
        .getOne();

      if (!cart && !getOnly) {
        const cart = await this.createCart();
        return cart;
      }
      return cart;
    } else if (!cartId && !getOnly) {
      const cart = await this.createCart();
      return cart;
    } else return undefined;
  }
}
