import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";

const DashboardSettingsPage: React.FC = () => {
  return (
    <Layout hasToaster>
      <Dashboard defaultSelected="/dashboard/settings" className="dashboard__settings">
        <Dashboard.Settings />
      </Dashboard>
    </Layout>
  );
};

DashboardSettingsPage.displayName = "DashboardSettingsPage";

export default DashboardSettingsPage;
