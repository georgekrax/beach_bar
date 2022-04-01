import { Img } from "@/components/BeachBar/Img";
import { DATA } from "@/config/data";
import { BeachBarQuery } from "@/graphql/generated";
import { Grid, MotionBox } from "@hashtag-design-system/components";
import { Variants } from "framer-motion";
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
  const arr: Props["imgsArr"][] = useMemo(() => chunk(imgsArr, DATA.PHOTOS_PER_SECTION), [imgsArr[0]?.id]);

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      exit="initial"
      variants={variants}
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex="md"
      bg="white"
      borderRadius="regular"
    >
      {arr.map((imgs, i) => (
        <Grid
          templateColumns="repeat(3, 1fr)"
          templateRows="repeat(2, auto)"
          gap={5}
          maxWidth="container.md"
          m="auto"
          mb={12}
          py={4}
          key={i}
          className={styles.section}
        >
          {imgs.map(({ id, imgUrl, description }) => (
            <Img
              key={id}
              src={imgUrl}
              id={id.toString()}
              alt={description}
              layout="fill"
              description={description}
              zoom={{ minHeight: "7.5em" }}
            />
          ))}
        </Grid>
      ))}
    </MotionBox>
  );
};

Photos.displayName = "BeachBarPhotos";
