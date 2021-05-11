<<<<<<< HEAD
import BeachBar from "@/components/BeachBar";
import { genBarThumbnailAlt } from "@/utils/format";
import { Dialog } from "@hashtag-design-system/components";
import Image from "next/image";
import Link from "next/link";
import { MapReducerInitialStateType } from "./reducer";
import styles from "./SelectedDetails.module.scss";

export const SelectedDetails: React.FC<MapReducerInitialStateType["selectedBeachBar"]> = ({
  name,
  slug,
  description,
  thumbnailUrl,
}) => {
  return (
    <Dialog.Content>
      <div className="w100 flex-column-space-between-flex-start">
        <div className="w100 flex-row-flex-start-stretch">
          <div className={styles.imgContainer}>
            <Image
              src={thumbnailUrl}
              alt={genBarThumbnailAlt(name)}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          <div className={styles.content + " flex-column-inherit-flex-start"}>
            <BeachBar.Header as="h4">{name}</BeachBar.Header>
            <p>{description}</p>
          </div>
        </div>
        {/* <div className={styles.featuresContainer + " flex-row-flex-start-center"}>
          {range(0, 2).map(num => (
            <div key={num} className={styles.container + " flex-row-center-center"}>
              <Icons.Map width={40} height={40} />
            </div>
          ))}
        </div> */}
        <Link href={{ pathname: "/beach/[slug]", query: { slug } }} passHref>
          <a className={styles.btn + " btn iw100"}>Go to #beach_bar</a>
        </Link>
      </div>
    </Dialog.Content>
  );
};

SelectedDetails.displayName = "MapSelectedDetails";
=======
import BeachBar from "@/components/BeachBar";
import { genBarThumbnailAlt } from "@/utils/format";
import { Dialog } from "@hashtag-design-system/components";
import Image from "next/image";
import Link from "next/link";
import { MapReducerInitialStateType } from "./reducer";
import styles from "./SelectedDetails.module.scss";

export const SelectedDetails: React.FC<MapReducerInitialStateType["selectedBeachBar"]> = ({
  name,
  slug,
  description,
  thumbnailUrl,
}) => {
  return (
    <Dialog.Content>
      <div className="w100 flex-column-space-between-flex-start">
        <div className="w100 flex-row-flex-start-stretch">
          <div className={styles.imgContainer}>
            <Image
              src={thumbnailUrl}
              alt={genBarThumbnailAlt(name)}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          <div className={styles.content + " flex-column-inherit-flex-start"}>
            <BeachBar.Header as="h4">{name}</BeachBar.Header>
            <p>{description}</p>
          </div>
        </div>
        {/* <div className={styles.featuresContainer + " flex-row-flex-start-center"}>
          {range(0, 2).map(num => (
            <div key={num} className={styles.container + " flex-row-center-center"}>
              <Icons.Map width={40} height={40} />
            </div>
          ))}
        </div> */}
        <Link href={{ pathname: "/beach/[slug]", query: { slug } }} passHref>
          <a className={styles.btn + " btn iw100"}>Go to #beach_bar</a>
        </Link>
      </div>
    </Dialog.Content>
  );
};

SelectedDetails.displayName = "MapSelectedDetails";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
