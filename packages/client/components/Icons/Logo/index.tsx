import { Google } from "./Google";
import { Hashtag } from "./Hashtag";

type SubComponents = {
  Google: typeof Google;
  Hashtag: typeof Hashtag;
};

type Props = {};

export const Logo: React.FC<Props> & SubComponents = () => {
  return <></>;
};

Logo.Google = Google;
Logo.Hashtag = Hashtag;

Logo.displayName = "IconLogo";
