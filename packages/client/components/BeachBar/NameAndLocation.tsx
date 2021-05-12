import Icons from "@/components/Icons";
import { BeachBar as GraphQLBeachBar } from "@/graphql/generated";
import { useClassnames } from "@hashtag-design-system/components";
import { memo, useMemo } from "react";
import BeachBar from "./index";

export type Props = {
  name: string;
  city?: string;
  region?: string;
  showLocation?: boolean;
  showLocationIcon?: boolean;
};

export const NameAndLocation: React.FC<
  Props & React.ComponentPropsWithoutRef<"div"> & Pick<GraphQLBeachBar, "formattedLocation">
> = memo(({ name, city, region, formattedLocation, showLocation = true, showLocationIcon = true, ...props }) => {
  const [classNames, rest] = useClassnames("flex-column-center-flex-start beach_bar__name-and-location", props);
  const location = useMemo(
    () =>
      formattedLocation
        ? formattedLocation.split(", ").slice(0, -1).join(", ")
        : `${city}${region ? `, ${region}` : ""}`,
    [formattedLocation, city, region]
  );

  return (
    <div className={classNames} {...rest}>
      <BeachBar.Header as="h4" className="header-6">
        {name}
      </BeachBar.Header>
      {location && showLocation && (
        <div className="flex-row-center-center">
          {showLocationIcon && <Icons.MapMarker.Dot.Filled width={16} height={16} style={{ marginRight: "0.25em" }} />}
          <span className="body-14" style={{ marginBottom: "0.15em" }}>
            {location}
          </span>
        </div>
      )}
    </div>
  );
});

NameAndLocation.displayName = "BeachBarNameAndLocation";
