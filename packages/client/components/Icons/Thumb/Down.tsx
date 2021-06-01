import { Base, IconBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Filled: typeof Filled;
  Content: typeof Content;
};

const Content: React.FC = () => {
  return (
    <>
      <g clipPath="url(#prefix__clip0)">
        <PathBase
          d="M22.5 13.9h-3V4.5h3v9.4zM14.8 4.5H6.9c-.7 0-1.3.4-1.6 1l-2.6 5.6a1.5 1.5 0 00-.1.6v1.6c0 .9.8 1.6 1.8 1.6h5.5l-.8 3.7 0 .3c0 .3.1.6.4.8l.3.2a1 1 0 001.3 0l5.1-4.7c.3-.3.5-.7.5-1.1v-8c0-.9-.8-1.6-1.8-1.6zm0 9.6-3.3 3c-.1.1-.4 0-.3-.2l.6-2.3a1 1 0 00-1-1.3H4.3v-1.6l2.6-5.6h7.9v8z"
          filled
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0">
          <path transform="translate(.5 .5)" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </>
  );
};

export const Down: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Content />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <PathBase
        d="M22 13.4h-4V4h4v9.4zM14.3 4H6.4c-.7 0-1.3.4-1.6 1l-2.6 5.6A1.5 1.5 0 002 11.2v1.6c0 .9.8 1.6 1.8 1.6h4.3a1 1 0 011 1.2l-.6 2.4 0 .3c0 .3.1.6.4.8l.9.8 5.8-5.3c.3-.3.5-.7.5-1.1v-8c0-.9-.8-1.6-1.8-1.6z"
        filled
      />
    </Base>
  );
};

Down.displayName = "IconThumbDown";
Filled.displayName = "IconThumbDownFilled";
Content.displayName = "IconThumbDownContent";

Down.Filled = Filled;
Down.Content = Content;

export default Down;
