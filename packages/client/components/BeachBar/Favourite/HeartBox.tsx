import { AUTH_ACTIONS } from "@/components/Auth/reducer";
import { IconBox } from "@/components/Next/IconBox";
import {
  BeachBar,
  FavouriteBeachBarsDocument,
  FavouriteBeachBarsQuery,
  MeDocument,
  useUpdateFavouriteBeachBarMutation,
} from "@/graphql/generated";
import { useAuthContext } from "@/utils/contexts";
import { useAuth, useConfig } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import dynamic from "next/dynamic";
import React, { memo, useEffect, useState } from "react";
import styles from "./HeartBox.module.scss";

const IconsHeart = dynamic(() => {
  const prom = import("@/components/Icons/Heart").then(mod => mod.Heart);
  return prom;
});
const IconsHeartFilled = dynamic(() => {
  const prom = import("@/components/Icons/Heart").then(mod => mod.Heart.Filled);
  return prom;
});

type Props = {
  beachBarSlug: BeachBar["slug"];
};

const HeartBox: React.FC<Props> = memo(({ beachBarSlug }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [update] = useUpdateFavouriteBeachBarMutation();

  const { data } = useAuth();
  const { dispatch } = useAuthContext();
  const {
    colors: { volcano },
  } = useConfig();

  const handleClick = async () => {
    if (!data?.me) {
      dispatch({ type: AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG, payload: { bool: true } });
      return;
    }
    setIsFavourite(prev => !prev);
    const { errors } = await update({
      variables: { slug: beachBarSlug },
      refetchQueries: [{ query: MeDocument }, { query: FavouriteBeachBarsDocument }],
      update: cache => {
        const cachedData = cache.readQuery<FavouriteBeachBarsQuery>({ query: FavouriteBeachBarsDocument });
        if (!cachedData) return;
        const res = cachedData.favouriteBeachBars.filter(
          ({ beachBar: { slug } }) => slug.toString() !== beachBarSlug.toString()
        );
        cache.writeQuery({ query: FavouriteBeachBarsDocument, data: { favouriteBeachBars: res } });
      },
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
  };

  useEffect(() => {
    if (data?.me) {
      const newIsFavourite = data.me.favoriteBars.map(({ beachBar }) => beachBar.slug).includes(beachBarSlug);
      if (newIsFavourite !== isFavourite) setIsFavourite(newIsFavourite);
    }
  }, [data, beachBarSlug]);

  // if (!data || !data.me) return null;

  const favouriteColor = volcano["200"];

  return (
    <IconBox
      className={styles.container + " zi--sm flex-row-flex-start-center"}
      animate={
        isFavourite
          ? { backgroundColor: favouriteColor, borderColor: favouriteColor }
          : { backgroundColor: "rgba(255, 255, 255, 0.9)", borderColor: undefined }
      }
      onClick={async () => await handleClick()}
      aria-label="Toggle wether to add or remove this #beach_bar from your favourites list"
    >
      <IconsHeart />
      <IconsHeartFilled
        animate={{ clipPath: `circle(${isFavourite ? 100 : 0}% at 65% 100%)`, transition: { duration: 0.4 } }}
      />
    </IconBox>
  );
});

HeartBox.displayName = "BeachBarFavouriteHeartBox";

export const FavouriteHeartBox = HeartBox;
