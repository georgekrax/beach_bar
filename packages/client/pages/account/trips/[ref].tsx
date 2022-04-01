import {Page} from "@/components/Account/Trips/Page";

const AccountTripInfoPage: React.FC = () => <Page />;

AccountTripInfoPage.displayName = "AccountTripInfo";

export default AccountTripInfoPage;

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   console.log(params);

//   return { props: { hey: "me" }, revalidate: 1, notFound: false };
// };

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const apolloClient = initializeApollo();

//   const variables: PaymentQueryVariables & PaymentRefundAmountQueryVariables = { refCode: query.ref as string };
//   const { errors } = await apolloClient.query<PaymentQuery>({ query: PaymentDocument, variables });
//   const { errors: refundErrors } = await apolloClient.query<PaymentRefundAmountQuery>({
//     query: PaymentRefundAmountDocument,
//     variables,
//   });

//   return {
//     props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() },
//     notFound: errors
//       ?.concat(refundErrors || [])
//       ?.some(({ extensions }) => extensions?.code === COMMON_ERRORS.NOT_FOUND),
//   };
// };
