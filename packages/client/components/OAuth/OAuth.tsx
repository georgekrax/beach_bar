import { Redirect } from "./Redirect";

type SubComponents = {
  Redirect: typeof Redirect;
};

type Props = {};

const OAuth: React.FC<Props> & SubComponents = () => {
  return <></>;
};

OAuth.Redirect = Redirect;

OAuth.displayName = "OAuth";

export default OAuth;
