import { BeachBarQuery } from "@/graphql/generated";
import { Modal, ModalOverlayFProps, useClassnames } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import styles from "./ImgZoom.module.scss";

const transition = {
  type: "spring",
  damping: 25,
  stiffness: 120,
};

export type Props = {
  id: string;
  preventDefault?: boolean;
  modal?: Partial<ModalOverlayFProps>;
} & Partial<Pick<NonNullable<BeachBarQuery["beachBar"]>["imgUrls"][number], "description">>;

export const ImgZoom: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">> = memo(
  ({ id, preventDefault = false, description, modal = {}, className, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalClassNames, modalRest] = useClassnames(styles.container + (isOpen ? " " + styles.open : ""), modal);

    const contentClassNames = styles.content + (isOpen ? " w--inherit" : "") + " h100 flex-column-center-center";

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    useEffect(() => {
      window.addEventListener("scroll", () => handleScroll());

      return () => window.removeEventListener("scroll", () => handleScroll());
    }, []);

    const handleClick = () => {
      if (!preventDefault) setIsOpen(!isOpen);
    };

    return (
      <div className={className}>
        {!isOpen && (
          <motion.div className={contentClassNames} layout layoutId={id} onClick={() => handleClick()}>
            {children}
          </motion.div>
        )}
        <Modal.Overlay
          isShown={isOpen}
          animate={{ opacity: isOpen ? 1 : 0 }}
          className={modalClassNames}
          transition={transition}
          onClick={() => setIsOpen(false)}
          {...modalRest}
        >
          <motion.div
            className={contentClassNames}
            layout
            layoutId={id}
            transition={transition}
            onClick={() => handleClick()}
          >
            {children}
            {description && <div className={styles.description + " text--center"}>{description}</div>}
          </motion.div>
        </Modal.Overlay>
      </div>
    );
  }
);

ImgZoom.displayName = "NetImgZoom";
