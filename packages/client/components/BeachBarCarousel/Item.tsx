import { useClassnames, useHasMounted } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion, useAnimation, useCycle, useReducedMotion, Variants } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

export const IMAGE_HEIGHT = 312;

const itemVariants: Variants = {
  initial: (hasReducedMotion: boolean) => ({
    y: hasReducedMotion ? 0 : 30,
    opacity: 0,
  }),
  animate: {
    y: 0,
    opacity: 0.9,
  },
};

export type Options = {
  imgProps: Partial<ImageProps> & Pick<ImageProps, "src">;
  beachBar: { name: string; city: string; region?: string; isFavourite?: boolean };
};

export type Props = {
  idx: number;
  active?: boolean;
} & Options;

export type FProps = Props & HTMLMotionProps<"div">;

export const Item = React.forwardRef<HTMLDivElement, FProps>(({
  idx,
  active = false,
  imgProps,
  beachBar: { city, name, region, isFavourite },
  ...props
}) => {
  const [classNames, rest] = useClassnames("index__carousel__img__container", props);
  const [imgClassnames, imgRest] = useClassnames("index__carousel__img", imgProps);
  const [hasMounted] = useHasMounted();
  const hasReducedMotion = useReducedMotion();
  const [scale, cycleScale] = useCycle(hasReducedMotion ? 1 : 0.9, 1);
  const [isBookmarkChecked, setIsBookmarkChecked] = useState(isFavourite);
  const bookmarkOverlayAnimation = useAnimation();
  const location = `${city}${region ? `, ${region}` : ""}`;

  useEffect(() => {
    if (hasReducedMotion || active) {
      cycleScale();
    } else {
      cycleScale(0);
    }
  }, [hasReducedMotion, active]);

  return (
    <motion.div
      className={classNames}
      key={"index_carousel_img_" + idx}
      variants={itemVariants}
      custom={hasReducedMotion}
      transition={{ duration: hasMounted ? 0.2 : 0.6, ease: "easeOut" }}
      animate={{ scale: scale }}
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
        data-id={idx}
        {...imgRest}
      />
      <div
        onClick={async () => {
          await bookmarkOverlayAnimation.start(
            { clipPath: `circle(${isBookmarkChecked ? 0 : 100}% at 65% 0%)` },
            { duration: 0.4 }
          );
          setIsBookmarkChecked(prevState => !prevState);
        }}
        className="index__carousel__bookmark"
      >
        <svg width={48} height={48} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 12.5 15 L 12 14.6 l -0.5 0.5 l -5.3 4.9 a 0.3 0.3 0 0 1 -0.4 -0.2 V 2 A 0.3 0.3 0 0 1 6 1.8 h 12 a 0.3 0.3 0 0 1 0.3 0.3 v 17.7 a 0.3 0.3 0 0 1 -0.4 0.2 l -5.3 -4.9 z"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
        <motion.svg
          initial={{ clipPath: `circle(${isBookmarkChecked ? 100 : 0}% at 65% 0%)` }}
          animate={bookmarkOverlayAnimation}
          width={48}
          height={48}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 12.5 15 L 12 14.6 l -0.5 0.5 l -5.3 4.9 a 0.3 0.3 0 0 1 -0.4 -0.2 V 2 A 0.3 0.3 0 0 1 6 1.8 h 12 a 0.3 0.3 0 0 1 0.3 0.3 v 17.7 a 0.3 0.3 0 0 1 -0.4 0.2 l -5.3 -4.9 z"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </motion.svg>
      </div>
      <div className="index__carousel__content__container flex-column-center-flex-start">
        <h6>{name}</h6>
        <div className="flex-row-flex-start-center">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7 4a7 7 0 00-.8 9l5.5 7.9c.1.1.3.1.4 0l5.5-7.9A7 7 0 007 4zM12 12a3 3 0 100-6a3 3 0 000 6z"
            />
          </svg>
          {location}
        </div>
      </div>
    </motion.div>
  );
};

Item.displayName = "BeachBarCarouselItem";
