import BeachBar from "@/components/BeachBar";
import Next from "@/components/Next";
import { Currency } from "@/graphql/generated";
import { AvailableProductsArr } from "@/typings/beachBar";
import { Button } from "@hashtag-design-system/components";
import range from "lodash/range";
import uniqBy from "lodash/uniqBy";
import { useEffect, useMemo, useState } from "react";
import styles from "./MainPage.module.scss";

type Props = {
  products: AvailableProductsArr;
  barCurrencySymbol: Currency["symbol"];
};

export const MainPage: React.FC<Props> = ({ products, barCurrencySymbol }) => {
  const [filterIds, setFilterIds] = useState<string[]>([]);
  const [filteredArr, setFilteredArr] = useState(products);

  const peopleArr = useMemo(() => {
    const maxPeopleArr = products.map(({ maxPeople }) => maxPeople);
    if (maxPeopleArr.length === 0) return [];
    return Array.from(new Set(range(Math.min(...maxPeopleArr), Math.max(...maxPeopleArr) + 1)));
  }, [products]);
  const componentsArr = useMemo(
    () =>
      uniqBy(products.map(({ category: { components } }) => components.map(({ component }) => component)).flat(), "id"),
    [products]
  );

  const handleClick = (id: string) => {
    const filtered = filterIds.filter(val => val !== id);
    if (filterIds.includes(id)) setFilterIds(filtered);
    else setFilterIds([...filtered, id]);
  };

  const filter = () => {
    let newArr = products;
    filterIds.forEach(id => {
      let parsed = parseInt(id);
      if (id.length === 1 && !isNaN(parsed)) newArr = newArr.filter(({ maxPeople }) => maxPeople >= parsed);
      else if (id.length === 3)
        newArr = newArr.filter(({ category: { components } }) =>
          components.some(({ component }) => component.icon.publicId === id)
        );
    });
    setFilteredArr(newArr);
  };

  useEffect(() => {
    if (filteredArr.length !== products.length) setFilteredArr(products);
  }, [products]);

  useEffect(() => filter(), [filterIds]);

  return (
    <div className={styles.container}>
      <h4>Products</h4>
      {products.length > 0 ? (
        <div>
          <BeachBar.SearchInfo bg="blue" />
          <div className={styles.filters}>
            {componentsArr.length > 1 && (
              <div className={styles.components + " flex-row-flex-start-center"}>
                <div className="semibold">Included: </div>
                {componentsArr.map(({ name, icon: { publicId } }) => (
                  <BeachBar.Feature
                    key={publicId}
                    feature={name}
                    iconId={publicId}
                    isChecked={filterIds.includes(publicId)}
                    onClick={() => handleClick(publicId)}
                  />
                ))}
              </div>
            )}
            {peopleArr.length > 1 && (
              <div className={styles.people + " flex-row-flex-start-center"}>
                <div className="semibold">People: </div>
                {peopleArr.map(num => (
                  <Button
                    key={num}
                    variant="secondary"
                    className={filterIds.includes(num.toString()) ? styles.checked : undefined}
                    onClick={() => handleClick(num.toString())}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {filteredArr.map(({ id, ...product }) => (
            <BeachBar.Product
              key={id}
              className={styles.product}
              id={id}
              extraDetails
              addToCart
              defaultCurrencySymbol={barCurrencySymbol}
              {...product}
            />
          ))}
        </div>
      ) : (
        <Next.DoNotHave msg="This #beach_bar does not have any available products" emoji="😔" />
      )}
    </div>
  );
};

MainPage.displayName = "BeachBarProductMainPage";
