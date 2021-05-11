<<<<<<< HEAD
import { useSearchContext } from "@/utils/contexts";
import { formatPeopleAdults, formatPeopleChilden } from "@/utils/search";
import { Input } from "@hashtag-design-system/components";
import { HANDLE_PEOPLE_CHANGE_PAYLOAD, SEARCH_ACTIONS } from "../index";
import styles from "./People.module.scss";

type Props = {};

export const People: React.FC<Props> = () => {
  const { people, dispatch } = useSearchContext();

  const handlePeopleChange = (name: keyof HANDLE_PEOPLE_CHANGE_PAYLOAD, newVal: number) => {
    if ((name === "adults" && newVal !== people?.adults) || (name === "children" && newVal !== people?.children)) {
      dispatch({ type: SEARCH_ACTIONS.HANDLE_PEOPLE_CHANGE, payload: { [name]: newVal } });
    }
  };

  return (
    <div>
      <Row
        quantity={people?.adults || 1}
        heading={formatPeopleAdults(people?.adults)}
        description={<>12 years old &amp; more</>}
      >
        <Input.IncrDcr defaultValue={1} min={1} max={12} onValue={val => handlePeopleChange("adults", val)} />
      </Row>
      <Row
        quantity={people?.children || 0}
        heading={formatPeopleChilden(people?.children)}
        description="Less than 12 years old"
      >
        <Input.IncrDcr defaultValue={0} min={0} max={8} onValue={val => handlePeopleChange("children", val)} />
      </Row>
    </div>
  );
};

People.displayName = "SearchFormPeople";

type RowProps = {
  quantity: number;
  heading: string;
  description: React.ReactNode;
};

export const Row: React.FC<RowProps> = ({ quantity, heading, description, children }) => (
  <div className={styles.row + " flex-row-space-between-center"}>
    <div className="flex-row-center-center">
      <span className={styles.quantity + " header-5 semibold"}>{quantity}</span>
      <div className="flex-column-center-flex-start">
        <div>{heading}</div>
        <span className="d--ib">{description}</span>
      </div>
    </div>
    {children}
  </div>
);

Row.displayName = "SearchFormPeopleRow";
=======
import { useSearchContext } from "@/utils/contexts";
import { formatPeopleAdults, formatPeopleChilden } from "@/utils/search";
import { Input } from "@hashtag-design-system/components";
import { HANDLE_PEOPLE_CHANGE_PAYLOAD, SEARCH_ACTIONS } from "../index";
import styles from "./People.module.scss";

type Props = {};

export const People: React.FC<Props> = () => {
  const { people, dispatch } = useSearchContext();

  const handlePeopleChange = (name: keyof HANDLE_PEOPLE_CHANGE_PAYLOAD, newVal: number) => {
    if ((name === "adults" && newVal !== people?.adults) || (name === "children" && newVal !== people?.children)) {
      dispatch({ type: SEARCH_ACTIONS.HANDLE_PEOPLE_CHANGE, payload: { [name]: newVal } });
    }
  };

  return (
    <div>
      <Row
        quantity={people?.adults || 1}
        heading={formatPeopleAdults(people?.adults)}
        description={<>12 years old &amp; more</>}
      >
        <Input.IncrDcr defaultValue={1} min={1} max={12} onValue={val => handlePeopleChange("adults", val)} />
      </Row>
      <Row
        quantity={people?.children || 0}
        heading={formatPeopleChilden(people?.children)}
        description="Less than 12 years old"
      >
        <Input.IncrDcr defaultValue={0} min={0} max={8} onValue={val => handlePeopleChange("children", val)} />
      </Row>
    </div>
  );
};

People.displayName = "SearchFormPeople";

type RowProps = {
  quantity: number;
  heading: string;
  description: React.ReactNode;
};

export const Row: React.FC<RowProps> = ({ quantity, heading, description, children }) => (
  <div className={styles.row + " flex-row-space-between-center"}>
    <div className="flex-row-center-center">
      <span className={styles.quantity + " header-5 semibold"}>{quantity}</span>
      <div className="flex-column-center-flex-start">
        <div>{heading}</div>
        <span className="d--ib">{description}</span>
      </div>
    </div>
    {children}
  </div>
);

Row.displayName = "SearchFormPeopleRow";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
