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
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { softRemove } from "../utils/softRemove";
import { CartProduct } from "./CartProduct";
import { User } from "./User";

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

  @OneToMany(() => CartProduct, cartProduct => cartProduct.cart)
  products: CartProduct[];

  @CreateDateColumn({ name: "timestamp", type: "timestamptz", default: () => `NOW()` })
  timestamp: Date;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt?: Date;

  async softRemove(): Promise<any> {
    const findOptions: any = { cartId: this.id };
    await softRemove(Cart, { id: this.id }, [CartProduct], findOptions);
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
