import { fieldAuthorizePlugin, makeSchema } from "nexus";
import { $settings } from "nexus-prisma";
import path from "path";
import * as types from "./schema/index";

$settings({ prismaClientContextField: "prisma" });

export const schema = makeSchema({
  types,
  shouldGenerateArtifacts: true,
  // shouldGenerateArtifacts: process.env.NODE_ENV === "production",
  prettierConfig: require.resolve("../.prettierrc.json"),
  nonNullDefaults: {
    input: true,
    output: true,
  },
  plugins: [
    fieldAuthorizePlugin({
      formatError: ({ error }) => {
        console.log("name", error.name); // Error
        console.log("message", error.message); // Not authorized
        throw new Error(error.message);
      },
    }),
  ],
  outputs: {
    // schema: path.join(__dirname, "graphql/__generated__/schema.graphql"),
    // typegen: path.join(__dirname, "graphql/__generated__/nexusTypes.ts"),
    schema: path.join(__dirname, "../src/graphql/generated/schema.graphql"),
    typegen: path.join(__dirname, "../src/graphql/generated/nexusTypes.ts"),
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "Prisma",
        glob: false,
      },
    ],
    headers: [
      // 'import { Prisma } from "@prisma/client"',
      'import { Dayjs } from "dayjs"',
      "type StringOrNumber = string | number",
      "type DateOrString = Date | Dayjs | string",
    ],
    mapping: {
      ID: "StringOrNumber",
      Email: "string",
      BigInt: "BigInt",
      // Decimal: "Prisma.Prisma.Decimal | number",
      IPv4: "string",
      URL: "string",
      Date: "DateOrString",
      DateTime: "DateOrString",
    },
  },
  contextType: {
    export: "MyContext",
    module: path.join(__dirname, "../src/typings"),
    // alias: "MyContext",
  },
});

