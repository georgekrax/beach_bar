import BeachBarComp, { BeachBarNameAndLocationProps } from "@/components/BeachBar";
import { BeachBar as GraphQLBeachBar } from "@/graphql/generated";
import { genBarThumbnailAlt } from "@/utils/format";
import { Box, BoxProps, cx } from "@hashtag-design-system/components";
import Image from "next/image";
import Link from "next/link";

type Props = Pick<GraphQLBeachBar, "name" | "slug" | "thumbnailUrl"> &
  Pick<BeachBarNameAndLocationProps, "location" | "hasLocation" | "hasLocationIcon"> &
  BoxProps & {
    hasFavorite?: boolean;
    navigateToBar?: boolean;
  };

export const BeachBar: React.FC<Props> = ({
  hasFavorite = true,
  navigateToBar = true,
  hasLocation = true,
  hasLocationIcon,
  location,
  name,
  slug,
  thumbnailUrl,
  ...props
}) => {
  const _className = cx("cursor--pointer", props.className);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigateToBar) e.preventDefault();
  };

  return (
    <Link href={{ pathname: "/beach/[...slug]", query: { slug: [slug], redirect: "/" } }} passHref>
      <a onClick={handleClick}>
        <Box
          position="relative"
          width="min(60vw, 200px)"
          height="min(60vw, 260px)"
          borderRadius="regular"
          overflow="hidden"
          {...props}
          _after={{
            content: '""',
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            bottom: 0,
            zIndex: "least",
            pointerEvents: "none",
            bgGradient: "linear-gradient(to top, blackAlpha.400 20%, transparent 40%)",
          }}
          className={_className}
        >
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={genBarThumbnailAlt(name)}
              objectFit="cover"
              objectPosition="center center"
              layout="fill"
            />
          )}
          {hasFavorite && (
            <Box
              position="absolute"
              top="0"
              right="0"
              border="none"
              padding="5%"
              zIndex="md"
              sx={{ "& > div": { transform: "scale(0.8)" } }}
              onClick={e => e.preventDefault()}
            >
              <BeachBarComp.Favourite.HeartBox beachBarSlug={slug} />
            </Box>
          )}
          <BeachBarComp.NameAndLocation
            position="absolute"
            hasLocation={hasLocation}
            hasLocationIcon={hasLocationIcon}
            name={name}
            location={location}
            left="50%"
            bottom="5%"
            width="86%"
            transform="translateX(-50%)"
            overflow="hidden"
            zIndex={2}
            sx={{ "& > *": { color: "white" }, "div path": { stroke: "none", fill: "white" } }}
          />
        </Box>
      </a>
    </Link>
  );
};

BeachBar.displayName = "CarouselBeachBar";
