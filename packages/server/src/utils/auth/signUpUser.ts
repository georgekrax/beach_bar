import { user as USER_SCOPES } from "@/constants/scopes";
import { NexusGenArgTypes, NexusGenInputs } from "@/graphql/generated/nexusTypes";
import { NonReadonly } from "@/typings/index";
import { getRedisKey } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { Prisma } from "@prisma/client";
import { prisma, redis } from "../../index";

type SignUpUserModel = Prisma.UserGetPayload<{ include: { account: true } }>;
export type SignUpUserOptions = Pick<Partial<SignUpUserModel>, "googleId" | "facebookId" | "instagramId" | "instagramUsername" | "hashtagId"> &
  Pick<Partial<NonNullable<SignUpUserModel["account"]>>, "countryId" | "city" | "phoneNumber"> &
  Pick<NexusGenInputs["OAuthUserInput"], "birthday" | "email" | "firstName" | "lastName" | "imgUrl">;

export const signUpUser = async (
  options: SignUpUserOptions & {
    isPrimaryOwner: NexusGenArgTypes["Mutation"]["signUp"]["isPrimaryOwner"];
  }
) => {
  const { email, isPrimaryOwner, countryId, city, birthday, ...data } = options;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) throw new Error("User already exists");
  const newUser = await prisma.user.create({
    include: { account: true },
    data: { ...data, email, account: { create: { countryId, city, birthday: birthday ? new Date(birthday?.toString()) : null } } },
  });

  try {
    if (isPrimaryOwner) await prisma.owner.create({ data: { userId: newUser.id } });
  } catch (err) {
    throw new Error(errors.INTERNAL_SERVER_ERROR);
  }

  const scopeKey: keyof typeof USER_SCOPES = isPrimaryOwner ? "PRIMARY_OWNER" : "SIMPLE_USER";
  await redis.sadd(
    getRedisKey({ model: "User", id: newUser.id, scope: true }),
    USER_SCOPES[scopeKey] as NonReadonly<typeof USER_SCOPES[typeof scopeKey]>
  );

  return newUser;
};
