import Icons from "@/components/Icons";
import { BeachBar as GraphQLBeachBar, BeachBarLocation as GraphQLBeachBarLocation } from "@/graphql/generated";
import { Flex, FlexProps, Text } from "@hashtag-design-system/components";
import { memo } from "react";
import { Header } from "./Header";

export type Props = FlexProps &
  Pick<GraphQLBeachBar, "name"> & {
    // name: string;
    // city?: string;
    // region?: string;
    location: Pick<GraphQLBeachBarLocation, "formattedLocation">;
    hasLocation?: boolean;
    hasLocationIcon?: boolean;
  };

export const NameAndLocation: React.FC<Props> = memo(
  ({ name, location, hasLocation = true, hasLocationIcon = true, ...props }) => {
    return (
      <Flex flexDirection="column" justifyContent="center" alignItems="flex-start" {...props}>
        <Header as="h4" className="header-6">
          {name}
        </Header>
        {location && hasLocation && (
          <div className="flex-row-center-center">
            {hasLocationIcon && <Icons.MapMarker.Dot.Filled width={16} height={16} style={{ marginRight: "0.25em" }} />}
            <Text as="span" mb="0.15em" className="body-14">
              {location.formattedLocation}
            </Text>
          </div>
        )}
      </Flex>
    );
  }
);

NameAndLocation.displayName = "BeachBarNameAndLocation";
