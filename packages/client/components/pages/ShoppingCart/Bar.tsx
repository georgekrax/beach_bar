import Section from "@/components/Section";
import {
  BeachBar as GraphQLBeachBar,
  CartProduct,
  Product,
  UpdateCartProductMutationVariables,
} from "@/graphql/generated";
import { Select } from "@hashtag-design-system/components";
import { AnimatePresence, motion, Variants } from "framer-motion";
import uniq from "lodash/uniq";
import { useState } from "react";
import { MOTION } from "@/config/index";
import { ShoppingCartPage } from "../index";
import styles from "./Bar.module.scss";
import { ProductProps } from "./Product";

const containerVariants: Variants = {
  initial: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export type Props = {
  beachBar: Pick<GraphQLBeachBar, "name"> & {
    defaultCurrency: Pick<GraphQLBeachBar["defaultCurrency"], "symbol">;
  };
  products: (Pick<CartProduct, "quantity" | "date" | "time"> & {
    product: Pick<Product, "id" | "name" | "price" | "imgUrl"> & Pick<ProductProps, "allowRemove" | "allowEdit">;
  })[];
  handleRemoveItem?: (i: number) => Promise<void>;
} & Pick<UpdateCartProductMutationVariables, "cartId">;

export const Bar: React.FC<Props> = ({ beachBar: { name, defaultCurrency }, products, cartId, handleRemoveItem }) => {
  const [hasAnimationEnded, setHasAnimationEnded] = useState(false);

  return (
    <div className={styles.container + " w-100 flex-column-flex-start-flex-start"}>
      <Section.Header
        className={styles.header}
        link="View products"
        href={{ pathname: "/map" }}
        initial="initial"
        animate="animate"
        exit={{ opacity: 0 }}
        variants={MOTION.fadeInUp}
      >
        {name}
      </Section.Header>
      <Select.Hr className="iw-100" />
      <motion.div
        className="w-100"
        animate="animate"
        initial="initial"
        variants={containerVariants}
        onAnimationComplete={() => setHasAnimationEnded(true)}
      >
        <AnimatePresence>
          {uniq(products).map(props => (
            <ShoppingCartPage.Product
              key={props.product.id + "_" + props.product.name + +"_" + props.date + "_" + props.time.id}
              cartId={cartId}
              hasAnimationEnded={hasAnimationEnded}
              handleRemoveItem={handleRemoveItem}
              defaultCurrency={defaultCurrency}
              {...props}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

Bar.displayName = "ShoppingCartBar";
