import Icons from "@/components/Icons";
import { useSearchContext } from "@/utils/contexts";
import { useIsDesktop } from "@/utils/hooks";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SEARCH_ACTIONS } from "./reducer";
import styles from "./ShowInMap.module.scss";

const IMG_SIZE = 60;

type Props = {
  formattedInputVal?: string;
};

export const ShowInMap: React.FC<Props> = ({ formattedInputVal }) => {
  const router = useRouter();
  const [imgUrl, setImgUrl] = useState("");
  const isDesktop = useIsDesktop();

  const {
    form: { searchValue },
    coordinates: { latitude, longitude },
    results: { filtered },
    dispatch,
  } = useSearchContext();

  const handleClick = () => {
    if (isDesktop) dispatch({ type: SEARCH_ACTIONS.TOGGLE_MAP_DIALOG, payload: { bool: true } });
    else router.push({ pathname: "/map", query: { redirect: "/search" } });
  };

  const getImgUrl = () =>
    `https://api.mapbox.com/styles/v1/georgekrax/ckmqrvq6w1e6417pd1piwrgwm/static/${longitude},${latitude},7.8,0/${IMG_SIZE}x95?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

  useEffect(() => {
    if (latitude && longitude) setImgUrl(getImgUrl());
  }, [latitude, longitude]);

  return !formattedInputVal ? null : (
    <div className={styles.container}>
      <div className="flex-row-space-between-center" onClick={() => handleClick()}>
        <div className="flex-row-center-center">
          <div className={styles.imgContainer} style={{ height: IMG_SIZE }}>
            {imgUrl && (
              <Image
                src={imgUrl}
                width={IMG_SIZE}
                alt={searchValue + " in map"}
                height={IMG_SIZE}
                objectFit="cover"
                objectPosition="center"
              />
          )}
          </div>
          <div className={styles.content + " flex-column-center-flex-start"}>
            <div className="semibold">Show {formattedInputVal} in Map</div>
            <div className="text--grey body-12">
              We found <span className="bold">{filtered.length}</span> #beach_bar
              {filtered.length > 1 || filtered.length === 0 ? "s" : ""}
            </div>
          </div>
        </div>
        <Icons.Chevron.Right />
      </div>
      <div className={styles.attribution + " body-12"}>
        ©{" "}
        <a href="https://www.mapbox.com/about/maps/" className="text--grey" rel="noopener" target="_blank">
          Mapbox
        </a>{" "}
        ©{" "}
        <a href="http://www.openstreetmap.org/copyright" className="text--grey" rel="noopener" target="_blank">
          OpenStreetMap
        </a>
      </div>
    </div>
  );
};
