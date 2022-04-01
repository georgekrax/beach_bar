import Dashboard from "@/components/Dashboard";
import { useProductQuery } from "@/graphql/generated";
import { useRouter } from "next/router";

const DashboardProductsInfoPage: React.FC = () => {
  const { query } = useRouter();
  const id = query.id?.toString();

  const { data, error, loading } = useProductQuery({ skip: !id, variables: { id: id! } });
  const product = data?.product;

  return (
    <Dashboard.Products.Page
      atEdit
      productId={product?.id}
      isLoading={loading}
      isError={error !== undefined}
      defaultValues={{ ...product, categoryId: product?.category.id }}
    />
  );
};

DashboardProductsInfoPage.displayName = "DashboardProductsInfoPage";

export default DashboardProductsInfoPage;
