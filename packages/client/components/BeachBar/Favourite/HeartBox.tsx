import { NextIconBoxProps } from "@/components/Next";
import { IconBox } from "@/components/Next/IconBox";
import {
  BeachBar,
  FavouriteBeachBarsDocument,
  FavouriteBeachBarsQuery,
  MeDocument,
  useGetUserFavouriteBeachBarsQuery,
  useUpdateFavouriteBeachBarMutation
} from "@/graphql/generated";
import { useAuth } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { PropsAtMotion, useToken } from "@hashtag-design-system/components";
import Icon, { IconProps } from "@hashtag-design-system/icons";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { memo, useEffect, useState } from "react";

// const LOCAL_STORAGE_KEY = "clicked-heart-boxes";
const MotionFilledHeart = motion<PropsAtMotion<IconProps>>(Icon.Social.Heart.Filled);

type Props = Partial<NextIconBoxProps> & {
  beachBarSlug: BeachBar["slug"];
};

const HeartBox: React.FC<Props> = memo(({ beachBarSlug, boxSize = "icon.lg", ...props }) => {
  // const { pathname } = useRouter();
  const [isFavourite, setIsFavourite] = useState(false);
  const favouriteColor = useToken("colors", "orange.500");

  const { data: session } = useSession();

  const { handleLogin } = useAuth({ skip: true });
  const { data } = useGetUserFavouriteBeachBarsQuery();
  const [update] = useUpdateFavouriteBeachBarMutation();

  const handleClick = async () => {
    if (!session) return handleLogin();
    const newIsFavourite = !isFavourite;
    setIsFavourite(newIsFavourite);
    // const arr: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    // if (!isUnload) {
    //   const newArr =
    //     arr.includes(beachBarSlug) || newIsFavourite ? arr.filter(val => val !== beachBarSlug) : [...arr, beachBarSlug];
    //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newArr));
    // }
    // if ((!isUnload && pathname.includes("/favourites")) || (isUnload && !arr.includes(beachBarSlug))) return;
    const { data: updateData, errors } = await update({
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
    if (!updateData && errors) errors.forEach(({ message }) => notify("error", message));
    // else localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  // useEffect(() => {
  //   window.addEventListener("beforeunload", () => handleClick(true));

  //   return () => {
  //     handleClick(true);
  //     window.removeEventListener("beforeunload", () => handleClick(true));
  //   };
  // }, []);

  useEffect(() => {
    if (!data?.favouriteBeachBars) return;
    const newIsFavourite = data.favouriteBeachBars.some(({ beachBar }) => beachBar.slug === beachBarSlug);
    if (newIsFavourite !== isFavourite) setIsFavourite(newIsFavourite);
  }, [beachBarSlug, data?.favouriteBeachBars.length]);

  return (
    <IconBox
      justify="flex-start"
      alignSelf="center"
      zIndex="sm"
      // bg="orange.200"
      _active={{ opacity: 0.8, bg: "orange.200" }}
      transitionProperty="common"
      transitionDuration="normal"
      transitionTimingFunction="ease-out"
      {...props}
      onClick={async () => await handleClick()}
      aria-label="Toggle to add or remove this #beach_bar to your favourites"
      // initial={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderColor: undefined }}
      initial={{ borderColor: undefined }}
      // animate={isFavourite ? { backgroundColor: favouriteColor, borderColor: favouriteColor } : "initial"}
      animate={isFavourite ? { borderColor: favouriteColor } : "initial"}
    >
      <Icon.Social.Heart.Filled position="absolute" zIndex="hide" color="white" boxSize={boxSize} />
      <Icon.Social.Heart  color="gray.800" boxSize={boxSize} />
      <MotionFilledHeart
        position="absolute"
        transform="translateX(-0.5px)"
        color={favouriteColor}
        stroke={favouriteColor}
        boxSize={boxSize}
        initial={false}
        animate={{ clipPath: `circle(${isFavourite ? 100 : 0}% at 65% 100%)`, transition: { duration: 0.4 } }}
      />
    </IconBox>
  );
});

HeartBox.displayName = "BeachBarFavouriteHeartBox";

export const FavouriteHeartBox = HeartBox;
