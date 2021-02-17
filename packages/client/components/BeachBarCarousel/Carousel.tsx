import { useEffect, useState } from "react";
import { CarouselItemOptions } from "./index";
import { Item } from "./Item";
import Slider from "./Slider";

type Props = {
  slides: CarouselItemOptions[];
  onChange?: (position: number) => void;
};

const Carousel: React.FC<Props> = ({ slides, onChange }) => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (onChange) onChange(position);
  }, []);

  return (
    <>
    <button onClick={() => {

    }}>Click me</button>
    <Slider setPosition={setPosition}>
      {slides.map((props, i) => {
        return <Item  key={i} idx={i} active={i === position} {...props} />;
      })}
      <div className="spacer" />
    </Slider>
    </>
  );
};

Carousel.displayName = "Carousel";

export default Carousel;
