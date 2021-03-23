import { BeachBarDetails } from "./BeachBarDetails";
import { Marker } from "./Marker";
import { Suggestions } from "./Suggestions";

type SubComponents = {
  Marker: typeof Marker;
  Suggestions: typeof Suggestions;
  BeachBarDetails: typeof BeachBarDetails;
};

const MapPage: React.FC & SubComponents = () => {
  return <></>;
};

MapPage.Marker = Marker;
MapPage.Suggestions = Suggestions;
MapPage.BeachBarDetails = BeachBarDetails;

MapPage.displayName = "MapPage";

export default MapPage;

export * from "./__helpers__";
