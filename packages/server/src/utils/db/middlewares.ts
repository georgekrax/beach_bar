import { TABLES } from "@beach_bar/common";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import camelCase from "lodash/camelCase";
import { prisma, redis } from "../..";
import { setRedisReservationLimits, SetRedisReservationLimitsInclude } from "../product";
import { updateSearchInputValues } from "../search";
import { getRedisIdx, getRedisKey, updateRedis } from "./redis";

// Soft-Delete middlewares
const DELETE_KEY = "deletedAt";
const SOFT_DELETED_MODELS: Record<string, { findKey?: string; relations: Prisma.ModelName[] }> = {
  Account: { relations: [] },
  BeachBar: {
    findKey: "beachBarId",
    relations: [
      "BeachBarLocation",
      "BeachBarImgUrl",
      "BeachBarOwner",
      "BeachBarFeature",
      "BeachBarReview",
      "Product",
      "UserFavoriteBar",
      "BeachBarRestaurant",
      "SearchInputValue",
    ],
  },
  BeachBarFeature: { relations: [] },
  BeachBarImgUrl: { relations: [] },
  BeachBarLocation: { relations: [] },
  BeachBarOwner: { relations: [] },
  BeachBarRestaurant: { findKey: "restaurantId", relations: ["RestaurantFoodItem"] },
  BeachBarReview: { relations: [] },
  Card: { relations: [] },
  Cart: { findKey: "cartId", relations: ["CartProduct", "CartFood", "CartNote"] },
  CartFood: { relations: [] },
  CartProduct: { relations: [] },
  Customer: { findKey: "customerId", relations: ["Card"] },
  Food: { findKey: "accountId", relations: [] },
  Owner: { findKey: "ownerId", relations: ["BeachBarOwner"] },
  Payment: { findKey: "paymentId", relations: ["ReservedProduct"] },
  Product: { findKey: "productId", relations: ["CartProduct", "ReservedProduct", "ProductReservationLimit"] },
  ProductReservationLimit: { relations: [] },
  ReservedProduct: { relations: [] },
  RestaurantFoodItem: { relations: [] },
  ReviewVote: { relations: [] },
  SearchInputValue: { relations: [] },
  User: {
    findKey: "userId",
    relations: ["Account", "BeachBarReview", "Cart", "UserFavoriteBar", "Owner", "Customer", "ReviewVote"],
  },
  UserFavoriteBar: { relations: [] },
};

const MODELS = Object.keys(SOFT_DELETED_MODELS);

const checkModel = (model: string): boolean => MODELS.includes(model);

const checkParams = (params: Parameters<Prisma.Middleware<any>>[0]): boolean => {
  if (typeof params.args.where?.id === "string") {
    switch (params.model) {
      case "BeachBarReview":
        params.args.where.id = BigInt(params.args.where.id);
        break;
      case "CartProduct":
        params.args.where.id = BigInt(params.args.where.id);
        break;

      default:
        break;
    }
  }
  return (params.model && checkModel(params.model)) ?? false;
};

const withDeleted = (params: Prisma.MiddlewareParams): Prisma.MiddlewareParams => {
  params.model = (params.model + "WithDeleted") as any;
  if (params.args?.where) {
    const { [DELETE_KEY]: deletedAt, ...newWhere } = params.args.where;
    params.args.where = newWhere;
  }
  return params;
};

const firstParams = (params: Prisma.MiddlewareParams): Prisma.MiddlewareParams => {
  if (params.args?.where && params.args.where[DELETE_KEY]?.not === null) withDeleted(params);
  else params.args = { ...params.args, where: { ...params.args?.["where"], [DELETE_KEY]: null } };
  return params;
};

const manyParams = (params: Prisma.MiddlewareParams): Prisma.MiddlewareParams => {
  const { [DELETE_KEY]: deletedAt } = params.args.where;
  // Exclude deleted records if they have not been explicitly requested
  if (deletedAt == undefined) params.args.where[DELETE_KEY] = null;
  if (deletedAt?.not === null) withDeleted(params);
  return params;
};

// const nested = (object: Record<string, any>, fn: (v: any) => any) => {
//   return Object.fromEntries(
//     Object.entries(object).map(([k, v]) => {
//       // const cb = v && typeof v === "object" ? nested(v, fn) : {};
//       return [k, { ...(k.endsWith("s") ? fn(v) : v) }];
//     })
//   );
// };

export const softDeleteFind: Prisma.Middleware<any> = async (params, next) => {
  const res = checkParams(params);
  console.log("find", res, params.action, params.model);
  if (!res) return next(params);

  if (params.action === "findUnique" || params.action === "findFirst") {
    // params.args.include = params.args.include
    //   ? nested(params.args.include, v => {
    //       return { ...v, where: { deletedAt: null, ...v["where"] } };
    //     })
    //   : undefined;
    // Change to findFirst - you cannot filter by anything except ID / unique with findUnique
    params.action = "findFirst";
    firstParams(params);
  }
  if (params.action === "findMany") {
    // Find many queries
    if (params.args?.where != undefined) manyParams(params);
    else params["args"] = { ...params.args, where: { ...params.args?.["where"], [DELETE_KEY]: null } };
  }
  return next(params);
};

export const softDeleteUpdate: Prisma.Middleware<any> = async (params, next) => {
  const res = checkParams(params);
  console.log("update", res, params.action, params.model);
  if (!res) return next(params);

  // if (params.action === "update") {
  //   // Change to updateMany - you cannot filter by anything except ID / unique with findUnique
  //   params.action = "updateMany";
  //   // params.args.where[DELETE_KEY] = null;
  //   firstParams(params);
  // }
  if (params.action === "updateMany") {
    if (params.args.where != undefined) manyParams(params);
    else params["args"] = { ...params.args, where: { ...params.args?.["where"], [DELETE_KEY]: null } };
  }
  return next(params);
};

