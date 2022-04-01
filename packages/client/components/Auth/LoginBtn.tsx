import { useAuth } from "@/utils/hooks";
import { Button, ButtonProps, callAllHandlers } from "@hashtag-design-system/components";

export const LoginBtn: React.FC<ButtonProps> = props => {
  const { handleLogin } = useAuth({ skip: true });

  return (
    <Button
    // variant="secondary"
      color="gray.600"
      {...props}
      onClick={e => callAllHandlers(() => handleLogin(), props.onClick)(e)}
    >
      Login
    </Button>
  );
};

LoginBtn.displayName = "AuthLoginBtn";
