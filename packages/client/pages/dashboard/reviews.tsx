import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";
import Next from "@/components/Next";

const DashboardReviewsPage: React.FC = () => {
  return (
    <Layout hasToaster>
      <Dashboard defaultSelected="/dashboard/reviews">
        <Next.MotionContainer>
          <Dashboard.Reviews />
        </Next.MotionContainer>
      </Dashboard>
    </Layout>
  );
};

DashboardReviewsPage.displayName = "DashboardReviewsPage";

export default DashboardReviewsPage;
