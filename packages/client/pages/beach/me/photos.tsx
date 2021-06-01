import { FavouriteHeartBox } from "@/components/BeachBar/Favourite/HeartBox";
import { Img } from "@/components/BeachBar/Img";
import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import { LayoutIconHeader } from "@/components/Layout/IconHeader";
import { IconBox } from "@/components/Next/IconBox";
import { NextMotionContainer } from "@/components/Next/MotionContainer";
import { BeachBarImgsDocument, BeachBarImgsQuery, useBeachBarImgsQuery } from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { getBeachBarStaticPaths } from "@/utils/data";
import { shareWithSocials } from "@/utils/notify";
import { motion, Variants } from "framer-motion";
import chunk from "lodash/chunk";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Toaster } from "react-hot-toast";

const variants: Variants = {
  initial: { y: 128, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { stiffness: 100, duration: 0.6, ease: "easeOut" },
  },
};

const BeachPhotosPage: React.FC = () => {
  const { query } = useRouter();

  const slug = useMemo(() => (query.slug as string) || "", [query]);
  const { data, loading, error } = useBeachBarImgsQuery({ variables: { slug: "kikabu" } });

  const arr: NonNullable<BeachBarImgsQuery["beachBarImgs"]>[] = useMemo(
    () => chunk(data?.beachBarImgs?.concat(data?.beachBarImgs || []) || [], 6),
    [data]
  );

  return (
    <Layout header={false} footer={false}>
      <Toaster position="top-center" />
      {loading ? (
        <h2>Loading...</h2>
      ) : error || !data?.beachBarImgs ? (
        <h2>About</h2>
      ) : (
        <NextMotionContainer className="beach_bar__photos-container--padding">
          <LayoutIconHeader
            className="zi--sm"
            before={
              <Link href={{ pathname: "/beach/[slug]", query: { slug } }}>
                <IconBox aria-label="Return">
                  <Icons.Arrow.Left />
                </IconBox>
              </Link>
            }
            after={
              <>
                <FavouriteHeartBox beachBarSlug={slug} />
                <IconBox
                  aria-label="Share this #beach_bar with other people"
                  onClick={() => shareWithSocials("#beach_bar", "with")}
                >
                  <Icons.Share />
                </IconBox>
              </>
            }
          />
          <motion.div
            className="beach_bar__photos-container flex-column-center-center"
            initial="initial"
            animate="animate"
            variants={variants}
          >
            {arr?.map((imgs, i) => (
              <div key={i} className="beach_bar__photos w100 flex-row-center-center">
                {imgs.map(({ id, imgUrl, description }) => (
                  <div key={id}>
                    <Img src={imgUrl} alt={description} layout="fill" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </NextMotionContainer>
      )}
    </Layout>
  );
};

BeachPhotosPage.displayName = "BeachPhotosPage";

export default BeachPhotosPage;

// export const getStaticPaths: GetStaticPaths = async () => {
//   const res = await getBeachBarStaticPaths();
//   return res;
// };

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  const slug = params?.slug;
  await apolloClient.query<BeachBarImgsQuery>({ query: BeachBarImgsDocument, variables: { slug: "kikabu" } });
  // if (slug) await apolloClient.query<BeachBarImgsQuery>({ query: BeachBarImgsDocument, variables: { slug: "kikabu" } });
  // else return { redirect: { destination: "/beach/" + slug, permanent: true } };

  return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() }, revalidate: 5 };
};
