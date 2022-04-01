import Next from "@/components/Next";
import { DashboardBookingsQuery } from "@/graphql/generated";
import { formatPeople } from "@/utils/format";
import { useDashboard } from "@/utils/hooks";
import { Table } from "@hashtag-design-system/components";
import { DashboardBookingsPaymentsTableRowProps } from "./index";
import dayjs from "dayjs";

type Props = {
  refCode: string;
} & Pick<DashboardBookingsPaymentsTableRowProps, "href"> &
  Omit<DashboardBookingsQuery["dashboardBookings"]["bookings"][number]["cart"]["products"][number], "id"> &
  Pick<ReturnType<typeof useDashboard>, "currencySymbol">;

export const ProductTableRow: React.FC<Props> = ({
  total,
  date,
  startTime,
  endTime,
  quantity,
  people,
  product,
  href,
  refCode,
  currencySymbol,
}) => {
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
          {quantity}x {product.name} | {formatPeople(people, true)}
        </Next.Link>
      </Table.Td>
      <Table.Td>
        <Next.Link href={href}>{refCode}</Next.Link>
      </Table.Td>
      <Table.Td className="text--nowrap">
        <Next.Link href={href}>
          {dayjs(date).format("MMM D, ")}
          {startTime.value.slice(0, -3)} &ndash; {endTime.value.slice(0, -3)}
        </Next.Link>
      </Table.Td>
    </>
  );
};

ProductTableRow.displayName = "DashboardBookingsProductTableRow";
