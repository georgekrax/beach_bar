import Icons from "@/components/Icons";
import Next from "@/components/Next";
import {
  BottomSheet,
  BottomSheetProps,
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Flex,
  Heading,
  Text,
} from "@hashtag-design-system/components";
import { memo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Btn } from "./Btn";
import styles from "./Crud.module.scss";

const ICON_SIZE = 16;

type SubComponents = {
  Btn: typeof Btn;
};

type Props = {
  title?: string;
  cta?:
    | false
    | (Omit<ButtonProps, "onClick"> & {
        icon?: React.ReactNode;
        onClick?:
          | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dismiss: () => Promise<void>) => Promise<void>)
          | undefined;
      });
  bottomSheet?: BottomSheetProps;
  fullPage?: boolean;
  content?: BoxProps;
  container?: BoxProps;
  closeIcon?: "close" | "chevron_left";
  onClose?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const Crud: React.FC<Props> & SubComponents = ({ cta, bottomSheet, children, onClose, ...props }) => {
  return bottomSheet ? (
    <BottomSheet {...bottomSheet}>
      {({ close }) => (
        <Content
          onClose={async e => {
            await close();
            onClose?.(e);
          }}
          cta={{
            ...cta,
            onClick: async e => {
              if (cta) cta.onClick && (await cta.onClick(e, close));
            },
          }}
          {...props}
        >
          {children}
        </Content>
      )}
    </BottomSheet>
  ) : (
    <Content cta={cta} onClose={onClose} {...props}>
      {children}
    </Content>
  );
};

Crud.Btn = Btn;

Crud.displayName = "HeaderCrud";

export const Content: React.FC<Props> = memo(
  ({ title, cta, container, content, closeIcon, fullPage = false, children, onClose }) => {
    const [offsetHeight, setOffsetHeight] = useState<number | undefined>();

    return (
      <div>
        <Box ref={elem => setOffsetHeight(elem?.offsetHeight)} className={styles.container} {...container}>
          <Flex align="center" px="container.pad">
            <Next.IconBox aria-label={closeIcon ? "Close modal window" : "Return to previous page"} onClick={onClose}>
              {closeIcon === "close" ? (
                <Icons.Close className="icon--bold" width={ICON_SIZE} height={ICON_SIZE} />
              ) : (
                <Icons.Arrow.Left className="icon--bold" width={ICON_SIZE} height={ICON_SIZE} />
              )}
            </Next.IconBox>
            <Text as="span" borderRadius="full" />
            <Heading as="h6" size="sm">
              {title}
            </Heading>
            {cta && (
              <Button textTransform="uppercase" zIndex="md" {...(cta as any)}>
                {cta.icon || <Icons.Save />} {cta.children}
              </Button>
            )}
          </Flex>
        </Box>
        <Toaster position="top-center" />
        <Box
          px="container.pad"
          p={fullPage ? { base: 0, lg: "initial" } : undefined}
          height={fullPage ? "100vh" : undefined}
          maxH={fullPage ? `calc(100vh - ${(offsetHeight || 0) + 1}px)` : undefined}
          overflow="auto"
          bg="gray.100"
          {...content}
        >
          <Box
            mt={10}
            mx="auto"
            mb={{ base: 24, md: 32 }}
            px={fullPage ? "containerPad" : undefined}
            maxW={fullPage ? "container.xl" : undefined}
          >
            {children}
          </Box>
        </Box>
      </div>
    );
  }
);

Content.displayName = "HeaderCrudContent";
