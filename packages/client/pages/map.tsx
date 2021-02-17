import { Input } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { useRef } from "react";

type Props = {};

const Map: React.FC<Props> = () => {
  const ref = useRef<HTMLElement>(null);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      // transition={{ duration: 0.5 }}
      style={{ background: "grey" }}
      exit="initial"
      layout
      layoutId="hey"
    >
      <Input placeholder="Search for places..." />
      Map
    </motion.div>
  );
};

Map.displayName = "Map";

export default Map;
