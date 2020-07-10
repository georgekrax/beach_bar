import { MyContext, UrlScalar } from "@beach_bar/common";
import { extendType } from "@nexus/schema";
import { createHash, randomBytes } from "crypto";
import { BeachBar } from "../../entity/BeachBar";
import { User } from "../../entity/User";
import { BeachBarType } from "./types";

export const BeachBarQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getStripeConnectOAuthUrl", {
      type: UrlScalar,
      nullable: true,
      description:
        "Returns the URL where the #beach_bar (owner) will be redirected to authorize and register with Stripe, for its connect account",
      resolve: async (_, __, { payload, res, stripe }: MyContext): Promise<string | null> => {
        if (!payload) {
          return null;
        }
        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        res.cookie("scstate", state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 300000,
        });
        const user = await User.findOne({
          where: { id: payload.sub },
          relations: ["owner", "account", "account.country", "account.city", "account.contactDetails"],
        });
        if (!user || !user.owner || !user.account || !user.account.country || !user.account.city || !user.account.contactDetails) {
          return null;
        }
        const url = await stripe.oauth.authorizeUrl({
          client_id: process.env.STRIPE_OAUTH_CLIENT_ID!.toString(),
          redirect_uri: process.env.STRIPE_CONNECT_OAUTH_REDIRECT_URI!.toString(),
          response_type: "code",
          state,
          stripe_user: {
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            business_type: "company",
            phone_number: user.account.contactDetails[0].phoneNumber,
            country: user.account.country.isoCode,
            city: user.account.city.name,
          },
          suggested_capabilities: ["transfers", "card_payments"],
        });
        return url;
      },
    });
    t.list.field("getAllBeachBars", {
      type: BeachBarType,
      description: "A list with all the available #beach_bars",
      nullable: true,
      resolve: async () => {
        const beachBars = await BeachBar.find({
          where: { isActive: true },
          relations: [
            "owners",
            "owners.owner",
            "owners.owner.user",
            "owners.owner.user.account",
            "reviews",
            "restaurants",
            "restaurants.foodItems",
            "products",
            "features",
            "features.service",
          ],
        });
        return beachBars;
      },
    });
  },
});
