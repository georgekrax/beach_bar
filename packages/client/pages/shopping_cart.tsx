import { Button, Dialog } from "@hashtag-design-system/components";
import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";
import { GetServerSideProps } from "next";
import { useMemo, useRef, useState } from "react";
import Icons from "../components/Icons";
import Layout from "../components/Layout";
import Next from "../components/Next";
import { ShoppingCartPage } from "../components/pages";
import Section from "../components/Section";
import { GetCartDocument, GetCartQuery, useDeleteCartProductMutation, useGetCartQuery } from "../graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "../lib/apollo";
import { getAuth } from "../lib/auth";
import { useAuth } from "../utils/hooks";

const ShoppingCart: React.FC = () => {
  const [productToDelete, setProductToDelete] = useState({ isDialogShown: false, productId: null });
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: { me },
  } = useAuth();
  const { data, loading, error } = useGetCartQuery({ fetchPolicy: "cache-and-network" });
  const [deleteProduct] = useDeleteCartProductMutation();

  const beachBars = useMemo(
    () =>
      data &&
      data.getCart &&
      uniqBy(data.getCart.products, "product.beachBar.id").map(({ product: { beachBar } }) => beachBar),
    [data]
  );
  const groupedProducts = useMemo(() => beachBars && groupBy(data.getCart.products, "product.beachBar.id"), [
    beachBars,
  ]);
  const thereIsShoppingCart = useMemo(() => (beachBars ? beachBars.length > 0 : false), [beachBars]);
  const total = useMemo(() => data?.getCart?.products.reduce((init, b) => init + b.product.price * b.quantity, 0), [
    data,
  ]);

  const handleRemoveItem = async (id: number) => setProductToDelete({ isDialogShown: true, productId: id });

  return (
    <Layout
      mainProps={{ className: thereIsShoppingCart ? undefined : "h-100" }}
      header={{ withAuth: false }}
      wrapperProps={{ ref: containerRef }}
    >
      {loading ? (
        <h2>Loading...</h2>
      ) : error || !data ? (
        <h2>Error</h2>
      ) : (
        <Next.Motion.Container>
          <div className="flex-row-space-between-center">
            <Section.PageHeader>
              <>
                My <span className="normal">cart</span>
              </>
            </Section.PageHeader>
            {thereIsShoppingCart && (
              <span className="body-14">
                Total items: {data.getCart.products.reduce((total, next) => total + next.quantity, 0)}
              </span>
            )}
          </div>
          {thereIsShoppingCart ? (
            <>
              <div className="shopping-cart__bars flex-column-flex-start-flex-start">
                {beachBars
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map(({ id, name, defaultCurrency }, i) => (
                    <ShoppingCartPage.Bar
                      key={id}
                      cartId={data.getCart.id}
                      beachBar={{ name, defaultCurrency }}
                      products={groupedProducts[id]
                        .sort((a, b) => (new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime() ? -1 : 1))
                        .map(({ __typename, ...rest }) => ({ ...rest }))}
                      handleRemoveItem={handleRemoveItem}
                    />
                  ))}
              </div>
              <div className="shopping-cart__total">
                <span>Total: </span>{" "}
                <h6 className="normal header-3 d--ib">
                  <span>
                    {total.toFixed(2)} {me?.account.country?.currency.symbol || beachBars[0].defaultCurrency.symbol}
                  </span>
                </h6>
              </div>
              <div ref={ref} className="shopping-cart__checkout-container flex-row-space-between-center">
                <Button pill aria-label="Checkout">
                  <Icons.Chevron.Right />
                  Checkout
                </Button>
              </div>
            </>
          ) : (
            <Next.DoNotHave msg="Your shopping cart is empty" emoji="😢">
              <Next.Link href={{ pathname: "/" }}>
                {/* <a>🛒 Continue shopping</a> */}
                <a>🛒 Continue searching to fill it!</a>
              </Next.Link>
            </Next.DoNotHave>
          )}
          <Dialog
            isShown={productToDelete.isDialogShown}
            onDismiss={async (e, { cancel }) => {
              const tagName = e.currentTarget.tagName;
              if (cancel && tagName && tagName.toLowerCase() === "button") {
                const productId = productToDelete.productId;

                await deleteProduct({
                  variables: { cartId: data.getCart.id, productId },
                  update: cache => {
                    const cacheData = cache.readQuery<GetCartQuery>({ query: GetCartDocument });
                    const newData = cacheData.getCart.products.filter(
                      ({ product }) => String(product.id) !== String(productId)
                    );

                    cache.writeQuery({
                      query: GetCartDocument,
                      data: { getCart: { products: newData } },
                    });
                  },
                });
              }
              setProductToDelete({ isDialogShown: false, productId: null });
            }}
          >
            <Dialog.Content style={{ textAlign: "center" }}>
              <Dialog.Title>Are you sure you want to remove this product from your cart?</Dialog.Title>
            </Dialog.Content>
            <Dialog.Btn.Group>
              <Dialog.Btn>Yes</Dialog.Btn>
              <Dialog.Btn confirm>No</Dialog.Btn>
            </Dialog.Btn.Group>
          </Dialog>
        </Next.Motion.Container>
      )}
    </Layout>
  );
};

export default ShoppingCart;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  await getAuth({ apolloClient });

  return {
    props: {
      [INITIAL_APOLLO_STATE]: apolloClient.cache.extract(),
    },
  };
};
