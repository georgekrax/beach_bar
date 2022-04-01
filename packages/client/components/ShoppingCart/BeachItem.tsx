import BeachBar from "@/components/BeachBar";
import { SEARCH_ACTIONS } from "@/components/Search";
import Section from "@/components/Section";
import { ShoppingCartProps } from "@/components/ShoppingCart";
import { fadeInUp, productVariants } from "@/config/animation";
import {
  AddCartNoteMutation,
  CartDocument,
  CartQuery,
  UpdateCartNoteMutation,
  useAddCartNoteMutation,
  useUpdateCartNoteMutation,
  useUpdateCartProductMutation,
} from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { formatPeople, parseHour, removeSameYear } from "@/utils/format";
import { useIsDevice } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Box, BoxProps, Flex, Form, IconButton, Input, MotionFlex, Text } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import dayjs from "dayjs";
import { AnimatePresence, Variants } from "framer-motion";
import { GraphQLError } from "graphql";
import uniq from "lodash/uniq";
import Image from "next/image";
import { ItemPrice } from "./ItemPrice";
import { Quantity } from "./Quantity";

// styles.trip

// .trip {
//   gap: 0 map-get($em-spacers, 16);
// }

// .product.trip {
// flex-grow: 1;
//   flex-basis: 48%;
//   align-self: stretch;
//   gap: 0;
// }

const DIVIDER_BOX = <Box width="1px" minH="100%" alignSelf="stretch" flexShrink={0} bg="gray.400" />;

const { min, max } = COMMON_CONFIG.DATA.cartProductQuantity;

const TRASH_BIN_OFFSET = 1.5;

const containerVariants: Variants = {
  initial: { transition: { staggerChildren: 0.1 } },
  animate: { transition: { staggerChildren: 0.1 } },
};

type Props = Pick<CartQuery["cart"]["products"][number]["product"]["beachBar"], "name" | "currency"> &
  Pick<Required<ShoppingCartProps>, "edit"> &
  BoxProps & {
    beachBarId: string;
    hasViewBeachProducts?: boolean;
    atTripInfo?: boolean;
    cart: Pick<CartQuery["cart"], "id" | "products" | "foods" | "notes">;
    handleRemoveItem?: (id: number) => void;
  };

