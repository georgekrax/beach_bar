import { makeSchema } from "@nexus/schema";
import path from "path";
import * as types from "./schema/index";

export const schema = makeSchema({
  types,
  shouldGenerateArtifacts: process.env.NODE_ENV === "development",
  outputs: {
    schema: path.join(__dirname, "generated/schema.graphql"),
    typegen: path.join(__dirname, "generated/nexusTypes.ts"),
  },
  prettierConfig: require.resolve("../.prettierrc.json"),
});
