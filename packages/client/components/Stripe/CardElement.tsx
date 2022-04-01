import { useToken } from "@chakra-ui/react";
import { CardElement as StripeCardElement, CardElementProps as StripeCardElementProps } from "@stripe/react-stripe-js";

type Props = StripeCardElementProps;

export const CardElement: React.FC<Props> = ({ ...props }) => {
  const [brandPrimary, gray900, gray800, clrError] = useToken("colors", [
    "brand.primary",
    "gray.900",
    "gray.800",
    "error",
  ]);

  return (
    <StripeCardElement
      {...props}
      options={{
        ...props.options,
        style: {
          ...props.options?.style,
          base: {
            iconColor: brandPrimary,
            fontSize: "16px", // fontSizes.md will throw an error because it is in "rem"
            color: gray900,
            "::placeholder": { color: gray800 },
            ...props.options?.style?.base,
          },
          invalid: { color: clrError, ...props.options?.style?.invalid },
        },
      }}
    />
  );
};

CardElement.displayName = "StripeCardElement";
