import Icons from "@/components/Icons";
import { NextLink } from "@/components/Next/Link";
import { useAuth } from "@/utils/hooks/useAuth";
import { useClassnames } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import { useAnimation, Variants } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Logo } from "../Logo";
import styles from "./Footer.module.scss";
import { InfoColumn } from "./InfoColumn";

const boxVariants: Variants = {
  open: { height: "auto", display: "block" },
  closed: { height: 0, display: "none" },
};

const iconVariants: Variants = { open: { rotate: 180 }, closed: { rotate: 360 } };

export type Props = React.ComponentPropsWithoutRef<"div">;

export const Footer: React.FC<Props> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const [classNames, rest] = useClassnames(styles.container + " w100", props);
  const controls = useAnimation();
  const iconControls = useAnimation();

  const { data } = useAuth();

  const handleClick = () => {
    controls.start(!isOpen ? "open" : "closed");
    iconControls.start(!isOpen ? "open" : "closed");
    setIsOpen(prev => !prev);
  };

  return (
    <footer className={classNames} onClick={() => handleClick()} {...rest}>
      <div className="flex-column-space-between-flex-start">
        <div
          className={styles.box + " w100 flex-column-space-between-flex-start"}
          // variants={boxVariants}
          // initial="closed"
          // animate={controls}
        >
          <div>
            <div className="flex-row-flex-start-center">
              <Icons.Chevron.Down
                className={styles.chevron}
                initial="closed"
                variants={iconVariants}
                animate={iconControls}
                transition={{ stiffness: 750, duration: 0.2 }}
              />
              <Logo />
            </div>
            <small className="d--block body-14 text-ws--nowrap">Built with ❤️ from Greece</small>
          </div>
          <small className="body-14 text-ws--nowrap">
            Copyright &#169; {dayjs().year()} #beach_bar. <br />
            All rights Reserved.
          </small>
        </div>
        <div className={styles.details + " flex-row-flex-start-flex-start"}>
          <InfoColumn
            header="Search"
            links={[
              { name: "Map", opts: { href: "/map" } },
              { name: "Shopping cart", opts: { href: "/shopping_cart" } },
            ]}
          />
          <InfoColumn
            header="About us"
            links={[
              { name: "About #beach_bar", opts: { href: "/about/beach_bar" } },
              { name: "News", opts: { href: "/about/news" } },
              { name: "Contact us", opts: { href: "/contact" } },
            ]}
          />
          {data?.me && (
            <InfoColumn
              header="Account"
              links={[
                { name: "Profile", opts: { href: "/account" } },
                { name: "Favourites", opts: { href: "/account/favourites" } },
                { name: "Trips", opts: { href: "/account/trips" } },
                { name: "Reviews", opts: { href: "/account/reviews" } },
                { name: "Billing", opts: { href: "/account/billing" } },
                { name: "Search history", opts: { href: "/account/history" } },
              ]}
            />
          )}
          <InfoColumn header="Get in touch">
            <div className={styles.getInTouch + " body-14"}>
              <div>Questions or feedback?</div>
              <div>We' d love to hear from you</div>
            </div>
            <div className="flex-row-flex-start-center">
              <a href="https://www.instagram.com/georgekrax" rel="noreferrer" target="_blank">
                <Image src="/facebook_logo.png" alt="Facebook logo" width={32} height={32} />
              </a>
              <a href="https://www.instagram.com/georgekrax" rel="noreferrer" target="_blank">
                <Image src="/instagram_logo.webp" alt="Instagram logo" width={32} height={32} />
              </a>
            </div>
          </InfoColumn>
        </div>
      </div>
      <div className={styles.bottom + " flex-row-space-between-center"}>
        <small>Book with us your next visit at the beach.</small>
        <small>
          <NextLink href="/about/terms_and_conditions">Terms &amp; Conditions</NextLink> <span>&bull;</span>{" "}
          <NextLink href="/about/privacy_policy">Privacy Policy</NextLink>
        </small>
      </div>
    </footer>
  );
};

Footer.displayName = "LayoutFooter";
