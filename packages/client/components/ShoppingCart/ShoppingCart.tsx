import Next, { NextMotionContainerProps } from "@/components/Next";
import Section from "@/components/Section";
import { CartDocument, CartQuery, useCartQuery, useDeleteCartProductMutation } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { notify } from "@/utils/notify";
import { calcCartTotal, calcCartTotalItems, extractCartBeachBars } from "@/utils/payment";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Text
} from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { SEARCH_ACTIONS } from "../Search";
import { BeachItem } from "./BeachItem";
import { ItemPrice } from "./ItemPrice";
import { Quantity } from "./Quantity";
import { Total } from "./Total";

type SubComponents = {
  Total: typeof Total;
  Quantity: typeof Quantity;
  ItemPrice: typeof ItemPrice;
  BeachItem: typeof BeachItem;
};

export type Props = {
  closeBtn?: boolean;
  edit?: boolean;
  atCheckout?: boolean;
  atLayout?: boolean;
  container?: NextMotionContainerProps;
};

const ShoppingCart: React.FC<Props> & SubComponents = ({
  closeBtn = false,
  edit = true,
  atCheckout = false,
  atLayout = false,
  container,
}) => {
  const [productToDeleteId, setProductToDeleteId] = useState<number | undefined>();
  const cancelRef = useRef<HTMLButtonElement>();
  const { dispatch } = useSearchContext();

  const { data, loading, error } = useCartQuery({ fetchPolicy: "cache-and-network", nextFetchPolicy: "cache-first" });
  const [deleteCartProduct] = useDeleteCartProductMutation();

  const { beachBars, thereIsShoppingCart, total } = useMemo(() => {
    const beachBars = extractCartBeachBars(data);
    return {
      beachBars,
      thereIsShoppingCart: beachBars ? beachBars.length > 0 : false,
      total: (data?.cart && calcCartTotal({ ...data?.cart })) || 0,
    };
  }, [data]);
  const doNotHave = useMemo(() => !thereIsShoppingCart || error || !data, [thereIsShoppingCart, error, data]);

  const handleRemoveItem = (id: number) => setProductToDeleteId(id);

  const handleClose = () => dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: false } });

  const dismissDelete = () => setProductToDeleteId(undefined);

  const removeProduct = async () => {
    if (!productToDeleteId) return notify("error", "");

    await deleteCartProduct({
      variables: { id: productToDeleteId.toString() },
      update: cache => {
        const cachedData = cache.readQuery<CartQuery>({ query: CartDocument });
        if (!cachedData?.cart) return;
        const newData = cachedData.cart.products?.filter(({ id }) => String(id) !== String(productToDeleteId));
        cache.writeQuery<CartQuery>({
          query: CartDocument,
          data: { __typename: "Query", cart: { ...cachedData.cart, products: newData } },
        });
      },
    });
    dismissDelete();
  };

  return (
    <Next.MotionContainer
      {...(atLayout && {
        className: "scrollbar",
        minHeight: 16,
        maxHeight: "calc(100vh - 2rem)",
        mt: 7,
        px: 7,
        overflowY: "auto",
      })}
      {...container}
    >
      {!atCheckout && (
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={3}>
            {closeBtn && (
              <Next.IconBox aria-label="Close shopping cart window" onClick={handleClose}>
                <Icon.Close />
              </Next.IconBox>
            )}
            <Section.PageHeader className="text--nowrap">
              My&nbsp;
              <Text as="span" fontWeight="normal">
                cart
              </Text>
            </Section.PageHeader>
          </Flex>
          {!doNotHave && (
            <Text as="span" fontSize="sm">
              Total items:&nbsp;{calcCartTotalItems({ ...data!.cart })}
            </Text>
          )}
        </Flex>
      )}
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          {doNotHave ? (
            <Next.DoNotHave msg="Your shopping cart is empty." emoji="😢">
              <Next.Link link={{ href: { pathname: "/search", query: { box: true } } }}>
                {/* <a>🛒 Continue shopping</a> */}
                <a>🛒 Continue searching to fill it!</a>
              </Next.Link>
            </Next.DoNotHave>
          ) : (
            <>
              <Flex flexDir="column" gap={8} my={6} _first={{ m: 0 }}>
                {(beachBars || [])
                  .sort((a, b) => (a.beachBar.name > b.beachBar.name ? 1 : -1))
                  .map(({ beachBar: { __typename, thumbnailUrl, location, ...beachBar }, ...cart }) => (
                    <BeachItem
                      key={"beach_bar_" + beachBar.id}
                      beachBarId={beachBar.id}
                      cart={cart}
                      edit={edit}
                      hasViewBeachProducts={!atCheckout}
                      handleRemoveItem={handleRemoveItem}
                      {...beachBar}
                      // m={i === 0 ? 0 : undefined} TODO:
                    />
                  ))}
              </Flex>
              {!atCheckout && (
                <Total
                  total={total}
                  currencySymbol={beachBars?.[0].beachBar.currency.symbol || undefined}
                  ml={0}
                  mt={atCheckout ? 0 : undefined}
                />
              )}
              {!atCheckout && (
                <Flex
                  justify="space-between"
                  align="center"
                  position="sticky"
                  bottom={-24}
                  left="50%"
                  py={3}
                  mt={6}
                  mb={{ base: 12, md: 0 }}
                  zIndex="sm"
                  bg="white"
                >
                  <Link href="/checkout">
                    <Button
                      aria-label="Checkout"
                      colorScheme="orange"
                      m="auto"
                      py={3}
                      flexGrow={1}
                      alignSelf="center"
                      maxWidth="22.5em"
                    >
                      Checkout
                    </Button>
                  </Link>
                </Flex>
              )}
            </>
          )}
        </>
      )}
      <AlertDialog isOpen={!!productToDeleteId} leastDestructiveRef={cancelRef as any} onClose={dismissDelete}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove product
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to remove this product from your cart?</AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={dismissDelete}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={async () => await removeProduct()}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Next.MotionContainer>
  );
};

ShoppingCart.Total = Total;
ShoppingCart.Quantity = Quantity;
ShoppingCart.ItemPrice = ItemPrice;
ShoppingCart.BeachItem = BeachItem;

ShoppingCart.displayName = "ShoppingCart";

export default ShoppingCart;
