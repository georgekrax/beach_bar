import { Box, CreditCardProps } from "@hashtag-design-system/components";
import Image, { ImageProps } from "next/image";

type Props = Pick<CreditCardProps, "brand"> & Partial<Omit<ImageProps, "layout" | "placeholder">>;

export const CardBrand: React.FC<Props> = ({ brand, width = 96, height = 72, ...props }) => {
  return brand ? (
    <Box
      sx={{
        "& > *": {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.35)",
          borderRadius: "base",
          border: "1px solid",
          borderColor: "gray.700",
        },
      }}
    >
      <Image
        src={`https://hashtag--data.s3-eu-west-1.amazonaws.com/credit-card-brands/${String(brand).toLowerCase()}.png`}
        alt={brand + " logo"}
        width={brand === "AMEX" ? +width.toString() * 0.75 : width}
        height={height}
        {...props}
      />
    </Box>
  ) : null;
};

CardBrand.displayName = "AccountPaymentMethodCardBrand";
