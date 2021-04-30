import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path1: typeof Path1;
  Path2: typeof Path2;
  Path3: typeof Path3;
  Path4: typeof Path4;
  Path5: typeof Path5;
  Path6: typeof Path6;
  Path7: typeof Path7;
  Filled1: typeof Filled1;
  Filled2: typeof Filled2;
  Filled3: typeof Filled3;
  Colored: typeof Colored;
};

const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      className="icon__filled--white"
      d="M13 2.3C9.9 4.2 9.2 8.3 9 11c0 0 0 0 0 0c1.2-.8 2.7-1.2 4-1.2c1.3 0 2.2.3 3.4 1.2c0 0 0 0 0 0c-.2-2.7-.3-6.7-3.4-8.6z"
      {...props}
    />
  );
};

const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      className="icon__filled--white"
      d="M15.8 10.9c-.8-.5-1.6-.7-2.4-.9v11a.9.9 0 11-1.9 0l.1-11c-.7.1-1.6.4-2.4.9C9.2 11 9.1 11 9 11a.8.8 0 01-.4-.1c-.5-.3-2.5-1.3-5.5 0l0 0a.5.5 0 01-.5-.1a.5.5 0 01-.2-.5c.4-2.2 1.6-4.1 3.4-5.6C7.7 3.4 10.7 2.4 13 2.3c2.3.1 4.3 1.1 6 2.5c1.8 1.4 3 3.4 3.4 5.6a.5.5 0 01-.2.5a.5.5 0 01-.5.1h0l0 0c-2.9-1.3-5-.3-5.5 0a.6.6 0 01-.6 0z"
      {...props}
    />
  );
};

const Path3: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      className="icon__filled--white"
      d="M9 11c.2-2.7.9-6.8 4-8.7c3 1.9 3.2 5.9 3.4 8.6a13.8 13.8 0 00-1.4-.6c-1.5-.5-3.4-.5-4.8.1c-.4.2-.8.4-1.1.6z"
      {...props}
    />
  );
};

