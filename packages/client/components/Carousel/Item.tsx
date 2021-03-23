import BeachBar from "@/components/BeachBar";
import { BeachBar as BeachBarGraphQL } from "@/graphql/generated";
import { useCarouselItem } from "@/utils/hooks";
import { useClassnames, useHasMounted } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion, Variants } from "framer-motion";
import Image, { ImageProps } from "next/image";
import React, { memo } from "react";
import styles from "./Item.module.scss";

export const IMAGE_HEIGHT = 312;

const itemVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 0.9,
  },
};

export type Options = {
  idx: number;
  imgProps: Partial<ImageProps> & Pick<ImageProps, "src">;
  beachBar: Pick<BeachBarGraphQL, "id" | "name"> & { city?: string; region?: string };
  showFavourite?: boolean;
};

export type Props = {
  active?: boolean;
} & Options;

export type FProps = Props & Omit<HTMLMotionProps<"div">, "id">;

export const Item = memo(React.forwardRef<HTMLDivElement, FProps>(
  ({ idx, active = false, imgProps, beachBar: { id, city, name, region }, showFavourite = true, ...props }, ref) => {
    const [classNames, rest] = useClassnames("index__carousel__img__container", props);
    const [imgClassnames, imgRest] = useClassnames("index__carousel__img", imgProps);
    const [hasMounted] = useHasMounted();
    const [scale] = useCarouselItem({ active });

    return (
      <motion.div
        className={classNames}
        key={"index_carousel_img_" + idx}
        variants={itemVariants}
        transition={{ duration: hasMounted ? 0.2 : 0.6, ease: "easeOut" }}
        animate={{ scale: scale }}
        ref={ref}
        data-id={idx}
        {...rest}
      >
        <Image
          className={imgClassnames}
          // width={232}
          // height={IMAGE_HEIGHT}
          alt={`${name} #beach_bar thumbnail image`}
          objectFit="cover"
          objectPosition="center"
          layout="fill"
          {...imgRest}
        />
        {showFavourite && (
          <div className={styles.favourite}>
            <BeachBar.Favourite.HeartBox beachBarId={id} />
          </div>
        )}
        <BeachBar.NameAndLocation
          className="index__carousel__content__container"
          name={name}
          city={city}
          region={region}
        />
      </motion.div>
    );
  }
));

Item.displayName = "CarouselItem";
