import Icons from "@/components/Icons";
import { SearchFiltersServiceItemProps } from "@/components/Search";
import { ServiceItem } from "@/components/Search/Filters/ServiceItem";
import { COMMON_CONFIG, TABLES } from "@beach_bar/common";
import { Box, cx, Flex } from "@hashtag-design-system/components";
import { useMemo } from "react";

const { SERVICES } = COMMON_CONFIG.DATA.searchFilters;
const { BEACH_BAR_SERVICE, BEACH_BAR_SERVICE_OBJ } = TABLES;

type Props = {
  features?: typeof BEACH_BAR_SERVICE;
  last?: boolean;
  atDashboard?: boolean;
  item?: Partial<SearchFiltersServiceItemProps>;
};

export const Services: React.FC<Props & React.ComponentPropsWithoutRef<"div">> = ({
  item,
  last = true,
  features = BEACH_BAR_SERVICE,
  atDashboard = false,
  ...props
}) => {
  const _className = cx("no-scrollbar", props.className);

  const mappedFeatures = useMemo(() => {
    return features.map(({ publicId, ...rest }) => {
      let icon: React.ReactNode;
      switch (publicId) {
        case BEACH_BAR_SERVICE_OBJ.SWIMMING_POOL.publicId:
          icon = <Icons.SwimmingPool />;
          break;
        case BEACH_BAR_SERVICE_OBJ.FOOD_SNACKS.publicId:
          icon = <Icons.Snacks.Filled />;
          break;
        case BEACH_BAR_SERVICE_OBJ.FREE_PARKING.publicId:
          icon = <Icons.ParkingSign.Filled />;
          break;
        case BEACH_BAR_SERVICE_OBJ.WATER_SLIDES.publicId:
          icon = <Icons.WaterSlides.Filled />;
          break;
        case BEACH_BAR_SERVICE_OBJ.SEA_INFLATABLE_TOYS.publicId:
          icon = <Icons.BeachBall.Filled />;
          break;
        case BEACH_BAR_SERVICE_OBJ.PRIVATE_BAY.publicId:
          icon = <Icons.Beach />;
          break;
      }
      return { ...rest, publicId, icon };
    });
  }, [features.length]);

  return (
    <Flex
      wrap={atDashboard ? "wrap" : undefined}
      gap={5}
      width=""
      pb={3}
      overflowX="auto"
      {...props}
      className={_className}
    >
      {mappedFeatures.map(({ id, name, publicId, ...rest }) => (
        <ServiceItem key={publicId} feature={name} id={atDashboard ? id.toString() : publicId} {...rest} {...item} />
      ))}
      {last && <Box flexShrink={0} alignSelf="stretch" display={{ md: "none" }} />}
    </Flex>
  );
};

Services.displayName = "SearchFiltersServices";
