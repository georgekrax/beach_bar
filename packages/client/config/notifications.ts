import { ToastOptions } from "react-hot-toast";

export const Assertive: Pick<ToastOptions, "ariaLive" | "role"> = {
  ariaLive: "assertive",
  role: "alert",
};
