import { MOTION } from "@/config/index";
import { BasicCardFragment } from "@/graphql/generated";
import { CreditCard, Flex, IconButton, MotionBox } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import { Add } from "./Add";
import { CardBrand } from "./CardBrand";
import { Edit } from "./Edit";
import { AccountPaymentMethodEditProps, AccountPaymentMethodIsDefaultProps } from "./index";
import { IsDefault } from "./IsDefault";

type SubComponents = {
  Edit: typeof Edit;
  Add: typeof Add;
  IsDefault: typeof IsDefault;
  CardBrand: typeof CardBrand;
};

type Props = Partial<Pick<AccountPaymentMethodEditProps, "handleEdit">> &
  Pick<React.ComponentPropsWithoutRef<"div">, "onClick"> & {
    card: BasicCardFragment;
    isDefault?: boolean;
    onEditClick?: React.ComponentPropsWithoutRef<"button">["onClick"];
    onRemoveClick?: React.ComponentPropsWithoutRef<"button">["onClick"];
    edit?: boolean;
    remove?: boolean;
    defaultText?: AccountPaymentMethodIsDefaultProps["text"];
  };

export const PaymentMethod: React.FC<Props> & SubComponents = ({
  card,
  isDefault,
  defaultText,
  edit = true,
  remove = true,
  handleEdit,
  onEditClick,
  onRemoveClick,
  onClick,
}) => {
  return (
    <MotionBox variants={MOTION.productVariants} onClick={onClick}>
      <CreditCard
        brand={card.brand?.name as any}
        creditNum={card.last4}
        owner={card.cardholderName}
        expirationDate={card.expMonth + "/" + card?.expYear?.toString().slice(-2)}
        zIndex="md"
        width="inherit"
        bgGradient="linear(to right, #ec008c, #fc6767)"
        boxShadow="inset 0px 0px 12px rgba(0 0 0 / 25%)"
      />
      <Flex
        justify="space-between"
        align="center"
        width="84%"
        mx="auto"
        py={2.5}
        px={4}
        bg="gray.200"
        borderBottomRadius="regular"
        transform="translateY(-2px)"
        cursor="pointer"
      >
        <IsDefault
          isChecked={isDefault}
          text={defaultText}
          onClick={async e => {
            const newVal = (e.target as HTMLInputElement).value === "true";
            if (newVal !== isDefault && handleEdit) {
              await handleEdit({ ...card, id: card.id.toString(), isDefault: newVal }, false);
            }
          }}
        />
        <Flex align="inherit" gap={3}>
          {edit && (
            <IconButton variant="outline" colorScheme="teal" aria-label="Edit" onClick={onEditClick}>
              <Icon.Edit boxSize={5} />
            </IconButton>
          )}
          {remove && (
            <IconButton variant="outline" colorScheme="teal" aria-label="Remove" onClick={onRemoveClick}>
              <Icon.CloseCircle boxSize={5} />
            </IconButton>
          )}
        </Flex>
      </Flex>
    </MotionBox>
  );
};

PaymentMethod.Edit = Edit;
PaymentMethod.Add = Add;
PaymentMethod.IsDefault = IsDefault;
PaymentMethod.CardBrand = CardBrand;

PaymentMethod.displayName = "BillingPaymentMethod";
