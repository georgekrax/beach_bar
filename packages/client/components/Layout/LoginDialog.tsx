import {
  GetFacebookOAuthUrlDocument,
  GetGoogleOAuthUrlDocument,
  GetInstagramOAuthUrlDocument,
} from "@/graphql/generated";
import { useApollo } from "@/lib/apollo";
import { OAuthProvider } from "@/typings/user";
import { Button, Dialog, DialogFProps, useIsMobile } from "@hashtag-design-system/components";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Icons from "../Icons";
import Layout from "./Layout";
import styles from "./LoginDialog.module.scss";

type Props = {
  dialogBtn?: boolean;
  oauth?: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
};

type FProps = Props & Pick<DialogFProps, "isShown">;

export const LoginDialog: React.FC<FProps> = ({ isShown, oauth = true, dialogBtn = true, setIsShown, children }) => {
  const router = useRouter();
  const { isMobile } = useIsMobile();
  const apolloClient = useApollo();

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
      isShown={isShown}
      onDismiss={() => setIsShown(false)}
      overlayProps={{ background: { color: "light", alpha: 0.9 } }}
      style={{ top: !isMobile ? "8%" : undefined }}
    >
      <div className={styles.imgContainer}>
        <Image src="/palm_leaf.png" width={280} height={200} quality={100} />
      </div>
      <div className={styles.rectangle + " layout__login__shape"} />
      <div className={styles.ellipseContainer + " w-100"}>
        <div className={styles.ellipse + " layout__login__shape"} />
      </div>
      <div className={styles.content + " flex-column-flex-start-center"}>
        <Layout.Logo />
        {dialogBtn && <Dialog.Btn.Close />}
        <div className={styles.container}>{children}</div>
        {oauth && (
          <>
            <div className={styles.orContainer + " w-100 flex-row-center-center"}>
              <span />
              <span>Or</span>
              <span />
            </div>
            <div className={styles.oauthContainer + " flex-row-center-center"}>
              <Button className={styles.oauth} variant="secondary" onClick={() => handleClick("Google")}>
                <Icons.Logo.Google /> Sign in with Google
              </Button>
              <Button className={styles.oauth} variant="secondary" onClick={() => handleClick("Facebook")}>
                <Image src="/facebook_logo.png" width={24} height={24} />
              </Button>
              <Button className={styles.oauth} variant="secondary" onClick={() => handleClick("Instagram")}>
                <Image src="/instagram_logo.webp" width={24} height={24} />
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

LoginDialog.displayName = "LayoutLoginDialog";
