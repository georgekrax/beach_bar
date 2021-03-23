import Icons from "@/components/Icons";
import { MOTION } from "@/config/index";
import { useSearchContext } from "@/utils/contexts";
import { notify } from "@/utils/notify";
import { HTMLMotionProps, motion } from "framer-motion";
import { SEARCH_ACTIONS } from "../reducer";
import styles from "./CurrentLocation.module.scss";

type Props = {};

type FProps = Props & HTMLMotionProps<"div">;

export const CurrentLocation: React.FC<FProps> = ({ ...props }) => {
  const { dispatch } = useSearchContext();

  const handleLocation = async (success: boolean, pos?: GeolocationPosition) => {
    if (!success || !pos)
      notify("error", "Please enable location permissions for this feature to work.", { somethingWentWrong: false });
    else {
      const {
        coords: { longitude, latitude },
      } = pos;
      const res = await fetch(
        process.env.NEXT_PUBLIC_MAPBOX_API_URL +
          `/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&country=gr&types=country%2Cregion%2Cplace%2Caddress`
      );
      const data = await res.json();
      dispatch({ type: SEARCH_ACTIONS.HANDLE_CURRENT_LOCATION, payload: { searchValue: data.features[0]?.text || "" } });
    }
  };

  return (
    <motion.div
      className={styles.container + " flex-row-flex-start-flex-start"}
      // initial="initial"
      variants={MOTION.bounceAnimation}
      {...props}
    >
      <Icons.Navigation width={18} height={18} />
      <div
        onClick={() => {
          if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              pos => handleLocation(true, pos),
              () => handleLocation(false),
              { enableHighAccuracy: true }
            );
          } else notify("error", "Unfortunately, geolocation is not supported by this browser.");
        }}
      >
        Current location
      </div>
    </motion.div>
  );
};

CurrentLocation.displayName = "SearchFormCurrentLocation";
