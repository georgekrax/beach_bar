import { SEARCH_ACTIONS } from "@/components/Search";
import { BeachBarQuery, useAddCartProductMutation, useCartQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { notify } from "@/utils/notify";
import { Button } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import BeachBar from "../BeachBar";
import { MainPage } from "./MainPage";
import styles from "./Product.module.scss";

type SubComponents = {
  MainPage: typeof MainPage;
};

type Props = {
  defaultCurrencySymbol: string;
  showComponents?: boolean;
  extraDetails?: boolean;
  addToCart?: boolean;
};

export const Product: React.FC<
  Props &
    NonNullable<BeachBarQuery["beachBar"]>["products"][number] &
    Pick<React.ComponentPropsWithoutRef<"div">, "className">
> &
  SubComponents = ({
  id,
  name,
  description,
  imgUrl,
  price,
  defaultCurrencySymbol,
  showComponents = true,
  category,
  extraDetails = false,
  addToCart = true,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data } = useCartQuery();
  const [addProductToCart] = useAddCartProductMutation();

  const containerStyles: React.CSSProperties | undefined = useMemo(
    () => (addToCart ? { paddingBottom: 0 } : undefined),
    [addToCart]
  );
  const descriptionStyles = useMemo(() => (isExpanded ? { display: "inline" } : undefined), [isExpanded]);

  const { date, hourTime, dispatch } = useSearchContext();

  const handleAddToCart = async () => {
    if (!data || !data.cart) {
      notify("error", "");
      return;
    }
    if (!date) {
      notify("error", "Please select your visit date.", { somethingWentWrong: false });
      return;
    }
    if (!hourTime) {
      notify("error", "Please select your visit time.", { somethingWentWrong: false });
      return;
    }

    const { data: res, errors } = await addProductToCart({
      variables: { cartId: data.cart.id, productId: id, quantity: 1, date, timeId: hourTime.toString() },
    });
    if (!res && errors) errors.forEach(({ message }) => notify("error", message, { somethingWentWrong: false }));
    else dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: true } });
  };

  const handleClick = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={styles.container + (className ? " " + className : "") + " flex-column-space-between-flex-start"}
      style={containerStyles}
    >
      <div className="w100" style={{ cursor: isExpanded ? "default" : "pointer" }} onClick={() => handleClick()}>
        {imgUrl && (
          <motion.div
            animate={isExpanded ? { width: 176, height: 176 } : { width: 112, height: 112 }}
            className={styles.imgContainer + " flex-row-center-flex-start"}
          >
            <Image
              src={imgUrl}
              alt={`"${name}" product image`}
              layout="fill"
              objectFit="cover"
              objectPosition="center center"
            />
          </motion.div>
        )}
        <div className={styles.content}>
          <div className={(addToCart ? "d--inline" : "") + " flex-row-space-between-center"}>
            <h5 className="header-6 semibold">{name}</h5>
            {!addToCart && (
              <div className={styles.priceTag + " flex-row-center-center border-radius--lg"}>
                {price > 0 ? defaultCurrencySymbol + " " + price.toFixed(2) : "Free"}
              </div>
            )}
          </div>
          <motion.p
            className="text--grey"
            animate={(description?.length || 0) >= 40 && { height: isExpanded ? "100%" : 64 }}
            transition={{ duration: 0.2 }}
            style={descriptionStyles}
          >
            {description}
          </motion.p>
        </div>
        {showComponents && (
          <div className={styles.components}>
            <BeachBar.Feature.Container>
              {category.components.map(({ quantity, component: { id, name, icon } }) => (
                <BeachBar.Feature
                  key={id}
                  quantity={quantity}
                  feature={extraDetails ? name : undefined}
                  iconId={icon.publicId}
                />
              ))}
            </BeachBar.Feature.Container>
          </div>
        )}
      </div>
      {addToCart && (
        <div className={styles.cartBottom + " flex-row-space-between-center"}>
          <div className={styles.priceTag + " flex-row-center-center border-radius--lg"}>
            {price > 0 ? defaultCurrencySymbol + " " + price.toFixed(2) : "Free"}
          </div>
          <Button variant="secondary" onClick={async () => await handleAddToCart()}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

Product.MainPage = MainPage;

Product.displayName = "BeachBarProduct";