export const BeachItem: React.FC<Props> = ({
  beachBarId,
  name,
  currency,
  cart,
  edit = true,
  hasViewBeachProducts = true,
  atTripInfo = false,
  handleRemoveItem,
  ...props
}) => {
  const { isDesktop } = useIsDevice();
  const { dispatch } = useSearchContext();

  const [updateCartProduct] = useUpdateCartProductMutation();
  const [addCartNote] = useAddCartNoteMutation();
  const [updateCartNote] = useUpdateCartNoteMutation();

  const note = cart.notes.find(({ beachBar }) => beachBar.id.toString() === beachBarId.toString());

  const handleLinkClick = () => dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: false } });

  const handleChange = async (id: number, newQuantity: number) => {
    if (newQuantity === 0 && handleRemoveItem && edit) return handleRemoveItem(id);

    const { data, errors } = await updateCartProduct({ variables: { id: id.toString(), quantity: newQuantity } });
    if (!data && errors) errors.forEach(({ message }) => notify("error", message, { somethingWentWrong: false }));
  };

  const handleNoteSubmit = async ({ target: { value: body } }: React.FocusEvent<HTMLTextAreaElement>) => {
    let res: AddCartNoteMutation | UpdateCartNoteMutation | null | undefined = undefined;
    let errors: readonly GraphQLError[] | undefined = undefined;

    if (note) {
      const { data: updateRes, errors: updateErrors } = await updateCartNote({
        variables: { id: note.id.toString(), body },
      });
      (res = updateRes), (errors = updateErrors);
    } else {
      const { data: addRes, errors: addErrors } = await addCartNote({
        variables: { cartId: cart.id.toString(), beachBarId, body },
        update: (cache, { data }) => {
          const cacheData = cache.readQuery<CartQuery>({ query: CartDocument });
          if (!cacheData || !cacheData.cart || !data) return;
          cache.writeQuery<CartQuery>({
            query: CartDocument,
            data: {
              __typename: "Query",
              cart: { ...cacheData.cart, notes: [...cacheData.cart.notes, data.addCartNote] },
            },
          });
        },
      });
      (res = addRes), (errors = addErrors);
    }
    if (!res && errors) errors.forEach(({ message }) => notify("error", message, { somethingWentWrong: false }));
  };

  return (
    <Box width="100%" {...props}>
      <Section.Header
        initial="initial"
        animate="animate"
        exit={{ opacity: 0 }}
        variants={fadeInUp}
        link={hasViewBeachProducts ? "View products" : undefined}
        href={{ pathname: "/beach/[...slug]", query: { slug: ["kikabu"] } }} // TODO: Change
        onLinkClick={isDesktop ? handleLinkClick : undefined}
      >
        {name}
      </Section.Header>
      <Flex flexDir="column" gap={8}>
        <MotionFlex
          // className={(atTripInfo ? styles.trip + " " : "") + "w100"}
          className="w100"
          animate="animate"
          initial="initial"
          variants={containerVariants}
          wrap="wrap"
        >
          <AnimatePresence>
            {uniq(cart.products).map(
              ({ id, date, startTime, endTime, quantity, people, product: { price, imgUrl, ...product } }) => (
                <MotionFlex
                  key={"cart_product_" + id}
                  initial="initial"
                  animate="animate"
                  exit={{ x: "-100%", opacity: 0 }}
                  variants={productVariants}
                  gap={4}
                  position="relative"
                  width="100%"
                  minH={edit ? 32 : 10}
                  mb={edit ? 6 : 4}
                  p={3}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="regular"
                  _last={{ mb: 0 }}
                  // className={(atTripInfo ? " " + styles.trip + " " : "")}
                >
                  {imgUrl && (
                    <Flex flexShrink={0} borderRadius="inherit" overflow="hidden">
                      <Image
                        src={imgUrl}
                        alt={name + " product image"}
                        width={edit ? 96 : 80}
                        height={edit ? 96 : 80}
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </Flex>
                  )}
                  <Flex flexDir="column" justify="space-between" width="inherit" overflow="auto">
                    <Box maxWidth={edit ? `calc(100% - ${(TRASH_BIN_OFFSET * 1.5) / 4}rem)` : undefined}>
                      <span>{product.name}</span>
                      <Flex
                        align="flex-start"
                        gap={2}
                        mt={1}
                        pb={0.5}
                        color="text.grey"
                        whiteSpace="nowrap"
                        fontSize="sm"
                        overflow="auto"
                        className="scrollbar"
                        sx={{ "::-webkit-scrollbar": { height: "8px" } }}
                      >
                        <span>{removeSameYear(dayjs(date))}</span>
                        {DIVIDER_BOX}
                        <span>
                          {parseHour(startTime.value)}&nbsp;&ndash;&nbsp;{parseHour(endTime.value)}
                        </span>
                        {DIVIDER_BOX}
                        <span>{formatPeople(people)}</span>
                      </Flex>
                    </Box>
                    <Flex justify="space-between" align="flex-end" width="inherit">
                      <Flex gap={2}>
                        <Quantity quantity={quantity} />
                        <ItemPrice price={price} currencySymbol={currency.symbol} />
                      </Flex>
                      {edit && (
                        <div>
                          {quantity === min && (
                            <IconButton
                              size="xs"
                              position="absolute"
                              top={TRASH_BIN_OFFSET}
                              right={TRASH_BIN_OFFSET}
                              bg="transparent"
                              borderRadius="md"
                              color="gray.600"
                              zIndex="sm"
                              colorScheme="red"
                              _hover={{ bg: "red.500", color: "white" }}
                              aria-label="Remove product from cart"
                              icon={<Icon.TrashBin.HandleFilled boxSize={3.5} />}
                              onClick={() => handleRemoveItem?.(id)}
                            />
                          )}
                          <Input.IncrDcrGroup
                            defaultValue={quantity}
                            min={1} // or 0?
                            max={max}
                            size="sm"
                            maxWidth={28}
                            placeholder="Placeholder"
                            onChange={async newVal => handleChange(id, parseInt(newVal))} // Do not change to: +newVal
                          >
                            <Input.IncrDcrStepper type="decrement" />
                            <Input.IncrDcr p={0} textAlign="center" />
                            <Input.IncrDcrStepper type="increment" />
                          </Input.IncrDcrGroup>
                        </div>
                      )}
                    </Flex>
                  </Flex>
                </MotionFlex>
              )
            )}
          </AnimatePresence>
        </MotionFlex>
        {cart.foods.length > 0 && (
          <BeachBar.Page.Food
            edit={edit}
            atShoppingCart
            hasNoProducts={false}
            currencySymbol={currency.symbol}
            foods={cart.foods.map(({ food }) => food)}
          />
        )}
        <Box>
          {atTripInfo ? (
            <>
              {note?.body && (
                <div>
                  <Text as="label" fontSize="sm">
                    Note:
                  </Text>
                  <div>{note?.body}</div>
                </div>
              )}
            </>
          ) : (
            <Form.Control isOptional>
              <Form.Label />
              <Input.Group>
                <Input.Textarea
                  rows={2}
                  placeholder="Note:"
                  defaultValue={note?.body}
                  onBlur={async e => await handleNoteSubmit(e)}
                  sx={{ "~ span": { fontStyle: "italic" } }}
                />
              </Input.Group>
            </Form.Control>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
