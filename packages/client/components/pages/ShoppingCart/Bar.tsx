<<<<<<< HEAD
import Section from "@/components/Section";
import { MOTION } from "@/config/index";
import { BeachBar as GraphQLBeachBar, CartProduct, Product } from "@/graphql/generated";
import { Select } from "@hashtag-design-system/components";
import { AnimatePresence, motion, Variants } from "framer-motion";
import uniq from "lodash/uniq";
import { useState } from "react";
import { ShoppingCartPage } from "../index";
import styles from "./Bar.module.scss";
import { ProductProps } from "./Product";

const containerVariants: Variants = {
  initial: { transition: { staggerChildren: 0.1 } },
  animate: { transition: { staggerChildren: 0.1 } },
};

export type Props = {
  beachBar: Pick<GraphQLBeachBar, "name"> & {
    defaultCurrency: Pick<GraphQLBeachBar["defaultCurrency"], "symbol">;
  };
  products: (Pick<CartProduct, "id" | "quantity" | "date"> & {
    product: Pick<Product, "id" | "name" | "price" | "imgUrl"> & Pick<ProductProps, "allowRemove" | "allowEdit">;
    time: Omit<CartProduct["time"], "utcValue">;
  })[];
  handleRemoveItem?: (i: string) => Promise<void>;
};

export const Bar: React.FC<Props> = ({ beachBar: { name, defaultCurrency }, products, handleRemoveItem }) => {
  const [hasAnimationEnded, setHasAnimationEnded] = useState(false);

  return (
    <div className={styles.container + " w100 flex-column-flex-start-flex-start"}>
      <Section.Header
        className={styles.header + " bold"}
        link="View products"
        href={{ pathname: "/map" }}
        initial="initial"
        animate="animate"
        exit={{ opacity: 0 }}
        variants={MOTION.fadeInUp}
      >
        {name}
      </Section.Header>
      <Select.Hr className="iw100" />
      <motion.div
        className="w100"
        animate="animate"
        initial="initial"
        variants={containerVariants}
        onAnimationComplete={() => setHasAnimationEnded(true)}
      >
        <AnimatePresence>
          {uniq(products).map(props => (
            <ShoppingCartPage.Product
              key={props.id}
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
=======
import Section from "@/components/Section";
import { MOTION } from "@/config/index";
import { BeachBar as GraphQLBeachBar, CartProduct, Product } from "@/graphql/generated";
import { Select } from "@hashtag-design-system/components";
import { AnimatePresence, motion, Variants } from "framer-motion";
import uniq from "lodash/uniq";
import { useState } from "react";
import { ShoppingCartPage } from "../index";
import styles from "./Bar.module.scss";
import { ProductProps } from "./Product";

const containerVariants: Variants = {
  initial: { transition: { staggerChildren: 0.1 } },
  animate: { transition: { staggerChildren: 0.1 } },
};

export type Props = {
  beachBar: Pick<GraphQLBeachBar, "name"> & {
    defaultCurrency: Pick<GraphQLBeachBar["defaultCurrency"], "symbol">;
  };
  products: (Pick<CartProduct, "id" | "quantity" | "date"> & {
    product: Pick<Product, "id" | "name" | "price" | "imgUrl"> & Pick<ProductProps, "allowRemove" | "allowEdit">;
    time: Omit<CartProduct["time"], "utcValue">;
  })[];
  handleRemoveItem?: (i: string) => Promise<void>;
};

export const Bar: React.FC<Props> = ({ beachBar: { name, defaultCurrency }, products, handleRemoveItem }) => {
  const [hasAnimationEnded, setHasAnimationEnded] = useState(false);

  return (
    <div className={styles.container + " w100 flex-column-flex-start-flex-start"}>
      <Section.Header
        className={styles.header + " bold"}
        link="View products"
        href={{ pathname: "/map" }}
        initial="initial"
        animate="animate"
        exit={{ opacity: 0 }}
        variants={MOTION.fadeInUp}
      >
        {name}
      </Section.Header>
      <Select.Hr className="iw100" />
      <motion.div
        className="w100"
        animate="animate"
        initial="initial"
        variants={containerVariants}
        onAnimationComplete={() => setHasAnimationEnded(true)}
      >
        <AnimatePresence>
          {uniq(products).map(props => (
            <ShoppingCartPage.Product
              key={props.id}
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
