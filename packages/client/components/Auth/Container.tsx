import { Form, FormGroupFProps } from "@hashtag-design-system/components";
import { AnimationControls, HTMLMotionProps, motion, Variants } from "framer-motion";

type SubComponents = {
  FormGroup: typeof FormGroup;
};

export type Props = {
  controls: AnimationControls | false;
  variants: Variants | false;
  description: React.ReactNode | false;
  other: { text: string; link: string } | false;
  handleClick: (() => Promise<void>) | false;
  children: React.ReactNode;
} & Pick<HTMLMotionProps<"div">, "initial" | "custom">;

export const Container: React.FC<Props> & SubComponents = ({
  initial,
  variants,
  controls,
  custom,
  description,
  other,
  handleClick,
  children,
}) => {
  return (
    <motion.div
      className="flex-column-center-center"
      initial={initial}
      animate={controls}
      variants={variants ? variants : undefined}
      custom={custom}
      transition={{ duration: 0.8 }}
    >
      <div className="w100 flex-column-center-center" style={{ maxWidth: "17.5em" }}>
        {description && <span className="auth-form__description">{description}</span>}
        {children}
        {other && (
          <div className="auth-form__other">
            <span>{other.text}</span>{" "}
            <span className="link" onClick={async () => handleClick && handleClick()}>
              {other.link}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

Container.displayName = "AuthContainer";

export const FormGroup: React.FC<FormGroupFProps> = ({ children, ...props }) => (
  <Form.Group
    as="form"
    className="auth-form__form flex-column-center-flex-start"
    // onSubmit={handleSubmit(onSubmit)}
    {...props}
  >
    {children}
  </Form.Group>
);

Container.FormGroup = FormGroup;

FormGroup.displayName = "AuthContainerFormGroup";
