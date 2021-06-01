import { useClassnames } from "@hashtag-design-system/components";
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path1: typeof Path1;
  Path2: typeof Path2;
  Mask: typeof Mask;
};

export const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M6 22h12a2 2 0 002-2V6.9c0-.6-.2-1.1-.6-1.5l-2.8-2.8c-.4-.4-.9-.6-1.5-.6H6a2 2 0 00-2 2v16a2 2 0 002 2z"
      {...props}
    />
  );
};

export const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M10 15.3a.8.8 0 000 1.5v-1.5zm4 1.5a.8.8 0 000-1.5v1.5zm-4 1.5a.8.8 0 000 1.5v-1.5zm4 1.5a.8.8 0 000-1.5v1.5zm-.3-12.5H8.3v1.5h5.4v-1.5zM8.3 7.2V2h-1.5v5.2h1.5zm5.5-5.2v5.2h1.5V2h-1.5zM8.3 7.3a.1.1 0 01-.1-.1h-1.5c0 .9.7 1.6 1.6 1.6v-1.5zm5.4 1.5a1.6 1.6 0 001.6-1.6h-1.5a.1.1 0 01-.1.1v1.5zm2 2.5H8.3v1.5h7.4v-1.5zM6.8 12.8V22h1.5v-9.2h-1.5zm10.5 9.2v-9.2h-1.5V22h1.5zM8.3 11.3a1.6 1.6 0 00-1.6 1.6h1.5a.1.1 0 01.1-.1v-1.5zm7.4 1.5a.1.1 0 01.1.1h1.5a1.6 1.6 0 00-1.6-1.6v1.5zm-5.7 4h4v-1.5h-4v1.5zm0 3h4v-1.5h-4v1.5zm6.6-17.1 1.1-1.1-1.1 1.1zm2.8 2.8-1.1 1.1 1.1-1.1zM18 20.5H6v3h12v-3zM5.5 20V4h-3v16h3zM6 3.5h9.1v-3H6v3zm12.5 3.4V20h3V6.9h-3zm-2.9-3.2 2.8 2.8 2.1-2.1-2.8-2.8-2.1 2.1zM21.5 6.9c0-1-.4-1.9-1.1-2.6l-2.1 2.1c.1.1.2.3.2.4h3zM15.1 3.5c.2 0 .3.1.4.2l2.1-2.1A3.6 3.6 0 0015.1.5v3zM6 20.5a.5.5 0 01-.5-.5h-3A3.5 3.5 0 006 23.5v-3zm12 3a3.5 3.5 0 003.5-3.5h-3a.5.5 0 01-.5.5v3zM5.5 4a.5.5 0 01.5-.5v-3A3.5 3.5 0 002.5 4h3z"
      mask="url(#prefix__a)"
      {...props}
    />
  );
};

export const Mask: React.FC<React.SVGProps<SVGMaskElement>> = ({ children, ...props }) => {
  return (
    <mask id="prefix__a" {...props}>
      {children}
    </mask>
  );
};

export const Save: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  const [classNames, rest] = useClassnames("icon-save", props);

  return (
    <Base className={classNames} {...rest}>
      <Mask>
        <Path1 />
      </Mask>
      <Path2 />
    </Base>
  );
};

Save.Path1 = Path1;
Save.Path2 = Path2;
Save.Mask = Mask;

Save.displayName = "SaveIcon";
Mask.displayName = "SaveMaskIcon";
Path1.displayName = "SavePath1Icon";
Path2.displayName = "SavePath2Icon";
