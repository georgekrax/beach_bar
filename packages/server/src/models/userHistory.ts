import dayjs from "dayjs";
import { model, Schema } from "mongoose";

const userHistorySchema = new Schema(
  {
    activityId: {
      type: Schema.Types.ObjectId,
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

export default model("userHistory", userHistorySchema);
