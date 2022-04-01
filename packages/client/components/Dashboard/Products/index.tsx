import BeachBar from "@/components/BeachBar";
import Dashboard, { DashboardAddBtnProps } from "@/components/Dashboard";
import Next from "@/components/Next";
import { useProductsQuery } from "@/graphql/generated";
import { useDashboard } from "@/utils/hooks";
import styles from "./index.module.scss";
// import { Page } from "./Page";

type SubComponents = {
  // Page: typeof Page;
};

export const Products: React.FC<DashboardAddBtnProps> & SubComponents = ({ heading }) => {
  const { beachBarId } = useDashboard();

  const { data, loading, error } = useProductsQuery({
    skip: !beachBarId,
    variables: { beachBarId: beachBarId! },
    // fetchPolicy: "cache-and-network",
  });

  // const [getProducts, { data, loading, error }] = useProductsLazyQuery({ fetchPolicy: "cache-and-network" });

  // useEffect(() => {
  //   if (beachBarId) getProducts({ variables: { beachBarId } });
  // }, [beachBarId]);

  return (
    <div className="w100">
      <Dashboard.AddBtn href="/dashboard/products/new" heading={heading} />
      <div className={styles.list}>
        <Next.Loading isScreen isLoading={loading}>
          {error ? (
            <h2>Error</h2>
          ) : data?.products.length === 0 ? (
            <Next.DoNotHave emoji="😔" msg="You have not added any products to your #beach_bar." />
          ) : (
            <>
              {data?.products.map(({ id, beachBar, ...rest }) => (
                <BeachBar.Product
                  key={"product_" + id}
                  id={id}
                  atDashboard
                  extraDetails
                  showComponents
                  addToCart={false}
                  defaultCurrencySymbol={beachBar.defaultCurrency.symbol}
                  {...rest}
                />
              ))}
            </>
          )}
        </Next.Loading>
      </div>
    </div>
  );
};

Products.displayName = "DashboardProducts";

// Products.Page = Page;
