import { Schema, model } from "mongoose";

const sampleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
    collection: "sample",
  }
);

export default model("sample", sampleSchema);
