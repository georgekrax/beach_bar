import { BigIntScalar, DateScalar } from "@the_hashtag/common/dist/graphql";
import { objectType, unionType } from "nexus";
import { BeachBarType } from "../types";

export const BeachBarEntryFeeType = objectType({
  name: "BeachBarEntryFee",
  description: "Represents an entry fee for a #beach_bar",
  definition(t) {
    t.field("id", { type: BigIntScalar });
    t.float("fee");
    t.field("date", { type: DateScalar, description: "The date this entry fee is applicable for" });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar this fee is added (assigned) to",
      resolve: o => o.beachBar,
    });
  },
});

export const AddBeachBarEntryFeeType = objectType({
  name: "AddBeachBarEntryFee",
  description: "Info to be returned when an entry fee is added to a #beach_bar",
  definition(t) {
    t.list.field("fees", {
      type: BeachBarEntryFeeType,
      description: "The fees that are being added & its details",
      resolve: o => o.fees,
    });
    t.boolean("added", { description: "A boolean that indicates if the fees have been successfully being added to a #beach_bar" });
  },
});

export const AddBeachBarEntryFeeResult = unionType({
  name: "AddBeachBarEntryFeeResult",
  definition(t) {
    t.members("AddBeachBarEntryFee", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "AddBeachBarEntryFee";
    }
  },
});

export const UpdateBeachBarEntryFeeType = objectType({
  name: "UpdateBeachBarEntryFee",
  description: "Info to be returned when the details of #beach_bar entry fee, are updated",
  definition(t) {
    t.list.field("fees", {
      type: BeachBarEntryFeeType,
      description: "The fees being updated",
      resolve: o => o.fees,
    });
    t.boolean("updated", { description: "A boolean that indicates if the fee details have been successfully updated" });
  },
});

export const UpdateBeachBarEntryFeeResult = unionType({
  name: "UpdateBeachBarEntryFeeResult",
  definition(t) {
    t.members("UpdateBeachBarEntryFee", "Error");
  },
  resolveType: item => {
    if (item.name === "Error") {
      return "Error";
    } else {
      return "UpdateBeachBarEntryFee";
    }
  },
});
