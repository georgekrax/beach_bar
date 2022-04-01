import { useSearchFormContext } from "@/utils/contexts";
import { Button, Flex } from "@hashtag-design-system/components";
import { Search as IconSearch } from "@hashtag-design-system/icons";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { SearchBoxProps } from ".";
import styles from "./Btn.module.scss";

const btnVariants: Variants = {
  visible: { transition: { staggerChildren: 0.05, staggerDirection: 1 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { bounce: 1 } },
  exit: { opacity: 0, x: 60 },
};

type Props = SearchBoxProps["cta"];

export const Btn: React.FC<Props> = props => {
  const { atHeader, atBeach, isBtnHovered, handleHover, handleBtnClick } = useSearchFormContext();

  const isNotHomePage = atHeader || atBeach;

  return (
    <Flex justify="flex-end" minWidth={isNotHomePage ? undefined : "5.375rem"} ml={isNotHomePage ? 0 : -2}>
      <Button
        // TODO: Check if width and height is equal
        initial={{ width: "3.25rem" }}
        animate={{ width: isBtnHovered ? "5.375rem" : "3.25rem" }}
        transition={{ type: "spring", bounce: 0.1, delay: !isBtnHovered ? 0.2 : 0 }}
        aria-label="Search"
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
        height={48 / 16 + "rem"}
        border="none"
        outline="none"
        borderRadius="full"
        overflow="hidden"
        bg="gray.800"
        _hover={{ bg: "gray.800" }}
        transform={atBeach ? "scale(0.9)" : undefined}
        {...props}
        sx={{ width: isNotHomePage ? "auto !important" : undefined, ...props.sx }}
        onClick={handleBtnClick}
        onHoverStart={() => handleHover("start")}
        onHoverEnd={() => handleHover("end")}
      >
        <AnimatePresence initial={false}>
          {isBtnHovered ? (
            <motion.div
              key="letters"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={btnVariants}
              className={styles.letters}
            >
              {Array.from("Search").map((letter, i) => (
                <motion.span key={i} variants={letterVariants} style={{ display: "block" }}>
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { delay: 0.3, stiffness: 50 } }}
              exit={{ x: -60, opacity: 0, transition: { duration: 0.4 } }}
            >
              <IconSearch boxSize={atBeach ? 5 : 5} color="white" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </Flex>
  );
};

Btn.displayName = "SearchBoxBtn";
