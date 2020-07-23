import dayjs from "dayjs";
import { model, Schema } from "mongoose";

const clientOsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
  },
  {
    _id: true,
    collection: "clientOs",
    timestamps: {
      currentTime: () => dayjs().toDate(),
    },
  }
);

export default model("clientOs", clientOsSchema);
