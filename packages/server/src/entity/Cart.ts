import { toFixed2 } from "@/utils/data";
import { softRemove } from "@/utils/softRemove";
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
import { BeachBar } from "./BeachBar";
import { CartFood } from "./CartFood";
import { CartNote } from "./CartNote";
// import { BeachBarEntryFee } from "./BeachBarEntryFee";
import { CartProduct } from "./CartProduct";
import { Payment } from "./Payment";
import { User } from "./User";

interface GetTotal {
  products: CartProduct[];
  foods: CartFood[];
  productsTotal: number;
  foodsTotal: number;
  totalWithoutEntryFees: number;
  totalWithEntryFees: number;
}

@Entity({ name: "cart", schema: "public" })
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "user_id", nullable: true })
  userId?: number;

  @Column({ type: "decimal", name: "products_total", precision: 12, scale: 2, default: () => 0 })
  productsTotal: number;

  @Column({ type: "decimal", name: "foods_total", precision: 12, scale: 2, default: () => 0 })
  foodsTotal: number;

  @Column({ type: "decimal", name: "total", precision: 12, scale: 2, default: () => 0 })
  total: number;

  @ManyToOne(() => User, user => user.carts, { nullable: true, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @OneToMany(() => CartProduct, cartProduct => cartProduct.cart, { nullable: true })
  products?: CartProduct[];

  @OneToMany(() => CartFood, cartFood => cartFood.cart, { nullable: true })
  foods?: CartFood[];

  @OneToMany(() => CartNote, cartNote => cartNote.cart, { nullable: true })
  notes?: CartNote[];

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

  // checkAllProductsAvailable(): { bool: boolean; notAvailable: CartProduct[] } {
  //   const notAvailable = (this.products || []).filter(
  //     ({ product, date, startTimeId, endTimeId, quantity }) =>
  //       !product.isAvailable({
  //         date: date.toString(),
  //         startTimeId: +startTimeId.toString(),
  //         endTimeId: +endTimeId.toString(),
  //         elevator: quantity,
  //       })
  //   );
  //   return { bool: notAvailable.length == 0, notAvailable: notAvailable };
  // }

  getBeachBarProducts(beachBarId: number): CartProduct[] {
    return this.products?.filter(product => product.product.beachBarId === beachBarId && !product.deletedAt) || [];
  }

  getBeachBarFoods(beachBarId: number): CartFood[] {
    return this.foods?.filter(food => food.food.beachBarId === beachBarId && !food.deletedAt) || [];
  }

  getTotal(beachBarId?: number, date?: Dayjs, afterToday: boolean = false, couponCodeDiscount = 0): GetTotal | never {
    let filteredProducts = (beachBarId ? this.getBeachBarProducts(beachBarId) : this.products) || [];
    if (afterToday) filteredProducts = filteredProducts.filter(product => dayjs(product.date).isAfter(dayjs()));
    if (date) filteredProducts = filteredProducts.filter(product => dayjs(product.date).isSame(date, "date"));
    const productsTotal = filteredProducts.reduce((sum, { quantity, product: { price } }) => sum + price * quantity, 0);
    // const totalMinSpending = filteredProducts.reduce((sum, { product: { minFoodSpending } }) => sum + (minFoodSpending || 0), 0);
    let filteredFoods = (beachBarId ? this.getBeachBarFoods(beachBarId) : this.foods) || [];
    if (date) filteredFoods = filteredFoods.filter(food => dayjs(food.date).isSame(date, "date"));
    const foodsTotal = filteredFoods.reduce((sum, { quantity, food: { price } }) => sum + price * quantity, 0);
    // if (foodsTotal < totalMinSpending) {
    //   throw new ApolloError("For the products you have selected, the total minimum spending is: " + totalMinSpending);
    // }
    const total = productsTotal + foodsTotal;
    const entryFeesTotal = this.getEntryFees(beachBarId, filteredProducts);
    return {
      products: filteredProducts,
      foods: filteredFoods,
      productsTotal,
      foodsTotal,
      totalWithoutEntryFees: toFixed2(total - couponCodeDiscount),
      totalWithEntryFees: toFixed2(total + entryFeesTotal - couponCodeDiscount),
    };
  }

  getEntryFees(beachBarId?: number, products?: CartProduct[]): number {
    if (!this.products || this.products.length === 0) return 0;
    let beachBars = this.getUniqBeachBars().filter(({ entryFee }) => entryFee != null && entryFee > 0);
    if (beachBarId) beachBars = beachBars.filter(({ id }) => String(id) === String(beachBarId));
    let entryFeeTotal = 0;
    // const uniqueProductDates = Array.from(new Set(this.products.map(product => product.date)));
    // const entryFee = await BeachBarEntryFee.findOne({ where: { beachBar, date: productDate } });
    // if (entryFee) entryFeeTotal = entryFeeTotal + parseFloat(entryFee.fee.toString());
    beachBars.forEach(({ id, entryFee }) => {
      const arr = products || this.getBeachBarProducts(id);
      entryFeeTotal = entryFeeTotal + arr.reduce((prev, { people }) => prev + people * entryFee, 0);
    });
    return entryFeeTotal;
  }

  // getStripeFee(isEu: boolean, total?: number): number {
  //   const cardProcessingFee = isEu ? PROCCESSING_FEES.EUR : PROCCESSING_FEES.NON_EUR;
  //   let totalWithEntryFees: number;
  //   if (!total) {
  //     const total = this.getTotal();
  //     totalWithEntryFees = total.totalWithEntryFees;
  //   } else totalWithEntryFees = total;
  //   // console.log("CART TOTAL: ", totalWithEntryFees);
  //   const stripeTotalFee = toFixed2(
  //     totalWithEntryFees * (+cardProcessingFee.percentageValue.toString() / 100) + +cardProcessingFee.fixedFeed.toString()
  //   );
  //   return toFixed2(stripeTotalFee);
  // }

  verifyZeroCartTotal(beachBar: BeachBar): boolean {
    return beachBar.zeroCartTotal;
  }

  async getProductTotal(productId: number): Promise<number> {
    const products = this.products?.filter(product => product.product.id === productId) || [];
    return products.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
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
  async getOrCreateCart(payload: any, cartId?: string, getOnly?: boolean): Promise<Cart | undefined> {
    if (payload?.sub && !cartId) {
      let cart = await getManager()
        .createQueryBuilder(Cart, "cart")
        .where("cart.userId = :userId", { userId: payload.sub })
        .leftJoinAndSelect("cart.user", "user")
        .leftJoinAndSelect("cart.payment", "payment")
        .leftJoinAndSelect("cart.notes", "notes")
        .leftJoinAndSelect("notes.beachBar", "notesBeachBar", "notesBeachBar.deletedAt IS NULL")
        .leftJoinAndSelect("cart.products", "products", "products.deletedAt IS NULL")
        .leftJoinAndSelect("products.product", "cartProduct", "cartProduct.deletedAt IS NULL")
        .leftJoinAndSelect("cart.foods", "foods", "foods.deletedAt IS NULL")
        .leftJoinAndSelect("foods.food", "cartFood", "cartFood.deletedAt IS NULL")
        .leftJoinAndSelect("cartFood.beachBar", "cartFoodBeachBar", "cartFoodBeachBar.deletedAt IS NULL")
        .leftJoinAndSelect("cartFood.category", "cartFoodCategory")
        .leftJoinAndSelect("cartFoodCategory.icon", "cartFoodCategoryIcon")
        .leftJoinAndSelect("cartProduct.beachBar", "cartProductBeachBar", "cartProductBeachBar.deletedAt IS NULL")
        .leftJoinAndSelect("cartProductBeachBar.defaultCurrency", "cartProductBeachBarCurrency")
        .leftJoinAndSelect("products.startTime", "productsStartTime")
        .leftJoinAndSelect("products.endTime", "productsEndTime")
        .andWhere("payment IS NULL")
        .orderBy("cart.timestamp", "DESC")
        .getOne();

      if (!cart && !getOnly) {
        const user = await User.findOne(payload.sub);
        if (!user) return undefined;
        cart = await this.createCart(user);
      }
      return cart;
    }
    if (cartId) {
      const cart = await getManager()
        .createQueryBuilder(Cart, "cart")
        .where("cart.id = :cartId", { cartId })
        .leftJoinAndSelect("cart.user", "user")
        .leftJoinAndSelect("cart.payment", "payment")
        .leftJoinAndSelect("cart.notes", "notes")
        .leftJoinAndSelect("notes.beachBar", "notesBeachBar", "notesBeachBar.deletedAt IS NULL")
        .leftJoinAndSelect("cart.products", "products", "products.deletedAt IS NULL")
        .leftJoinAndSelect("products.product", "cartProduct", "cartProduct.deletedAt IS NULL")
        .leftJoinAndSelect("cart.foods", "foods", "foods.deletedAt IS NULL")
        .leftJoinAndSelect("foods.food", "cartFood", "cartFood.deletedAt IS NULL")
        .leftJoinAndSelect("cartFood.beachBar", "cartFoodBeachBar", "cartFoodBeachBar.deletedAt IS NULL")
        .leftJoinAndSelect("cartFood.category", "cartFoodCategory")
        .leftJoinAndSelect("cartFoodCategory.icon", "cartFoodCategoryIcon")
        .leftJoinAndSelect("cartProduct.beachBar", "cartProductBeachBar", "cartProductBeachBar.deletedAt IS NULL")
        .leftJoinAndSelect("cartProductBeachBar.defaultCurrency", "cartProductBeachBarCurrency")
        .leftJoinAndSelect("products.startTime", "productsStartTime")
        .leftJoinAndSelect("products.endTime", "productsEndTime")
        .andWhere("payment IS NULL")
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
