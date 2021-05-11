<<<<<<< HEAD
import { useClassnames } from "@hashtag-design-system/components";
import React from "react";
import styles from "./Total.module.scss";

type Props = {
  total: number;
  currencySymbol: string;
};

export const Total: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">> = ({
  total,
  currencySymbol,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container, props);

  return (
    <div className={classNames} {...rest}>
      <span>Total: </span>{" "}
      <h6 className="normal header-3 d--ib">
        {total.toFixed(2)}
        {currencySymbol}
      </h6>
    </div>
  );
};

Total.displayName = "ShoppingCartTotal";
=======
import { useClassnames } from "@hashtag-design-system/components";
import React from "react";
import styles from "./Total.module.scss";

type Props = {
  total: number;
  currencySymbol: string;
};

export const Total: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">> = ({
  total,
  currencySymbol,
  ...props
}) => {
  const [classNames, rest] = useClassnames(styles.container, props);

  return (
    <div className={classNames} {...rest}>
      <span>Total: </span>{" "}
      <h6 className="normal header-3 d--ib">
        {total.toFixed(2)}
        {currencySymbol}
      </h6>
    </div>
  );
};

Total.displayName = "ShoppingCartTotal";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
