import Checkout, { CheckoutCustomerProps } from "@/components/Checkout";
import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { RealisticConfetti } from "@/components/Next/RealisticConfetti";
import { SEARCH_ACTIONS } from "@/components/Search";
import ShoppingCart from "@/components/ShoppingCart";
import { useCartQuery, useCheckoutMutation, useCustomerLazyQuery } from "@/graphql/generated";
import { CheckoutContextProvider, CheckoutContextType, useSearchContext } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { calcCartTotal, extractCartBeachBars } from "@/utils/payment";
import { errors as COMMON_ERRORS } from "@beach_bar/common";
import { Button, Flex, Heading, MotionFlex } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";

const MotionCheckmark = motion(Icon.CheckMarkCircle.Filled);

const CheckoutPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<Parameters<CheckoutContextType["goTo"]>[0]>(1);
  // const [stepsArr, setStepsArr] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [cardId, setCardId] = useState<string | undefined>();
  const stepRefs = useRef<HTMLDivElement[] | null[]>([]);
  const conffetiRef = useRef<RealisticConfetti | null>(null);

  const { isMobile, isDesktop } = useIsDevice();
  const { dispatch } = useSearchContext();
  const { data: session } = useSession();
  const isAuthed = !!session;

  const [checkout, { data: mutationData, loading: mutationLoading }] = useCheckoutMutation();
  const [getCustomer, { data: customerData, error: customerError, called, refetch }] = useCustomerLazyQuery({
    notifyOnNetworkStatusChange: true,
  });
  const { data: cart } = useCartQuery();

  const beachBars = useMemo(() => extractCartBeachBars(cart), [cart]);
  const isAuthStepHidden = useMemo(() => isAuthed && customerData?.customer, [isAuthed, customerData?.customer.id]);

  const goTo: CheckoutContextType["goTo"] = step => {
    const current = stepRefs.current[step - 1];
    if (!current) return;
    setActiveStep(step);
    window.scrollTo({ top: current.offsetTop, behavior: "smooth" });
  };

  const handleCustomer = async ({
    email,
    phoneNumber,
    countryId,
  }: Parameters<CheckoutCustomerProps["onSubmit"]>["0"]) => {
    if (isAuthed) return goTo(2);
    const { data, error } = await getCustomer({ variables: { email, phoneNumber, countryId } });
    console.log(data, error);
    if (data && !error) goTo(2);
    else notify("error", "Customer could not be found.");
  };

  const handlePayNow = async () => {
    const opts = { somethingWentWrong: false };
    if (!cardId) return notify("error", "Please select a payment method, or provide one", opts);
    const cartId = cart?.cart.id;
    if (!cartId) return notify("error", "Please provide a valid shopping cart", opts);
    const { errors } = await checkout({ variables: { cardId, cartId: cartId.toString() } });
    if (!errors) {
      if (conffetiRef?.current) setTimeout(() => conffetiRef.current!.fire(), 850);
      return;
    }

    const err = errors[0].extensions as any;
    const isConflict = err?.code.toLowerCase() === COMMON_ERRORS.CONFLICT.toLowerCase();
    if (isConflict && err.notAvailableProducts.length > 0) {
      err.notAvailableProducts.forEach(({ product, date, startTime, endTime, quantity }) => {
        const str = `The "${product.name}" product (quantity: ${quantity}x) , is not available for ${dayjs(date).format(
          "MM/DD/YYYY"
        )}, at ${startTime.value.slice(0, -3)} - ${endTime.value.slice(0, -3)}`;
        notify("error", str, { ...opts, duration: 6000 });
      });
    } else errors?.forEach(({ message }) => notify("error", message, opts));
  };

  useEffect(() => {
    if (isAuthed && !customerData) getCustomer();
    if (activeStep !== 3) setActiveStep(isAuthed ? 2 : 1);
  }, [isAuthed]);

  useEffect(() => {
    if (customerError) notify("error", customerError.message);
    // if (!called) refetch();
  }, [customerError?.message, called]);

  return (
    <>
      <Layout
        hasToaster
        tapbar={false}
        header={{ isSticky: true, auth: false }}
        main={{ position: "relative" }}
        shoppingCart={isMobile}
      >
        <CheckoutContextProvider value={{ isAuthed, cardId, setCardId, goTo }}>
          <Flex justify="space-between" align="center">
            <Heading as="h4" size="lg" fontWeight="semibold" my={8} color="text.grey">
              Checkout
            </Heading>
            <Next.IconBox
              display={{ md: "none" }}
              aria-label="View your shopping cart"
              onClick={() => dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: true } })}
            >
              <Icons.ShoppingCart />
            </Next.IconBox>
          </Flex>
          <Flex align="flex-start" gap={8}>
            <Flex flexDir="column" gap={20} flexShrink={0} flexBasis="70%" minW={0}>
              <Checkout.Step
                isShown={activeStep === 1}
                ref={el => (stepRefs.current[0] = el)}
                onClick={() => activeStep !== 1 && goTo(1)}
                display={isAuthStepHidden ? "none" : undefined}
              >
                <Checkout.Customer onSubmit={handleCustomer} />
              </Checkout.Step>
              <Checkout.Step
                isShown={activeStep === 2}
                display={mutationData?.checkout ? "none" : undefined}
                ref={el => (stepRefs.current[1] = el)}
                onClick={() => activeStep !== 2 && goTo(2)}
              >
                <Checkout.PaymentMethod customer={customerData?.customer} />
              </Checkout.Step>
              <Checkout.Step
                isShown={activeStep === 3}
                ref={el => (stepRefs.current[2] = el)}
                onClick={() => activeStep !== 3 && goTo(3)}
              >
                <AnimatePresence exitBeforeEnter>
                  {!mutationData?.checkout ? (
                    <MotionFlex
                      key="pay_now"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      flexDir="column"
                      justify="center"
                      align="center"
                    >
                      <Flex flexDir="column" justify="center" align="center">
                        <ShoppingCart.Total
                          inclEntryFees
                          align="center"
                          total={calcCartTotal({ products: cart?.cart.products || [], foods: cart?.cart.foods || [] })}
                          currencySymbol={beachBars?.[0]?.beachBar.currency.symbol || undefined}
                        />
                      </Flex>
                      <Button
                        alignSelf="center"
                        size="lg"
                        colorScheme="orange"
                        width="min(86%, 20rem)"
                        mt={6}
                        fontSize="xl"
                        opacity={mutationLoading ? 0.5 : 1}
                        disabled={!cardId || !cart?.cart}
                        onClick={async () => await handlePayNow()}
                      >
                        Pay now
                      </Button>
                    </MotionFlex>
                  ) : (
                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Flex justify="center" align="center">
                        <MotionCheckmark
                          color="success"
                          boxSize={20}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, transition: { duration: 0.2 } }}
                        />
                      </Flex>
                      <MotionFlex
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, transition: { delay: 0.2, duration: 0.2 } }}
                        flexDir="column"
                        justify="center"
                        align="center"
                      >
                        <Heading as="h5" fontSize="2xl" fontWeight="semibold" mt={4} mb={2}>
                          Payment successful
                        </Heading>
                        <div>
                          View details&nbsp;
                          <Next.Link
                            link={{
                              replace: true,
                              prefetch: false,
                              href: {
                                pathname: "/account/trips/[refCode]",
                                query: { refCode: mutationData.checkout.refCode },
                              },
                            }}
                          >
                            here
                          </Next.Link>
                        </div>
                      </MotionFlex>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Checkout.Step>
            </Flex>
            {isDesktop && (
              <ShoppingCart atCheckout edit={false} container={{ position: "sticky", top: "header.height", minW: 0 }} />
            )}
          </Flex>
        </CheckoutContextProvider>
      </Layout>
      <Next.RealisticConfetti ref={conffetiRef} scalar={1.5} gravity={1.5} />
    </>
  );
};

export default CheckoutPage;
