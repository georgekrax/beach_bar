import { genReviewRating } from "@/utils/format";
import { useMemo } from "react";
import styles from "./RatingBox.module.scss";

type Props = {
  rating: number;
};

export const RatingBox: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">> = ({
  rating,
  className,
}) => {
  const { floored, val } = useMemo(() => genReviewRating(rating), [rating]);

  return (
    <div
      className={styles.box + " " + ` rating--${floored} flex-row-center-center` + (className ? " " + className : "")}
    >
      {val}
    </div>
  );
};

RatingBox.displayName = "BeachBarReviewRatingBox";
