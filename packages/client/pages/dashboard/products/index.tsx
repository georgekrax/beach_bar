import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";
import Next from "@/components/Next";

const DashboardProductsPage: React.FC = () => {
  return (
    <Layout hasToaster>
      <Dashboard defaultSelected="/dashboard/products">
        <Next.MotionContainer>
          <Dashboard.Products heading="Products" />
        </Next.MotionContainer>
      </Dashboard>
    </Layout>
  );
};

DashboardProductsPage.displayName = "DashboardProductsPage";

export default DashboardProductsPage;
