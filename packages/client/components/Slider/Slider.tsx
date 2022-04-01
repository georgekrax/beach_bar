import React from "react"
import { Double } from "./Double";

type SubComponents = {
  Double: typeof Double;
}

export type Props = {

}

const Slider: React.FC<Props> & SubComponents = () => {
  return (
    <div>

    </div>
  );
};

Slider.displayName = "Slider"

Slider.Double = Double;

export default Slider;