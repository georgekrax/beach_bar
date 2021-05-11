<<<<<<< HEAD
import { CreditCardProps } from "@hashtag-design-system/components";
import Image, { ImageProps } from "next/image";
import styles from "./CardBrand.module.scss";

type FProps = Pick<CreditCardProps, "brand"> & Partial<Omit<ImageProps, "layout">>;

export const CardBrand: React.FC<FProps> = ({ brand, width = 96, height = 72, ...props }) => {
  return brand ? (
    <div className={styles.container}>
      <Image
        src={`https://hashtag--data.s3-eu-west-1.amazonaws.com/credit-card-brands/${String(brand).toLowerCase()}.png`}
        alt={brand + " logo"}
        width={brand === "AMEX" ? parseInt(width.toString()) * 0.75 : width}
        height={height}
        {...props}
      />
    </div>
  ) : null;
};

CardBrand.displayName = "AccountPaymentMethodCardBrand";
=======
import { CreditCardProps } from "@hashtag-design-system/components";
import Image, { ImageProps } from "next/image";
import styles from "./CardBrand.module.scss";

type FProps = Pick<CreditCardProps, "brand"> & Partial<Omit<ImageProps, "layout">>;

export const CardBrand: React.FC<FProps> = ({ brand, width = 96, height = 72, ...props }) => {
  return brand ? (
    <div className={styles.container}>
      <Image
        src={`https://hashtag--data.s3-eu-west-1.amazonaws.com/credit-card-brands/${String(brand).toLowerCase()}.png`}
        alt={brand + " logo"}
        width={brand === "AMEX" ? parseInt(width.toString()) * 0.75 : width}
        height={height}
        {...props}
      />
    </div>
  ) : null;
};

CardBrand.displayName = "AccountPaymentMethodCardBrand";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
