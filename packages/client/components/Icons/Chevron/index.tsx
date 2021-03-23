import { Down } from "./Down";
import { Left } from "./Left";
import { Right } from "./Right";

type SubComponents = {
  Left: typeof Left;
  Right: typeof Right;
  Down: typeof Down;
};

const Chevron: React.FC & SubComponents = () => {
  return <></>;
};

Chevron.Left = Left;
Chevron.Right = Right;
Chevron.Down = Down;

Chevron.displayName = "ChevronIcon";

export default Chevron;
