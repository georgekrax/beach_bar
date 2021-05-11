import Account, { AccountPaymentMethodAddProps } from "@/components/Account";
import Auth from "@/components/Auth";
import CheckoutComp from "@/components/Checkout";
import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { RealisticConfetti } from "@/components/Next/RealisticConfetti";
import ShoppingCart from "@/components/ShoppingCart";
import { useCartEntryFeesLazyQuery, useCartQuery, useCheckoutMutation, useCustomerQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { useAuth } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { calcCartTotal, getCartBeachBars } from "@/utils/payment";
import { calcTotalPeople, formatNumber } from "@/utils/search";
import { emailSchema } from "@/utils/yup";
import { errors as COMMON_ERRORS } from "@beach_bar/common";
import { Button, Input } from "@hashtag-design-system/components";
import { SelectedItems } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { COUNTRIES_ARR } from "@the_hashtag/common";
import dayjs from "dayjs";
import { AnimatePresence, motion, useElementScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";

const FULL_OPACITY = 1;
const MIN_OPACITY = 0.25;

type FormData = {
  email: string;
  phoneNumber?: string;
};

const Checkout: React.FC = () => {
  const [countryId, setCountryId] = useState<string | undefined>();
  const [cardId, setCardId] = useState<string | undefined>();
  const [cardFormState, setCardFormState] = useState<
    Pick<Parameters<NonNullable<AccountPaymentMethodAddProps["onFormState"]>>["0"], "isValid">
  >({ isValid: false });
  const ref = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<HTMLDivElement[] | null[]>([]);
  const conffetiRef = useRef<RealisticConfetti | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(emailSchema) });
  const { field: email } = useController<FormData, "email">({ name: "email", control });
  const { field: phoneNumber } = useController<FormData, "phoneNumber">({ name: "phoneNumber", control });
  const { scrollYProgress } = useElementScroll(ref);

  const step0 = useTransform(scrollYProgress, [0, 0.45], [FULL_OPACITY, MIN_OPACITY]);
  const step1 = useTransform(
    scrollYProgress,
    // [0, 0.4, 0.7, 0.85],
    [0, 0.4, 0.6],
    [FULL_OPACITY, FULL_OPACITY, MIN_OPACITY]
  );
  const step2 = useTransform(scrollYProgress, [0.7, 1], [MIN_OPACITY, FULL_OPACITY]);

  const { people } = useSearchContext();
  const { data } = useAuth();
  const [checkout, { data: mutationData, loading: mutationLoading }] = useCheckoutMutation();

  const isAuthed = useMemo(() => !!data?.me, [data]);
  const { data: customerData, error: customerError, refetch } = useCustomerQuery({ skip: !isAuthed });
  const { data: cart } = useCartQuery();
  const [getCartEntryFees, { data: entryFeesData }] = useCartEntryFeesLazyQuery();

  const cards = useMemo(
    () =>
      Array.from(customerData?.customer.customer.cards || [])
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
        .sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1)),
    [customerData]
  );
  const beachBars = useMemo(() => getCartBeachBars(cart), [cart]);
  const hideStepAuth = useMemo(() => isAuthed && customerData?.customer, [isAuthed, customerData]);
  const totalPeople = useMemo(() => calcTotalPeople(people), [people]);
  const currencySymbol = useMemo(
    () => data?.me?.account.country?.currency.symbol || (beachBars?.[0] ? beachBars[0].defaultCurrency.symbol : ""),
    [data, beachBars]
  );

  const goTo = (step: number) => {
    const current = stepRefs.current[step];
    console.log("----");
    console.log(scrollYProgress.get().toFixed(2));
    if (!current) notify("error", "");
    else ref.current?.scrollTo({ behavior: "smooth", top: current.offsetTop });
  };

  const handleSelect = (items: SelectedItems[]) => {
    const country = COUNTRIES_ARR.find(
      ({ name }) => name.toLowerCase() === items.find(({ selected }) => selected)?.id.toLowerCase()
    );
    if (!country) notify("error", "");
    else setCountryId(country.id.toString());
  };

  const onSubmit = async ({ email, phoneNumber }: FormData) => {
    await refetch({ email, phoneNumber, countryId });
    if (customerError) notify("error", customerError.message);
    else goTo(1);
  };

  const handlePayNow = async () => {
    const opts = { somethingWentWrong: false };
    if (!cardId) {
      notify("error", "Please select a payment method, or provide one", opts);
      return;
    }
    const cartId = cart?.cart.id;
    if (!cartId) {
      notify("error", "Please select provide a valid shopping cart", opts);
      return;
    }
    const { errors } = await checkout({ variables: { cardId, cartId, totalPeople } });
    if (errors) {
      const firstError = errors[0];
      if (
        firstError &&
        firstError.extensions?.code.toLowerCase() === COMMON_ERRORS.CONFLICT.toLowerCase() &&
        firstError.extensions.notAvailableProducts.length > 0
      )
        firstError.extensions.notAvailableProducts.forEach(({ product: { name }, date, time, quantity }) =>
          notify(
            "error",
            `The "${name}" product (quantity: ${quantity}x) , is not available for ${dayjs(date).format("MM/DD/YYYY")}${
              time ? `, at ${time.value.slice(0, -3)}` : ""
            }`,
            { ...opts, duration: 6000 }
          )
        );
      else errors.forEach(({ message }) => notify("error", message, opts));
    } else {
      if (conffetiRef && conffetiRef.current) setTimeout(() => conffetiRef.current!.fire(), 850);
    }
  };

  useEffect(() => {
    if (cart && cart.cart && !entryFeesData) getCartEntryFees({ variables: { cartId: cart?.cart.id, totalPeople } });
  }, [cart]);

  useEffect(() => {
    const alreadyDefault = cards.find(({ isDefault }) => isDefault);
    if (!cardId && alreadyDefault) setCardId(alreadyDefault.id);
  }, [cards]);

  const { isValid } = cardFormState;

  return (
    <>
      <Layout
        tapbar={false}
        header={{ withAuth: false }}
        wrapper={{ style: { paddingLeft: 0, paddingRight: 0 } }}
        footer={{ className: "wrapper--padding" }}
      >
        <Toaster position="top-center" />
        <h4 className="checkout__header">Checkout</h4>
        <div ref={ref} className="checkout__carousel no-scrollbar">
          <CheckoutComp.Step
            className="checkout__auth"
            ref={el => (stepRefs.current[0] = el)}
            opacity={step0}
            onClick={() => goTo(0)}
            style={{ display: hideStepAuth ? "none" : undefined }}
          >
            <div>Please enter your email address or login to your account, to continue</div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex-row-center-center">
                <div>
                  <Input
                    {...email}
                    placeholder="Email"
                    secondhelptext={{ error: true, value: errors.email?.message }}
                    forwardref={email.ref}
                  />
                  <Input.Tel
                    inputProps={{
                      ...phoneNumber,
                      placeholder: "Phone number",
                      optional: true,
                      forwardref: phoneNumber.ref,
                    }}
                    selectProps={{ onSelect: items => handleSelect(items) }}
                  />
                </div>
                <Next.OrContainer text="Or" direction="column" />
                <Auth.LoginBtn />
              </div>
              <Button type="submit">Continue</Button>
            </form>
          </CheckoutComp.Step>
          <CheckoutComp.Step
            ref={el => (stepRefs.current[1] = el)}
            opacity={step1}
            onClick={() => goTo(1)}
            style={{ marginTop: hideStepAuth ? 0 : undefined, display: mutationData?.checkout ? "none" : undefined }}
          >
            {cards.length > 0 && (
              <div>
                <div className="upper text--secondary semibold">Your cards</div>
                <div className="checkout__cards no-scrollbar w100 flex-row-flex-start-center">
                  {cards.map(({ id, ...card }) => {
                    const isChecked = cardId === id;
                    return (
                      <div>
                        <Account.PaymentMethod
                          key={id}
                          edit={false}
                          remove={false}
                          defaultText="selected"
                          isDefault={cardId !== undefined ? isChecked : card.isDefault}
                          card={{ id, ...card }}
                          onClick={() => setCardId(id)}
                          onValue={newVal => {
                            if (!newVal && isChecked) setCardId("");
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="text--secondary semibold">
              {cards.length > 0 ? "Other payment method" : "Payment method"}
            </div>
            <Account.PaymentMethod.Add
              className="checkout__other-method"
              saveForFuturePayments
              defaultBtn={false}
              bottomSheet={false}
              notifyOnSuccess={false}
              customerId={customerData?.customer.customer.id || ""}
              cardsLength={cards.length}
              onSubmit={() => goTo(2)}
              onSubmitId={id => {
                if (id) setCardId(id);
              }}
              onFormState={formState => formState.isValid !== cardFormState.isValid && setCardFormState(formState)}
            >
              <Button
                type="submit"
                disabled={!cardId || !isValid}
                onClick={e => {
                  if (cardId) {
                    e.preventDefault();
                    goTo(2);
                  }
                }}
              >
                Continue
              </Button>
            </Account.PaymentMethod.Add>
          </CheckoutComp.Step>
          <CheckoutComp.Step
            className="checkout__pay-now"
            ref={el => (stepRefs.current[2] = el)}
            opacity={step2}
            onClick={() => goTo(2)}
          >
            <AnimatePresence exitBeforeEnter>
              {!mutationData?.checkout ? (
                <motion.div
                  key="pay_now"
                  className="flex-column-center-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex-column-center-center">
                    <ShoppingCart.Total total={calcCartTotal(cart?.cart.products)} currencySymbol={currencySymbol} />
                    {entryFeesData?.cartEntryFees && (
                      <div className="checkout__pay-now__fees flex-row-center-center">
                        <div>
                          Entry fees for {totalPeople} {totalPeople <= 1 ? "person" : "people"}:{" "}
                        </div>
                        <span>
                          +{formatNumber(entryFeesData?.cartEntryFees || 0)}
                          {currencySymbol}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    className={mutationLoading ? "loading" : undefined}
                    disabled={!cardId || !cart?.cart}
                    onClick={async () => await handlePayNow()}
                  >
                    Pay now
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="checkout__success"
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex-row-center-center">
                    <Icons.Checkmark.Circle.Colored
                      width={80}
                      height={80}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, transition: { duration: 0.4 } }}
                    />
                  </div>
                  <motion.div
                    className="flex-column-center-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { delay: 0.2, duration: 0.2 } }}
                  >
                    <div className="header-5">Payment successful</div>
                    <div>
                      View details{" "}
                      <Next.Link
                        replace
                        prefetch={false}
                        href={{
                          pathname: "/account/trip/[refCode]",
                          query: { refCode: mutationData.checkout.refCode },
                        }}
                      >
                        here
                      </Next.Link>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CheckoutComp.Step>
        </div>
      </Layout>
      <Next.RealisticConfetti ref={conffetiRef} scalar={1.5} gravity={1.5} />
    </>
  );
};

export default Checkout;
