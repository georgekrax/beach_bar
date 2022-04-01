import { Text } from "@hashtag-design-system/components";
import { useMemo } from "react";

export type Props = {
  price: number;
  currencySymbol: string;
};

export const ItemPrice: React.FC<Props> = ({ currencySymbol, price }) => {
  const formattedPrice = useMemo(
    () => (price === 0 ? "Free" : currencySymbol + " " + price.toFixed(2)),
    [currencySymbol, price]
  );

  return (
    <Text as="span" fontSize="sm" color="text.grey" whiteSpace="nowrap">
      {formattedPrice}
    </Text>
  );
};

ItemPrice.displayName = "ShoppingCartItemPrice";
