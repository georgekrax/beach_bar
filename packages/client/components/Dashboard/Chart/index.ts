import dynamic from "next/dynamic";

export const Chart = dynamic(
  () => {
    const prom = import("./Chart").then(mod => mod.Chart);
    return prom;
  },
  { ssr: false }
);