const Path4: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      filled
      d="M13 2.3l0-.5h0l0 .5zm0 7.4 0-.5h0l0 .5zm2.8 1.1-.3.4.3-.4zm-2.4-.9.1-.5-.6-.1v.6h.5zm-1.9 11 .5 0-.5 0zm.1-11 .5 0 0-.6-.6.1.1.5zm-2.4.9-.3-.4.3.4zm-.6 0-.3.4.3-.4zm-5.5 0 .2.5 0 0 0 0-.2-.5zm0 0 .2.5 0 0 0 0-.2-.5zm-.5-.1.3-.4-.3.4zm-.2-.5-.5-.1.5.1zM6 4.8l.3.4-.3-.4zm13.1 0-.3.4.3-.4zm3.4 5.6.5-.1-.5.1zm-.2.5.3.4-.3-.4zm-.5.1-.2.5 0 0 .2-.5zm0 0 .2-.5 0 0-.2.5zm0 0-.2.5 0 0 .2-.5zm-6.9-.6.2-.5-.2.5zm-4.8.1.2.5-.2-.5zm2.6-8.5c-1.6 1-2.7 2.6-3.3 4.3c-.6 1.7-.9 3.4-1 4.8l1 .1c.1-1.3.3-3 .9-4.5c.6-1.5 1.5-2.9 2.9-3.8l-.5-.8zm-4 8.7a.5.5 0 00-.1.1a.5.5 0 00.7.7a.5.5 0 00.2-.2a.5.5 0 00-.5-.7l.2 1a.4.4 0 01-.1 0a.5.5 0 01-.5-.4a.5.5 0 01.3-.5a.5.5 0 01.3 0a.5.5 0 01.1.9l-.6-.8zm.6.8c1.1-.8 2.5-1.1 3.7-1.2l0-1c-1.4 0-3 .4-4.3 1.3l.6.8zm3.7-1.2c.6 0 1.1.1 1.6.3c.5.2.9.4 1.5.8l.6-.8c-.6-.4-1.2-.7-1.8-.9c-.6-.2-1.2-.3-1.9-.3l0 1zm3.5.2a.5.5 0 00-.2 0a.5.5 0 000 1a.5.5 0 00.2 0a.5.5 0 00.1-.9l-.6.8a.4.4 0 01-.1-.1a.5.5 0 01-.1-.4a.5.5 0 01.7-.4a.5.5 0 01.2.2a.5.5 0 01-.5.7l0 0 .2-1zm.4.5c-.1-1.3-.2-3.1-.6-4.7c-.5-1.6-1.3-3.2-3-4.3l-.5.8c1.4.9 2.1 2.2 2.5 3.7c.4 1.5.5 3.1.6 4.5l1-.1zm-.8-.4c-.8-.6-1.8-.8-2.6-.9l-.1 1c.7.1 1.5.3 2.2.8l.5-.8zm-3.1-.4v11h1V10h-1zm0 11c0 .2-.2.4-.4.4v1c.8 0 1.4-.6 1.4-1.4h-1zm-.4.4a.4.4 0 01-.4-.4l-1 0a1.4 1.4 0 001.4 1.5v-1zm-.4-.4.1-11-1 0-.1 11 1 0zm-.5-11.5c-.8.1-1.7.4-2.6.9l.5.8c.7-.5 1.5-.7 2.2-.8l-.1-1zm-2.6.9 0 0a.5.5 0 010 0c0 0 0 0 0 0a.2.2 0 010 0L9 10.5v1a.8.8 0 00.3-.1c.1 0 .2-.1.2-.1l-.5-.8zM9 10.5l0 0a.5.5 0 01-.1 0c0 0 0 0 0 0l-.5.8c.1.1.2.1.3.1c.1 0 .2 0 .3 0v-1zm-.1 0c-.6-.4-2.8-1.5-6-.1l.4.9c2.8-1.2 4.6-.3 5 0l.5-.8zm-5.9-.1a.6.6 0 000 0l0 0 .4.9c0 0 0 0 0 0a.4.4 0 010 0l-.3-.9zm0 0c0 0 0 0 0 0c0 0 0 0 0 0l-.6.8a.9.9 0 001 .1l-.4-.9zm.1 0c0 0 0 0 0 0l-1-.2a1 1 0 00.3.9l.6-.8zm0 0c.4-2 1.5-3.9 3.3-5.3l-.6-.8C3.7 5.9 2.4 8 2 10.3L3 10.4zm3.3-5.3c1.6-1.3 4.6-2.3 6.8-2.4l0-1c-2.4.1-5.5 1.1-7.3 2.6l.6.8zm6.7-2.4c2.1.1 4.1 1 5.8 2.4l.6-.8c-1.8-1.4-3.9-2.5-6.3-2.6l0 1zm5.8 2.4c1.7 1.4 2.9 3.2 3.3 5.3l1-.2c-.4-2.3-1.7-4.4-3.6-5.9l-.6.8zM22 10.4c0 0 0 0 0 0l.6.8a1 1 0 00.3-.9L22 10.4zm0 0a0 0 0 010 0c0 0 0 0 0 0l-.4.9a.9.9 0 001-.1l-.6-.8zm.1 0 0 0-.4.9 0 0 .4-.9zm0 0h0l-.4.9 0 0 .4-.9zm0 0c-3.1-1.4-5.3-.3-6 .1l.5.8c.5-.3 2.3-1.2 5 0l.4-.9zm-6 .1a.1.1 0 010 0a.1.1 0 010 0l-.5.8c.3.2.8.2 1.1 0l-.5-.8zm.5 0c-.4-.2-.9-.4-1.5-.6l-.3.9c.5.2 1 .4 1.4.6l.4-.9zm-1.5-.6c-1.6-.6-3.6-.6-5.2.1l.4.9c1.3-.6 3.1-.6 4.5-.1l.3-.9zm-5.2.1c-.4.2-.9.4-1.2.6l.5.9c.3-.2.6-.4 1-.5l-.4-.9z"
      {...props}
    />
  );
};

const Path5: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      filled
      d="M12.5 2.3C9.4 4.2 8.7 8.3 8.5 11c0 0 0 0 0 0c1.2-.8 2.7-1.2 4-1.2c1.3 0 2.2.3 3.4 1.2c0 0 0 0 0 0c-.2-2.7-.3-6.7-3.4-8.6z"
      {...props}
    />
  );
};

const Path6: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      filled
      d="M15.3 10.9c-.8-.5-1.6-.7-2.4-.9v11a.9.9 0 11-1.9 0l.1-11c-.7.1-1.6.4-2.4.9c-.1.1-.1.1-.2.1a.8.8 0 01-.4-.1c-.5-.3-2.5-1.3-5.5 0a.5.5 0 01-.5-.1a.5.5 0 01-.2-.5c.4-2.2 1.6-4.1 3.4-5.6c1.7-1.4 4.8-2.4 7-2.5c2.3.1 4.3 1.1 6 2.5c1.8 1.4 3 3.4 3.4 5.6a.5.5 0 01-.2.5a.5.5 0 01-.5.1h0l0 0c-2.9-1.3-5-.3-5.5 0a.6.6 0 01-.6 0z"
      {...props}
    />
  );
};

const Path7: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase filled d="M12 10a6.9 6.9 0 00-.1 0l-.7.1-.1 11a.9.9 0 101.9 0V10l-.7-.1a6.9 6.9 0 00-.1 0z" {...props} />
  );
};

