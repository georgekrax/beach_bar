import { Badge } from "./Badge";
import { DoNotHave } from "./DoNotHave";
import { IconBox } from "./IconBox";
import { Link } from "./Link";
import { MarginedHeader } from "./MarginedHeader";
import { OrContainer } from "./OrContainer";
import { RealisticConfetti } from "./RealisticConfetti";
import { TimePicker } from "./TimePicker";

type SubComponents = {
  Link: typeof Link;
  TimePicker: typeof TimePicker;
  DoNotHave: typeof DoNotHave;
  IconBox: typeof IconBox;
  Badge: typeof Badge;
  MarginedHeader: typeof MarginedHeader;
  OrContainer: typeof OrContainer;
  RealisticConfetti: typeof RealisticConfetti;
};

type Props = {};

const Next: React.FC<Props> & SubComponents = () => {
  return <></>;
};

Next.Link = Link;
Next.TimePicker = TimePicker;
Next.DoNotHave = DoNotHave;
Next.IconBox = IconBox;
Next.Badge = Badge;
Next.MarginedHeader = MarginedHeader;
Next.OrContainer = OrContainer;
Next.RealisticConfetti = RealisticConfetti;

Next.displayName = "Next";

export default Next;
