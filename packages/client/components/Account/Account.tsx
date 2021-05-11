import { Header } from "./Header";
import { Menu } from "./Menu";
import { PaymentMethod } from "./PaymentMethod";
import { Trips } from "./Trips";
import { HistoryAction } from "./HistoryAction";
import { Avatar } from "./Avatar";

type SubComponents = {
  Menu: typeof Menu;
  Header: typeof Header;
  PaymentMethod: typeof PaymentMethod;
  Trips: typeof Trips;
  HistoryAction: typeof HistoryAction;
  Avatar: typeof Avatar;
};

type Props = {};

const Account: React.FC<Props> & SubComponents = () => {
  return <></>;
};

Account.Menu = Menu;
Account.Header = Header;
Account.PaymentMethod = PaymentMethod;
Account.Trips = Trips;
Account.HistoryAction = HistoryAction;
Account.Avatar = Avatar;

Account.displayName = "Account";

export default Account;
