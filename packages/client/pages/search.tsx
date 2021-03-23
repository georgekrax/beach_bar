import Layout from "@/components/Layout";
import Next from "@/components/Next";
import SearchComponent, { SEARCH_ACTIONS } from "@/components/Search";
import { SearchInputValuesDocument } from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { useSearchContext } from "@/utils/contexts";
import { useIsMobile } from "@hashtag-design-system/components";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { UrlObject } from "url";

const Search: React.FC = () => {
  const router = useRouter();
  const { isMobile } = useIsMobile();
  const { map, dispatch } = useSearchContext();

  const isBox = useMemo(() => router.query.box === "true", [router]);
  const redirect = useMemo(() => router.query.redirect as string, [router]);

  const getRedirect = () => {
    let res: string | UrlObject | undefined = redirect;
    if (map && !res?.toString().includes("map"))
      dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { map: false } });
    else if (!redirect?.includes("map"))
      res = {
        pathname: isMobile && !isBox ? "/search" : "/",
        query: isMobile && !isBox ? { box: "true" } : null,
      };
    return res;
  };

  const handleReturn = () => router.push(getRedirect());

  const handleSubmit = () => {
    if (map) router.push(getRedirect());
    else {
      const { box, ...rest } = router.query;
      router.push({ ...router, query: rest, pathname: "/search" });
    }
  };

  return (
    <Layout header={false} footer={false} tapbar={false} wrapperProps={{ style: { padding: 0 } }}>
      {false ? (
        <h2>Loading...</h2>
      ) : false ? (
        <h2>Error</h2>
      ) : (
        <Next.Motion.Container>
          <Toaster position="top-center" />
          {isBox && <SearchComponent.Form onReturn={handleReturn} onSubmit={handleSubmit} />}
        </Next.Motion.Container>
      )}
    </Layout>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  if (ctx.query.box) await apolloClient.query({ query: SearchInputValuesDocument });

  return {
    props: {
      [INITIAL_APOLLO_STATE]: apolloClient.cache.extract(),
    },
  };
};
