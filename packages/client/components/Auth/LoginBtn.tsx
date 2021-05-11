import { useAuthContext } from "@/utils/contexts/AuthContext";
import { Button, ButtonFProps, useClassnames } from "@hashtag-design-system/components";
import styles from "./LoginBtn.module.scss";
import { AUTH_ACTIONS } from "./reducer";

export const LoginBtn: React.FC<ButtonFProps> = props => {
  const [classNames, rest] = useClassnames(styles.btn, props);

  // const { dispatch } = useAuthContext();

  return (
    <Button
      variant="secondary"
      className={classNames}
      // onClick={() => dispatch({ type: AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG, payload: { bool: true } })}
      {...rest}
    >
      Login
    </Button>
  );
};

LoginBtn.displayName = "AuthLoginBtn";
