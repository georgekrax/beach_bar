import { Redis } from "ioredis";
import errors from "../../constants/errors";
import scopes from "../../constants/scopes";
import { Account } from "../../entity/Account";
import { City } from "../../entity/City";
import { Country } from "../../entity/Country";
import { User } from "../../entity/User";
import { ErrorType } from "../../schema/returnTypes";

export const signUpUser = async (
  email: string,
  redis: Redis,
  hashtagId?: bigint,
  googleId?: any,
  facebookId?: any,
  instagramId?: any,
  instagramUsername?: string | any,
  username?: string,
  firstName?: string,
  lastName?: string,
  country?: Country,
  city?: City,
  birthday?: Date,
): Promise<{ user: User } | ErrorType> => {
  const newUser = User.create({
    email,
    hashtagId,
    googleId,
    facebookId,
    instagramId,
    instagramUsername,
    username,
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
  } catch (err) {
    return { error: { code: errors.INTERNAL_SERVER_ERROR, message: `Something went wrong: ${err.message}` } };
  }

  await redis.sadd(`scope:${newUser.id}` as KeyType, scopes.SIMPLE_USER);

  return { user: newUser };
};
