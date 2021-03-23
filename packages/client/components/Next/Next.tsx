import { Link } from "./Link";
import { TimePicker } from "./TimePicker";
import { DoNotHave } from "./DoNotHave";
import { Motion } from "./Motion";
import { IconBox } from "./IconBox";

type SubComponents = {
  Link: typeof Link;
  TimePicker: typeof TimePicker;
  DoNotHave: typeof DoNotHave;
  Motion: typeof Motion;
  IconBox: typeof IconBox;
}

type Props = {};

const Next: React.FC<Props> & SubComponents = () => {
  return <></>;
};

Next.Link = Link;
Next.TimePicker = TimePicker;
Next.DoNotHave = DoNotHave;
Next.Motion = Motion;
Next.IconBox = IconBox;

Next.displayName = "Next";

export default Next;
