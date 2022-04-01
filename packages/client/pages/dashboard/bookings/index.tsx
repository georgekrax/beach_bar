import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
const DashboardBookingsPage: React.FC = () => {
  return (
    <Layout hasToaster>
      <Dashboard defaultSelected="/dashboard/bookings">
        <Next.MotionContainer><Dashboard.Bookings /></Next.MotionContainer>
      </Dashboard>
    </Layout>
  );
};

DashboardBookingsPage.displayName = "DashboardBookingsPage";

export default DashboardBookingsPage;
