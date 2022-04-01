import { CartProduct } from "@/graphql/generated";
import { MotionText, MotionTextProps } from "@hashtag-design-system/components";

export const Quantity: React.FC<MotionTextProps & Pick<CartProduct, "quantity">> = ({ quantity, ...props }) => (
  <MotionText
    as="span"
    initial={{ opacity: 0 }}
    animate={quantity > 0 ? { opacity: 1 } : { opacity: 0, transition: { duration: 0 } }}
    py="0.1rem"
    px={1}
    bg="gray.300"
    borderRadius={6}
    fontSize="xs"
    color="text.grey"
    {...props}
  >
    {quantity}x
  </MotionText>
);

Quantity.displayName = "NextQuantity";
