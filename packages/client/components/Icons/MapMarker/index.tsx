import { DotCropped } from "./DotCropped";
import { Dot } from "./Dot";

type SubComponents = {
  Dot: typeof Dot;
  DotCropped: typeof DotCropped;
};

const MapMarker: React.FC & SubComponents = () => {
  return <></>;
};

MapMarker.Dot = Dot;
MapMarker.DotCropped = DotCropped;

MapMarker.displayName = "MapMarkerIcon";

export default MapMarker;
