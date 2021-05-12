import Next from "@/components/Next";
import ShoppingCartPage from "@/components/pages/ShoppingCart";
import Section from "@/components/Section";
import { CartDocument, CartQuery, useCartQuery, useDeleteCartProductMutation } from "@/graphql/generated";
import { useAuth } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { calcCartTotal, calcCartTotalProducts, getCartBeachBars } from "@/utils/payment";
import { Button, Dialog } from "@hashtag-design-system/components";
import { NextMotionContainer } from "@/components/Next/MotionContainer";
import groupBy from "lodash/groupBy";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Total } from "./Total";

type SubComponents = {
  Total: typeof Total;
};

type Props = {};

const ShoppingCart: React.FC<Props> & SubComponents = () => {
  const [productToDelete, setProductToDelete] = useState<{ isDialogShown: boolean; cartProductId?: string }>({
    isDialogShown: false,
    cartProductId: undefined,
  });
  const ref = useRef<HTMLDivElement>(null);

  const { data: authData } = useAuth({skip: true});
  const { data, loading, error } = useCartQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: true,
  });
  // const [deleteProduct] = useDeleteCartProductMutation();

  const handleRemoveItem = async (id: string) => setProductToDelete({ isDialogShown: true, cartProductId: id });

  const beachBars = useMemo(() => getCartBeachBars(data), [data]);
  const groupedProducts = useMemo(() => beachBars && groupBy(data?.cart?.products, "product.beachBar.id"), [beachBars]);
  const thereIsShoppingCart = useMemo(() => (beachBars ? beachBars.length > 0 : false), [beachBars]);
  const total = useMemo(() => calcCartTotal(data?.cart?.products), [data]);

  return (
    <div>
      {loading ? (
        <h2>Loading...</h2>
      ) : error || !data ? (
        <h2>Error</h2>
      ) : (
        <NextMotionContainer>
          <div className="flex-row-space-between-center">
            <Section.PageHeader>
              <>
                My <span className="normal">cart</span>
              </>
            </Section.PageHeader>
            {thereIsShoppingCart && (
              <span className="body-14">Total items: {calcCartTotalProducts(data.cart?.products)}</span>
            )}
          </div>
          {thereIsShoppingCart ? (
            <>
              <div className="shopping-cart__bars flex-column-flex-start-flex-start">
                {(beachBars || [])
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map(({ id, name, defaultCurrency }) => (
                    <ShoppingCartPage.Bar
                      key={id}
                      beachBar={{ name, defaultCurrency }}
                      products={
                        groupedProducts?.[id]
                          .sort((a, b) => (new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime() ? -1 : 1))
                          .map(({ __typename, ...rest }) => ({ ...rest })) || []
                      }
                      handleRemoveItem={handleRemoveItem}
                    />
                  ))}
              </div>
              <Total
                className="shopping-cart__total"
                total={total}
                currencySymbol={
                  authData?.me?.account.country?.currency.symbol ||
                  (beachBars?.[0] ? beachBars[0].defaultCurrency.symbol : "")
                }
              />
              <div ref={ref} className="shopping-cart__checkout-container flex-row-space-between-center">
                <Link href="/checkout">
                  <Button pill aria-label="Checkout">
                    Checkout
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <Next.DoNotHave msg="Your shopping cart is empty" emoji="😢">
              <Next.Link href={{ pathname: "/search", query: { box: true } }}>
                {/* <a>🛒 Continue shopping</a> */}
                <a>🛒 Continue searching to fill it!</a>
              </Next.Link>
            </Next.DoNotHave>
          )}
          {/* <Dialog
            isShown={productToDelete.isDialogShown}
            onDismiss={async (e, { cancel }) => {
              const tagName = e.currentTarget.tagName;
              if (productToDelete.cartProductId && cancel && tagName && tagName.toLowerCase() === "button") {
                await deleteProduct({
                  variables: { id: productToDelete.cartProductId },
                  update: cache => {
                    const cacheData = cache.readQuery<CartQuery>({ query: CartDocument });
                    if (!cacheData || !cacheData.cart) return;
                    const newData = cacheData.cart.products?.filter(
                      ({ id }) => String(id) !== String(productToDelete.cartProductId)
                    );
                    cache.writeQuery<CartQuery>({
                      query: CartDocument,
                      data: { __typename: "Query", cart: { ...cacheData.cart, products: newData } },
                    });
                  },
                });
              }
              if (!productToDelete.cartProductId) notify("error", "");
              setProductToDelete({ isDialogShown: false, cartProductId: undefined });
            }}
          >
            <Dialog.Content style={{ textAlign: "center" }}>
              <Dialog.Title>Are you sure you want to remove this product from your cart?</Dialog.Title>
            </Dialog.Content>
            <Dialog.Btn.Group>
              <Dialog.Btn>Yes</Dialog.Btn>
              <Dialog.Btn confirm>No</Dialog.Btn>
            </Dialog.Btn.Group>
          </Dialog> */}
        </NextMotionContainer>
      )}
    </div>
  );
};

ShoppingCart.Total = Total;

ShoppingCart.displayName = "ShoppingCart";

export default ShoppingCart; 