import { makeSchema } from "@nexus/schema";

import * as types from "./schema/index";

export const schema = makeSchema({
  types: [types],
});
