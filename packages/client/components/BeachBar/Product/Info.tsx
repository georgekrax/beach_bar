import ShoppingCart from "@/components/ShoppingCart";
import { CartQuery } from "@/graphql/generated";
import { textOverlfow } from "@/utils/styles";
import { Flex, Heading, MotionFlex, MotionText } from "@hashtag-design-system/components";
import Image from "next/image";
import { useState } from "react";
import { ProductProps } from ".";
import { Feature } from "../Feature";

type Props = Pick<
  ProductProps,
  "name" | "imgUrl" | "description" | "category" | "hasComponents" | "hasExtraDetails" | "hasAddToCart"
> & {
  isAlreadyInCart?: CartQuery["cart"]["products"][number];
};

export const Info: React.FC<Props> = ({
  name,
  imgUrl,
  description,
  category,
  hasComponents,
  hasExtraDetails,
  hasAddToCart,
  isAlreadyInCart,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Flex
      flexDir="column"
      justify="inherit"
      align="inherit"
      className="w100"
      onClick={() => setIsExpanded(prev => !prev)}
    >
      <Flex>
        {imgUrl && (
          <MotionFlex
            justify="center"
            flexShrink={0}
            position="relative"
            float="left"
            mr={4}
            mb={4}
            userSelect="none"
            sx={{
              "& > *": {
                borderRadius: "regular",
              },
              "~ span:not(:nth-of-type(2))": {
                clear: "both",
              },
            }}
            animate={
              isExpanded
                ? { width: 176, height: 176, cursor: "zoom-out" }
                : { width: 112, height: 112, cursor: "zoom-in" }
            }
          >
            <Image src={imgUrl} alt={name + " product image"} layout="fill" objectFit="cover" objectPosition="center" />
          </MotionFlex>
        )}
        <div>
          <Flex justify="space-between" align="center" mb={1} display={hasAddToCart ? "inline" : undefined}>
            <Flex align="center">
              <Heading as="h5" size="md" fontWeight="semibold">
                {name}
              </Heading>
              <ShoppingCart.Quantity quantity={isAlreadyInCart?.quantity || 0} ml={3} />
            </Flex>
            {/* {!addToCart && (
                <div className={styles.priceTag + " text--nowrap border-radius--lg flex-row-center-center"}>
                  {price > 0 ? defaultCurrencySymbol + " " + price.toFixed(2) : "Free"}
                </div>
              )} */}
          </Flex>
          <MotionText
            as="p"
            color="text.grey"
            display={{ md: "inline" }}
            animate={(description?.length || 0) >= 40 && { height: isExpanded ? "100%" : 64 }}
            transition={{ duration: 0.2 }}
            style={{ display: isExpanded ? "inline" : undefined }}
            sx={textOverlfow(3)}
          >
            {description}
          </MotionText>
        </div>
      </Flex>
      {hasComponents && (
        <Feature.Container mt={6} mb={4} m={{ md: 0 }}>
          {category.components.map(({ quantity, component: { id, name, icon } }) => (
            <Feature key={id} quantity={quantity} feature={hasExtraDetails ? name : undefined} iconId={icon.publicId} />
          ))}
        </Feature.Container>
      )}
    </Flex>
  );
};

Info.displayName = "ProductInfo";
