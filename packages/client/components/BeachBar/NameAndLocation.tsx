import { useClassnames } from "@hashtag-design-system/components";
import { memo, useMemo } from "react";
import Icons from "../Icons";
import BeachBar from "./index";

type Props = {
  name: string;
  city?: string;
  region?: string;
};

type FProps = Props & React.ComponentPropsWithoutRef<"div">;

export const NameAndLocation: React.FC<FProps> = memo(({ name, city, region, ...props }) => {
  const [classNames, rest] = useClassnames("flex-column-center-flex-start beach_bar__name-and-location", props);
  const location = useMemo(() => `${city}${region ? `, ${region}` : ""}`, [city, region]);

  return (
    <div className={classNames} {...rest}>
      <BeachBar.Header as="h6">{name}</BeachBar.Header>
      {(city || region) && (
        <div className="flex-row-center-center">
          <Icons.MapMarker.Dot.Filled width={16} height={16} />
          <span style={{ marginBottom: "0.15em" }}>{location}</span>
        </div>
      )}
    </div>
  );
});

NameAndLocation.displayName = "BeachBarNameAndLocation";
