import { Page } from "@/components/Dashboard/Foods/Page";
import { useFoodQuery } from "@/graphql/generated";
import { useRouter } from "next/router";

const DashboardFoodInfoPage: React.FC = () => {
  const { query } = useRouter();
  const id = query.id?.toString();

  const { data, error, loading } = useFoodQuery({ skip: !id, variables: { id: id! } });
  const food = data?.food;

  return (
    <Page
      atEdit
      foodId={food?.id}
      isLoading={loading}
      isError={error !== undefined}
      defaultValues={{ ...food, categoryId: food?.category.id }}
    />
  );
};

DashboardFoodInfoPage.displayName = "DashboardFoodsInfoPage";

export default DashboardFoodInfoPage;
