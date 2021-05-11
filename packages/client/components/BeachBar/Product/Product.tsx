import { SEARCH_ACTIONS } from "@/components/Search";
import { BeachBarQuery, useAddCartProductMutation, useCartQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { notify } from "@/utils/notify";
import { Button } from "@hashtag-design-system/components";
import Image from "next/image";
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
  addToCart = false,
  className,
}) => {
  const { data } = useCartQuery();
  const [addProductToCart] = useAddCartProductMutation();

  const { date, hourTime, dispatch } = useSearchContext();

  const handleAddToCart = async () => {
    if (!data || !data.cart) {
      notify("error", "");
      return;
    }

    const { data: res, errors } = await addProductToCart({
      variables: { cartId: data.cart.id, productId: id, quantity: 1, date, timeId: hourTime?.toString() },
    });
    if (!res && errors) errors.forEach(({ message }) => notify("error", message, { somethingWentWrong: false }));
    else dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: true } });
  };

  return (
    <div className={styles.container + (className ? " " + className : "")}>
      <div className="flex-row-flex-start-flex-start">
        {imgUrl && (
          <div className={styles.imgContainer + " flex-row-center-center"}>
            <Image src={imgUrl} alt={`"${name}" product image`} width={112} height={112} />
          </div>
        )}
        <div className={styles.content + " w100"}>
          <div className="flex-row-space-between-flex-start">
            <h5 className="header-6">{name}</h5>
            <div className={styles.priceTag + " flex-row-center-center border-radius--lg"}>
              {price > 0 ? defaultCurrencySymbol + " " + price.toFixed(2) : "Free"}
            </div>
          </div>
          <div>{description}</div>
        </div>
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
      {addToCart && (
        <div className={styles.cartCta}>
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
