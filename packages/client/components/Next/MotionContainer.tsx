import { MotionBox, MotionBoxProps } from "@hashtag-design-system/components";

export type Props = MotionBoxProps;

export const MotionContainer: React.FC<Props> = ({ children, ...props }) => {
  return (
    <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial" {...props}>
      {children}
    </MotionBox>
  );
};

MotionContainer.displayName = "NextMotionContainer";
