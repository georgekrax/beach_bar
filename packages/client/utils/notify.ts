import toast, { ToastOptions } from "react-hot-toast";
import { CONFIG } from "../config";

export type NotifyOptions = {
  assertive?: boolean;
  somethingWentWrong?: boolean | { onlyWhenUndefined: boolean };
} & ToastOptions;

export const notify = (
  action: "success" | "error" | "none",
  message: string,
  { assertive = true, somethingWentWrong = action === "error", ...params }: NotifyOptions = {}
) => {
  let options = { ...params };
  let msg: string = "";
  if (somethingWentWrong) {
    if (typeof somethingWentWrong === "object" && somethingWentWrong.onlyWhenUndefined)
      msg = message ? message : CONFIG.ERRORS.SWW;
    else msg = CONFIG.ERRORS.SWW + " " + message.replace("Something went wrong.", "");
  } else msg = message;
  if (assertive) options = { ...options, ...CONFIG.NOTIFICATIONS.Assertive };
  if (action !== "none") toast[action](msg, options);
  else toast(msg, options);
};
