import { enumType, inputObjectType } from "nexus";

export const OAuthProviderEnum = enumType({
  name: "OAuthProvider",
  members: {
    Hashtag: "#hashtag",
    Google: "Google",
    GitHub: "GitHub",
    Facebook: "Facebook",
    Instagram: "Instagram",
  },
});

export const OAuthUserInput = inputObjectType({
  name: "OAuthUserInput",
  description: "User details in when authorizing with an OAuth Provider",
  definition(t) {
    t.id("id");
    t.email("email");
    t.nullable.string("username");
    t.nullable.string("firstName");
    t.nullable.string("lastName");
    t.nullable.url("imgUrl");
    t.nullable.date("birthday");
  },
});
