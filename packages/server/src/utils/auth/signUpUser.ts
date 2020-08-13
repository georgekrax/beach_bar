import { errors } from "@beach_bar/common";
import { user as userScopes } from "@constants/scopes";
import { Account } from "@entity/Account";
import { City } from "@entity/City";
import { Country } from "@entity/Country";
import { Owner } from "@entity/Owner";
import { User } from "@entity/User";
import { Redis } from "ioredis";

export const signUpUser = async (options: {
  email: string;
  redis: Redis;
  isPrimaryOwner: boolean;
  hashtagId?: bigint;
  googleId?: any;
  facebookId?: any;
  instagramId?: any;
  instagramUsername?: string | any;
  firstName?: string;
  lastName?: string;
  country?: Country;
  city?: City;
  birthday?: Date;
}): Promise<{ user: User } | any> => {
  const {
    email,
    redis,
    isPrimaryOwner,
    hashtagId,
    googleId,
    facebookId,
    instagramId,
    instagramUsername,
    firstName,
    lastName,
    country,
    city,
    birthday,
  } = options;
  const user = await User.findOne({ where: { email }, relations: ["account"] });
  if (user) {
    return { error: { code: errors.CONFLICT, message: "User already exists" } };
  }
  const newUser = User.create({
    email,
    hashtagId,
    googleId,
    facebookId,
    instagramId,
    instagramUsername,
    firstName,
    lastName,
  });

  const newUserAccount = Account.create({ country, city, birthday });

  try {
    await newUser.save();
    newUserAccount.user = newUser;
    if (country) {
      newUserAccount.country = country;
    }
    if (city) {
      newUserAccount.city = city;
    }
    await newUserAccount.save();
    if (isPrimaryOwner) {
      await Owner.create({ user: newUser }).save();
    }
  } catch (err) {
    return { error: { code: errors.INTERNAL_SERVER_ERROR, message: `Something went wrong: ${err.message}` } };
  }

  if (isPrimaryOwner) {
    await redis.sadd(newUser.getRedisKey(true) as KeyType, userScopes.PRIMARY_OWNER);
  } else {
    await redis.sadd(newUser.getRedisKey(true) as KeyType, userScopes.SIMPLE_USER);
  }

  return { user: newUser };
};
