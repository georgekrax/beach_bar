import BeachBar from "@/components/BeachBar";
import { GetAllBeachBarsQuery } from "../../AuthForm/node_modules/@/graphql/generated";
import { Button, Dialog } from "@hashtag-design-system/components";
import Image from "next/image";
import styles from "./BeachBarDetails.module.scss";

type FProps = Pick<GetAllBeachBarsQuery["getAllBeachBars"][number], "name" | "thumbnailUrl" | "description">;

export const BeachBarDetails: React.FC<FProps> = ({ name, description, thumbnailUrl }) => {
  return (
    <Dialog.Content>
      <div className="w-100 flex-column-space-between-flex-start">
        <div className="w-100 flex-row-flex-start-stretch">
          <div className={styles.imgContainer}>
            <Image src={thumbnailUrl} layout="fill" objectFit="cover" objectPosition="center" />
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
        <Button className={styles.btn + " iw-100"}>Go to #beach_bar</Button>
      </div>
    </Dialog.Content>
  );
};

BeachBarDetails.displayName = "MapBeachBarDetails";
