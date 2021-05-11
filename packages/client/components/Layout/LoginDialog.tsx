import { AUTH_ACTIONS } from "@/components/Auth/reducer";
import Icons from "@/components/Icons";
import { NextOrContainer } from "@/components/Next/OrContainer";
import { DATA } from "@/config/data";
import {
  GetFacebookOAuthUrlDocument,
  GetGoogleOAuthUrlDocument,
  GetInstagramOAuthUrlDocument
} from "@/graphql/generated";
import { OAuthProvider } from "@/typings/user";
import { useAuthContext } from "@/utils/contexts/AuthContext";
import { useApolloClient } from "@apollo/client";
import { Button, Dialog, DialogFProps, useIsMobile } from "@hashtag-design-system/components";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import styles from "./LoginDialog.module.scss";
import { Logo } from "./Logo";

type Props = {
  dialogBtn?: boolean;
  oauth?: boolean;
};

export const LoginDialog: React.FC<Props & Partial<Pick<DialogFProps, "isShown">>> = ({
  oauth = true,
  dialogBtn = true,
  isShown,
  children,
}) => {
  const router = useRouter();
  const { isMobile } = useIsMobile();
  const apolloClient = useApolloClient();

  // const { isLoginDialogShown, dispatch } = useAuthContext();

  // const handleDismiss = () => dispatch({ type: AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG, payload: { bool: false } });

  const handleClick = async (provider: OAuthProvider) => {
    let url: string;
    if (provider === "Google")
      url = await (await apolloClient.query({ query: GetGoogleOAuthUrlDocument })).data.getGoogleOAuthUrl;
    else if (provider === "Facebook")
      url = await (await apolloClient.query({ query: GetFacebookOAuthUrlDocument })).data.getFacebookOAuthUrl;
    else url = await (await apolloClient.query({ query: GetInstagramOAuthUrlDocument })).data.getInstagramOAuthUrl;
    router.push(url);
  };

  return (
    <Dialog
      className={styles.loginDialog}
      // isShown={isShown ?? isLoginDialogShown}
      isShown
      // onDismiss={() => handleDismiss()}
      overlayProps={{ background: { color: "light", alpha: 0.9 } }}
      style={{ top: !isMobile ? "8%" : undefined }}
    >
      <div className={styles.imgContainer}>
        <Image src="/palm_leaf.png" alt="Palm leaf" width={280} height={200} quality={100} />
      </div>
      <div className={styles.rectangle + " layout__login__shape"} />
      <div className={styles.ellipseContainer + " w100"}>
        <div className={styles.ellipse + " layout__login__shape"} />
      </div>
      <div className={styles.content + " flex-column-flex-start-center"}>
        <Logo />
        {dialogBtn && <Dialog.Btn.Close />}
        <div className={styles.container + " w100 flex-row-flex-start-center"}>{children}</div>
        {oauth && (
          <>
            <NextOrContainer />
            <div className={styles.oauthContainer + " flex-row-center-center"}>
              <Button className={styles.oauth} variant="secondary" onClick={() => handleClick("Google")}>
                <Icons.Logo.Google /> Sign in with Google
              </Button>
              <Button className={styles.oauth} variant="secondary" onClick={() => handleClick("Facebook")}>
                <Image src="/facebook_logo.png" alt="Facebook logo" width={DATA.ICON_SIZE} height={DATA.ICON_SIZE} />
              </Button>
              <Button className={styles.oauth} variant="secondary" onClick={() => handleClick("Instagram")}>
                <Image src="/instagram_logo.webp" alt="Instagram logo" width={DATA.ICON_SIZE} height={DATA.ICON_SIZE} />
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

LoginDialog.displayName = "LayoutLoginDialog";
