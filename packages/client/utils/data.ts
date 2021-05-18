import { GetAllBeachBarsQuery, GetAllBeachBarsDocument } from "@/graphql/generated";
import { initializeApollo } from "@/lib/apollo";

export const getBeachBarStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query<GetAllBeachBarsQuery>({ query: GetAllBeachBarsDocument });

  return { paths: data.getAllBeachBars.map(({ slug }) => ({ params: { slug: [slug] } })), fallback: true };
};
