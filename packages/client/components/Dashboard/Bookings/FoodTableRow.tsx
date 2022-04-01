import Next from "@/components/Next";
import { DashboardBookingsQuery } from "@/graphql/generated";
import { useDashboard } from "@/utils/hooks";
import { Table } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import { DashboardBookingsPaymentsTableRowProps } from "./index";

type Props = {
  refCode: string;
} & Pick<DashboardBookingsPaymentsTableRowProps, "href"> &
  Omit<DashboardBookingsQuery["dashboardBookings"]["bookings"][number]["cart"]["foods"][number], "id"> &
  Pick<ReturnType<typeof useDashboard>, "currencySymbol">;

export const FoodTableRow: React.FC<Props> = ({ total, date, quantity, food, href, refCode, currencySymbol }) => {
  return (
    <>
      <Table.Td className="itext--right semibold">
        <Next.Link href={href}>
          {currencySymbol}
          {total?.toFixed(2)}
        </Next.Link>
      </Table.Td>
      <Table.Td className="text--nowrap">
        <Next.Link href={href}>
          {quantity}x {food.name}
        </Next.Link>
      </Table.Td>
      <Table.Td>
        <Next.Link href={href}>{refCode}</Next.Link>
      </Table.Td>
      <Table.Td className="text--nowrap">
        <Next.Link href={href}>{dayjs(date).format("MMM D")}</Next.Link>
      </Table.Td>
    </>
  );
};

FoodTableRow.displayName = "FoodTableRow";
