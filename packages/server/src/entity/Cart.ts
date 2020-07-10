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
import { softRemove } from "../utils/softRemove";
import { BeachBarEntryFee } from "./BeachBarEntryFee";
import { CartProduct } from "./CartProduct";
import { Payment } from "./Payment";
import { User } from "./User";

interface GetBeachBarTotalPrice {
  entryFees: BeachBarEntryFee[];
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
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async getTotalPrice(): Promise<number | undefined> {
    const products = await CartProduct.find({ where: { cart: this }, relations: ["product"] });
    if (products) {
      const total = products.reduce((sum, i) => {
        return sum + i.product.price * i.quantity;
      }, 0);
      return total;
    }
    return undefined;
  }

  async getBeachBarTotalPrice(beachBarId: number): Promise<GetBeachBarTotalPrice | undefined> {
    if (this.products) {
      const products = this.products.filter(product => product.product.beachBarId === beachBarId && !product.product.deletedAt);
      if (products) {
        const total = products.reduce((sum, i) => {
          return sum + i.product.price * i.quantity;
        }, 0);
        const entryFees: BeachBarEntryFee[] = [];
        products
          .map(product => product.date)
          .filter((v, i, s) => {
            return s.indexOf(v) === i;
          })
          .forEach(async date => {
            const entryFee = await BeachBarEntryFee.findOne({ beachBarId, date });
            if (entryFee) {
              entryFees.push(entryFee);
            }
          });
        if (!entryFees || entryFees.length <= 0) {
          return undefined;
        }
        const totalEntryFees = entryFees.reduce((sum, i) => {
          return sum + i.fee;
        }, 0);
        return {
          entryFees,
          totalWithoutEntryFees: total,
          totalWithEntryFees: total + totalEntryFees,
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
