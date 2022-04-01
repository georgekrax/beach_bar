import { Badge } from "./Badge";
import { DoNotHave } from "./DoNotHave";
import { FAQ } from "./FAQ";
import { IconBox } from "./IconBox";
import { ImgZoom } from "./ImgZoom";
import { Link } from "./Link";
import { MarginedHeader } from "./MarginedHeader";
import { MotionContainer } from "./MotionContainer";
import { OrContainer } from "./OrContainer";
import { RealisticConfetti } from "./RealisticConfetti";
import { TextBox } from "./TextBox";
import { TimePicker } from "./TimePicker";
import { Tooltip } from "./Tooltip";
import { UploadBtn } from "./UploadBtn";
import { Loading } from "./Loading";

type SubComponents = {
  Link: typeof Link;
  TimePicker: typeof TimePicker;
  DoNotHave: typeof DoNotHave;
  IconBox: typeof IconBox;
  Badge: typeof Badge;
  MarginedHeader: typeof MarginedHeader;
  OrContainer: typeof OrContainer;
  RealisticConfetti: typeof RealisticConfetti;
  MotionContainer: typeof MotionContainer;
  ImgZoom: typeof ImgZoom;
  FAQ: typeof FAQ;
  Tooltip: typeof Tooltip;
  UploadBtn: typeof UploadBtn;
  TextBox: typeof TextBox;
  Loading: typeof Loading;
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
Next.MotionContainer = MotionContainer;
Next.ImgZoom = ImgZoom;
Next.FAQ = FAQ;
Next.Tooltip = Tooltip;
Next.UploadBtn = UploadBtn;
Next.TextBox = TextBox;
Next.Loading = Loading;

Next.displayName = "Next";

export default Next;

export type { Props as NextImgZoomProps } from "./ImgZoom";
export type { Props as NextTooltipProps } from "./Tooltip";
export type { Props as NextUploadBtnProps } from "./UploadBtn";
export type { Props as NextLinkProps } from "./Link";
export type { Props as NextIconBoxProps } from "./IconBox";
export type { Props as NextMotionContainerProps } from "./MotionContainer";