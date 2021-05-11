<<<<<<< HEAD
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

export const copyToClipboard = (txt: string) => {
  const inputc = document.body.appendChild(document.createElement("input"));
  inputc.value = txt;
  inputc.focus();
  inputc.select();
  document.execCommand("copy");
  inputc.parentNode?.removeChild(inputc);
};

export const shareWithSocials = (name?: string, at = "at") => {
  try {
    if (navigator)
      navigator.share({
        url: window.location.href,
        text: name ? "Book now your next trip to the beach " + at + " " + name : undefined,
      });
  } catch {
    copyToClipboard(window.location.href);
    notify("success", "Link copied!");
    // notify("error", "Unfortunately, sharing is not supported by your system.", { somethingWentWrong: false });
  }
};
=======
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

export const copyToClipboard = (txt: string) => {
  const inputc = document.body.appendChild(document.createElement("input"));
  inputc.value = txt;
  inputc.focus();
  inputc.select();
  document.execCommand("copy");
  inputc.parentNode?.removeChild(inputc);
};

export const shareWithSocials = (name?: string, at = "at") => {
  try {
    if (navigator)
      navigator.share({
        url: window.location.href,
        text: name ? "Book now your next trip to the beach " + at + " " + name : undefined,
      });
  } catch {
    copyToClipboard(window.location.href);
    notify("success", "Link copied!");
    // notify("error", "Unfortunately, sharing is not supported by your system.", { somethingWentWrong: false });
  }
};
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
