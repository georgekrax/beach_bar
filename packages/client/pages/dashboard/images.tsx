import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";
import Next from "@/components/Next";

const DashboardImagesPage: React.FC = () => {
  return (
    <Layout hasToaster>
      <Dashboard defaultSelected="/dashboard/images">
        <Next.MotionContainer>
          <Dashboard.Images />
        </Next.MotionContainer>
      </Dashboard>
    </Layout>
  );
};

DashboardImagesPage.displayName = "DashboardImagesPage";

export default DashboardImagesPage;
