import dayjs from "dayjs";
import { model, Schema } from "mongoose";
import { ILoginDetails } from "../typings/schemaInterfaces";

const ObjectId = Schema.Types.ObjectId;

const loginDetailsSchema = new Schema(
  {
    accountId: {
      type: Number,
      required: true,
    },
    platformId: {
      type: ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["logged_in", "invalid_password", "failed"],
      required: true,
      default: "failed",
      trim: true,
    },
    osId: {
      type: ObjectId,
      required: false,
    },
    browserId: {
      type: ObjectId,
      required: false,
    },
    countryId: {
      type: Number,
      required: false,
    },
    cityId: {
      type: Number,
      required: false,
    },
    ipAddr: {
      type: String,
      required: false,
    },
  },
  {
    _id: true,
    collection: "loginDetails",
    timestamps: {
      currentTime: () => dayjs().toDate(),
    },
  }
);

export default model<ILoginDetails>("loginDetails", loginDetailsSchema);
