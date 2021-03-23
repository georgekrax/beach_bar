import { Up } from "./Up";
import { Down } from "./Down";

type SubComponents ={
  Up: typeof Up;
  Down: typeof Down;
}

export const Thumb: React.FC & SubComponents = () => {
  return (
    <>

    </>
  );
};

Thumb.Up = Up;
Thumb.Down = Down;

Thumb.displayName = "IconThumb"