import Next, { NextImgZoomProps } from "@/components/Next";
import { useClassnames } from "@hashtag-design-system/components";
import Image, { ImageProps } from "next/image";
import { useRef } from "react";
import styles from "./Img.module.scss";

type Props = {
  last?: boolean;
  container?: Pick<React.ComponentPropsWithoutRef<"div">, "className" | "style">;
};

export const Img: React.FC<Props & ImageProps & Pick<NextImgZoomProps, "description">> = ({
  container = {},
  last,
  description,
  children,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container + " w100 h100 flex-row-center-center", container);
  const layoutId = useRef(Math.random());

  return (
    <Next.ImgZoom
      id={layoutId.current.toString()}
      preventDefault={last}
      description={description}
      modal={{ className: styles.zoom }}
    >
      <div className={classNames} {...rest}>
        <Image objectFit="cover" objectPosition="center" {...props} />
        {children}
      </div>
    </Next.ImgZoom>
  );
};

Img.displayName = "BeachBarImg";
