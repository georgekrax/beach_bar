<<<<<<< HEAD
import dynamic from "next/dynamic";
import Next from "./Next";

export default Next;

export const NextIconBox = dynamic(() => {
  const prom = import("@/components/Next/IconBox").then(mod => mod.IconBox);
  return prom;
})
=======
import dynamic from "next/dynamic";
import Next from "./Next";

export default Next;

export const NextIconBox = dynamic(() => {
  const prom = import("@/components/Next/IconBox").then(mod => mod.IconBox);
  return prom;
})
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
