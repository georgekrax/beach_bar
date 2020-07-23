import dayjs from "dayjs";
import { model, Schema } from "mongoose";

const clientBrowserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
    },
  },
  {
    _id: true,
    collection: "clientBrowser",
    timestamps: {
      currentTime: () => dayjs().toDate(),
    },
  }
);

export default model("clientBrowser", clientBrowserSchema);
