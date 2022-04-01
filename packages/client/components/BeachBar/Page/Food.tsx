import { ShoppingCartItemPriceProps, ShoppingCartProps } from "@/components/ShoppingCart";
import { BeachBarQuery } from "@/graphql/generated";
import { TABLES } from "@beach_bar/common";
import { Box, ComponentWithAs, Flex, FlexProps } from "@hashtag-design-system/components";
import Icon, { IconProps } from "@hashtag-design-system/icons";
import { groupBy } from "lodash";
import { useMemo } from "react";
import { FoodItem } from "./FoodItem";

const { FOOD_CATEGORY } = TABLES;

export type Props = Pick<ShoppingCartItemPriceProps, "currencySymbol"> &
  Pick<NonNullable<BeachBarQuery["beachBar"]>, "foods"> &
  Pick<ShoppingCartProps, "edit"> &
  FlexProps & {
    hasNoProducts: boolean;
    atShoppingCart?: boolean;
    atDashboard?: boolean;
  };

export const Food: React.FC<Props> = ({
  hasNoProducts,
  currencySymbol,
  foods,
  atShoppingCart = false,
  atDashboard = false,
  edit,
  ...props
}) => {
  const groupedFoods = useMemo(() => {
    const arr = Object.values(groupBy(foods, ({ category }) => category.name));
    return arr
      .map(val => {
        const category = val[0].category;
        let IconComp: ComponentWithAs<"svg", IconProps>;
        switch (category.icon.publicId) {
          case FOOD_CATEGORY.find(({ name }) => name === "Smoothies and fresh juices")?.publicId:
            IconComp = Icon.People.FreshJuice.Colored;
            break;
          case FOOD_CATEGORY.find(({ name }) => name === "Coffee")?.publicId:
            IconComp = Icon.People.CoffeeCup.Colored;
            // iconName = Icon.People.CoffeeCup.Colored;
            break;
          case FOOD_CATEGORY.find(({ name }) => name === "Soft drinks")?.publicId:
            IconComp = Icon.People.SoftDrink.Colored;
            break;
          case FOOD_CATEGORY.find(({ name }) => name === "Beverages & refreshments")?.publicId:
            IconComp = Icon.People.RefreshmentDrink.Colored;
            break;
          case FOOD_CATEGORY.find(({ name }) => name === "Beer")?.publicId:
            IconComp = Icon.People.Beer.Colored;
            break;
          case FOOD_CATEGORY.find(({ name }) => name === "Alchoholic drinks")?.publicId:
            IconComp = Icon.People.AlchoholicDrink.Colored;
            break;
          case FOOD_CATEGORY.find(({ name }) => name === "Food & snacks")?.publicId:
            IconComp = Icon.People.FoodCutlery.Colored;
            break;
        }
        // @ts-expect-error
        return { foods: val, category, icon: <IconComp boxSize="icon.lg" /> };
      })
      .sort((a, b) => +a.category.id - +b.category.id);
  }, [foods.length, foods[0]?.id]);

  return (
    <Flex
      wrap="wrap"
      mt={hasNoProducts ? 6 : undefined}
      border="2px solid"
      borderColor="gray.200"
      borderRadius="regular"
      bg="white"
      {...props}
    >
      <Flex
        justify="space-between"
        wrap="wrap"
        width="100%"
        maxHeight={hasNoProducts ? "none" : 96}
        my={2}
        py={2}
        px={4}
        overflowY="auto"
        className="scrollbar"
      >
        {groupedFoods.map(({ foods, category, icon }, i) => (
          <Box
            key={"food_category_" + category.id}
            width="inherit"
            mb={atShoppingCart && i === groupedFoods.length - 1 ? 0 : 8}
            flexBasis={{ md: hasNoProducts ? "31%" : undefined }}
          >
            <Flex align="center" gap={1} mb={2} pt={2} pb="0.4em" borderBottom="1px solid" borderColor="brand.primary">
              {icon}
              <div>{category.name}</div>
            </Flex>
            <Box as="ul" m={0} p={0} listStyleType="none" bg="white" overflow="hidden">
              {foods.map(({ id, ...rest }) => (
                <FoodItem
                  key={"food_item_" + id}
                  id={id}
                  edit={edit}
                  atDashboard={atDashboard}
                  currencySymbol={currencySymbol}
                  {...rest}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

Food.displayName = "BeachBarPageFood";
