import { useAnimation, Variants } from "framer-motion";
import { useMemo } from "react";
import { AuthContainerProps } from "./index";
import dynamic from "next/dynamic";
import { ForgotPassword } from "./ForgotPassword";

const Login = dynamic(() => {
  const prom = import("./Login").then(mod => mod.Login);
  return prom;
});
const SignUp = dynamic(() => {
  const prom = import("./SignUp").then(mod => mod.SignUp);
  return prom;
});
const CTA = dynamic(() => {
  const prom = import("./CTA").then(mod => mod.CTA);
  return prom;
});
const Container = dynamic(() => {
  const prom = import("./Container").then(mod => mod.Container);
  return prom;
});
const FormGroup = dynamic(() => {
  const prom = import("./Container").then(mod => mod.FormGroup);
  return prom;
});
const Context = dynamic(() => {
  const prom = import("./Context").then(mod => mod.Context);
  return prom;
});
const LoginBtn = dynamic(() => {
  const prom = import("./LoginBtn").then(mod => mod.LoginBtn);
  return prom;
});

const loginVariants: Variants = {
  hidden: { x: "-300%" },
  visible: { x: 0 },
};

export const otherVariants: Variants = {
  hidden: { x: "100%" },
  visible: (custom: number = 1) => ({ x: `-${custom * 100}%` }),
};

type SubComponents = {
  Login: typeof Login;
  SignUp: typeof SignUp;
  CTA: typeof CTA;
  Container: typeof Container;
  Context: typeof Context;
  LoginBtn: typeof LoginBtn;
  FormGroup: typeof FormGroup;
};

const Auth: React.FC & SubComponents = () => {
  const loginControls = useAnimation();
  const signUpControls = useAnimation();
  const forgotPasswordControls = useAnimation();
  const containers = useMemo(
    (): AuthContainerProps[] => [
      {
        variants: loginVariants,
        controls: loginControls,
        description: "Use your credentials to login into your account",
        other: {
          text: "No account?",
          link: "Create one",
        },
        initial: "visible",
        handleClick: async () => {
          loginControls.start("hidden");
          await signUpControls.start("visible");
        },
        children: (
          <Login
            handleForgotPasswordClick={async () => {
              loginControls.start("hidden");
              await forgotPasswordControls.start("visible");
            }}
          />
        ),
      },
      {
        variants: otherVariants,
        controls: signUpControls,
        description: <>Explore &amp; live new experiencies</>,
        other: {
          text: "Already have an account?",
          link: "Login",
        },
        initial: "hidden",
        custom: 1,
        handleClick: async () => {
          signUpControls.start("hidden");
          await loginControls.start("visible");
        },
        children: <SignUp />,
      },
    ],
    []
  );
  return (
    <>
      {containers.map((props, i) => (
        <Container key={i} {...props} />
      ))}
      <ForgotPassword animationControls={forgotPasswordControls} />
    </>
  );
};

Auth.Login = Login;
Auth.SignUp = SignUp;
Auth.CTA = CTA;
Auth.Container = Container;
Auth.Context = Context;
Auth.LoginBtn = LoginBtn;
Auth.FormGroup = FormGroup;

Auth.displayName = "Auth";

export default Auth;
