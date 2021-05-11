<<<<<<< HEAD:packages/client/components/Auth/Auth.tsx
import { useAnimation, Variants } from "framer-motion";
import { useMemo } from "react";
import { Container } from "./Container";
import { CTA } from "./CTA";
import { AuthContainerProps, ForgotPassword } from "./index";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { Context } from "./Context";
import { LoginBtn } from "./LoginBtn";

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

Auth.displayName = "Auth";

export default Auth;
=======
import { useAnimation, Variants } from "framer-motion";
import { useMemo } from "react";
import { Container } from "./Container";
import { CTA } from "./CTA";
import { AuthContainerProps, ForgotPassword } from "./index";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { Context } from "./Context";
import { LoginBtn } from "./LoginBtn";

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

Auth.displayName = "Auth";

export default Auth;
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff:packages/client/components/AuthForm/AuthForm.tsx
