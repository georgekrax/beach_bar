import errors from "./errors";
import * as motion from "./motion";
import * as notifications from "./notifications";
// import * as motion from "./graphql";
import * as pages from "./pages";

export const CONFIG = {
  ...pages,
  MOTION: motion,
  ERRORS: errors,
  NOTIFICATIONS: notifications,
  // GRAPHQL: graphql,
};

export { default as NAMES } from "./names";
export { DATA } from "./data";
export { motion as MOTION };
