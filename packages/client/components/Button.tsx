type Props = React.HTMLAttributes<HTMLButtonElement> & {
  type?: "default" | "pill" | "danger";
  state?: "default" | "focused" | "hover" | "active" | "disabled";
  outlined?: boolean;
  href?: string;
  leftIcon?: any;
  rightIcon?: any;
  onClick?: (e) => void;
  [x: string]: any;
};

const Button: React.FC<Props> = ({
  type = "default",
  state = "default",
  outlined = false,
  href,
  leftIcon,
  rightIcon,
  onClick,
  children,
  ...rest
}) => {
  return <button {...rest}>{children}</button>;
};

export default Button;
