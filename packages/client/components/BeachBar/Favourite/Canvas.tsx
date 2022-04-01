import Carousel from "@/components/Carousel";
import Section from "@/components/Section";
import { MeQuery } from "@/graphql/generated";
import { SimpleGrid } from "@chakra-ui/react";
import { GridItem } from "@hashtag-design-system/components";

export type Props = {
  arr: NonNullable<MeQuery["me"]>["favoriteBars"];
};

export const Canvas: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"section">, "className">> = ({
  arr,
  ...props
}) => {
  return (
    <section {...props}>
      <Section.Header href="/account/favourites" link="View all">
        My Favourites
      </Section.Header>
      <SimpleGrid autoFlow="row" columns={3} spacing={5} height={96}>
        {arr.map(({ beachBar }, i) => {
          const isEven = i % 2 === 0;
          return (
            // <GridItem key={"favourite_" + beachBar.id} colSpan={i === 0 || i === 3 || i === 4 ? 2 : undefined}>
            <GridItem key={"favourite_" + i} colSpan={i === 0 || i === 3 || i === 4 ? 2 : undefined}>
              <Carousel.BeachBar
                borderRadius="regular"
                borderTopRightRadius={!isEven ? 0 : undefined}
                borderTopLeftRadius={isEven ? 0 : undefined}
                // borderRadius={i % 2 === 1 ? "14px 0px" : "0px 14px"}
                className="iw100 ih100"
                hasLocationIcon={false}
                {...beachBar}
              />
            </GridItem>
          );
        })}
      </SimpleGrid>
    </section>
  );
};

Canvas.displayName = "BeachBarFavouriteCanvas";
