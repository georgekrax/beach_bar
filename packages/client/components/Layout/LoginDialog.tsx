import { AUTH_ACTIONS } from "@/components/Auth/reducer";
import Next from "@/components/Next";
import { DATA } from "@/config/data";
import { useAuthContext } from "@/utils/contexts/AuthContext";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@hashtag-design-system/components";
import { Logo, useToken } from "@hashtag-design-system/icons";
import { BuiltInProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";
import Image from "next/image";
import styles from "./LoginDialog.module.scss";

type Props = {
  hasCloseBtn?: boolean;
  hasOAuth?: boolean;
};

export const LoginDialog: React.FC<Props & Pick<Partial<ModalProps>, "isOpen">> = ({
  hasOAuth = true,
  hasCloseBtn = true,
  isOpen,
  children,
}) => {
  const loginDialogShape = useToken("sizes", "loginDialogShape");
  const shadowColor = useToken("colors", "blackAlpha.200");

  const { isLoginDialogShown, dispatch } = useAuthContext();

  const handleDismiss = () => dispatch({ type: AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG, payload: { bool: false } });

  const handleClick = async (provider: Extract<BuiltInProviderType, "google" | "facebook" | "instagram">) => {
    // let url: string;
    signIn(provider);
    // url = await (await apolloClient.query({ query: GetInstagramOAuthUrlDocument })).data.getInstagramOAuthUrl;
    // router.push(url);
  };

  return (
    <Modal isOpen={isOpen ?? isLoginDialogShown} onClose={handleDismiss}>
      <ModalOverlay bg="whiteAlpha.800" />
      <ModalContent mt={32} borderRadius="loginDialog">
        <ModalBody p={0}>
          <Box position="absolute" top="-12vh" left={-16} zIndex="default" overflow="visible">
            <Image src="/palm_leaf.png" alt="Palm leaf" width={280} height={200} quality={100} />
          </Box>
          <Box
            position="absolute"
            top={46}
            right="15%"
            transform="rotate(-17deg)"
            borderRadius="10px"
            bg="#ffcb10"
            className="layout__login__shape"
          />
          <Box
            position="absolute"
            top={0}
            right={0}
            height="loginDialogShape"
            overflow="hidden"
            borderTopRightRadius="loginDialog"
            className="w100"
          >
            <Box
              position="absolute"
              top={`calc(${loginDialogShape} / -2)`}
              right={`calc(${loginDialogShape} / -2)`}
              borderRadius="50%"
              bg="blue.500"
              className="layout__login__shape"
            />
          </Box>
          <Flex
            flexDirection="column"
            alignItems="center"
            position="relative"
            minHeight={80}
            mt={20}
            padding={5}
            borderRadius="24px"
            boxShadow={`0px -4px 16px ${shadowColor}`}
            bg="white"
            zIndex={2}
          >
            <Logo />
            {hasCloseBtn && <ModalCloseButton zIndex={2} bg="inherit" />}
            {children}
            {hasOAuth && (
              <>
                <Next.OrContainer />
                <Flex justifyContent="center" alignItems="center" flexWrap="wrap">
                  <Button className={styles.oauth} onClick={() => handleClick("google")}>
                    <Logo.Google.Colored /> Sign in with Google
                  </Button>
                  <Button className={styles.oauth} onClick={() => handleClick("facebook")}>
                    <Image
                      src="/facebook_logo.png"
                      alt="Facebook logo"
                      width={DATA.ICON_SIZE}
                      height={DATA.ICON_SIZE}
                    />
                  </Button>
                  <Button className={styles.oauth} onClick={() => handleClick("instagram")}>
                    <Image
                      src="/instagram_logo.webp"
                      alt="Instagram logo"
                      width={DATA.ICON_SIZE}
                      height={DATA.ICON_SIZE}
                    />
                  </Button>
                </Flex>
              </>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  // return (
  //   <Dialog
  //     className={styles.loginDialog}
  //     isShown={isShown ?? isLoginDialogShown}
  //     onDismiss={e => {
  //       try {
  //         e.nativeEvent.type;
  //       } catch {
  //         const targetType = (e.target as HTMLElement).tagName;
  //         if (targetType === "button".toUpperCase()) return;
  //       }
  //       handleDismiss();
  //     }}
  //     overlayProps={{ background: { color: "light", alpha: 0.9 } }}
  //     style={{ top: "unset" }}
  //   >
  //   </Dialog>
  // );
};

LoginDialog.displayName = "LayoutLoginDialog";
