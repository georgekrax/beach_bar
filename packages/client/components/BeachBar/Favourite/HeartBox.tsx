import Icons from "@/components/Icons";
import {
  BeachBar,
  FavouriteBeachBarsDocument,
  FavouriteBeachBarsQuery,
  useUpdateFavouriteBeachBarMutation,
} from "@/graphql/generated";
import { notify } from "@/utils/notify";
import { useAnimation } from "framer-motion";
import { memo, useState } from "react";
import styles from "./HeartBox.module.scss";

type Props = {
  beachBarId: BeachBar["id"];
};

export const HeartBox: React.FC<Props> = memo(({ beachBarId }) => {
  const [isFavourite, setIsFavourite] = useState(true);
  const [update] = useUpdateFavouriteBeachBarMutation();
  const heartOverlayAnimation = useAnimation();

  const handleClick = async () => {
    await heartOverlayAnimation.start({ clipPath: `circle(${isFavourite ? 0 : 100}% at 65% 100%)` }, { duration: 0.4 });
    const { errors } = await update({
      variables: { beachBarId },
      refetchQueries: [{ query: FavouriteBeachBarsDocument }],
      update: cache => {
        const cachedData = cache.readQuery<FavouriteBeachBarsQuery>({ query: FavouriteBeachBarsDocument });
        if (!cachedData) return;
        const res = cachedData.favouriteBeachBars.filter(({ beachBar }) => beachBar.id.toString() !== beachBarId.toString());
        cache.writeQuery({
          query: FavouriteBeachBarsDocument,
          data: { favouriteBeachBars: res },
        });
      },
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
    setIsFavourite(prev => !prev);
  };

  return (
    <div className={styles.container + " flex-row-flex-start-center"} onClick={async () => await handleClick()}>
      <Icons.Heart width={32} height={32} />
      <Icons.Heart.Filled
        width={32}
        height={32}
        initial={{ clipPath: `circle(${isFavourite ? 100 : 0}% at 65% 100%)` }}
        animate={heartOverlayAnimation}
      />
    </div>
  );
});

HeartBox.displayName = "BeachBarFavouriteHeartBox";
