import Next, { NextImgZoomProps } from "@/components/Next";
import { Flex, FlexProps } from "@hashtag-design-system/components";
import Image, { ImageProps } from "next/image";

type Props = {
  isLast?: boolean;
  container?: FlexProps;
  zoom?: Partial<NextImgZoomProps>;
};

export const Img: React.FC<Props & ImageProps & Pick<NextImgZoomProps, "description">> = ({
  container,
  isLast,
  description,
  zoom,
  children,
  ...props
}) => {
  return (
    <Next.ImgZoom isPreventedDefault={isLast} description={description} {...zoom}>
      <Flex
        justify="center"
        align="center"
        flex={1}
        position="relative"
        width="100%"
        height="100%"
        overflow="hidden"
        borderRadius="regular"
        transitionProperty="common"
        transitionDuration="normal"
        transitionTimingFunction="ease-out"
        {...container}
        _hover={{ opacity: 0.75, transform: "scale(0.99)", ...container?._hover }}
      >
        <Image objectFit="cover" objectPosition="center" {...props} />
        {children}
      </Flex>
    </Next.ImgZoom>
  );
};

Img.displayName = "BeachBarImg";
