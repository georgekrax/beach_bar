import { BigIntScalar, DateScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { BeachBarType } from "../types";

export const BeachBarEntryFeeType = objectType({
  name: "BeachBarEntryFee",
  description: "Represents an entry fee for a #beach_bar",
  definition(t) {
    t.field("id", { type: BigIntScalar, nullable: false });
    t.float("fee", { nullable: false });
    t.field("date", { type: DateScalar, nullable: false, description: "The date this entry fee is applicable for" });
    t.field("beachBar", {
      type: BeachBarType,
      nullable: false,
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
      nullable: false,
      resolve: o => o.fees,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the fees have been successfully being added to a #beach_bar",
    });
  },
});

export const AddBeachBarEntryFeeResult = unionType({
  name: "AddBeachBarEntryFeeResult",
  definition(t) {
    t.members("AddBeachBarEntryFee", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddBeachBarEntryFee";
      }
    });
  },
});

export const UpdateBeachBarEntryFeeType = objectType({
  name: "UpdateBeachBarEntryFee",
  description: "Info to be returned when the details of #beach_bar entry fee, are updated",
  definition(t) {
    t.list.field("fees", {
      type: BeachBarEntryFeeType,
      description: "The fees being updated",
      nullable: false,
      resolve: o => o.fees,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the fee details have been successfully updated",
    });
  },
});

export const UpdateBeachBarEntryFeeResult = unionType({
  name: "UpdateBeachBarEntryFeeResult",
  definition(t) {
    t.members("UpdateBeachBarEntryFee", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateBeachBarEntryFee";
      }
    });
  },
});
