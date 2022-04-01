import Account from "@/components/Account";
import Carousel from "@/components/Carousel";
import { CustomerQuery } from "@/graphql/generated";
import { useCheckoutContext } from "@/utils/contexts";
import { Box, Button, Flex, Text } from "@hashtag-design-system/components";
import { useEffect, useMemo, useState } from "react";

type Props = {
  customer?: CustomerQuery["customer"];
};

export const PaymentMethod: React.FC<Props> = ({ customer }) => {
  const [isCardValid, setIsCardValid] = useState(false);

  const { isAuthed, cardId, setCardId, goTo } = useCheckoutContext();

  const cards = useMemo(
    () => Array.from(customer?.cards || []).sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1)),
    [customer?.id, customer?.cards.length, customer?.cards[0]?.id]
  );

  const handleSubmitId = (id: string) => setCardId(id);

  const handleBtnClick = () => {
    if (!cardId) return;
    goTo(3);
  };

  useEffect(() => {
    const alreadyDefault = cards.find(({ isDefault }) => isDefault);
    if (!cardId && alreadyDefault) setCardId(alreadyDefault.id.toString());
  }, [cards.length, cards[0]?.id]);

  return (
    <Flex flexDir={{ base: "column", md: "row" }} gap={6}>
      {cards.length > 0 && (
        <Carousel.Context>
          <Box minW={0}>
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Box color="brand.secondary" fontWeight="semibold">
                Your cards
              </Box>
              <div>
                <Carousel.ControlBtn dir="prev" />
                <Carousel.ControlBtn dir="next" />
              </div>
            </Flex>
            <Carousel
              container={{
                position: "relative",
                _after: {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: "-1px",
                  width: 12,
                  height: "100%",
                  zIndex: "md",
                  bgGradient: "linear(to left, gray.50 1%, transparent)",
                },
              }}
            >
              {cards.map(({ id, ...card }, i) => {
                const isChecked = cardId?.toString() === id.toString();
                return (
                  <Carousel.Item
                    key={"payment_method_" + id}
                    idx={i}
                    hasAnimatedScale={false}
                    width="100%"
                    maxW={64}
                    mx={6}
                    ml={0}
                    flexShrink={0}
                  >
                    <Account.PaymentMethod
                      edit={false}
                      remove={false}
                      defaultText="selected"
                      isDefault={cardId !== undefined ? isChecked : card.isDefault}
                      card={{ id, ...card }}
                      onClick={() => setCardId(id.toString())}
                    />
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </Box>
        </Carousel.Context>
      )}
      <Box flex="1 0 35%">
        <Text as="span" color="brand.secondary" fontWeight="semibold">
          {cards.length > 0 ? "Other payment method" : "Payment method"}
        </Text>
        <Account.PaymentMethod.Add
          atCheckout
          cardsLength={cards.length}
          customerId={customer?.id.toString() || ""}
          saveForFuturePayments={isAuthed}
          onSubmitId={handleSubmitId}
          setIsFormValid={setIsCardValid}
        >
          <Button
            type="submit"
            colorScheme="orange"
            mt={8}
            mx="auto"
            disabled={!cardId && !isCardValid}
            onClick={handleBtnClick}
          >
            Continue
          </Button>
        </Account.PaymentMethod.Add>
      </Box>
    </Flex>
  );
};

PaymentMethod.displayName = "CheckoutPaymentMethod";
