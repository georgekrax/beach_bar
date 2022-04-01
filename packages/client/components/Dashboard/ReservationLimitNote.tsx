import Next from "@/components/Next";

export const ReservationLimitNote: React.FC = () => {
  return (
    <Next.TextBox icon={{ style: { alignSelf: "flex-start" } }}>
      <div>For example:</div>
      <ul>
        <li>
          You have <span className="semibold">40x products</span> (each that consists of 2x sunbeds and 1x umbrella).
        </li>
        <li>
          You would like to hold <span className="semibold">35x products daily</span> for our website&apos;s users, so
          that they book through our platform, and leave
          <span className="semibold">the other 5x for passing customers</span>.
        </li>
      </ul>
      <div>The steps that you should follow are:</div>
      <ul>
        <li>
          Select the "From" and "To" dates of this limit.&nbsp;
          <span className="font--italic">
            If you want this to be <span className="semibold">standard and fixed during the year</span>, please set as
            the "From" date the day your business opens, and "To" the day it closes.
          </span>
        </li>
        <li>
          Then, set the quantity of available daily products.{" "}
          <span className="semibold">In our case is 35x products</span>.
        </li>
        <li>
          Lastly, add these limits to the product, by <span className="semibold">clicking the "Add" button</span>.
        </li>
      </ul>
    </Next.TextBox>
  );
};

ReservationLimitNote.displayName = "DashboardReservationLimitNote";
