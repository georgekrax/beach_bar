import dynamic from "next/dynamic";

const Link = dynamic(() => {
  const prom = import("./Link").then(mod => mod.Link);
  return prom;
});
const TimePicker = dynamic(() => {
  const prom = import("./TimePicker").then(mod => mod.TimePicker);
  return prom;
});
const DoNotHave = dynamic(() => {
  const prom = import("./DoNotHave").then(mod => mod.DoNotHave);
  return prom;
});
const IconBox = dynamic(() => {
  const prom = import("./IconBox").then(mod => mod.IconBox);
  return prom;
});
const Badge = dynamic(() => {
  const prom = import("./Badge").then(mod => mod.Badge);
  return prom;
});
const MarginedHeader = dynamic(() => {
  const prom = import("./MarginedHeader").then(mod => mod.MarginedHeader);
  return prom;
});
const OrContainer = dynamic(() => {
  const prom = import("./OrContainer").then(mod => mod.OrContainer);
  return prom;
});
const RealisticConfetti = dynamic(() => {
  const prom = import("./RealisticConfetti").then(mod => mod.RealisticConfetti);
  return prom;
});
const MotionContainer = dynamic(() => {
  const prom = import("./MotionContainer").then(mod => mod.MotionContainer);
  return prom;
});
const ImgZoom = dynamic(() => {
  const prom = import("./ImgZoom").then(mod => mod.ImgZoom);
  return prom;
});

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

Next.displayName = "Next";

export default Next;
