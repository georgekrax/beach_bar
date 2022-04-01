import { Page } from "@/components/Account/Trips/Page";
import { useDashboard } from "@/utils/hooks";

const DashboardBookingsInfoPage: React.FC = () => {
  const { beachBarId } = useDashboard();

  return <Page atDashboard={beachBarId} />;
};

DashboardBookingsInfoPage.displayName = "DashboardBookingsInfoPage";

export default DashboardBookingsInfoPage;
