import dayjs from "dayjs";
import { model, Schema } from "mongoose";

const userHistoryActivitySchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 255,
      required: true,
      unique: true,
    },
  },
  {
    _id: true,
    collection: "userHistoryActivity",
    timestamps: {
      currentTime: () => dayjs().toDate(),
    },
  }
);

export default model("userHistoryActivity", userHistoryActivitySchema);
