import { btnFilterChecked } from "@/utils/styles";
import { TABLES } from "@beach_bar/common";
import { Box, ComponentWithAs, Flex, FlexProps, Text } from "@hashtag-design-system/components";
import Icon, { IconProps } from "@hashtag-design-system/icons";
import React, { useMemo } from "react";
import { Container } from "./Container";

const { BEACH_BAR_SERVICE_OBJ, PRODUCT_COMPONENTS_OBJ } = TABLES;

type SubComponents = {
  Container: typeof Container;
};

type Props = FlexProps & {
  feature?: string;
  iconId?: string;
  quantity?: number;
  isChecked?: boolean;
  atSearch?: boolean;
  hasQuantity?: boolean;
};

// @ts-expect-error
export const Feature: React.NamedExoticComponent<Props> & SubComponents = React.memo(
  ({
    feature,
    quantity,
    iconId,
    isChecked = false,
    atSearch = false,
    hasQuantity: _hasQuantity,
    children,
    ...props
  }) => {
    const hasQuantity = useMemo(() => _hasQuantity || (quantity && quantity > 1), [_hasQuantity, quantity]);
    const icon = useMemo(() => {
      let IconName: ComponentWithAs<"svg", IconProps> | undefined = undefined;
      switch (iconId) {
        case BEACH_BAR_SERVICE_OBJ.SWIMMING_POOL.publicId:
          IconName = Icon.SwimmingPool;
          break;
        case BEACH_BAR_SERVICE_OBJ.FOOD_SNACKS.publicId:
          IconName = Icon.People.Snacks.Filled;
          break;
        case BEACH_BAR_SERVICE_OBJ.FREE_PARKING.publicId:
          IconName = Icon.Notification.ParkingSign.Filled;
          break;
        case BEACH_BAR_SERVICE_OBJ.WATER_SLIDES.publicId:
          IconName = Icon.People.WaterSlides.Filled;
          break;
        case BEACH_BAR_SERVICE_OBJ.SEA_INFLATABLE_TOYS.publicId:
          IconName = Icon.BeachBall.Filled;
          break;
        case BEACH_BAR_SERVICE_OBJ.PRIVATE_BAY.publicId:
          IconName = Icon.Beach.Filled;
          break;
        case PRODUCT_COMPONENTS_OBJ.CHAIR.publicId:
          IconName = Icon.BeachChair;
          break;
        case PRODUCT_COMPONENTS_OBJ.SUNBED.publicId:
          IconName = Icon.Sunbed.Filled;
          break;
        case PRODUCT_COMPONENTS_OBJ.SUNBED_WITH_MATTRESS.publicId:
          IconName = Icon.SunbedWithMatress.Filled;
          break;
        case PRODUCT_COMPONENTS_OBJ.UMBRELLA.publicId:
          IconName = Icon.BeachUmbrella.FilledOneSide;
          break;
      }
      if (!IconName) return null;
      return <IconName color="orange.500" />;
    }, [iconId]);

    return (
      <Flex
        justify="center"
        align="center"
        gap={2.5}
        py={atSearch ? 0 : { base: 2, md: "0.4rem" }}
        px={atSearch ? 0 : { base: 3, md: 2 }}
        // p={atSearch ? 0 : undefined} Does not work
        border={atSearch ? "none" : "1px solid"}
        borderColor="gray.400"
        borderRadius="regular"
        color="gray.800"
        userSelect="none"
        fontSize="sm"
        transitionProperty="background"
        transitionTimingFunction="ease-out"
        transitionDuration="normal"
        {...btnFilterChecked(isChecked)}
        {...props}
        sx={{ svg: { flexShrink: 0, boxSize: { md: "icon.semi" } }, ...props.sx }}
        _last={!atSearch ? undefined : { ".divider": { display: "none" } }}
      >
        {icon}
        {children}
        {(feature || hasQuantity) && (
          <Flex justify="inherit" align="inherit" gap={1}>
            {hasQuantity && (
              <Box fontWeight="semibold">
                <span>{quantity}</span>
                <Text
                  as="span"
                  display="inline-block"
                  // transform="translateY(-5%)"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  x
                </Text>
              </Box>
            )}
            {hasQuantity && feature && !atSearch && <Box color="text.grey">&bull;</Box>}
            <div>{feature}</div>
            {atSearch && (
              <Box
                width="3.2px"
                height="3.2px"
                my="auto"
                mx={2}
                bg="gray.700"
                transform="translateY(2px)"
                borderRadius="full"
                className="divider"
              />
            )}
          </Flex>
        )}
      </Flex>
    );
  }
);

Feature.Container = Container;

Feature.displayName = "BeachBarFeature";
