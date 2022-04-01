import { Box, Flex } from "@hashtag-design-system/components";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { StepProps } from ".";
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
const Step = dynamic(() => {
  const prom = import("./Step").then(mod => mod.Step);
  return prom;
});

const variants = {
  animate: { x: 0, opacity: 1 },
  initial: (bool: boolean) => ({ x: bool ? "100%" : "-100%", opacity: 0 }),
  exit: (bool: boolean) => ({ x: !bool ? "100%" : "-100%", opacity: 0 }),
};

type SubComponents = {
  Login: typeof Login;
  SignUp: typeof SignUp;
  CTA: typeof CTA;
  Container: typeof Container;
  Context: typeof Context;
  LoginBtn: typeof LoginBtn;
  FormGroup: typeof FormGroup;
  Step: typeof Step;
};

const Auth: React.FC & SubComponents = () => {
  const [[activeIdx, direction], setPage] = useState([0, 0]);

  const steps: StepProps[] = useMemo(
    () => [
      {
        description: "Use your credentials to login into your account",
        other: { text: "No account?", link: "Create one", handleClick: () => handleClick("sign_up") },
        children: <Login handleForgotPassword={() => handleClick("forgot_password")} />,
      },
      {
        description: <>Explore &amp; live new experiencies</>,
        other: { text: "Already have an account?", link: "Login", handleClick: () => handleClick("login") },
        children: <SignUp />,
      },
      {
        description: "Enter the email address associated with your account",
        other: {
          text: "Didn't receive the email?",
          link: "Send again",
          handleClick: (e: React.MouseEvent<HTMLSpanElement>) => {
            const button: HTMLButtonElement | null | undefined = (
              e.target as HTMLSpanElement
            ).offsetParent?.querySelector('button[type="submit"]');
            button?.click();
          },
        },
        children: <ForgotPassword />,
      },
    ],
    []
  );

  const handleClick = (newDirection: "prev" | "next" | "login" | "sign_up" | "forgot_password") => {
    let newIdx = activeIdx + (newDirection === "prev" ? -1 : 1);
    switch (newDirection) {
      case "login":
        newIdx = 0;
        break;
      case "sign_up":
        newIdx = 1;
        break;
      case "forgot_password":
        newIdx = 2;
        break;

      default:
        newIdx = 0;
        break;
    }

    if (newIdx < 0) newIdx = 0;
    else if (newIdx > 2) newIdx = 2;

    const newDir = newIdx - activeIdx;
    setPage([newIdx, newDir === 0 ? -1 : newDir]);
  };

  const bool = direction > 0;

  return (
    <Box width="100%" paddingX={6} overflow="hidden" whiteSpace="nowrap">
      <AnimatePresence exitBeforeEnter initial={false} custom={bool}>
        <motion.div
          key={activeIdx}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          custom={bool}
          transition={{ duration: 0.4 }}
        >
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            whiteSpace="normal"
            style={{ minHeight: activeIdx === 0 ? 264 : activeIdx === 1 ? 300 : undefined }}
            sx={{ form: { display: "flex", flexDirection: "column", gap: 4 } }}
          >
            <Step {...steps[activeIdx]} />
          </Flex>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

Auth.Login = Login;
Auth.SignUp = SignUp;
Auth.CTA = CTA;
Auth.Container = Container;
Auth.Context = Context;
Auth.LoginBtn = LoginBtn;
Auth.FormGroup = FormGroup;
Auth.Step = Step;

Auth.displayName = "Auth";

export default Auth;
