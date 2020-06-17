import { Redis } from "ioredis";
import { getConnection } from "typeorm";
import { Account } from "../entity/Account";
import { User } from "../entity/User";

export const removeUserSessions = async (userId: number | string, redis: Redis): Promise<void> => {
  await redis.del(userId.toString() as KeyType);

  await getConnection().getRepository(User).increment({ id: userId }, "tokenVersion", 1);

  await getConnection().createQueryBuilder().update(Account).set({ isActive: false }).where("userId = :userId", { userId }).execute();
};
