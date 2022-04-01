import Next from "@/components/Next";
import { DashboardBookingsQuery } from "@/graphql/generated";
import { useDashboard } from "@/utils/hooks";
import { Table } from "@hashtag-design-system/components";
import dayjs from "dayjs";

export type Props = {
  href: string;
} & Omit<DashboardBookingsQuery["dashboardBookings"]["bookings"][number], "id"> &
  Pick<ReturnType<typeof useDashboard>, "currencySymbol">;

export const PaymentsTableRow: React.FC<Props> = ({ total, cart, card, timestamp, href, currencySymbol }) => {
  const { beachBarId } = useDashboard();

  const { products, foods, notes } = cart;
  const { country, customer } = card;

  return (
    <>
      {/* <Table.Tr key={"booking_" + id} className="cursor--pointer" idx={i + 1}> */}
      <Table.Td className="itext--right semibold">
        <Next.Link href={href}>
          {country?.currency.symbol || currencySymbol}
          {total?.toFixed(2)}
        </Next.Link>
      </Table.Td>
      <Table.Td>{/* <Next.Link href={href}>{status.name}</Next.Link> */}</Table.Td>
      <Table.Td className="text--nowrap">
        <Next.Link href={href}>
          {products.length + "x product" + (products.length === 1 ? "" : "s")}
          {foods.length > 0 && (
            <>
              &nbsp;&amp; {foods.length}x food{foods.length === 1 ? "" : "S"}
            </>
          )}
        </Next.Link>
      </Table.Td>
      <Table.Td className="text--nowrap">
        <Next.Link href={href}>{customer.user?.fullName || ""}</Next.Link>
      </Table.Td>
      <Table.Td>
        <Next.Link href={href}>
          {notes.find(({ beachBar }) => beachBar.id.toString() === beachBarId)?.body || ""}
        </Next.Link>
      </Table.Td>
      <Table.Td className="text--nowrap">
        <Next.Link href={href}>{dayjs(timestamp).format("MMM D, h:mm A")}</Next.Link>
      </Table.Td>
      {/* </Table.Tr> */}
    </>
  );
};

PaymentsTableRow.displayName = "DashboardBookingsPaymentsTableRow";
