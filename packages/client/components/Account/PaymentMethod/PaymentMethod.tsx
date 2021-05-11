<<<<<<< HEAD
import Icons from "@/components/Icons";
import { MOTION } from "@/config/index";
import { BasicCardFragment } from "@/graphql/generated";
import { Button, CreditCard } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Add } from "./Add";
import { CardBrand } from "./CardBrand";
import { Edit } from "./Edit";
import {
  AccountPaymentMethodEditProps,
  AccountPaymentMethodIsDefaultFProps,
  AccountPaymentMethodIsDefaultProps,
} from "./index";
import { IsDefault } from "./IsDefault";
import styles from "./PaymentMethod.module.scss";

type SubComponents = {
  Edit: typeof Edit;
  Add: typeof Add;
  IsDefault: typeof IsDefault;
  CardBrand: typeof CardBrand;
};

type Props = {
  card: BasicCardFragment;
  isDefault?: boolean;
  onEditClick?: React.ComponentPropsWithoutRef<"button">["onClick"];
  onRemoveClick?: React.ComponentPropsWithoutRef<"button">["onClick"];
  edit?: boolean;
  remove?: boolean;
  defaultText?: AccountPaymentMethodIsDefaultProps["text"];
};

export const PaymentMethod: React.FC<
  Props &
    Partial<Pick<AccountPaymentMethodEditProps, "handleEdit">> &
    Pick<React.ComponentPropsWithoutRef<"div">, "onClick"> &
    Pick<AccountPaymentMethodIsDefaultFProps, "onValue">
> &
  SubComponents = ({
  isDefault,
  edit = true,
  remove = true,
  defaultText,
  handleEdit,
  onEditClick,
  onRemoveClick,
  onClick,
  onValue,
  card,
}) => {
  const isItDefault = useMemo(() => isDefault, [isDefault, card]);

  return (
    <motion.div className={styles.container + " w100"} variants={MOTION.productVariants} onClick={onClick}>
      <div className={styles.cardContainer + " zi--md w100"}>
        <CreditCard
          brand={card.brand?.name as any}
          creditNum={card.last4}
          ownerName={card.cardholderName}
          expirationDate={card.expMonth + "/" + card?.expYear.toString().slice(-2)}
        />
      </div>
      <div className={styles.edit + " w100 flex-row-space-between-center"}>
        <IsDefault
          showDefault={isItDefault}
          defaultChecked={isItDefault}
          checked={isItDefault}
          text={defaultText}
          onValue={async newVal => {
            if (newVal !== isItDefault && handleEdit)
              await handleEdit({ ...card, month: card.expMonth, year: card.expYear, isDefault: newVal }, false);
            if (onValue) onValue(newVal);
          }}
        />
        <div className={styles.actions + " flex-row-flex-start-center"}>
          {edit && (
            <Button variant="secondary" aria-label="Edit" onClick={onEditClick}>
              <Icons.Edit />
            </Button>
          )}
          {remove && (
            <Button variant="secondary" aria-label="Remove" onClick={onRemoveClick}>
              <Icons.Close.Circle />
            </Button>
          )}
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
=======
import Icons from "@/components/Icons";
import { MOTION } from "@/config/index";
import { BasicCardFragment } from "@/graphql/generated";
import { Button, CreditCard } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Add } from "./Add";
import { CardBrand } from "./CardBrand";
import { Edit } from "./Edit";
import {
  AccountPaymentMethodEditProps,
  AccountPaymentMethodIsDefaultFProps,
  AccountPaymentMethodIsDefaultProps,
} from "./index";
import { IsDefault } from "./IsDefault";
import styles from "./PaymentMethod.module.scss";

type SubComponents = {
  Edit: typeof Edit;
  Add: typeof Add;
  IsDefault: typeof IsDefault;
  CardBrand: typeof CardBrand;
};

type Props = {
  card: BasicCardFragment;
  isDefault?: boolean;
  onEditClick?: React.ComponentPropsWithoutRef<"button">["onClick"];
  onRemoveClick?: React.ComponentPropsWithoutRef<"button">["onClick"];
  edit?: boolean;
  remove?: boolean;
  defaultText?: AccountPaymentMethodIsDefaultProps["text"];
};

export const PaymentMethod: React.FC<
  Props &
    Partial<Pick<AccountPaymentMethodEditProps, "handleEdit">> &
    Pick<React.ComponentPropsWithoutRef<"div">, "onClick"> &
    Pick<AccountPaymentMethodIsDefaultFProps, "onValue">
> &
  SubComponents = ({
  isDefault,
  edit = true,
  remove = true,
  defaultText,
  handleEdit,
  onEditClick,
  onRemoveClick,
  onClick,
  onValue,
  card,
}) => {
  const isItDefault = useMemo(() => isDefault, [isDefault, card]);

  return (
    <motion.div className={styles.container + " w100"} variants={MOTION.productVariants} onClick={onClick}>
      <div className={styles.cardContainer + " zi--md w100"}>
        <CreditCard
          brand={card.brand?.name as any}
          creditNum={card.last4}
          ownerName={card.cardholderName}
          expirationDate={card.expMonth + "/" + card?.expYear.toString().slice(-2)}
        />
      </div>
      <div className={styles.edit + " w100 flex-row-space-between-center"}>
        <IsDefault
          showDefault={isItDefault}
          defaultChecked={isItDefault}
          checked={isItDefault}
          text={defaultText}
          onValue={async newVal => {
            if (newVal !== isItDefault && handleEdit)
              await handleEdit({ ...card, month: card.expMonth, year: card.expYear, isDefault: newVal }, false);
            if (onValue) onValue(newVal);
          }}
        />
        <div className={styles.actions + " flex-row-flex-start-center"}>
          {edit && (
            <Button variant="secondary" aria-label="Edit" onClick={onEditClick}>
              <Icons.Edit />
            </Button>
          )}
          {remove && (
            <Button variant="secondary" aria-label="Remove" onClick={onRemoveClick}>
              <Icons.Close.Circle />
            </Button>
          )}
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
