import Icons from "@/components/Icons";
import { MOTION } from "@/config/index";
import { Card } from "@/graphql/generated";
import { Button, CreditCard } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { Add } from "./Add";
import { Edit } from "./Edit";
import { AccountPaymentMethodEditProps } from "./index";
import { IsDefault } from "./IsDefault";
import { CardBrand } from "./CardBrand";
import styles from "./PaymentMethod.module.scss";

type SubComponents = {
  Edit: typeof Edit;
  Add: typeof Add;
  IsDefault: typeof IsDefault;
  CardBrand: typeof CardBrand;
};

type Props = {
  card: AccountPaymentMethodEditProps["card"] & Pick<Card, "last4">;
  isDefault?: boolean;
  onEditClick: React.ComponentPropsWithoutRef<"button">["onClick"];
  onRemoveClick: React.ComponentPropsWithoutRef<"button">["onClick"];
} & Pick<AccountPaymentMethodEditProps, "handleEdit">;

export const PaymentMethod: React.FC<Props> & SubComponents = ({
  isDefault = false,
  handleEdit,
  onEditClick,
  onRemoveClick,
  card,
}) => {
  return (
    <motion.div className={styles.container + " w-100"} variants={MOTION.productVariants}>
      <div className={styles.cardContainer + " w-100"}>
        <CreditCard
          brand={card?.brand}
          creditNum={card?.last4}
          ownerName={card?.cardholderName}
          expirationDate={card?.expMonth + "/" + card?.expYear.toString().slice(-2)}
        />
      </div>
      <div className={styles.edit + " w-100 flex-row-space-between-center"}>
        <IsDefault
          showDefault={isDefault}
          defaultChecked={isDefault}
          checked={isDefault}
          onValue={async newVal => {
            if (newVal !== isDefault)
              await handleEdit(
                {
                  id: card.id,
                  month: card.expMonth,
                  year: card.expYear,
                  cardholderName: card.cardholderName,
                  last4: card.last4,
                  isDefault: newVal,
                },
                false
              );
          }}
        />
        <div className={styles.actions + " flex-row-flex-start-center"}>
          <Button variant="secondary" aria-label="Remove" onClick={onRemoveClick}>
            <Icons.Close.Circle />
          </Button>
          <Button variant="secondary" aria-label="Edit" onClick={onEditClick}>
            <Icons.Edit />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

PaymentMethod.Edit = Edit;
PaymentMethod.Add = Add;
PaymentMethod.IsDefault = IsDefault;
PaymentMethod.CardBrand = CardBrand;

PaymentMethod.displayName = "BillingPaymentMethod";
