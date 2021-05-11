import { SearchQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { genBarThumbnailAlt, genReviewRating } from "@/utils/format";
import { calcDist } from "@/utils/search";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import BeachBar from "./BeachBar";
import styles from "./Search.module.scss";

const IconsStar = dynamic(() => {
  const prom = import("@/components/Icons/Star").then(mod => mod.Star);
  return prom;
});

export const Search: React.FC<SearchQuery["search"]["results"][number]> = ({
  beachBar: { slug, name, thumbnailUrl, avgRating, location, features, reviews },
}) => {
  const { inputValue, coordinates } = useSearchContext();

  const dis = useMemo(() => calcDist(coordinates, location), [coordinates, location]);
  const ratingInfo = useMemo(() => genReviewRating(avgRating), [avgRating]);
  const locationVal = useMemo(() => {
    let newVal: string[] = [];
    if (inputValue?.city && location.region) newVal.push(location.region.name);
    else if (inputValue?.country && !inputValue.city && !inputValue.region) newVal.push(location.city.name);
    return newVal.join(", ").trimEnd();
  }, []);

  return (
    <Link href={{ pathname: `/beach/${slug}` }}>
      <div className={styles.container + " w100 flex-column-flex-start-stretch"}>
        <div className={styles.imgContainer + " w100"}>
          <Image
            src={thumbnailUrl}
            alt={genBarThumbnailAlt(name)}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <div className={styles.content + " w100 h100 flex-column-space-between-flex-start"}>
          <div className={styles.header + " flex-row-space-between-center"}>
            <div>
              <div className="flex-row-flex-start-flex-end">
                <h5 className="header-6">{name}</h5>
                <div>
                  {locationVal ? locationVal + ", " : ""}
                  <span className="body-14 ">{dis <= 15 ? dis.toFixed(1) : Math.round(dis)}km</span>
                </div>
              </div>
              <div className={styles.reviewsScore + " body-14 text--grey flex-row-flex-start-center"}>
                <IconsStar className={"rating--" + ratingInfo.floored} width={16} height={16} />
                <div>{ratingInfo.val}</div>
                <span>&nbsp;({reviews.length})</span>
              </div>
            </div>
            <BeachBar.Favourite.HeartBox beachBarSlug={slug} />
          </div>
          <BeachBar.Feature.Container style={{ gap: 0 }}>
            {features.map(({ quantity, service: { id, name } }) => (
              <BeachBar.Feature key={id} isSearch quantity={quantity} feature={name} />
            ))}
          </BeachBar.Feature.Container>
        </div>
      </div>
    </Link>
  );
};

Search.displayName = "BeachBarSearch";
