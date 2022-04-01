import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";
import Next from "@/components/Next";

const DashboardBillingPage: React.FC = () => {
  return (
    <Layout hasToaster>
      <Dashboard defaultSelected="/dashboard/billing">
        <Next.MotionContainer><Dashboard.Billing /></Next.MotionContainer>
      </Dashboard>
    </Layout>
  );
};

DashboardBillingPage.displayName = "DashboardBillingPage";

export default DashboardBillingPage;
