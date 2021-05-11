<<<<<<< HEAD
import BeachBarComp, { BeachBarNameAndLocationProps } from "@/components/BeachBar";
import { BeachBar as GraphQLBeachBar } from "@/graphql/generated";
import { genBarThumbnailAlt } from "@/utils/format";
import { useClassnames } from "@hashtag-design-system/components";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./BeachBar.module.scss";

type Props = {
  showFavourite?: boolean;
  navigateToBar?: boolean;
};

export const BeachBar: React.FC<
  Props &
    Pick<GraphQLBeachBar, "name" | "slug" | "thumbnailUrl" | "formattedLocation"> &
    Pick<React.ComponentPropsWithoutRef<"div">, "className" | "style" | "onClick"> &
    Pick<BeachBarNameAndLocationProps, "showLocation" | "showLocationIcon">
> = ({
  name,
  slug,
  thumbnailUrl,
  formattedLocation,
  showFavourite = true,
  showLocation = true,
  showLocationIcon,
  navigateToBar = true,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container, props);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigateToBar) e.preventDefault();
  };

  return (
    <Link href={{ pathname: "/beach/[slug]", query: { slug, redirect: "/" } }} passHref>
      <a onClick={e => handleClick(e)}>
        <div className={classNames} {...rest}>
          <Image
            src={thumbnailUrl}
            alt={genBarThumbnailAlt(name)}
            objectFit="cover"
            objectPosition="center bottom"
            layout="fill"
          />
          {showFavourite && (
            <div className={styles.favourite + " zi--md"}>
              <BeachBarComp.Favourite.HeartBox beachBarSlug={slug} />
            </div>
          )}
          <BeachBarComp.NameAndLocation
            className={styles.content}
            showLocation={showLocation}
            showLocationIcon={showLocationIcon}
            name={name}
            formattedLocation={formattedLocation}
          />
        </div>
      </a>
    </Link>
  );
};

BeachBar.displayName = "CarouselBeachBar";
=======
import BeachBarComp, { BeachBarNameAndLocationProps } from "@/components/BeachBar";
import { BeachBar as GraphQLBeachBar } from "@/graphql/generated";
import { genBarThumbnailAlt } from "@/utils/format";
import { useClassnames } from "@hashtag-design-system/components";
import { FavouriteHeartBox } from "@/components/BeachBar/Favourite/HeartBox";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./BeachBar.module.scss";

type Props = {
  showFavourite?: boolean;
  navigateToBar?: boolean;
};

export const BeachBar: React.FC<
  Props &
    Pick<GraphQLBeachBar, "name" | "slug" | "thumbnailUrl" | "formattedLocation"> &
    Pick<React.ComponentPropsWithoutRef<"div">, "className" | "style" | "onClick"> &
    Pick<BeachBarNameAndLocationProps, "showLocation" | "showLocationIcon">
> = ({
  name,
  slug,
  thumbnailUrl,
  formattedLocation,
  showFavourite = true,
  showLocation = true,
  showLocationIcon,
  navigateToBar = true,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container, props);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigateToBar) e.preventDefault();
  };

  return (
    <Link href={{ pathname: "/beach/[slug]", query: { slug, redirect: "/" } }} passHref>
      <a onClick={e => handleClick(e)}>
        <div className={classNames} {...rest}>
          <Image
            src={thumbnailUrl}
            alt={genBarThumbnailAlt(name)}
            objectFit="cover"
            objectPosition="center bottom"
            layout="fill"
          />
          {showFavourite && (
            <div className={styles.favourite + " zi--md"}>
              <FavouriteHeartBox beachBarSlug={slug} />
            </div>
          )}
          <BeachBarComp.NameAndLocation
            className={styles.content}
            showLocation={showLocation}
            showLocationIcon={showLocationIcon}
            name={name}
            formattedLocation={formattedLocation}
          />
        </div>
      </a>
    </Link>
  );
};

BeachBar.displayName = "CarouselBeachBar";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
