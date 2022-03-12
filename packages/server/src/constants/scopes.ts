export const user = {
  SIMPLE_USER: ["profile", "email", "openid", "hashtag@crud:user", "beach_bar@crud:user"],
  CRUD_OWNER_BEACH_BAR: "beach_bar@crud:owner_beach_bar",
  CRUD_BEACH_BAR: "beach_bar@crud:beach_bar",
  PRIMARY_OWNER: [
    "profile",
    "email",
    "openid",
    "hashtag@crud:user",
    "beach_bar@crud:user",
    "beach_bar@crud:beach_bar",
    "beach_bar@crud:product",
    "beach_bar@crud:food",
    "beach_bar@crud:owner_beach_bar",
  ],
} as const;
