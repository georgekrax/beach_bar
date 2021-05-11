import Icons from "@/components/Icons";
import { COMMON_CONFIG } from "@beach_bar/common";
import React, { useMemo } from "react";
import { Container } from "./Container";
import styles from "./Feature.module.scss";

const { SERVICES } = COMMON_CONFIG.DATA.searchFilters;
const { PRODUCT_COMPONENTS } = COMMON_CONFIG.DATA;

type SubComponents = {
  Container: typeof Container;
};

type Props = {
  feature?: string;
  iconId?: string;
  quantity?: number;
  isChecked?: boolean;
  isSearch?: boolean;
};

// @ts-expect-error
export const Feature: React.NamedExoticComponent<Props & Pick<React.ComponentPropsWithoutRef<"div">, "onClick">> &
  SubComponents = React.memo(({ feature, quantity, iconId, isChecked = false, isSearch = false, children, ...props }) => {
  const showQuantity = useMemo(() => quantity && quantity > 1, [quantity]);
  const icon = useMemo(() => {
    switch (iconId) {
      case SERVICES.SWIMMING_POOL.publicId:
        return <Icons.SwimmingPool.Colored />;
      case SERVICES.FOOD_SNACKS.publicId:
        return <Icons.Snacks.Colored />;
      case SERVICES.FREE_PARKING.publicId:
        return <Icons.ParkingSign.Colored />;
      case SERVICES.WATER_SLIDES.publicId:
        return <Icons.WaterSlides.Filled />;
      case SERVICES.SEA_INFLATABLE_TOYS.publicId:
        return <Icons.BeachBall.Filled />;
      case SERVICES.PRIVATE_BAY.publicId:
        return <Icons.Beach />;
      case PRODUCT_COMPONENTS.CHAIR.publicId:
        return <Icons.Chair.Colored />;
      case PRODUCT_COMPONENTS.SUNBED.publicId:
        return <Icons.Sunbed.Colored />;
      case PRODUCT_COMPONENTS.SUNBED_WITH_MATTRESS.publicId:
        return <Icons.Sunbed.WithMattress.Colored />;
      case PRODUCT_COMPONENTS.UMBRELLA.publicId:
        return <Icons.BeachUmbrella.Colored />;

      default:
        return null;
    }
  }, [iconId]);

  return (
    <div className={styles.container + (isChecked ? " " + styles.checked : "") + (isSearch ? " " + styles.search : "") + " flex-row-center-center"} {...props}>
      {icon}
      {children}
      {(feature || showQuantity) && (
        <div className="flex-row-center-center">
          {showQuantity && (
            <div className={styles.quantity + " body-14 flex-row-center-flex-end"}>
              <div className="d--ib semibold">{quantity}</div>
              <span className={styles.quantityX + " body-12 semibold"}>x</span>
            </div>
          )}
          {showQuantity && feature && <div className={styles.bull}>&bull;</div>}
          <div className={styles.feature}>{feature}</div>
          {isSearch && <div className={styles.divider + " border-radius--lg"}></div>}
        </div>
      )}
    </div>
  );
});

Feature.Container = Container;

Feature.displayName = "BeachBarFeature";
