import dynamic from "next/dynamic";
import Next from "./Next";

export default Next;

export const NextIconBox = dynamic(() => {
  const prom = import("@/components/Next/IconBox").then(mod => mod.IconBox);
  return prom;
})
