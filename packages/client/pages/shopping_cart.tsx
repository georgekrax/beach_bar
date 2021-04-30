import Layout from "@/components/Layout";
import ShoppingCartComp from "@/components/ShoppingCart";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { getAuth } from "@/lib/auth";
import { GetServerSideProps } from "next";

const ShoppingCart: React.FC = () => {
  return (
    <Layout header={{ withAuth: false }}>
      <ShoppingCartComp />
    </Layout>
  );
};

export default ShoppingCart;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  await getAuth({ apolloClient });

  return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() } };
};

// {loading ? (
//   <h2>Loading...</h2>
// ) : error || !data ? (
//   <h2>Error</h2>
// ) : (
//   <Next.Motion.Container>
//     <div className="flex-row-space-between-center">
//       <Section.PageHeader>
//         <>
//           My <span className="normal">cart</span>
//         </>
//       </Section.PageHeader>
//       {thereIsShoppingCart && (
//         <span className="body-14">
//           Total items: {(data?.getCart?.products || []).reduce((total, next) => total + next.quantity, 0)}
//         </span>
//       )}
//     </div>
//     {thereIsShoppingCart ? (
//       <>
//         <div className="shopping-cart__bars flex-column-flex-start-flex-start">
//           {(beachBars || [])
//             .sort((a, b) => (a.name > b.name ? 1 : -1))
//             .map(({ id, name, defaultCurrency }, i) => (
//               <ShoppingCartPage.Bar
//                 key={id}
//                 cartId={data?.getCart?.id || ""}
//                 beachBar={{ name, defaultCurrency }}
//                 products={
//                   groupedProducts?.[id]
//                     .sort((a, b) => (new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime() ? -1 : 1))
//                     .map(({ __typename, ...rest }) => ({ ...rest })) || []
//                 }
//                 handleRemoveItem={handleRemoveItem}
//               />
//             ))}
//         </div>
//         <div className="shopping-cart__total">
//           <span>Total: </span>{" "}
//           <h6 className="normal header-3 d--ib">
//             <span>
//               {total.toFixed(2)}{" "}
//               {authData?.me?.account.country?.currency.symbol ||
//                 (beachBars?.[0] ? beachBars[0].defaultCurrency.symbol : "")}
//             </span>
//           </h6>
//         </div>
//         <div ref={ref} className="shopping-cart__checkout-container flex-row-space-between-center">
//           <Button pill aria-label="Checkout">
//             Checkout
//           </Button>
//         </div>
//       </>
//     ) : (
//       <Next.DoNotHave msg="Your shopping cart is empty" emoji="😢">
//         <Next.Link href={{ pathname: "/search", query: { box: true } }}>
//           {/* <a>🛒 Continue shopping</a> */}
//           <a>🛒 Continue searching to fill it!</a>
//         </Next.Link>
//       </Next.DoNotHave>
//     )}
//     <Dialog
//       isShown={productToDelete.isDialogShown}
//       onDismiss={async (e, { cancel }) => {
//         const tagName = e.currentTarget.tagName;
//         if (cancel && tagName && tagName.toLowerCase() === "button") {
//           const productId = productToDelete.productId;
//           if (!productId || !data.getCart?.id) return;
//           await deleteProduct({
//             variables: { cartId: data.getCart?.id, productId: productId },
//             update: cache => {
//               const cacheData = cache.readQuery<GetCartQuery>({ query: GetCartDocument });
//               const newData = cacheData?.getCart?.products?.filter(
//                 ({ product }) => String(product.id) !== String(productId)
//               );

//               cache.writeQuery({
//                 query: GetCartDocument,
//                 data: { getCart: { products: newData } },
//               });
//             },
//           });
//         }
//         setProductToDelete({ isDialogShown: false, productId: undefined });
//       }}
//     >
//       <Dialog.Content style={{ textAlign: "center" }}>
//         <Dialog.Title>Are you sure you want to remove this product from your cart?</Dialog.Title>
//       </Dialog.Content>
//       <Dialog.Btn.Group>
//         <Dialog.Btn>Yes</Dialog.Btn>
//         <Dialog.Btn confirm>No</Dialog.Btn>
//       </Dialog.Btn.Group>
//     </Dialog>
//   </Next.Motion.Container>
// // )}
