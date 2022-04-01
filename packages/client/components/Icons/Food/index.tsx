import { Cutlery } from "./Cutlery";
import { Clochebell } from "./Clochebell";

type SubComponents = {
  Cutlery: typeof Cutlery;
  Clochebell: typeof Clochebell;
}

type Props = {};

const Food: React.FC<Props> & SubComponents = () => {
  return <></>;
};

Food.displayName = "FoodIcon";

Food.Cutlery = Cutlery;
Food.Clochebell = Clochebell;

export default Food;