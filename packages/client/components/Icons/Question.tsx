import { Base, CircleBase, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Filled: typeof Filled;
};

const Circle: React.FC<IconPathBaseFProps> = props => <CircleBase cx={12} cy={12} r={10} {...props} />;

const Path: React.FC<IconPathBaseFProps> = props => (
  <PathBase
    d="M10.8 14.8c0-.6.1-1.1.2-1.5c.1-.4.4-.8.8-1.2l1-1.1c.4-.5.7-1 .7-1.6c0-.5-.1-1-.4-1.3c-.3-.3-.7-.5-1.3-.5c-.5 0-1 .1-1.3.4c-.3.3-.5.7-.5 1.1H8.6c0-.8.3-1.5.9-2c.6-.5 1.4-.8 2.3-.8c1 0 1.8.3 2.3.8c.6.5.8 1.3.8 2.2c0 .9-.4 1.8-1.3 2.7l-.9.8c-.4.4-.6 1-.6 1.8h-1.4zm-.1 2.5c0-.2.1-.4.2-.6c.1-.2.4-.2.6-.2s.5.1.6.2a.8.8 0 01.2.6c0 .2-.1.4-.2.6c-.1.2-.4.2-.6.2s-.5-.1-.6-.2a.8.8 0 01-.2-.6z"
    {...props}
  />
);

export const Question: React.FC<IconBaseFProps> & SubComponents = props => (
  <Base {...props}>
    <Circle />
    <Path className="icon__stroke--none icon__filled--black" />
  </Base>
);

const Filled: React.FC<IconBaseFProps> = props => (
  <Base {...props}>
    <Circle className="icon__stroke--none icon__filled--black" />
    <Path className="icon__stroke--none icon__filled--white" />
  </Base>
);

Question.displayName = "QuestionIcon";
Filled.displayName = "QuestionFilledIcon";
Path.displayName = "QuestionPathIcon";
Circle.displayName = "QuestionCircleIcon";

Question.Filled = Filled;
