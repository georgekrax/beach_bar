import { MOTION } from "@/config/index";
import { FavouriteBeachBarsQuery } from "@/graphql/generated";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Favourite.module.scss";
import { HeartBox } from "./HeartBox";

type SubComponents = {
  HeartBox: typeof HeartBox;
};

type FProps = FavouriteBeachBarsQuery["favouriteBeachBars"][number]["beachBar"];

export const Favourite: React.FC<FProps> & SubComponents = ({ id, name, thumbnailUrl, formattedLocation }) => {
  return (
    <motion.div className={styles.container + " w-100 flex-row-flex-start-stretch"} variants={MOTION.productVariants}>
      <div>
        <Image
          src={thumbnailUrl}
          // width={112}
          // height={112}
          objectFit="cover"
          objectPosition="center"
          quality={100}
          layout="fill"
        />
      </div>
      <div className="w-100 flex-column-space-between-flex-start">
        <div>
          <h6 className="semibold">{name}</h6>
          <span className="d--block">{formattedLocation}</span>
        </div>
        <HeartBox beachBarId={id} />
      </div>
    </motion.div>
  );
};

Favourite.HeartBox = HeartBox;

Favourite.displayName = "BeachBarFavourite";
