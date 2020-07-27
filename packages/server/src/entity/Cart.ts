import { softRemove } from "@utils/softRemove";
import { Dayjs } from "dayjs";
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
    Repository
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { BeachBarEntryFee } from "./BeachBarEntryFee";
import { CartProduct } from "./CartProduct";
import { Payment } from "./Payment";
import { StripeFee } from "./StripeFee";
import { User } from "./User";

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

  getUniqueBeachBars(): BeachBar[] | undefined {
    if (this.products) {
      const beachBars = this.products.map(product => product.product.beachBar);
      const uniqueBeachBars = beachBars.filter((beachBar, index, self) => index === self.findIndex(t => t.id === beachBar.id));
      return uniqueBeachBars;
    } else {
      return undefined;
    }
  }

  getBeachBarProducts(beachBarId: number): CartProduct[] | undefined {
    if (this.products) {
      return this.products.filter(product => product.product.beachBarId === beachBarId);
    } else {
      return undefined;
    }
  }

  async getTotalPrice(): Promise<GetTotalPrice | undefined> {
    if (this.products) {
      const filteredProducts = this.products.filter(product => !product.deletedAt);
      const total = filteredProducts.reduce((sum, i) => {
        return sum + i.product.price * i.quantity;
      }, 0);
      const entryFeesTotal = await this.getBeachBarsEntryFeeTotal();
      if (entryFeesTotal === undefined) {
        return undefined;
      }
      return {
        totalWithoutEntryFees: total,
        totalWithEntryFees: total + entryFeesTotal,
      };
    }
    return undefined;
  }

  async getStripeFee(isEu: boolean, total?: number): Promise<number | undefined> {
    const cardProcessingFee = await StripeFee.findOne({ isEu });
    if (!cardProcessingFee) {
      return undefined;
    }
    let totalWithEntryFees: number;
    if (!total) {
      const total = await this.getTotalPrice();
      if (total === undefined) {
        return undefined;
      }
      totalWithEntryFees = total.totalWithEntryFees;
    } else {
      totalWithEntryFees = total;
    }
    const stripeTotalFee: number = parseFloat(
      (
        totalWithEntryFees * (parseFloat(cardProcessingFee.percentageValue.toString()) / 100) +
        parseFloat(cardProcessingFee.pricingFee.toString())
      ).toFixed(2)
    );
    return parseFloat(stripeTotalFee.toFixed(2));
  }

  async getBeachBarsEntryFeeTotal(): Promise<number | undefined> {
    if (this.products) {
      const uniqueBeachBars = this.getUniqueBeachBars();
      if (!uniqueBeachBars) {
        return undefined;
      }
      const uniqueProductDates = Array.from(new Set(this.products.map(product => product.date)));
      let entryFeeTotal = 0;
      for (let i = 0; i < uniqueBeachBars.length; i++) {
        for (let i = 0; i < uniqueProductDates.length; i++) {
          const productDate = uniqueProductDates[i];
          const beachBar = uniqueBeachBars[i];
          const entryFee = await BeachBarEntryFee.findOne({ where: { beachBar, date: productDate } });
          if (entryFee) {
            entryFeeTotal = entryFeeTotal + parseFloat(entryFee.fee.toString());
          }
        }
      }
      return entryFeeTotal;
    }
    return undefined;
  }

  async getBeachBarEntryFee(beachBarId: number): Promise<number | undefined> {
    if (this.products) {
      const isBeachBarIncluded = this.products.some(product => product.product.beachBarId === beachBarId);
      if (!isBeachBarIncluded) {
        return undefined;
      }
      const uniqueProductDates = Array.from(
        new Set(this.products.filter(product => product.product.beachBarId === beachBarId).map(product => product.date))
      );
      let entryFeeTotal = 0;
      for (let i = 0; i < uniqueProductDates.length; i++) {
        const productDate = uniqueProductDates[i];
        const entryFee = await BeachBarEntryFee.findOne({ where: { beachBarId, date: productDate } });
        if (entryFee) {
          entryFeeTotal = entryFeeTotal + parseFloat(entryFee.fee.toString());
        }
      }
      return entryFeeTotal;
    }
    return undefined;
  }

  async getBeachBarTotalPrice(beachBarId: number, couponCodeDiscount = 0): Promise<GetBeachBarTotalPrice | undefined> {
    if (this.products) {
      const products = this.products.filter(product => product.product.beachBarId === beachBarId && !product.product.deletedAt);
      if (products) {
        const total = products.reduce((sum, i) => {
          return sum + i.product.price * i.quantity;
        }, 0);
        const totalEntryFees = await this.getBeachBarEntryFee(beachBarId);
        if (totalEntryFees === undefined) {
          return undefined;
        }
        return {
          entryFeeTotal: totalEntryFees,
          totalWithoutEntryFees: total - couponCodeDiscount,
          totalWithEntryFees: parseFloat((total + totalEntryFees - couponCodeDiscount).toFixed(2)),
        };
      }
      return undefined;
    }
    return undefined;
  }

  async getProductTotalPrice(productId: number): Promise<number | undefined> {
    if (this.products) {
      const product = this.products.filter(product => product.product.id === productId);
      if (product) {
        const total = product.reduce((sum, i) => {
          return sum + i.product.price * i.quantity;
        }, 0);
        return total;
      }
      return undefined;
    }
    return undefined;
  }

  verifyZeroCartTotal(beachBar: BeachBar): boolean {
    if (!beachBar.zeroCartTotal) {
      return false;
    } else {
      return true;
    }
  }

  async customSoftRemove(deleteTotal = true): Promise<any> {
    const findOptions: any = { cartId: this.id };
    if (deleteTotal) {
      await softRemove(Cart, { id: this.id }, [CartProduct], findOptions);
    } else {
      await softRemove(Cart, { id: this.id });
    }
  }
}

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {
  async createCart(user?: User): Promise<Cart | undefined> {
    const cart = Cart.create({
      user,
      total: 0,
    });
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
        .orderBy("cart.timestamp", "DESC")
        .getOne();

      if (!cart && !getOnly) {
        const user = await User.findOne(payload.sub);
        if (!user) {
          return undefined;
        }
        const cart = await this.createCart(user);
        if (!cart) {
          return undefined;
        }
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
        .orderBy("cart.timestamp", "DESC")
        .getOne();

      if (!cart && !getOnly) {
        const cart = await this.createCart();
        if (!cart) {
          return undefined;
        }
        return cart;
      }
      return cart;
    } else if (!cartId && !getOnly) {
      const cart = await this.createCart();
      if (!cart) {
        return undefined;
      }
      return cart;
    } else {
      return undefined;
    }
  }
}
