import BeachBar from "@/components/BeachBar";
import Dashboard, { DashboardAddBtnProps } from "@/components/Dashboard";
import Next from "@/components/Next";
import { useFoodsQuery } from "@/graphql/generated";
import { useDashboard } from "@/utils/hooks";
import styles from "./index.module.scss";
// import { Page } from "./Page";

type SubComponents = {
  // Page: typeof Page;
};

export const Foods: React.FC<DashboardAddBtnProps> & SubComponents = ({ heading }) => {
  const { beachBarId, beachBar } = useDashboard({ fetch: true });

  const { data, loading, error } = useFoodsQuery({ skip: !beachBarId, variables: { beachBarId: beachBarId! } });

  return (
    <div className="w100">
      <Dashboard.AddBtn href="/dashboard/foods/new" heading={heading} />
      <Next.Loading isScreen isLoading={loading}>
        {error ? (
          <h2>Error</h2>
        ) : data?.foods.length === 0 ? (
          <Next.DoNotHave emoji="😔" msg="You have not added any foods, snacks or drinks to your #beach_bar." />
        ) : (
          <BeachBar.Page.Food
            atDashboard
            hasNoProducts
            className={styles.foods}
            foods={data?.foods || []}
            currencySymbol={beachBar?.defaultCurrency.symbol || ""}
          />
        )}
      </Next.Loading>
    </div>
  );
};

Foods.displayName = "DashboardFoods";

// Foods.Page = Page;
