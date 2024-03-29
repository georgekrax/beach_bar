import { motion, SVGMotionProps } from "framer-motion";

type FProps = Pick<React.ComponentPropsWithoutRef<"svg">, "className"> & SVGMotionProps<SVGPathElement>;

export const TapBarIndicatorIconPath = {
  default:
    "M 24 24.1 H 0 c 0.2 0 0.6 -0.4 1.1 -0.6 c 0.5 -0.1 1.4 -0.3 1.8 -0.4 h 0 c 1.8 -0.4 3.3 -1.8 4.3 -2.5 c 0.7 -0.7 1.3 -1 2.7 -1.9 c 0.8 -0.5 1.6 -0.5 2.1 -0.5 c 0.7 0 1.6 -0 2.5 0.5 c 1.2 0.7 1.4 0.7 2.6 1.9 c 0.6 0.6 3.6 2.1 4.3 2.5 c 0.6 0.3 0.9 0.2 1.5 0.4 c 0.8 0.2 0.6 0.5 1.1 0.6 z",
  fluid: {
    middle:
      "M 24 24.1 H 0 c 0.2 0 0.6 -0.4 1.1 -0.6 c 0.5 -0.1 1.4 -0.3 1.8 -0.4 h 0 c 1.8 -0.4 3.8 -0.8 4.8 -1.5 c 0.7 -0.7 0.8 -0.5 2.2 -1.4 c 0.8 -0.5 1.6 -0.5 2.1 -0.5 c 0.7 0 1.6 -0 2.5 0.5 c 1.2 0.7 0.9 0.2 2.1 1.4 c 0.6 0.6 4.1 1.1 4.8 1.5 c 0.6 0.3 0.9 0.2 1.5 0.4 c 0.8 0.2 0.6 0.5 1.1 0.6 z",
    right:
      "M 24 24.1 H 0 c 0.2 0 0.6 -0.4 1.1 -0.6 c 0.5 -0.1 1.4 -0.3 1.8 -0.4 h 0 c 1.8 -0.4 7.3 -0.8 8.3 -1.5 c 0.7 -0.7 0.8 -0.5 2.2 -1.4 c 0.8 -0.5 1.6 -0.5 2.1 -0.5 c 0.7 0 1.6 -0 2.5 0.5 c 1.2 0.7 0.9 0.2 2.1 1.4 c 0.6 0.6 0.1 0.6 0.8 1 c 0.6 0.3 1.4 0.7 2 0.9 c 0.8 0.2 0.6 0.5 1.1 0.6 z",
    left:
      "M 24 24.1 H 0 c 0.2 0 0.6 -0.4 1.1 -0.6 c 0.5 -0.1 0.4 -0.3 0.8 -0.4 h 0 c 1.8 -0.4 0.8 -0.8 1.8 -1.5 c 0.7 -0.7 0.3 -0.5 1.7 -1.4 c 0.8 -0.5 1.6 -0.5 2.1 -0.5 c 0.7 0 1.6 -0 2.5 0.5 c 1.2 0.7 0.9 0.2 2.1 1.4 c 0.6 0.6 8.6 1.1 9.3 1.5 c 0.6 0.3 0.9 0.2 1.5 0.4 c 0.8 0.2 0.6 0.5 1.1 0.6 z",
  },
};

const TapBarIndicator: React.FC<FProps> = ({ className, ...props }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* <path d="M24 24.092H0c.247 0 .571-.407 1.108-.553.518-.142 1.177-.244 1.582-.317l.264-.053c1.826-.442 2.284-.768 3.323-1.477C7.323 20.585 10.67 18 12 18c1.662 0 4.061 1.662 6.092 3.692.569.569 2.574 1.142 3.323 1.477.61.273.876.21 1.477.37.773.205.568.463 1.108.553z" /> */}
      <motion.path d={TapBarIndicatorIconPath.default} {...props} />
    </svg>
  );
};

TapBarIndicator.displayName = "TapBarIndicatorIcon";

export default TapBarIndicator;