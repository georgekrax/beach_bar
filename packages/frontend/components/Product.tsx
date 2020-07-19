import React from "react";
import css from "../public/static/hey.module.scss";

export const Product: React.FC<{ product }> = ({ product }) => {
  return (
    <div>
      <h4>{product.name}</h4>
      <p>------------------------</p>
      <p className={css.me}>
        <b>Category: </b>
        {product.category.name}
      </p>
    </div>
  );
};

export default Product;
