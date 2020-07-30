import dayjs from "dayjs";
import { model, Schema } from "mongoose";
import { IUserHistory } from "../typings/schemaInterfaces";

const ObjectId = Schema.Types.ObjectId;

const userHistorySchema = new Schema(
  {
    activityId: {
      type: ObjectId,
      required: true,
      ref: "userHistoryActivity",
    },
    objectId: {
      type: Number,
      required: false,
      trim: true,
    },
    userId: {
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
    collection: "userHistory",
    timestamps: {
      currentTime: () => dayjs().toDate(),
    },
  }
);

export default model<IUserHistory>("userHistory", userHistorySchema);
