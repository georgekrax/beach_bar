import { Header } from "./Header";
import { Menu } from "./Menu";
import { PaymentMethod } from "./PaymentMethod";
import { Trips } from "./Trips";
import { HistoryAction } from "./HistoryAction";

type SubComponents = {
  Menu: typeof Menu;
  Header: typeof Header;
  PaymentMethod: typeof PaymentMethod;
  Trips: typeof Trips;
  HistoryAction: typeof HistoryAction;
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

Account.displayName = "Account";

export default Account;
