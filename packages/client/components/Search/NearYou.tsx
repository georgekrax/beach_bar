import { BeachBar } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { genBarThumbnailAlt, halfOrWholeNum } from "@/utils/format";
import { calcDist } from "@/utils/search";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import styles from "./NearYou.module.scss";

const MAX_SPEED = 80;
const KM_AND_SPEED = [
  {
    km: 25,
    speed: 35,
  },
  {
    km: 50,
    speed: 45,
  },
  {
    km: 75,
    speed: 60,
  },
  {
    km: 100,
    speed: MAX_SPEED,
  },
];

type FormattedDisType = { unit: "km" | "min" | "hour"; value: number };

type Props = {};

export const NearYou: React.FC<
  Props & Pick<BeachBar, "name" | "slug" | "thumbnailUrl"> & Pick<BeachBar["location"], "latitude" | "longitude">
> = ({ name, slug, thumbnailUrl, latitude, longitude }) => {
  const formattedDis: FormattedDisType | undefined = useMemo(() => {
    let res: FormattedDisType = { unit: "km", value: 0 };
    const { lat, lon } = userIpAddr();
    if (!lat || !lon) return undefined;
    const disInKm = Math.floor(calcDist({ latitude: lat, longitude: lon }, { latitude, longitude }));
    const speed = KM_AND_SPEED.find(({ km }) => km >= disInKm)?.speed || MAX_SPEED;
    res = { ...res, value: disInKm / speed };
    if (res.value < 1) res = { ...res, unit: "min" };
    else res = { ...res, unit: "hour" };
    return {
      ...res,
      value: res.unit === "hour" ? halfOrWholeNum(res.value, 0.6) : parseFloat(res.value.toFixed(2)),
    };
  }, [userIpAddr(), latitude, longitude]);

  return (
    <Link href={{ pathname: "/beach/[slug]", query: { slug } }}>
      <div className={styles.container + " flex-row-flex-start-center"}>
        <div className={styles.imgContainer + " flex-row-center-center"}>
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={genBarThumbnailAlt(name)}
              width={56}
              height={56}
              objectFit="cover"
              objectPosition="center"
            />
          )}
        </div>
        <div className="flex-column-center-flex-start">
          <div className="semibold">{name}</div>
          {formattedDis && (
            <div>
              {formattedDis.unit === "hour"
                ? formattedDis.value + " hours"
                : formattedDis.unit === "min"
                ? Math.round(formattedDis.value * 60) + " minutes"
                : formattedDis.unit === "km"
                ? formattedDis.value
                : ""}
              {formattedDis.unit === "hour" || formattedDis.unit === "min" ? " with car" : "km"}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

NearYou.displayName = "SearchNearYou";
