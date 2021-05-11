<<<<<<< HEAD
import { GetAllBeachBarsQuery, GetAllBeachBarsDocument } from "@/graphql/generated";
import { initializeApollo } from "@/lib/apollo";

export const getBeachBarStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query<GetAllBeachBarsQuery>({ query: GetAllBeachBarsDocument });

  return { paths: data.getAllBeachBars.map(({ slug }) => ({ params: { slug } })), fallback: true };
};
=======
import { GetAllBeachBarsQuery, GetAllBeachBarsDocument } from "@/graphql/generated";
import { initializeApollo } from "@/lib/apollo";

export const getBeachBarStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query<GetAllBeachBarsQuery>({ query: GetAllBeachBarsDocument });

  return { paths: data.getAllBeachBars.map(({ slug }) => ({ params: { slug } })), fallback: true };
};
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
