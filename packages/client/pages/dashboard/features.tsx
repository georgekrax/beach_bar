import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";
import Next from "@/components/Next";

const DashboardFeaturesPage: React.FC = () => {
  return (
    <Layout hasToaster>
      <Dashboard defaultSelected="/dashboard/features">
        <Next.MotionContainer>
          <Dashboard.Features />
        </Next.MotionContainer>
      </Dashboard>
    </Layout>
  );
};

DashboardFeaturesPage.displayName = "DashboardFeaturesPage";

// export const getStaticProps: GetStaticProps = async () => {
//   const apolloClient = initializeApollo();

//   await getAuth({ apolloClient });
//   await apolloClient.query({ query: PaymentsDocument });

//   return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() }, revalidate: 10 };
// };

export default DashboardFeaturesPage;
