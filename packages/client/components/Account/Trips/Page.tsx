import Account from "@/components/Account";
import Header from "@/components/Header";
import Icons from "@/components/Icons";
import Next from "@/components/Next";
import ShoppingCart from "@/components/ShoppingCart";
import { PaymentDocument, PaymentQueryVariables, usePaymentQuery, useRefundPaymentMutation } from "@/graphql/generated";
import { notify } from "@/utils/notify";
import { calcCartTotal, extractCartBeachBars } from "@/utils/payment";
import { TABLES } from "@beach_bar/common";
import { Dialog } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import styles from "./Page.module.scss";

dayjs.extend(minMax);

const { REFUND_PERCENTAGE } = TABLES;

type Props = {
  atDashboard?: string;
};

export const Page: React.FC<Props> = ({ atDashboard = undefined }) => {
  const { query, ...router } = useRouter();
  const [isDialogShown, setIsDialogShown] = useState(false);
  const variables: PaymentQueryVariables = { refCode: String(query.ref) };
  const { data: notData, loading, error } = usePaymentQuery({ variables: { ...variables, beachBarId: atDashboard } });
  const [refund] = useRefundPaymentMutation();

  const data = notData?.payment;

  const { hasSameBeachBars, hasSameTimes, eligibleToRefund, beachBars, refundAmount, currencySymbol, net } =
    useMemo(() => {
      if (!data?.cart) return { net: 0 };
      const { cart, card } = data;
      const { products, foods } = cart;

      let refundPercentage: number | undefined = undefined;
      const zeroRefund = REFUND_PERCENTAGE.find(({ percentageValue }) => percentageValue === 0)!.percentageValue;
      if (!products || products.length === 0) refundPercentage = zeroRefund;
      const productsAfterToday = products
        .map(({ date, ...rest }) => ({ ...rest, date: dayjs(date) }))
        .filter(({ date }) => date.isAfter(dayjs()));
      const total = calcCartTotal({
        products: productsAfterToday.map(({ date, ...rest }) => ({ ...rest, date: date.toISOString() })),
        foods,
      });
      const minDate = dayjs.min(productsAfterToday.map(({ date }) => date));
      let daysDiff = Math.floor((dayjs(minDate).toDate().getTime() - dayjs().toDate().getTime()) / 86_400_000);
      if (isNaN(daysDiff)) daysDiff = 0;
      if (!minDate) refundPercentage = zeroRefund;
      else {
        refundPercentage = REFUND_PERCENTAGE.reduce((prev, cur) => {
          return Math.abs(cur.daysLimit - daysDiff) < Math.abs(prev.daysLimit - daysDiff) ? cur : prev;
        }).percentageValue;
      }
      if (!refundPercentage) refundPercentage = zeroRefund;

      return {
        net: (data.total || 0) - data.stripeProccessingFee - data.appFee,
        refundAmount: Math.floor(total * refundPercentage) / 100,
        beachBars: extractCartBeachBars({ cart: data?.cart }) || [],
        eligibleToRefund: productsAfterToday.length > 0,
        currencySymbol: card.country?.currency.symbol,
        hasSameBeachBars: new Set(products.map(({ product: { beachBar } }) => beachBar.name)).size === 0,
        hasSameTimes:
          new Set(products.map(({ date, startTime, endTime }) => date + "_" + startTime.id + "_" + endTime.id)).size ===
          0,
      };
    }, [data]);

  return (
    <Header.Crud
      title={atDashboard ? "Booking" : "Trip"}
      closeIcon="chevron_left"
      fullPage
      onClose={() => router.back()}
    >
      <Next.Loading isScreen isLoading={loading}>
        {error || !data ? (
          <h2>Error</h2>
        ) : (
          <div
            className={
              styles.container + (atDashboard ? " " + styles.atDashboard : "") + " flex-column-flex-start-flex-start"
            }
          >
            <Toaster position="top-center" />
            <div className="w100">
              <Account.Trips.Details style={{ marginTop: 0 }}>
                {hasSameBeachBars && (
                  <Account.Trips.Info info="#beach_bar">
                    <Account.Trips.DoubleInfo
                      primary={data.cart.products?.[0]?.product.beachBar.name}
                      secondary={data.cart.products?.[0]?.product.beachBar.location?.formattedLocation}
                    />
                  </Account.Trips.Info>
                )}
                <Account.Trips.Info info="Ref code" children={"#" + data.refCode} />
                {hasSameTimes && (
                  <Account.Trips.Info info="Visit time">
                    <Account.Trips.DoubleInfo
                      primary={data.cart.products?.[0]?.date}
                      secondary={
                        data.cart.products?.[0]?.startTime.value.slice(0, -3) +
                        " - " +
                        data.cart.products?.[0]?.endTime.value.slice(0, -3)
                      }
                    />
                  </Account.Trips.Info>
                )}
                <Account.Trips.Info info="Status">
                  <Account.Trips.DoubleInfo
                    row
                    alignItems="center"
                    primary={data.status.name}
                    className={styles.status}
                  >
                    {data.isRefunded ? <Icons.Close.Circle.Colored /> : <Icons.Checkmark.Circle.Colored />}
                  </Account.Trips.DoubleInfo>
                </Account.Trips.Info>
              </Account.Trips.Details>
              {!atDashboard && (
                <Account.Trips.Details header="Contact details">
                  <Account.Trips.Info info="Email" children={data.card.customer.email} />
                  {data.card.customer.phoneNumber && (
                    <Account.Trips.Info info="Phone number">
                      <Account.Trips.DoubleInfo
                        row
                        primary={"+" + data.card.customer.country?.callingCode}
                        alignItems="center"
                      >
                        <span style={{ color: "unset" }}>{data.card.customer.phoneNumber}</span>
                      </Account.Trips.DoubleInfo>
                    </Account.Trips.Info>
                  )}
                </Account.Trips.Details>
              )}
              <Account.Trips.Details header="Billing information">
                {atDashboard && (
                  <>
                    <Account.Trips.Info info="Net" children={net.toFixed(2) + currencySymbol} />
                    <Account.Trips.Info info="#beach_bar fee" children={data.appFee.toFixed(2) + currencySymbol} />
                    <Account.Trips.Info
                      info="Stripe fee"
                      children={data.stripeProccessingFee.toFixed(2) + currencySymbol}
                    />
                    <Account.Trips.Info info="Stripe ID" children={data.stripeId} />
                  </>
                )}
                <Account.Trips.Info info="Paid at" children={dayjs(data.timestamp).format("MM/DD/YYYY")} />
                <Account.Trips.Info info="Paid with">
                  <Account.Trips.DoubleInfo row alignItems="center">
                    <div className={styles.card}>
                      <span className="d--ib">**** **** ****</span> <span>{data.card.last4}</span>
                    </div>
                    <Account.PaymentMethod.CardBrand brand={data.card.brand?.name as any} width={28} height={20} />
                  </Account.Trips.DoubleInfo>
                </Account.Trips.Info>
                {data.voucherCode?.couponCode ||
                  (data.voucherCode?.offerCode && (
                    <Account.Trips.Info
                      info="Voucher code"
                      children={data.voucherCode?.couponCode?.refCode || data.voucherCode?.offerCode.refCode}
                    />
                  ))}
                <ShoppingCart.Total
                  inclEntryFees
                  addEntryFees={false}
                  beachBarId={atDashboard}
                  cart={data.cart}
                  total={data.total || 0}
                  style={{ margin: "2em 0 0 auto" }}
                  currencySymbol={currencySymbol}
                />
              </Account.Trips.Details>
            </div>
            <Account.Trips.Details header="Cart">
              {beachBars?.map(({ beachBar }) => (
                <ShoppingCart.BeachItem
                  {...beachBar}
                  key={"beach_bar_" + beachBar.id}
                  className={styles.beachItem}
                  beachBarId={beachBar.id}
                  cart={data.cart}
                  viewBeachProducts={false}
                  edit={false}
                  atTripInfo
                />
              ))}
            </Account.Trips.Details>
            {!atDashboard && (
              <Account.Trips.Details header="Refund">
                <div className="flex-column-center-flex-start">
                  <div>Cancel and refund the upcoming trips of this payment</div>
                  <Header.Crud.Btn
                    variant="danger"
                    disabled={!eligibleToRefund || data.isRefunded || !refundAmount}
                    onClick={() => setIsDialogShown(true)}
                  >
                    Refund
                  </Header.Crud.Btn>
                </div>
              </Account.Trips.Details>
            )}
          </div>
        )}
      </Next.Loading>
      <Dialog
        isShown={isDialogShown}
        onDismiss={async (e, { cancel }) => {
          const tagName = e.currentTarget.tagName;
          const id = data?.id;
          if (cancel && id && tagName && tagName.toLowerCase() === "button") {
            const { errors } = await refund({
              variables: { paymentId: id },
              refetchQueries: [{ query: PaymentDocument, variables }],
            });
            if (errors) errors.forEach(({ message }) => notify("error", message));
            else notify("success", "Success! Your trip has been cancelled & refunded.");
          }
          setIsDialogShown(false);
        }}
      >
        <Dialog.Content style={{ textAlign: "center" }}>
          <Dialog.Title>Are you sure you want to refund and cancel the upcoming trips of this payment?</Dialog.Title>
          <div className={styles.refundMsg}>
            You will be refunded depending on how early you cancel your trip. For this payment, you will receive:&nbsp;
            <span className="semibold">
              {refundAmount}&nbsp;{currencySymbol}
            </span>
          </div>
        </Dialog.Content>
        <Dialog.Btn.Group>
          <Dialog.Btn>Yes</Dialog.Btn>
          <Dialog.Btn variant="danger" confirm>
            No
          </Dialog.Btn>
        </Dialog.Btn.Group>
      </Dialog>
    </Header.Crud>
  );
};

Page.displayName = "AccountTripsPage";
