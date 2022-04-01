import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";
import Next from "@/components/Next";

const DashboardFoodsPage: React.FC = () => {
  return (
    <Layout hasToaster>
      <Dashboard defaultSelected="/dashboard/foods">
        <Next.MotionContainer>
          <Dashboard.Foods heading="Foods" />
        </Next.MotionContainer>
      </Dashboard>
    </Layout>
  );
};

DashboardFoodsPage.displayName = "DashboardFoodsPage";

export default DashboardFoodsPage;
