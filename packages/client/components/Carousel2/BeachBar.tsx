import BeachBarComp, { BeachBarNameAndLocationProps } from "@/components/BeachBar";
import { FavouriteHeartBox } from "@/components/BeachBar/Favourite/HeartBox";
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
    Pick<GraphQLBeachBar, "name" | "slug" | "thumbnailUrl" | "location"> &
    Pick<React.ComponentPropsWithoutRef<"div">, "className" | "style" | "onClick"> &
    Pick<BeachBarNameAndLocationProps, "showLocation" | "showLocationIcon">
> = ({
  name,
  slug,
  thumbnailUrl,
  location,
  showFavourite = true,
  showLocation = true,
  showLocationIcon,
  navigateToBar = true,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container + " cursor--pointer", props);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigateToBar) e.preventDefault();
  };

  return (
    <Link href={{ pathname: "/beach/[...slug]", query: { slug: [slug], redirect: "/" } }} passHref>
      <a onClick={e => handleClick(e)}>
        <div className={classNames} {...rest}>
          <Image
            src={thumbnailUrl}
            alt={genBarThumbnailAlt(name)}
            objectFit="cover"
            objectPosition="center bottom"
            layout="fill"
          />
          {/* {showFavourite && (
            <div className={styles.favourite + " zi--md"} onClick={e => e.preventDefault()}>
              <FavouriteHeartBox beachBarSlug={slug} />
            </div>
          )}
          <BeachBarComp.NameAndLocation
            className={styles.content}
            showLocation={showLocation}
            showLocationIcon={showLocationIcon}
            name={name}
            formattedLocation={formattedLocation}
          /> */}
        </div>
      </a>
    </Link>
  );
};
