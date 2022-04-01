import { Img } from "@/components/BeachBar/Img";
import Next from "@/components/Next";
import { AspectRatio, Flex } from "@hashtag-design-system/components";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { BeachBarProps } from "../index";

export type Props = {
  maxImgs: number;
};

export const Images: React.FC<
  Props & Pick<NonNullable<BeachBarProps>, "name" | "slug" | "thumbnailUrl" | "imgUrls">
> = ({ name, slug, thumbnailUrl, imgUrls, maxImgs }) => {
  const { query } = useRouter();
  const imgsArr = useMemo(() => imgUrls.slice(0, maxImgs), [imgUrls, maxImgs]);

  return (
    <Flex align="stretch" gap={3}>
      {thumbnailUrl && (
        <AspectRatio ratio={1} minWidth={{ base: "60%", sm: "36%" }}>
          <Img src={thumbnailUrl} priority layout="fill" quality={100} description={name + " thumbnail image"} />
        </AspectRatio>
      )}
      {imgUrls.length > 0 && (
        <Flex
          flexDir={{ base: "column", sm: "row" }}
          align="inherit"
          gap="inherit"
          wrap={{ sm: "wrap" }}
          width="100%"
          minHeight={{ base: "35vh", sm: "auto" }}
        >
          {imgsArr.map(({ id, imgUrl, description }, i) => {
            const isLast = i === imgsArr.length - 1;
            return (
              <Img
                key={id}
                src={imgUrl}
                alt={description ? description + " - " + name : name.trimEnd() + "'s image"}
                layout="fill"
                isLast={isLast}
                description={description}
                zoom={{ position: "relative", flex: "1 1 35%", maxWidth: imgsArr.length > 1 ? "66%" : undefined }}
                container={isLast ? { _hover: { transform: "none", cursor: "pointer" } } : undefined}
              >
                {isLast && imgUrls.length > maxImgs && (
                  <Next.Link
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    fontSize="2xl"
                    fontWeight="bold"
                    color="white"
                    bg="blackAlpha.600"
                    transitionDuration="slow"
                    _hover={{ opacity: 1, transform: "scale(1.2)" }}
                    link={{
                      replace: true,
                      shallow: true,
                      passHref: true,
                      href: { pathname: "/beach/[...slug]", query: { ...query, slug: [slug, "photos"] } },
                    }}
                  >
                    +{imgUrls.length - maxImgs}
                  </Next.Link>
                )}
              </Img>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};

Images.displayName = "BeachBarPageImages";
