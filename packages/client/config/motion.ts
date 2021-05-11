<<<<<<< HEAD
import { Variants } from "framer-motion";

export const LAYOUT_IDS = {
  searchBox: "search_box",
  accountHeader: "account_header",
};
export const productVariants: Variants = {
  initial: { opacity: 0, x: -48 },
  animate: { opacity: 1, x: 0 },
};

export const fadeInUp = {
  initial: {
    y: 12,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const searchItemVariants: Variants = {
  initial: (i: number) => ({
    y: -32,
    opacity: 0,
    transition: { delay: i * 0.05, easings: "easeInOut" },
  }),
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, easings: "easeInOut" },
  }),
};

export const bounceAnimation: Variants = {
  initial: { y: -24, opacity: 0 },
  animate: (delay: number = 0.1) => ({ y: 0, opacity: 1, transition: { duration: 0.2, delay } }),
};
=======
import { Variants } from "framer-motion";

export const LAYOUT_IDS = {
  searchBox: "search_box",
  accountHeader: "account_header",
};
export const productVariants: Variants = {
  initial: { opacity: 0, x: -48 },
  animate: { opacity: 1, x: 0 },
};

export const fadeInUp = {
  initial: {
    y: 12,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const searchItemVariants: Variants = {
  initial: (i: number) => ({
    y: -32,
    opacity: 0,
    transition: { delay: i * 0.05, easings: "easeInOut" },
  }),
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, easings: "easeInOut" },
  }),
};

export const bounceAnimation: Variants = {
  initial: { y: -24, opacity: 0 },
  animate: (delay: number = 0.1) => ({ y: 0, opacity: 1, transition: { duration: 0.2, delay } }),
};
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