export const softDelete: Prisma.Middleware<any> = async (params, next) => {
  const res = checkParams(params);
  if (!res || !params.action.includes("delete")) return next(params);

  console.log("delete", res, params.action, params.model);
  const now = dayjs().toISOString(); // new Date()
  if (params.action === "delete") {
    // Delete queries
    // Change action to an update
    params.action = "update";
    params.args["data"] = { [DELETE_KEY]: now };
  }
  if (params.action === "deleteMany") {
    // Delete many queries
    params.action = "updateMany";
    if (params.args.data != undefined) params.args.data[DELETE_KEY] = now;
    else params.args["data"] = { [DELETE_KEY]: now };
  }

  const { id } = params.args.where;
  const { findKey, relations } = SOFT_DELETED_MODELS[params.model!];
  for (const item of relations) {
    if (checkModel(item)) {
      const where = !findKey ? {} : { [findKey]: id };
      await prisma[camelCase(item)].updateMany({ where, data: { deletedAt: now } });
    }
  }

  switch (params.model) {
    case "BeachBar":
      // Delete from search dropdown results
      await prisma.searchInputValue.deleteMany({ where: { beachBarId: id } });

      try {
        const idx = await getRedisIdx({ model: "BeachBar", id });
        const redisKey = getRedisKey({ model: "BeachBar" });
        await redis.lset(redisKey, idx, "");
        await redis.lrem(redisKey, 0, "");
      } catch (err) {
        throw new Error(err.message);
      }
      return next(params);

    case "BeachBarFeature":
    case "BeachBarImgUrl":
    case "BeachBarOwner":
    case "BeachBarRestaurant":
    case "BeachBarReview":
    case "Food":
    case "Product":
    case "ReservedProduct":
    case "RestaurantFoodItem":
    case "ReviewVote":
      const result = await next(params);
      let secondModel: string | undefined = undefined;
      switch (params.model) {
        case "ReservedProduct":
          secondModel = "product";
          break;
        case "RestaurantFoodItem":
          secondModel = "restaurant";
          break;
        case "ReviewVote":
          secondModel = "review";
          break;

        default:
          break;
      }
      const model = await prisma[camelCase(params.model)].findFirst({
        where: { id: result.id },
        include: secondModel ? { include: { [secondModel]: true } } : undefined,
      });
      if (model) {
        await updateRedis({ model: "BeachBar", id: secondModel ? model[secondModel].beachBarId : model.beachBarId });
      }
      if (params.model === "ReservedProduct") {
        // if (daysDiff) {
        //   this.isRefunded = true;
        //   await this.save();
        // }

        try {
          // delete in Redis too
          const { beachBarId } = model.product;
          const idx = await getRedisIdx({ model: "ReservedProduct", id, product: { beachBarId } });
          const redisKey = getRedisKey({ model: "ReservedProduct", beachBarId });
          await redis.lset(redisKey, idx, "");
          await redis.lrem(redisKey, 0, "");
        } catch (err) {
          throw new Error(err.message);
        }
      }
      return result;
    case "Payment":
      const refundedStatus = TABLES.PAYMENT_STATUS.find(({ name }) => name === "REFUNDED");
      await prisma.payment.update({ where: { id }, data: { statusId: refundedStatus?.id } });
      return next(params);

    case "ProductReservationLimit":
      const limit = await prisma.productReservationLimit.findUnique({ where: { id }, include: SetRedisReservationLimitsInclude });
      if (limit) await setRedisReservationLimits(limit, { atDelete: true });
      return next(params);

    default:
      return next(params);
  }
};

// Other middlewares
export const middleware: Prisma.Middleware<any> = async (params, next) => {
  // if (["create", "update"].includes(params.action)) return next(params);
  switch (params.model) {
    case "Account": {
      const birthday = params.args?.birthday;
      if (birthday && (params.action.includes("update") || params.action.includes("create"))) {
        const differenceMs = dayjs().subtract(+dayjs(birthday), "millisecond");
        const parsedAge = Math.abs(dayjs(differenceMs).year() - 1970);
        params.args.age = parsedAge;
      }
      return next(params);
    }
    case "ProductReservationLimit": {
      const result = await next(params);
      if (params.action.includes("update") || params.action.includes("create")) {
        const limit = await prisma.productReservationLimit.findUnique({
          where: { id: result?.id || params.args.where?.id },
          include: SetRedisReservationLimitsInclude,
        });
        if (limit) await setRedisReservationLimits(limit, { atDelete: false });
      }
      return result;
    }
    case "BeachBar": {
      const result = await next(params);
      if (["create", "update"].includes(params.action)) {
        const beachBar = await prisma.beachBar.findUnique({ where: { id: result.id }, include: { location: true } });
        if (beachBar) await updateSearchInputValues(beachBar);
      }
      return result;
    }
    case "ReservedProduct": {
      if (params.action !== "create") return next(params);
      const result = await next(params);
      await updateRedis({ model: "ReservedProduct", id: result.id, atCreate: true });
      return result;
    }
    // case "CartProduct": {
    //   const result = await next(params);
    //   if (params.action.includes("update") && params.args?.data?.quantity) {
    //     const newQuantity = result.quantity;
    //     setRedisReservationLimits({ ...result, ...result.product, from: result.date, to: result.date }, { atDelete: false, elevator: diff });
    //   }
    //   return result;
    // }

    default:
      return next(params);
  }
};
