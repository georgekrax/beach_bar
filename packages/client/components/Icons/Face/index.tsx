import { Happy } from "./Happy";
import { Sad } from "./Sad";

type SubComponents ={
  Happy: typeof Happy;
  Sad: typeof Sad;
}

export const Face: React.FC & SubComponents = () => {
  return (
    <>

    </>
  );
};

Face.Happy = Happy;
Face.Sad = Sad;

Face.displayName = "IconFace"