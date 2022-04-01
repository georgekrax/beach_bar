import { PaymentQuery, useCartEntryFeesQuery, useCartQuery } from "@/graphql/generated";
import { formatPeople } from "@/utils/format";
import { useAuth } from "@/utils/hooks";
import { calcCartTotalPeople } from "@/utils/search";
import { Flex, FlexProps, Heading, Text } from "@hashtag-design-system/components";
import { useMemo } from "react";

type Props = FlexProps & {
  total: number;
  currencySymbol?: string;
  inclEntryFees?: boolean | { displayMsg: boolean };
  addEntryFees?: boolean;
  cart?: PaymentQuery["payment"]["cart"];
  beachBarId?: string;
};

export const Total: React.FC<Props> = ({
  total,
  inclEntryFees = false,
  addEntryFees = inclEntryFees,
  cart,
  beachBarId,
  currencySymbol: propsCurrencySymbol,
  ...props
}) => {
  const { data } = useAuth();
  const { data: cartData } = useCartQuery({ skip: !inclEntryFees || cart !== undefined });
  const currencySymbol = useMemo(() => propsCurrencySymbol || data?.me?.account?.country?.currency.symbol, [props]);
  const totalPeople = useMemo(
    () => calcCartTotalPeople(cart?.products || cartData?.cart.products || []),
    [cartData?.cart.products.length, cartData?.cart.products[0]?.id]
  );

  const { data: entryFeesData } = useCartEntryFeesQuery({
    skip: !inclEntryFees,
    variables: { cartId: (cart?.id || cartData?.cart.id || "").toString(), beachBarId },
  });

  return (
    <Flex flexDir="column" align="flex-end" mt={12} mb={4} {...props}>
      <div>
        <Text as="span" mr={1} fontSize="lg">
          Total:&nbsp;
        </Text>
        <Heading as="h4" display="inline-block" size="lg" fontWeight="semibold">
          {(total + (addEntryFees ? entryFeesData?.cartEntryFees || 0 : 0)).toFixed(2)}&nbsp;
          {currencySymbol}
        </Heading>
      </div>
      {(inclEntryFees === true || (typeof inclEntryFees !== "boolean" && inclEntryFees.displayMsg)) && (
        <Text as="span" mt={1} fontSize="sm" fontStyle="italic">
          (incl. entry fees for {formatPeople(totalPeople)}: {currencySymbol}
          {entryFeesData?.cartEntryFees.toFixed(2)})
        </Text>
      )}
    </Flex>
  );
};

Total.displayName = "ShoppingCartTotal";
