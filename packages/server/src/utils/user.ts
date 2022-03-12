import { getRedisKey } from "@/utils/db";
import { Account, Prisma, User } from "@prisma/client";
import { prisma, redis } from "../index";

// getFullName()
type GetFullNameOptions = Pick<Partial<User>, "firstName" | "lastName">;

export const getFullName = ({ firstName, lastName }: GetFullNameOptions): string | null => {
  if (!firstName && !lastName) return null;
  let fullName: string[] = [];
  if (firstName) fullName.push(firstName);
  if (lastName) fullName.push(lastName);
  return fullName.join(" ");
};

type GetUserHasNewOptions = Pick<Partial<User>, "firstName" | "lastName" | "email"> &
  Pick<
    Partial<Account>,
    | "birthday"
    | "phoneNumber"
    | "telCountryId"
    | "zipCode"
    | "trackHistory"
    | "city"
    | "countryId"
    | "address"
    | "honorificTitle"
    | "imgUrl"
  >;

// getUserHasNew()
export const getUserHasNew = (
  user: Prisma.UserGetPayload<{ include: { account: true } }>,
  {
    email,
    firstName,
    lastName,
    imgUrl,
    honorificTitle,
    birthday,
    countryId,
    city,
    phoneNumber,
    address,
    zipCode,
  }: GetUserHasNewOptions
) => {
  if (
    email !== user.email ||
    firstName !== user.firstName ||
    lastName !== user.lastName ||
    imgUrl !== user.account?.imgUrl ||
    honorificTitle !== user.account?.honorificTitle ||
    birthday?.toString() !== user.account?.birthday?.toString() ||
    countryId !== user.account?.countryId ||
    city !== user.account?.city ||
    phoneNumber !== user.account?.phoneNumber ||
    address !== user.account?.address ||
    zipCode !== user.account?.zipCode
  ) {
    return true;
  }
  return false;
};

// removeUserSessions()
export const removeUserSessions = async (userId: number): Promise<void> => {
  await redis.del(getRedisKey({ model: "User", id: userId }));

  await prisma.user.updateMany({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } });
  await prisma.account.updateMany({ where: { userId }, data: { isActive: false } });
};
