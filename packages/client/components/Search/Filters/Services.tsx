<<<<<<< HEAD
import Icons from "@/components/Icons";
import Search, { SearchFiltersServiceItemProps } from "@/components/Search";
import { COMMON_CONFIG } from "@beach_bar/common";
import styles from "./Services.module.scss";

const { SERVICES } = COMMON_CONFIG.DATA.searchFilters;
const SERVICES_ARR = Object.values(SERVICES);

type Props = {
  features?: typeof SERVICES_ARR;
  last?: boolean;
  item?: Partial<SearchFiltersServiceItemProps>;
};

export const Services: React.FC<Props & React.ComponentPropsWithoutRef<"div">> = ({
  features = SERVICES_ARR,
  last = true,
  item,
  ...props
}) => {
  return (
    <div className={styles.container + " no-scrollbar flex-row-flex-start-flex-start"} {...props}>
      {features.map(({ publicId, name }) => {
        let icon: React.ReactNode;
        switch (publicId) {
          case SERVICES.SWIMMING_POOL.publicId:
            icon = <Icons.SwimmingPool />;
            break;
          case SERVICES.FOOD_SNACKS.publicId:
            icon = <Icons.Snacks.Filled />;
            break;
          case SERVICES.FREE_PARKING.publicId:
            icon = <Icons.ParkingSign.Filled />;
            break;
          case SERVICES.WATER_SLIDES.publicId:
            icon = <Icons.WaterSlides.Filled />;
            break;
          case SERVICES.SEA_INFLATABLE_TOYS.publicId:
            icon = <Icons.BeachBall.Filled />;
            break;
          case SERVICES.PRIVATE_BAY.publicId:
            icon = <Icons.Beach />;
            break;
        }
        return <Search.Filters.ServiceItem id={publicId} feature={name} icon={icon} {...item} />;
      })}
      {last && <div></div>}
    </div>
  );
};

Services.displayName = "SearchFiltersServices";
=======
import Icons from "@/components/Icons";
import Search, { SearchFiltersServiceItemProps } from "@/components/Search";
import { COMMON_CONFIG } from "@beach_bar/common";
import styles from "./Services.module.scss";

const { SERVICES } = COMMON_CONFIG.DATA.searchFilters;
const SERVICES_ARR = Object.values(SERVICES);

type Props = {
  features?: typeof SERVICES_ARR;
  last?: boolean;
  item?: Partial<SearchFiltersServiceItemProps>;
};

export const Services: React.FC<Props & React.ComponentPropsWithoutRef<"div">> = ({
  features = SERVICES_ARR,
  last = true,
  item,
  ...props
}) => {
  return (
    <div className={styles.container + " no-scrollbar flex-row-flex-start-flex-start"} {...props}>
      {features.map(({ publicId, name }) => {
        let icon: React.ReactNode;
        switch (publicId) {
          case SERVICES.SWIMMING_POOL.publicId:
            icon = <Icons.SwimmingPool />;
            break;
          case SERVICES.FOOD_SNACKS.publicId:
            icon = <Icons.Snacks.Filled />;
            break;
          case SERVICES.FREE_PARKING.publicId:
            icon = <Icons.ParkingSign.Filled />;
            break;
          case SERVICES.WATER_SLIDES.publicId:
            icon = <Icons.WaterSlides.Filled />;
            break;
          case SERVICES.SEA_INFLATABLE_TOYS.publicId:
            icon = <Icons.BeachBall.Filled />;
            break;
          case SERVICES.PRIVATE_BAY.publicId:
            icon = <Icons.Beach />;
            break;
        }
        return <Search.Filters.ServiceItem id={publicId} feature={name} icon={icon} {...item} />;
      })}
      {last && <div></div>}
    </div>
  );
};

Services.displayName = "SearchFiltersServices";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
