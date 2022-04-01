import { Header } from "./Header";
import { PaymentMethod } from "./PaymentMethod";
import { Trips } from "./Trips";
import { HistoryItem } from "./HistoryItem";
import { Avatar } from "./Avatar";
import { Dashboard } from "./Dashboard";
import { BirthdayField } from "./BirthdayField";
import { BasicInfo, LocationDetails } from "./ProfileInfo";

type SubComponents = {
  Header: typeof Header;
  PaymentMethod: typeof PaymentMethod;
  Trips: typeof Trips;
  HistoryItem: typeof HistoryItem;
  Avatar: typeof Avatar;
  Dashboard: typeof Dashboard;
  BirthdayField: typeof BirthdayField;
  BasicInfo: typeof BasicInfo;
  LocationDetails: typeof LocationDetails;
};

type Props = {};

const Account: React.FC<Props> & SubComponents = () => {
  return <></>;
};

Account.Header = Header;
Account.PaymentMethod = PaymentMethod;
Account.Trips = Trips;
Account.HistoryItem = HistoryItem;
Account.Avatar = Avatar;
Account.Dashboard = Dashboard;
Account.BirthdayField = BirthdayField;
Account.BasicInfo = BasicInfo;
Account.LocationDetails = LocationDetails;

Account.displayName = "Account";

export default Account;
