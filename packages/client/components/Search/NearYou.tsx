import { BeachBar } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { genBarThumbnailAlt, halfOrWholeNum } from "@/utils/format";
import { calcDist } from "@/utils/search";
import { useReactiveVar } from "@apollo/client";
import { cx, Flex, FlexProps } from "@hashtag-design-system/components";
import Image from "next/image";
import { useMemo } from "react";
import Next from "../Next";
import styles from "./NearYou.module.scss";

const MAX_SPEED = 80;
const KM_AND_SPEED = [
  { km: 25, speed: 35 },
  { km: 50, speed: 45 },
  { km: 75, speed: 60 },
  { km: 100, speed: MAX_SPEED },
];

type FormattedDisType = { unit: "km" | "min" | "hour"; value: number };

type Props = Pick<Partial<BeachBar>, "name" | "slug" | "thumbnailUrl" | "location"> & {
  loading?: boolean;
};

const CONTAINER_STYLES: FlexProps = {
  alignItems: "center",
  borderRadius: 14,
  minWidth: 248 / 16 + "em",
  height: 64 / 16 + "rem",
  scrollSnapAlign: "start",
  bg: "gray.100",
  color: "gray.900",
};

export const NearYou: React.FC<Props> = ({ name, slug, thumbnailUrl, location, loading = false }) => {
  const _className = cx(styles.container, "cursor-pointer");

  const ipAddress = useReactiveVar(userIpAddr);

  const formattedDis: FormattedDisType | undefined = useMemo(() => {
    let res: FormattedDisType = { unit: "km", value: 0 };
    const { lat, lon } = ipAddress || {};
    if (!lat || !lon || !location || loading) return undefined;
    const { latitude, longitude } = location;
    const disInKm = Math.floor(calcDist({ latitude: lat, longitude: lon }, { latitude, longitude }));
    const speed = KM_AND_SPEED.find(({ km }) => km >= disInKm)?.speed || MAX_SPEED;
    res = { ...res, value: disInKm / speed };
    if (res.value < 1) res = { ...res, unit: "min" };
    else res = { ...res, unit: "hour" };
    return { ...res, value: res.unit === "hour" ? halfOrWholeNum(res.value, 0.6) : +res.value.toFixed(2) };
  }, [ipAddress?.lat, ipAddress?.lon, location, loading]);

  if (loading) return <Flex {...CONTAINER_STYLES} bg="loading" className={_className} />;

  return (
    <Next.Link link={{ href: { pathname: "/beach/[...slug]", query: !slug ? undefined : { slug: [slug] } } }}>
      <Flex {...CONTAINER_STYLES} className={_className}>
        {thumbnailUrl && (
          <Flex justifyContent="center" alignItems="center" flexShrink={0} borderRadius="14px" overflow="hidden">
            <Image
              src={thumbnailUrl}
              alt={genBarThumbnailAlt(name!)}
              width={64}
              height={64}
              objectFit="cover"
              objectPosition="center"
            />
          </Flex>
        )}
        <Flex
          flexDirection="column"
          justifyContent="center"
          ml={4}
          mr={3}
          overflowX="hidden"
          className="text--nowrap w100"
          sx={{
            span: {
              width: "inherit",
              overflowX: "inherit",
              textOverflow: "ellipsis",
            },
          }}
        >
          <span className="semibold">{name}</span>
          {formattedDis && (
            <span className="text--grey">
              {formattedDis.unit === "hour"
                ? formattedDis.value + " " + (formattedDis.value === 1 ? "hour" : "hours")
                : formattedDis.unit === "min"
                ? Math.round(formattedDis.value * 60) + " minutes"
                : formattedDis.unit === "km"
                ? formattedDis.value
                : ""}
              {formattedDis.unit === "hour" || formattedDis.unit === "min" ? " with car" : "km"}
            </span>
          )}
        </Flex>
      </Flex>
    </Next.Link>
  );
};

NearYou.displayName = "SearchNearYou";
