import Icons from "@/components/Icons";
import { MOTION } from "@/config/index";
import { useUpdateCartProductMutation } from "@/graphql/generated";
import { removeSaveYear } from "@/utils/removeSameYear";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Input } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { Props as BarProps } from "./Bar";
import styles from "./Product.module.scss";

export type ProductProps = {
  hasAnimationEnded: boolean;
  allowRemove?: boolean;
  allowEdit?: boolean;
};

export type ProductFProps = ProductProps &
  Pick<BarProps, "handleRemoveItem"> &
  BarProps["products"][number] &
  Pick<BarProps["beachBar"], "defaultCurrency">;

export const Product: React.FC<ProductFProps> = ({
  hasAnimationEnded = false,
  product: { name, price, imgUrl },
  id,
  quantity,
  defaultCurrency,
  time,
  date,
  allowRemove = true,
  allowEdit = true,
  handleRemoveItem,
}) => {
  const [updateCartProduct] = useUpdateCartProductMutation();

  const handleChange = async (value: number) => {
    if (value === quantity) return;
    await updateCartProduct({
      variables: { id, quantity: value },
      // update: cache => {
      //   const data = cache.readQuery<GetCartQuery>({ query: GetCartDocument });
      //   if (!data || !data.getCart || !data.getCart.products) return;
      //   cache.writeQuery({
      //     query: GetCartDocument,
      //     data: {
      //       getCart: {
      //         ...data.getCart,
      //         products: data.getCart.products.map(obj =>
      //           String(obj.id) === String(id) ? { ...obj, quantity: value } : obj
      //         ),
      //       },
      //     },
      //   });
      // },
    });
  };

  return (
    <motion.div
      initial={hasAnimationEnded ? "initial" : undefined}
      animate={hasAnimationEnded ? "animate" : undefined}
      exit={{ x: "-100%", opacity: 0 }}
      variants={MOTION.productVariants}
      className={styles.container + " w100 flex-row-flex-start-flex-start"}
    >
      {imgUrl && (
        <Image
          src={imgUrl}
          alt={`${name} product image`}
          width={104}
          height={104}
          objectFit="cover"
          objectPosition="center"
          className={styles.img}
        />
      )}
      <div className={styles.details + " flex-column-space-between-flex-start"}>
        <div className="w100">
          <div className="flex-row-space-between-center">
            {/* <BeachBar.Header as="h6" className="body-16"> */}
            <span className="d--block">{name}</span>
            {/* </BeachBar.Header> */}
            {allowRemove && handleRemoveItem && (
              <Icons.Close width={14} height={14} onClick={async () => await handleRemoveItem(id)} />
            )}
          </div>
          <div className="flex-row-flex-start-center">
            <div>for {removeSaveYear(dayjs(date))}</div>
            <div></div>
            <div>{time.value.slice(0, -3)}</div>
          </div>
        </div>
        <div className={styles.quantity + " w100 flex-row-space-between-center"}>
          <div>
            <span>{defaultCurrency.symbol}</span> <span>{price}</span>
          </div>
          <Input.IncrDcr
            defaultValue={quantity}
            min={COMMON_CONFIG.DATA.cartProductQuantity.min}
            max={COMMON_CONFIG.DATA.cartProductQuantity.max}
            btnProps={{ disabled: !allowEdit }}
            onValue={async value => handleChange(value)}
          />
        </div>
      </div>
    </motion.div>
  );
};

Product.displayName = "ShoppingCartProduct";
