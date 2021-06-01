import { Img } from "@/components/BeachBar/Img";
import { BeachBarQuery } from "@/graphql/generated";
import { motion, Variants } from "framer-motion";
import chunk from "lodash/chunk";
import { useMemo } from "react";
import styles from "./Photos.module.scss";

const variants: Variants = {
  initial: { y: "25%", opacity: 0, transition: { duration: 0.4 } },
  animate: {
    y: 0,
    opacity: 1,
    transition: { stiffness: 100, delay: 0.1, duration: 0.4, ease: "easeOut" },
  },
};

type Props = {
  imgsArr: NonNullable<BeachBarQuery["beachBar"]>["imgUrls"];
};

export const Photos: React.FC<Props> = ({ imgsArr }) => {
  const arr: Props["imgsArr"][] = useMemo(() => chunk(imgsArr.concat(imgsArr), 6), [imgsArr]);

  return (
    <motion.div
      className={styles.container + " h100"}
      initial="initial"
      animate="animate"
      exit="initial"
      variants={variants}
    >
      <div className="w100">
        {arr.map((imgs, i) => (
          <div key={i} className={styles.section + " w100 flex-row-center-center"}>
            {imgs.map(({ id, imgUrl, description }) => (
              <Img key={id} src={imgUrl} id={id} alt={description} layout="fill" description={description} />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

Photos.displayName = "BeachBarPhotos";
