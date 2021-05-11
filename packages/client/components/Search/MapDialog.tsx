import Map from "@/components/Map/Map";
import { useSearchContext } from "@/utils/contexts/SearchContext";
import { Dialog } from "@hashtag-design-system/components";
import { SEARCH_ACTIONS } from "./index";
import styles from "./MapDialog.module.scss";

type Props = {};

export const MapDialog: React.FC<Props> = () => {
  // const { map, dispatch } = useSearchContext();

  const handleDismiss = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.className.includes("modal") && target.style.backgroundColor.includes("255, 255, 255")) {
      // dispatch({ type: SEARCH_ACTIONS.TOGGLE_MAP_DIALOG, payload: { bool: false } });
    }
  };

  return (
    <Dialog
      className={styles.dialog}
      // isShown={map.isDialogShown}
      isShown
      onDismiss={e => handleDismiss(e)}
      overlayProps={{ background: { color: "light", alpha: 0.75 } }}
    >
      <Map className={styles.map} />
    </Dialog>
  );
};

MapDialog.displayName = "SearchMapDialog";
