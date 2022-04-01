import { BeachBarQuery } from "@/graphql/generated";
import {
  addDomEvent,
  Box,
  BoxProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalOverlay,
  MotionFlex,
  MotionFlexProps,
  useDisclosure,
} from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { memo, useEffect, useRef } from "react";

const MotionModalCloseButton = motion(ModalCloseButton);

const CONTENT_PROPS: MotionFlexProps = {
  flexDir: "column",
  justify: "center",
  align: "center",
};

export type Props = BoxProps & {
  isPreventedDefault?: boolean;
  modal?: ModalContentProps;
} & Partial<Pick<NonNullable<BeachBarQuery["beachBar"]>["imgUrls"][number], "description">>;

export const ImgZoom: React.FC<Props> = memo(
  ({ isPreventedDefault = false, description, modal, children, ...props }) => {
    const layoutId = useRef(Math.random()).current.toString();

    const { isOpen, onClose, onToggle } = useDisclosure();

    useEffect(() => addDomEvent(window, "scroll", onClose), []);

    const handleClick = () => {
      if (!isPreventedDefault) onToggle();
    };

    return (
      <Box {...props}>
        {!isOpen && (
          <MotionFlex
            {...CONTENT_PROPS}
            layout
            layoutId={layoutId}
            width="100%"
            height="100%"
            cursor="zoom-in"
            onClick={handleClick}
          >
            {children}
          </MotionFlex>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            width="75vw"
            height="50vh"
            maxWidth={{ lg: "500px" }}
            bg="transparent"
            cursor="zoom-out"
            shadow="none"
            {...modal}
          >
            <MotionModalCloseButton
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ delay: 0.2, duration: 0.08 }}
              zIndex="least"
              bg="white"
              _hover={{ bg: "white" }}
              _active={{ bg: "white" }}
            />
            <ModalBody
              {...(CONTENT_PROPS as any)}
              as={MotionFlex}
              layout
              layoutId={layoutId}
              padding={0}
              sx={{ "& > div": { _first: { shadow: "xl" } } }}
              _hover={{ "& > *": { opacity: 1, transform: "none" } }}
              onClick={handleClick}
            >
              {children}
              {description && (
                <Box width="80%" pt={2} pb={3} borderBottomRadius="regular" bg="white" textAlign="center">
                  {description}
                </Box>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  }
);

ImgZoom.displayName = "NextImgZoom";
