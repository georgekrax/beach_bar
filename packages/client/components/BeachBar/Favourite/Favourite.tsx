import { MOTION } from "@/config/index";
import { FavouriteBeachBarsQuery } from "@/graphql/generated";
import { genBarThumbnailAlt } from "@/utils/format";
import { motion } from "framer-motion";
import Image from "next/image";
import { Canvas } from "./Canvas";
import styles from "./Favourite.module.scss";
import { FavouriteHeartBox } from "./HeartBox";
import { List } from "./List";

type SubComponents = {
  // HeartBox: typeof FavouriteHeartBox;
  List: typeof List;
  Canvas: typeof Canvas;
};

type FProps = FavouriteBeachBarsQuery["favouriteBeachBars"][number]["beachBar"];

export const Favourite: React.FC<FProps> & SubComponents = ({ name, slug, thumbnailUrl, formattedLocation }) => {
  return (
    <motion.div className={styles.container + " w100 flex-row-flex-start-stretch"} variants={MOTION.productVariants}>
      <div>
        <Image
          src={thumbnailUrl}
          alt={genBarThumbnailAlt(name)}
          // width={112}
          // height={112}
          objectFit="cover"
          objectPosition="center"
          quality={100}
          layout="fill"
        />
      </div>
      <div className="w100 flex-column-space-between-flex-start">
        <div>
          <h6 className="semibold">{name}</h6>
          <span className="d--block">{formattedLocation}</span>
        </div>
        <FavouriteHeartBox beachBarSlug={slug} />
      </div>
    </motion.div>
  );
};

// Favourite.HeartBox = FavouriteHeartBox;
Favourite.List = List;
Favourite.Canvas = Canvas;

Favourite.displayName = "BeachBarFavourite";
