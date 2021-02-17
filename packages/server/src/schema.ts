import { makeSchema } from "nexus";
import path from "path";
import * as types from "./schema/index";

export const schema = makeSchema({
  nonNullDefaults: {
    input: true,
    output: true,
  },
  types,
  // shouldGenerateArtifacts: process.env.NODE_ENV === "production",
  shouldGenerateArtifacts: true,
  outputs: {
    schema: path.join(__dirname, "graphql/__generated__/schema.graphql"),
    typegen: path.join(__dirname, "graphql/__generated__/nexusTypes.ts"),
  },
  prettierConfig: require.resolve("../.prettierrc.json"),
});
