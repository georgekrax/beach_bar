import { Redis } from "ioredis";
import errors from "../../constants/errors";
import scopes from "../../constants/scopes";
import { Account } from "../../entity/Account";
import { Country } from "../../entity/Country";
import { Owner } from "../../entity/Owner";
import { User } from "../../entity/User";
import { ErrorType } from "../../schema/returnTypes";
import { UserContactDetails } from "../../entity/UserContactDetails";

export const signUpUser = async (
  email: string,
  isPrimaryOwner: boolean,
  redis: Redis,
  hashtagId?: bigint,
  googleId?: any,
  facebookId?: any,
  instagramId?: any,
  username?: string,
  firstName?: string,
  lastName?: string,
  country?: Country | undefined,
): Promise<{ user: User } | ErrorType> => {
  const newUser = User.create({
    email,
    hashtagId,
    googleId,
    facebookId,
    instagramId,
    username,
    firstName,
    lastName,
  });

  const newUserAccount = Account.create();

  try {
    await newUser.save();
    newUserAccount.user = newUser;
    await newUserAccount.save();
    const newUserContactDetails = UserContactDetails.create({
      account: newUserAccount,
      country,
    });
    await newUserContactDetails.save();
    if (isPrimaryOwner) {
      const owner = Owner.create({ user: newUser, isPrimary: true });
      await owner.save();
    }
  } catch (err) {
    return { error: { code: errors.INTERNAL_SERVER_ERROR, message: `Something went wrong: ${err.message}` } };
  }

  if (isPrimaryOwner) {
    await redis.sadd(`scope:${newUser.id}` as KeyType, scopes.PRIMARY_OWNER);
  } else {
    await redis.sadd(`scope:${newUser.id}` as KeyType, scopes.SIMPLE_USER);
  }

  return { user: newUser };
};
