import dayjs from "dayjs";
import { model, Schema } from "mongoose";

const platformSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    urlHostname: {
      type: String,
      required: true,
      maxlength: 255,
    },
  },
  {
    _id: true,
    collection: "platform",
    timestamps: {
      currentTime: () => dayjs().toDate(),
    },
  }
);

export default model("platform", platformSchema);
