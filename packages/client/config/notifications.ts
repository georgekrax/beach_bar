import { ToastOptions } from "react-hot-toast";

export const Assertive: Pick<ToastOptions, "ariaProps"> = {
  ariaProps: {
    "aria-live": "assertive",
    role: "alert",
  },
};
