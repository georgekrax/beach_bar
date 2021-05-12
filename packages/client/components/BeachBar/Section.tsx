import styles from "./Section.module.scss";

type SubComponents = {
  Contact: typeof Contact;
};

type Props = {
  header?: string;
};

export const Section: React.FC<Props> & SubComponents = ({ header, children }) => {
  return (
    <div className={styles.container}>
      {header && <h6>{header}</h6>}
      {children}
    </div>
  );
};

type ContactProps = {
  info: string;
  val: string;
};

export const Contact: React.FC<ContactProps> = ({ info, val }) => {
  return (
    <div className={styles.contact + " flex-row-space-between-center"}>
      <div>{info}:</div>
      <span className="semibold">{val}</span>
    </div>
  );
};

Section.Contact = Contact;

Section.displayName = "BeachBarSection";
Contact.displayName = "BeachBarSectionContact";
