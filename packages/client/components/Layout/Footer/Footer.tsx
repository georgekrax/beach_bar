import Icons from "@/components/Icons";
import Next from "@/components/Next";
import { useIsDevice } from "@/utils/hooks";
import { useAuth } from "@/utils/hooks/useAuth";
import { callAllHandlers, cx, MotionBox, MotionBoxProps } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import { Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Logo } from "../Logo";
import styles from "./Footer.module.scss";
import { InfoColumn } from "./InfoColumn";

const boxVariants: Variants = { open: { height: "auto" }, closed: { height: 110 } };
const iconVariants: Variants = { open: { rotate: 180 }, closed: { rotate: 360 } };

export type Props = MotionBoxProps;

export const Footer: React.FC<Props> = props => {
  const [isExpanded, setIsExpanded] = useState(false);
  const _className = cx(styles.container + " container--padding w100", props.className);
  const { isDesktop } = useIsDevice();

  const { data } = useAuth();

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    setTimeout(() => window.scroll({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  };

  useEffect(() => {
    if (isDesktop) setIsExpanded(true);
    else setIsExpanded(false);
  }, [isDesktop]);

  return (
    <MotionBox
      as="footer"
      height="fit-content"
      mt={8}
      pt="container.pad"
      bg="gray.50"
      overflow="hidden"
      {...props}
      onClick={e => callAllHandlers(() => handleClick(), props.onClick)(e)}
      className={_className}
      animate={isExpanded ? "open" : "closed"}
      variants={boxVariants}
    >
      <div className="flex-column-space-between-flex-start">
        <div className={styles.box + " w100 flex-column-space-between-flex-start"}>
          <div>
            <div
              className={styles.logo + " flex-row-flex-start-center"}
              style={{ paddingBottom: isExpanded ? 0 : undefined }}
            >
              <Icons.Chevron.Down
                className={styles.chevron}
                initial="closed"
                variants={iconVariants}
                animate={isExpanded ? "open" : "closed"}
                transition={{ stiffness: 750, duration: 0.2 }}
              />
              <Logo />
            </div>
            <small className="d--block body-14 text--nowrap">Made with ❤️ in Greece</small>
          </div>
          <small className="body-14 text--nowrap">
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
          <InfoColumn
            header="About"
            links={[
              { name: "About #beach_bar", opts: { href: "/about/beach_bar" } },
              { name: "News", opts: { href: "/about/news" } },
              { name: "Create your listing", opts: { href: "/partners" } },
              { name: "Founder's letter", opts: { href: "/about/what-makes-beach_bar-beach_bar" } },
            ]}
          />
          <InfoColumn
            header="Support"
            links={[
              { name: "Our COVID-19 response", opts: { href: "/support/covid-19" } },
              { name: "Help center", opts: { href: "/support/help-center" } },
              { name: "Contact us", opts: { href: "/support/contact" } },
            ]}
          />
          <InfoColumn header="Get in touch">
            <div className={styles.getInTouch + " body-14"}>
              <div>Questions or feedback?</div>
              <div>We' d love to hear from you</div>
            </div>
            <div className="flex-row-flex-start-center">
              <a
                className="flex-row-center-center"
                href="https://www.instagram.com/georgekrax"
                rel="noreferrer"
                target="_blank"
              >
                <Image src="/facebook_logo.png" alt="Facebook logo" width={32} height={32} />
              </a>
              <a
                className="flex-row-center-center"
                href="https://www.instagram.com/georgekrax"
                rel="noreferrer"
                target="_blank"
              >
                <Image src="/instagram_logo.webp" alt="Instagram logo" width={32} height={32} />
              </a>
            </div>
          </InfoColumn>
        </div>
      </div>
      <div className={styles.bottom + " flex-row-space-between-center"}>
        <small>Book with us your next visit to the beach</small>
        {/* <small>Booking.com for your next visit at the beach.</small> */}
        <small>
          <Next.Link link={{ href: "/about/terms_and_conditions" }}>Terms &amp; Conditions</Next.Link>&nbsp;
          <span>&bull;</span> <Next.Link link={{ href: "/about/privacy_policy" }}>Privacy Policy</Next.Link>
        </small>
      </div>
    </MotionBox>
  );
};

Footer.displayName = "LayoutFooter";
