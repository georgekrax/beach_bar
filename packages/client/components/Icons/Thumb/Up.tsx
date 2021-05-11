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
          d="M2.5 11.1h3V20.5h-3v-9.4zM10.3 20.5h7.9c.7 0 1.3-.4 1.6-1l2.6-5.6c.1-.2.1-.4.1-.6v-1.6c0-.9-.8-1.6-1.8-1.6h-5.5l.8-3.7 0-.3c0-.3-.1-.6-.4-.8l-.3-.2a1 1 0 00-1.3 0L9 9.8A1.5 1.5 0 008.5 10.9v8c0 .9.8 1.6 1.8 1.6zm0-9.6 3.3-3c.1-.1.4 0 .3.2l-.6 2.3a1 1 0 001 1.3h6.6v1.6l-2.6 5.6H10.3v-8z"
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

export const Up: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
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
        d="M2 10.6h4V20H2v-9.4zM9.8 20h7.9c.7 0 1.3-.4 1.6-1l2.6-5.6c.1-.2.1-.4.1-.6v-1.6c0-.9-.8-1.6-1.8-1.6h-4.3a1 1 0 01-1-1.2l.6-2.4 0-.3c0-.3-.1-.6-.4-.8L14.3 4 8.5 9.3A1.5 1.5 0 008 10.4v8c0 .9.8 1.6 1.8 1.6z"
        filled
      />
    </Base>
  );
};

Up.displayName = "IconThumbUp";
Filled.displayName = "IconThumbUpFilled";
Content.displayName = "IconThumbUpContent";

Up.Filled = Filled;
Up.Content = Content;

export default Up;