export const BeachUmbrella: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 />
      <Path2 />
      <Path3 />
      <Path4 />
    </Base>
  );
};

const Filled1: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path5 />
      <Path6 className="icon__beach-umbrella__filled-stroke" style={{ strokeWidth: 1}} />
      <Path7 />
      <Path4 />
      <PathBase
        className="icon__filled--white"
        d="M8.5 11c.2-2.7.9-6.8 4-8.7c3 1.9 3.2 5.9 3.4 8.6a13.8 13.8 0 00-1.4-.6c-1.5-.5-3.4-.5-4.8.1c-.4.2-.8.4-1.1.6z"
      />
    </Base>
  );
};

const Filled2: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path5 className="icon__filled-white" />
      <Path6 className="icon__filled--white" />
      <Path4 filled />
      <PathBase
        filled
        d="M9.6 10.4c-.5.2-1-.1-1-.7c.3-2.6 1.3-5.8 3.9-7.4c2.5 1.6 3 4.5 3.3 7c.1.7-.7 1.2-1.3.9c-1.5-.5-3.4-.5-4.8.1z"
      />
      <Path7 />
      <PathBase
        filled
        d="M12.5 2.3l.3-.4a.5.5 0 00-.5 0l.3.4zM12 10l0-.5h0l0 .5zm-.1 0 0-.5 0 0 0 0 .1.5zm-.7.1-.1-.5-.4 0 0 .4.5 0zm-.1 11 .5 0-.5 0zm1.9-11h.5v-.5l-.5 0-.1.5zm-.7-.1.1-.5 0 0h0l0 .5zm.1-8.1c-2.8 1.8-3.8 5.2-4.1 7.8l1 .1c.3-2.6 1.2-5.6 3.6-7.1l-.5-.8zm4 7.4c-.2-2.5-.7-5.7-3.5-7.4l-.5.8c2.3 1.4 2.8 4.1 3 6.6l1-.1zm-6.4 1.6c1.3-.6 3.1-.6 4.5-.1l.3-.9c-1.6-.6-3.6-.6-5.2.1l.4.9zm2.2-1.4a7.3 7.3 0 00-.2 0l.1 1a6.4 6.4 0 01.1 0l0-1zm-.2 0-.7.1.1 1 .7-.1-.1-1zm-1.2.6-.1 11 1 0 .1-11-1 0zm-.1 11a1.4 1.4 0 001.4 1.5v-1a.4.4 0 01-.4-.4l-1 0zm1.4 1.5c.8 0 1.4-.6 1.4-1.4h-1c0 .2-.2.4-.4.4v1zm1.4-1.4V10h-1v11h1zm-.5-11.5-.7-.1-.1 1 .7.1.1-1zm-.8-.1a7.3 7.3 0 00-.2 0l0 1 .1 0 .1-1zm3.1-.1a.4.4 0 01-.2.4a.5.5 0 01-.5.1l-.3.9c.9.3 2.1-.4 2-1.5l-1 .1zm-7.1.3c-.1.5.2.9.5 1.1c.3.2.8.3 1.2.1l-.4-.9a.2.2 0 01-.2 0c-.1 0-.1-.1-.1-.1l-1-.1z"
      />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Filled2 className="icon__colored--beach-umbrella" {...props} />
  );
};

const Filled3: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 className="" filled />
      <Path2 className="" filled />
      <Path3 className="" filled />
      <Path4 className="" filled />
    </Base>
  );
};

BeachUmbrella.Path1 = Path1;
BeachUmbrella.Path2 = Path2;
BeachUmbrella.Path3 = Path3;
BeachUmbrella.Path4 = Path4;
BeachUmbrella.Path5 = Path5;
BeachUmbrella.Path6 = Path6;
BeachUmbrella.Path7 = Path7;
BeachUmbrella.Filled1 = Filled1;
BeachUmbrella.Filled2 = Filled2;
BeachUmbrella.Filled3 = Filled3;
BeachUmbrella.Colored = Colored;

BeachUmbrella.displayName = "IconBeachUmbrella";
Path1.displayName = "IconBeachUmbrellaPath1";
Path2.displayName = "IconBeachUmbrellaPath2";
Path3.displayName = "IconBeachUmbrellaPath3";
Path4.displayName = "IconBeachUmbrellaPath4";
Path5.displayName = "IconBeachUmbrellaPath5";
Path6.displayName = "IconBeachUmbrellaPath6";
Path7.displayName = "IconBeachUmbrellaPath7";
Filled1.displayName = "IconBeachUmbrellaFilled1";
Filled2.displayName = "IconBeachUmbrellaFilled2";
Filled3.displayName = "IconBeachUmbrellaFilled3";
Colored.displayName = "IconBeachUmbrellaColored";
